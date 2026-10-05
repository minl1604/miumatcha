export type SceneAction = 'brew' | 'bakery' | 'cat' | 'order' | 'stock' | 'decor';
export interface SceneView {
  paused: boolean;
  reducedMotion: boolean;
  weather: string;
  phase: string;
  seconds: number;
  day: number;
  decorating?: boolean;
  interactive?: boolean;
  customers: { id: string; appearance: number | string; name: string; status: string; kind?: string }[];
  staff: { id: string; appearance: number | string; name: string; task?: string }[];
  cats: { id: string; name: string; appearance: number | string; mood: number | string; energy: number; activity?: string }[];
  events?: { id: string; kind: 'delivery' | 'technician' | 'inspector' | 'vet'; name: string }[];
  furniture: { id: string; kind: string; x: number; y: number; rotation: number }[];
  player: { hair: number | string; skin: number | string; outfit: number | string };
}
export interface CafeSceneProps {
  view: SceneView;
  onSelect: (kind: SceneAction, id?: string) => void;
  onPlace?: (x: number, y: number) => void;
}
