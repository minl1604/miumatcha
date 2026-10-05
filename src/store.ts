import { useSyncExternalStore } from "react";
import { createGame, reduceGame } from "./domain";
import type { GameAction, GameState } from "./domain";
import {
  saveGame,
  loadGame,
  clearGame,
  saveSettings,
  loadSettings,
} from "./persistence";
let state: GameState = createGame();
const listeners = new Set<() => void>();
let initialization: Promise<void> | undefined,
  writing = false,
  pending: GameState | undefined,
  ticks = 0;
export let saveError = "";
function emit() {
  listeners.forEach((fn) => fn());
}
async function persist() {
  if (writing) return;
  writing = true;
  while (pending) {
    const next = pending;
    pending = undefined;
    try {
      await saveGame(next);
      saveError = "";
    } catch {
      saveError =
        "Không thể tự lưu. Hãy xuất bản lưu JSON trước khi đóng trang.";
      emit();
    }
  }
  writing = false;
}
export function queueSave() {
  pending = state;
  void persist();
}
export function dispatch(action: GameAction) {
  const next = reduceGame(state, action);
  if (next !== state) {
    state = next;
    emit();
    if (action.type === "SETTINGS")
      void saveSettings(state.settings).catch(() => {});
    if (action.type !== "STEP" || ++ticks % 10 === 0) queueSave();
  }
}
export function getState() {
  return state;
}
export function useGame() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    () => state,
  );
}
export function initialize(): Promise<void> {
  if (initialization) return initialization;
  initialization = (async () => {
    try {
      const saved = await loadGame();
      const settings = await loadSettings();
      if (saved) state = { ...saved, paused: true };
      if (settings) state = { ...state, settings };
      emit();
    } catch {
      saveError =
        "Bản lưu lỗi; game mở một tiệm mới. Bản dự phòng vẫn được giữ.";
    }
    window.setInterval(() => dispatch({ type: "STEP", seconds: 1 }), 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        dispatch({ type: "PAUSE", paused: true });
        queueSave();
      }
    });
    window.addEventListener("pagehide", queueSave);
    if (import.meta.env.DEV) {
      (window as unknown as { __MIU_DEBUG: unknown }).__MIU_DEBUG = {
        getState,
        dispatch,
        replace: replaceGame,
      };
    }
  })();
  return initialization;
}
export function replaceGame(next: GameState) {
  state = { ...next, paused: true };
  emit();
  queueSave();
}
export async function newGame(mode: "relax" | "business" = "relax") {
  const settings = state.settings;
  await clearGame();
  state = createGame({ mode, dayDuration: settings.dayDuration });
  state.settings = settings;
  emit();
  queueSave();
}
