import { useEffect, useMemo, useRef, useState } from "react";
import CafeScene from "./CafeScene";
import AssetGallery from "./AssetGallery";
import Minigame, { type MinigameContext } from "./Minigame";
import { customers, customersInCafe, recipeCost, roleNames } from "./domain";
import type { Formula, Order, CatInteraction } from "./domain";
import { dispatch, getState, initialize, useGame, saveError } from "./store";
import { audio } from "./audio";
import { requestFeedback, type FeedbackResult } from "./feedback";
import { Button, Empty, Icon, Meter, Modal, money } from "./ui";
import { Management } from "./Management";

type Page =
  | "cafe"
  | "menu"
  | "cats"
  | "stock"
  | "staff"
  | "decor"
  | "report"
  | "more"
  | "settings"
  | "help"
  | "journal";
type ManagementResult = {
  kind: string;
  transactionIds?: string[];
  inventoryCount?: { ingredient: string; quantity: number }[];
  deliveryIds?: string[];
  quarantineIds?: string[];
  shiftAssignments?: {
    staffId: string;
    role: "barista" | "baker" | "cashier";
  }[];
  routes?: { orderId: string; task: "drink" | "serve" }[];
  evidence?: { incidentId: string; evidenceId: string }[];
};
const phaseNames = {
  preparation: "Chuẩn bị mở tiệm",
  open: "Tiệm đang mở cửa",
  closing: "Phục vụ đơn cuối",
  after: "Sau giờ làm",
};
const catActions: [CatInteraction, string][] = [
  ["sniff", "Đưa tay cho ngửi"],
  ["head", "Vuốt đầu"],
  ["cheek", "Vuốt má"],
  ["back", "Vuốt lưng"],
  ["chin", "Gãi cằm"],
  ["paw", "Chạm bàn chân"],
  ["call", "Gọi tên"],
  ["treat", "Cho ăn thưởng"],
  ["brush", "Chải lông"],
  ["lap", "Ngồi trên đùi"],
  ["photo", "Chụp ảnh"],
  ["rest", "Để bé nghỉ"],
  ["vet", "Thú y trong game"],
];
const catGames = [
  ["feather", "Cần câu lông vũ"],
  ["ball", "Bóng qua hầm"],
  ["hide", "Trốn tìm"],
  ["boxes", "Hộp nào có mèo?"],
  ["explore", "Đường khám phá"],
  ["train", "Dạy chạm tay"],
  ["photo", "Khoảnh khắc mèo"],
] as const;
const customerIndex = (id: string) =>
  Math.max(
    0,
    customers.findIndex((c) => c.id === id),
  );
const catIndex = (id: string) =>
  ["matcha", "houji", "mochi", "sesame", "chestnut", "snow"].indexOf(id);
const itemArt = (recipeId: string) => {
  const r = getState().recipes.find((r) => r.id === recipeId);
  return (
    "/assets/items/" +
    (r?.custom ? r.formula.tea + "-latte" : recipeId) +
    ".svg"
  );
};
export default function App() {
  const game = useGame();
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<Page>("cafe");
  const [orderId, setOrderId] = useState<string>();
  const [catId, setCatId] = useState<string>();
  const [mini, setMini] = useState<{
    kind: string;
    catId?: string;
    orderId?: string;
    bakingId?: string;
  }>();
  const [toast, setToast] = useState("");
  const [welcome, setWelcome] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult>();
  const requestedFeedback = useRef(new Set<string>());
  const lastMessage = useRef("");
  const [techniques, setTechniques] = useState<Record<string, number>>({});
  useEffect(() => {
    void initialize().then(() => {
      setReady(true);
      setWelcome(getState().tutorial === 0);
    });
  }, []);
  useEffect(() => {
    audio.configure({
      music: game.settings.music,
      effects: game.settings.effects,
    });
    audio.setPaused(game.paused);
  }, [game.settings.music, game.settings.effects, game.paused]);
  useEffect(() => {
    if (game.lastMessage && game.lastMessage !== lastMessage.current) {
      lastMessage.current = game.lastMessage;
      setToast(game.lastMessage);
    }
  }, [game.lastMessage]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,select,textarea")) return;
      if (e.key === "Escape") {
        setPage("cafe");
        setCatId(undefined);
        setOrderId(undefined);
        setMini(undefined);
      }
      if (e.code === "Space") {
        e.preventDefault();
        dispatch({ type: "PAUSE" });
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const active = game.orders.filter((o) =>
    ["waiting", "making", "ready"].includes(o.status),
  );
  const selected = game.orders.find((o) => o.id === orderId);
  const selectedCat = game.cats.find((c) => c.id === catId);
  const served = game.orders.filter(
    (o) =>
      o.status === "served" &&
      game.transactions.some(
        (t) => t.day === game.day && t.orderId === o.id && t.revenue > 0,
      ),
  ).length;
  useEffect(() => {
    if (!selected?.score || requestedFeedback.current.has(selected.id)) return;
    requestedFeedback.current.add(selected.id);
    const customer = customers.find((c) => c.id === selected.customerId);
    const recipe = game.recipes.find((r) => r.id === selected.recipeId);
    const f = selected.draft?.formula || selected.requested;
    const s = selected.score;
    void requestFeedback({
      recipeName: recipe?.name || "Trà tự pha",
      customerName: customer?.name,
      personality: customer?.personality,
      score: s.total,
      criteria: {
        ingredients: s.requirement,
        taste: s.taste,
        technique: s.technique,
        temperature: s.temperature,
        presentation: s.presentation,
      },
      actual: {
        tea: f.tea,
        sweetness: f.sugar + f.syrupAmount * 0.6,
        milk: f.milkAmount,
        temperature: f.temperature,
        topping: f.topping,
      },
      requested: {
        tea: selected.requested.tea,
        sweetness:
          selected.requested.sugar + selected.requested.syrupAmount * 0.6,
        milk: selected.requested.milkAmount,
        temperature: selected.requested.temperature,
        topping: selected.requested.topping,
      },
      history: `Số lần ghé: ${game.customers[selected.customerId]?.visits || 0}`,
    }).then(setFeedback);
  }, [selected, game.customers, game.recipes]);
  const selectOrder = (id: string) => {
    setOrderId(id);
    setFeedback(undefined);
    setTechniques({});
  };
  const selectScene = (kind: string, id?: string) => {
    if (page !== "cafe" || selected || catId || mini || welcome) return;
    if (kind === "brew") {
      const o = active.find((o) => o.status !== "ready");
      if (o) selectOrder(o.id);
      else {
        setPage("menu");
        setToast(
          "Mở tiệm và đợi khách gọi món. Chạm khách để xem phiếu gọi món.",
        );
      }
    } else if (kind === "order") {
      const order = active.find((o) => o.id === id) || active[0];
      if (order) selectOrder(order.id);
      else setToast("Chưa có khách gọi món.");
    } else if (kind === "cat") {
      const cat =
        game.cats.find((c) => c.id === id && c.unlocked) ||
        game.cats.find((c) => c.unlocked);
      if (cat) setCatId(cat.id);
    } else if (kind === "bakery") setPage("stock");
    else if (kind === "stock" || kind === "decor")
      setPage(
        kind === "stock" && game.staff.some((w) => w.id === id)
          ? "staff"
          : kind,
      );
  };
  const miniContext = useMemo<MinigameContext>(() => {
    const s = getState();
    return {
      transactions: s.transactions.filter((t) => t.day === s.day),
      inventory: s.inventory,
      deliveries: s.deliveries,
      staff: s.staff.filter((w) => w.hired && !w.former),
      orders: s.orders,
      incidents: s.incidents,
    };
  }, [mini]);
  const completed = (score: number, detail?: string) => {
    if (!mini) return;
    audio.play("success");
    if (mini.catId)
      dispatch({
        type: "CAT_GAME",
        catId: mini.catId,
        game: (mini.kind === "explore" ? "trail" : mini.kind) as "feather",
        score,
      });
    else if (mini.orderId) {
      const name =
        mini.kind === "milk"
          ? "pour"
          : mini.kind === "layers"
            ? "layer"
            : mini.kind;
      setTechniques((t) => ({ ...t, [name]: score }));
      if (mini.kind === "whisk")
        dispatch({
          type: "ADJUST_DRINK",
          orderId: mini.orderId,
          patch: { dissolution: score },
        });
      if (mini.kind === "milk")
        dispatch({
          type: "ADJUST_DRINK",
          orderId: mini.orderId,
          patch: { presentation: score },
        });
      setToast(
        `Kỹ thuật ${Math.round(score)}/100. Điểm này sẽ ảnh hưởng món hoàn tất.`,
      );
    } else if (mini.bakingId)
      dispatch({
        type: "TAKE_BAKE",
        bakingId: mini.bakingId,
        decoration: score,
      });
    else if (mini.kind === "clean") {
      if (score >= 60) dispatch({ type: "CLEAN" });
      else
        setToast(
          "Chưa dọn đủ khu vực. Hãy ưu tiên sàn ướt và chạm mỗi chỗ ba lần.",
        );
    } else {
      let data: ManagementResult | undefined;
      try {
        data = JSON.parse(detail || "");
      } catch {
        setToast("Chưa có kết quả kiểm chứng.");
      }
      if (
        data &&
        ["cash", "count", "inspect"].includes(mini.kind) &&
        score === 100
      )
        dispatch({
          type: "AUDIT",
          kind: mini.kind as "cash",
          transactionIds: data.transactionIds,
          inventoryCount: data.inventoryCount,
          deliveryIds: data.deliveryIds,
          ...(data.quarantineIds ? { quarantineIds: data.quarantineIds } : {}),
        });
      else if (data && mini.kind === "lost") {
        for (const ev of data.evidence || [])
          dispatch({ type: "INVESTIGATE", ...ev });
      } else if (data && mini.kind === "schedule" && score >= 50) {
        for (const assignment of data.shiftAssignments || []) {
          const worker = getState().staff.find(
            (w) => w.id === assignment.staffId && w.hired && !w.former,
          );
          if (worker) {
            if (worker.role !== assignment.role)
              dispatch({
                type: "STAFF_ACTION",
                staffId: worker.id,
                action: "transfer",
                role: assignment.role,
              });
            if (!worker.onShift)
              dispatch({
                type: "STAFF_ACTION",
                staffId: worker.id,
                action: "shift",
              });
          }
        }
        setToast(
          "Đã áp dụng ca làm. Nhân viên nhận việc thật theo vai trò và năng lượng.",
        );
      } else if (data && mini.kind === "rush" && score >= 60) {
        let manual: string | undefined;
        for (const route of data.routes || []) {
          const worker = getState().staff.find(
            (w) =>
              w.hired &&
              !w.former &&
              w.onShift &&
              !w.taskId &&
              (w.role === "manager" ||
                w.role === (route.task === "drink" ? "barista" : "cashier")),
          );
          if (worker)
            dispatch({
              type: "ASSIGN",
              staffId: worker.id,
              task: route.task,
              targetId: route.orderId,
            });
          else if (route.task === "serve")
            dispatch({ type: "SERVE", orderId: route.orderId });
          else manual ??= route.orderId;
        }
        if (manual) selectOrder(manual);
      } else
        setToast(
          mini.kind === "taste"
            ? `Suy luận công thức đạt ${Math.round(score)} điểm. Dùng thông tin vị trà khi tạo món riêng.`
            : "Kết quả chưa đủ chính xác; dữ liệu tiệm chưa được thay đổi.",
        );
    }
    setMini(undefined);
  };
  const sceneView = {
    interactive: page === "cafe" && !selected && !catId && !mini && !welcome,
    paused: game.paused,
    reducedMotion: game.settings.reducedMotion,
    weather: game.weather,
    phase: game.phase,
    seconds: game.clock,
    day: game.day,
    customers: customersInCafe(game).map((o) => ({
      id: o.id,
      appearance: customerIndex(o.customerId),
      name: customers.find((c) => c.id === o.customerId)?.name || "Khách",
      status: o.status,
      kind: o.kind,
    })),
    staff: game.staff
      .filter((s) => s.hired && !s.former && s.onShift)
      .map((s, i) => ({
        id: s.id,
        appearance: game.staff.indexOf(s),
        name: s.name,
        task: game.tasks.find((t) => t.id === s.taskId)?.type,
      })),
    cats: game.cats
      .filter((c) => c.unlocked)
      .map((c) => ({
        id: c.id,
        name: c.name,
        appearance: catIndex(c.id),
        mood: c.expression,
        energy: c.energy,
        activity: c.activity,
      })),
    furniture: game.furniture,
    player: game.avatar,
    events: [
      ...game.deliveries
        .filter((d) => d.status === "travel")
        .slice(0, 1)
        .map((d) => ({
          id: d.id,
          kind: "delivery" as const,
          name: "Giao nguyên liệu",
        })),
      ...game.incidents
        .filter(
          (i) =>
            i.stage !== "resolved" &&
            ["fridge", "health", "inspection"].includes(i.type),
        )
        .map((i) => ({
          id: i.id,
          kind:
            i.type === "health"
              ? ("vet" as const)
              : i.type === "inspection"
                ? ("inspector" as const)
                : ("technician" as const),
          name:
            i.type === "health"
              ? "Thú y"
              : i.type === "inspection"
                ? "Kiểm tra vệ sinh"
                : "Kỹ thuật viên",
        })),
    ],
  };
  if (new URLSearchParams(location.search).has("gallery"))
    return <AssetGallery />;
  return (
    <div
      className={`app ${game.settings.reducedMotion ? "reduced-motion" : ""}`}
      onPointerDown={() => {
        void audio.unlock();
      }}
    >
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <Icon name="cat" size={34} />
          </div>
          <div className="brand-title">
            Miu Matcha<em>TIỆM TRÀ & BÁNH MÈO</em>
          </div>
        </div>
        <div className="header-right">
          <span className="wallet">
            <Icon name="money" size={22} />
            {money(game.cash)}
          </span>
          <span className="divider" />
          <button
            className="icon-btn help-button"
            aria-label="Hướng dẫn"
            onClick={() => setPage("help")}
          >
            <Icon name="help" />
          </button>
          <button
            className="icon-btn"
            aria-label="Cài đặt"
            onClick={() => setPage("settings")}
          >
            <Icon name="settings" />
          </button>
          <button
            className="icon-btn"
            aria-label={game.paused ? "Tiếp tục" : "Tạm dừng"}
            onClick={() => dispatch({ type: "PAUSE" })}
          >
            <Icon name={game.paused ? "play" : "pause"} />
          </button>
        </div>
      </header>
      <div className="layout">
        <nav className="sidebar" aria-label="Sổ tiệm">
          {(
            [
              ["cafe", "shop", "Tiệm của mình"],
              ["menu", "recipe", "Thực đơn"],
              ["cats", "cat", "Các bé mèo"],
              ["stock", "stock", "Kho & bánh"],
              ["staff", "staff", "Nhân viên"],
              ["decor", "decor", "Trang trí"],
              ["report", "report", "Thu chi"],
            ] as const
          ).map(([id, icon, label]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => {
                audio.play("click");
                setPage(id);
              }}
            >
              <Icon name={icon} size={26} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
          <div className="sidebar-bottom">
            <button
              className={`nav-item ${page === "more" ? "active" : ""}`}
              onClick={() => setPage("more")}
            >
              <Icon name="calendar" size={25} />
              <span className="nav-label">Đời sống tiệm</span>
              {game.incidents.some((i) => i.stage !== "resolved") && (
                <span className="notice-counter">!</span>
              )}
            </button>
          </div>
        </nav>
        <main className="main">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">MỘT GÓC NHỎ, NHIỀU ĐIỀU DỄ THƯƠNG</p>
              <h1>
                {game.day === 1
                  ? "Ngày đầu tiên của tiệm"
                  : `Một ngày mới ở Miu · Ngày ${game.day}`}
              </h1>
              <p>
                Pha một tách trà ngon. Chăm một bé mèo vui. Chậm lại một chút.
              </p>
            </div>
            <span className="weather-pill">
              <Icon name={game.weather === "rain" ? "rain" : "sun"} />
              {game.weather === "rain"
                ? "Mưa dịu ngoài hiên"
                : game.weather === "cool"
                  ? "Se lạnh · trà ấm"
                  : "Nắng nhẹ · 24°C"}
            </span>
          </div>
          {Number(game.flags.warningStreak ?? 0) > 0 && (
            <div className="warning">
              <strong>
                {game.flags.businessFailed
                  ? "Tiệm đang tạm ngừng để phục hồi"
                  : `Cảnh báo thiếu quỹ ${game.flags.warningStreak}/3`}
              </strong>
              <p>
                {game.flags.businessFailed
                  ? "Sau ba ngày có hóa đơn đến hạn và quỹ thấp, cần khôi phục tiền mặt + dự phòng tối thiểu 50.000đ để mở ngày mới."
                  : "Bạn có thể gia hạn hóa đơn, rút quỹ, điều chỉnh ca, vay hoặc bán thiết bị trước ngày tiếp theo."}
              </p>
              <div className="actions" style={{ marginTop: 10 }}>
                <Button onClick={() => setPage("report")}>
                  Xem sổ & kế hoạch phục hồi
                </Button>
                <Button onClick={() => setPage("settings")}>
                  Bản lưu & chơi mới
                </Button>
              </div>
            </div>
          )}
          <div className="status-strip">
            <div className="time-status">
              <span className="status-dot" />
              <strong>Ngày {game.day}</strong>
              <span style={{ color: "#c4c9b5" }}>·</span>
              <strong>
                {String(
                  8 + Math.floor((game.elapsed / game.dayDuration) * 10),
                ).padStart(2, "0")}
                :
                {String(
                  Math.floor((game.elapsed / game.dayDuration) * 600) % 60,
                ).padStart(2, "0")}
              </strong>
              <div className="day-bar">
                <Meter value={(game.elapsed / game.dayDuration) * 100} />
              </div>
              <small>{phaseNames[game.phase]}</small>
            </div>
            <div className="status-actions">
              <Button icon="clean" onClick={() => setMini({ kind: "clean" })}>
                Dọn tiệm
              </Button>
              {game.phase === "preparation" ? (
                <Button
                  icon="play"
                  kind="primary"
                  onClick={() => {
                    dispatch({ type: "OPEN" });
                    audio.play("success");
                  }}
                >
                  Mở cửa tiệm
                </Button>
              ) : game.phase === "open" ? (
                <Button icon="moon" onClick={() => dispatch({ type: "CLOSE" })}>
                  Đóng cửa
                </Button>
              ) : game.phase === "closing" ? (
                <Button
                  icon="orders"
                  onClick={() => {
                    if (active.length) selectOrder(active[0].id);
                    else dispatch({ type: "CLOSE" });
                  }}
                >
                  Đơn cuối ({active.length})
                </Button>
              ) : (
                <Button
                  icon="sun"
                  kind="primary"
                  onClick={() => dispatch({ type: "NEXT_DAY" })}
                >
                  Ngày tiếp theo
                </Button>
              )}
              {game.phase === "closing" && (
                <Button
                  kind="danger small"
                  onClick={() => dispatch({ type: "CLOSE" })}
                >
                  Đóng sổ · bỏ {active.length} đơn
                </Button>
              )}
            </div>
          </div>
          <div className="workspace">
            <div className="cafe-main">
              <section className="cafe-card" aria-label="Cảnh quán Miu Matcha">
                <div className="scene-top">
                  <span className="scene-tag">
                    <Icon name="leaf" size={15} />
                    GÓC TIỆM CỦA BẠN
                  </span>
                  <span className="scene-tag live">
                    <span className="status-dot" />
                    {game.phase === "open"
                      ? "OPEN · XIN CHÀO!"
                      : "MIU · CHẬM VÀ THƠM"}
                  </span>
                </div>
                <div className="scene-wrap">
                  {ready && (
                    <CafeScene view={sceneView} onSelect={selectScene} />
                  )}{" "}
                  {game.paused && (
                    <div className="paused-overlay">
                      <strong>Tiệm đang nghỉ một chút</strong>
                      <Button
                        icon="play"
                        kind="primary"
                        onClick={() =>
                          dispatch({ type: "PAUSE", paused: false })
                        }
                      >
                        Tiếp tục chơi
                      </Button>
                    </div>
                  )}
                </div>
                <div className="scene-foot">
                  <span className="hint">
                    <Icon name="help" size={14} />
                    Chạm vào quầy, khách hoặc mèo để tương tác.
                  </span>
                  <span>
                    Cấp {game.level} · Danh tiếng {Math.round(game.reputation)}
                    /100
                  </span>
                </div>
              </section>
              <section className="cat-section">
                <div className="row-title">
                  <h3>Những người bạn nhỏ</h3>
                  <button className="text-link" onClick={() => setPage("cats")}>
                    Ghé góc mèo <Icon name="arrow" size={13} />
                  </button>
                </div>
                <div className="cat-cards">
                  {game.cats
                    .filter((c) => c.unlocked)
                    .slice(0, 3)
                    .map((c) => (
                      <button
                        key={c.id}
                        className="cat-card"
                        onClick={() => setCatId(c.id)}
                      >
                        <img
                          className="cat-avatar"
                          src={`/assets/cats/portrait-cat-${catIndex(c.id)}.svg`}
                          alt={`Mèo ${c.name}`}
                        />
                        <div className="cat-card-body">
                          <h4>{c.name}</h4>
                          <p>
                            {c.expression === "bình yên"
                              ? c.personality
                              : c.expression}
                          </p>
                          <Meter
                            value={c.joy}
                            tone={
                              c.id === "houji"
                                ? "gold"
                                : c.id === "mochi"
                                  ? "pink"
                                  : "green"
                            }
                          />
                        </div>
                        <Icon name="heart" size={13} />
                      </button>
                    ))}
                </div>
              </section>
            </div>
            <aside className="side-panel">
              <div className="side-title">
                <h3>Khách đang chờ</h3>
                <span className="pill">{active.length} đơn</span>
              </div>
              <p className="side-sub">Một món ngon, một nụ cười.</p>
              <div className="order-list">
                {active.length ? (
                  active.map((o) => {
                    const c = customers.find((c) => c.id === o.customerId)!;
                    const r = game.recipes.find((r) => r.id === o.recipeId);
                    return (
                      <article
                        className={`order-card ${o.status !== "waiting" ? "working" : ""}`}
                        key={o.id}
                      >
                        <div className="order-person">
                          <img
                            className="portrait"
                            src={`/assets/characters/portrait-customer-${customerIndex(c.id)}.svg`}
                            alt={c.name}
                          />
                          <div>
                            <h4>{c.name}</h4>
                            <p>
                              {o.kind === "table"
                                ? "Tại tiệm"
                                : o.kind === "takeaway"
                                  ? "Mang đi"
                                  : o.kind === "delivery"
                                    ? "Giao hàng"
                                    : "Combo trà + bánh"}{" "}
                              · {c.personality}
                            </p>
                          </div>
                        </div>
                        <div className="order-recipe">
                          <img
                            src={itemArt(o.recipeId)}
                            width="25"
                            height="29"
                            alt=""
                          />
                          {r?.name || "Trà tự pha"}
                        </div>
                        <div className="order-meta">
                          <span>
                            {o.requested.temperature > 35
                              ? "Uống ấm"
                              : "Uống lạnh"}{" "}
                            · {o.requested.sugar}g đường
                          </span>
                          <span>{money(o.price)}</span>
                        </div>
                        <Meter value={(o.remaining / c.patience) * 100} />
                        <Button
                          kind={o.status === "ready" ? "primary" : ""}
                          icon={o.status === "ready" ? "orders" : "recipe"}
                          onClick={() => selectOrder(o.id)}
                        >
                          {o.worker
                            ? "Xem nhân viên làm"
                            : o.status === "ready"
                              ? "Giao món"
                              : o.status === "making"
                                ? "Tiếp tục pha"
                                : "Pha món này"}
                        </Button>
                      </article>
                    );
                  })
                ) : (
                  <div className="queue-empty">
                    <Icon name="orders" size={45} />
                    <p>
                      {game.phase === "preparation"
                        ? "Khách sẽ đến sau khi bạn mở tiệm. Kho ban đầu đã sẵn sàng cho một ngày nhỏ."
                        : game.phase === "after"
                          ? "Cảm ơn một ngày chăm chỉ. Xem báo cáo rồi nghỉ một chút nhé."
                          : "Chưa có đơn mới. Đây là lúc vuốt mèo hoặc chuẩn bị bánh."}
                    </p>
                  </div>
                )}
              </div>
              <div className="queue-summary">
                <span>
                  <strong>{served}</strong>đã phục vụ
                </span>
                <span>
                  <strong>{Math.round(game.hygiene)}%</strong>sạch sẽ
                </span>
              </div>
              {game.incidents.some((i) => i.stage !== "resolved") && (
                <Button
                  icon="warning"
                  kind="small"
                  onClick={() => setPage("more")}
                >
                  Có việc cần xem xét
                </Button>
              )}
            </aside>
          </div>
          <div className="below-scene">
            <div className="daily-note">
              <div className="note-icon">
                <Icon name="trophy" size={25} />
              </div>
              <div>
                <h4>
                  {game.missions.find((m) => !m.claimed)?.title ||
                    "Một ngày bình yên ở Miu"}
                </h4>
                <p>
                  {game.missions.find((m) => !m.claimed)
                    ? `${game.missions.find((m) => !m.claimed)!.progress}/${game.missions.find((m) => !m.claimed)!.target} · Mở sổ đời sống để nhận phần thưởng.`
                    : "Khách nhớ vị trà, còn mèo nhớ những lần bạn dịu dàng."}
                </p>
              </div>
            </div>
            <div className="ambience">
              <div>
                <h4>Âm thanh của một buổi chiều</h4>
                <p>Giai điệu tự tạo · tiếng mưa & mèo</p>
              </div>
              <button
                className="icon-btn"
                aria-label="Bật hoặc tắt nhạc"
                onClick={() =>
                  dispatch({
                    type: "SETTINGS",
                    patch: { music: game.settings.music > 0 ? 0 : 0.25 },
                  })
                }
              >
                <Icon name={game.settings.music > 0 ? "sound" : "sound"} />
              </button>
            </div>
          </div>
          <footer className="app-foot">
            <span>
              Miu Matcha · Được lưu trên thiết bị này{" "}
              {saveError && "· " + saveError}
            </span>
            <span>Nhận xét cục bộ · Không cần tài khoản</span>
          </footer>
        </main>
      </div>
      {page !== "cafe" && (
        <Modal
          title={
            {
              menu: "Sổ công thức & thực đơn",
              cats: "Góc mèo của Miu",
              stock: "Kho nguyên liệu & lò bánh",
              staff: "Những người cùng chăm tiệm",
              decor: "Một góc tiệm theo ý bạn",
              report: "Sổ thu chi",
              more: "Đời sống tiệm",
              settings: "Cài đặt & bản lưu",
              help: "Chào bạn, chủ tiệm mới!",
              journal: "Nhật ký của Miu",
            }[page]
          }
          subtitle={
            page === "report"
              ? "Mỗi con số đến từ giao dịch thật trong ngày."
              : undefined
          }
          wide={["menu", "stock", "staff", "decor", "report", "more"].includes(
            page,
          )}
          onClose={() => setPage("cafe")}
        >
          <Management
            page={page}
            onCat={setCatId}
            onMinigame={(kind, bakingId) => setMini({ kind, bakingId })}
            onToast={setToast}
          />
        </Modal>
      )}
      {selected && (
        <Modal
          title={`Pha cho ${customers.find((c) => c.id === selected.customerId)?.name}`}
          subtitle={`Phiếu ${selected.id} · ${money(selected.price)} · ${selected.status === "ready" ? "Món đã hoàn tất" : "Nguyên liệu chỉ trừ khi thêm vào ly"}`}
          wide
          onClose={() => setOrderId(undefined)}
        >
          <Brew
            order={selected}
            scores={techniques}
            feedback={feedback}
            onGame={(kind) => setMini({ kind, orderId: selected.id })}
            onServed={() => {
              dispatch({ type: "SERVE", orderId: selected.id });
              if (getState().orders.find((o) => o.id === selected.id)?.paid) {
                setOrderId(undefined);
                audio.play("success");
              }
            }}
          />
        </Modal>
      )}
      {selectedCat && (
        <Modal
          title={`${selectedCat.name} · ${selectedCat.personality}`}
          subtitle="Chú ý phản ứng của bé. Tôn trọng khoảng nghỉ giúp bé tin bạn hơn."
          onClose={() => setCatId(undefined)}
        >
          <div className="cat-detail-top">
            <img
              className="cat-detail-img"
              src={`/assets/cats/portrait-cat-${catIndex(selectedCat.id)}.svg`}
              alt={selectedCat.name}
            />
            <div>
              <p>
                {selectedCat.expression} · {selectedCat.activity}
              </p>
              <Meter value={selectedCat.hunger} label="No bụng" />
              <Meter value={selectedCat.joy} label="Vui vẻ" tone="pink" />
              <Meter
                value={selectedCat.energy}
                label="Năng lượng"
                tone="gold"
              />
              <Meter value={selectedCat.cleanliness} label="Vệ sinh" />
              <Meter value={selectedCat.trust} label="Thân thiết" tone="pink" />
            </div>
          </div>
          {selectedCat.restingUntil > game.clock && (
            <div className="warning">
              Bé đang muốn nghỉ. Hãy đợi hoặc để bé yên.
            </div>
          )}
          <div className="cat-interactions">
            {catActions.map(([action, label]) => (
              <Button
                key={action}
                onClick={() => {
                  dispatch({
                    type: "CAT_INTERACT",
                    catId: selectedCat.id,
                    interaction: action,
                  });
                  audio.play("cat");
                }}
              >
                {label}
              </Button>
            ))}
          </div>
          <h3 style={{ marginTop: 22 }}>Chơi một chút nhé?</h3>
          <p className="small-text">
            Tối đa 3 lượt thưởng mỗi bé mỗi ngày. Động tác yêu thích khác nhau
            giữa các bé.
          </p>
          <div className="game-list">
            {catGames.map(([kind, label]) => (
              <Button
                key={kind}
                onClick={() => setMini({ kind, catId: selectedCat.id })}
              >
                {label}
              </Button>
            ))}
          </div>
        </Modal>
      )}
      {welcome && ready && (
        <Modal
          title="Một tiệm nhỏ đang đợi bạn"
          onClose={() => {
            dispatch({ type: "TUTORIAL", step: 1 });
            setWelcome(false);
          }}
        >
          <div className="onboarding">
            <img
              src="/assets/cats/portrait-cat-0.svg"
              alt="Matcha chào chủ tiệm"
            />
            <div>
              <h2>Chào mừng đến Miu.</h2>
              <p>
                Ở đây, bạn pha trà, nướng bánh và chăm các bé mèo. Bắt đầu thật
                nhỏ: một ly trà đúng ý khách và một buổi sáng bình yên.
              </p>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <b>01 · CHUẨN BỊ</b>Kho đã có nguyên liệu. Bạn có thể nướng một mẻ
              bánh.
            </div>
            <div className="tutorial-step">
              <b>02 · MỞ TIỆM</b>Nhận đơn, thêm nguyên liệu rồi chơi minigame
              pha.
            </div>
            <div className="tutorial-step">
              <b>03 · KẾT NGÀY</b>Giao món, đóng cửa và đọc báo cáo thu chi.
            </div>
          </div>
          <p className="small-text">
            Chạm đồ vật trong cảnh để thao tác. Phím cách tạm dừng; đổi tab cũng
            tự tạm dừng. Các hệ thống nâng cao mở dần theo cấp tiệm.
          </p>
          <div className="actions" style={{ marginTop: 20 }}>
            <Button
              kind="primary"
              icon="leaf"
              onClick={() => {
                dispatch({ type: "TUTORIAL", step: 1 });
                setWelcome(false);
              }}
            >
              Bắt đầu chăm tiệm
            </Button>
          </div>
        </Modal>
      )}
      {mini && (
        <Minigame
          key={`${mini.kind}-${mini.catId || mini.orderId || mini.bakingId || "practice"}`}
          kind={mini.kind}
          context={miniContext}
          reducedMotion={game.settings.reducedMotion}
          externallyPaused={game.paused}
          onPauseChange={(paused) => dispatch({ type: "PAUSE", paused })}
          onComplete={completed}
          onCancel={() => setMini(undefined)}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function Brew({
  order,
  scores,
  feedback,
  onGame,
  onServed,
}: {
  order: Order;
  scores: Record<string, number>;
  feedback?: FeedbackResult;
  onGame: (kind: string) => void;
  onServed: () => void;
}) {
  const game = useGame();
  const recipe = game.recipes.find((r) => r.id === order.recipeId);
  const customer = customers.find((c) => c.id === order.customerId)!;
  const [formula, setFormula] = useState<Formula>(
    order.draft?.formula || order.requested,
  );
  const current = order.draft?.formula || formula;
  const mastered =
    game.orders.filter(
      (o) =>
        o.recipeId === order.recipeId &&
        o.paid &&
        (o.draft?.technique ?? 0) >= 85,
    ).length >= 3;
  const patch = (p: Partial<Formula>) => {
    if (order.draft)
      dispatch({ type: "ADJUST_DRINK", orderId: order.id, patch: p });
    else setFormula((f) => ({ ...f, ...p }));
  };
  const range = (
    label: string,
    key: keyof Formula,
    min: number,
    max: number,
    unit: string,
  ) => (
    <label className="field">
      {label} · {String(current[key])}
      {unit}
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        value={Number(current[key])}
        onChange={(e) => patch({ [key]: Number(e.target.value) })}
      />
    </label>
  );
  return (
    <div>
      <div className="brew-layout">
        <div className="drink-preview">
          <img
            className="drink-art"
            src={itemArt(order.recipeId)}
            alt={recipe?.name}
          />
          <div>
            <h3>{recipe?.name}</h3>
            <p>
              {customer.personality} · {order.requested.tea} ·{" "}
              {order.requested.temperature}°C
            </p>
            <p>
              Đường {order.requested.sugar}g · sữa {order.requested.milkAmount}
              ml · topping {order.requested.topping}
            </p>
            <div className="price">
              Giá vốn {money(order.draft?.cost ?? recipeCost(current))}
            </div>
            <p>
              Lãi gộp dự kiến{" "}
              {money(order.price - (order.draft?.cost ?? recipeCost(current)))}
            </p>
          </div>
        </div>
        <div>
          {customer.avoid.length > 0 && (
            <div className="warning">
              Khách yêu cầu tránh:{" "}
              {customer.avoid
                .map((i) => (i === "milk" ? "sữa tươi" : i))
                .join(", ")}
              . Game chặn giao món có thành phần cần tránh.
            </div>
          )}
          {order.status === "waiting" ||
          (order.status === "making" && !order.worker) ? (
            <>
              <div className="brew-fields">
                <label className="field">
                  Loại trà
                  <select
                    aria-label="Loại trà"
                    value={current.tea}
                    onChange={(e) =>
                      patch({ tea: e.target.value as Formula["tea"] })
                    }
                  >
                    {["matcha", "houjicha", "sencha", "genmaicha"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                {range("Lượng trà", "teaAmount", 1, 8, "g")}
                <label className="field">
                  Loại sữa
                  <select
                    aria-label="Loại sữa"
                    value={current.milk}
                    onChange={(e) =>
                      patch({ milk: e.target.value as Formula["milk"] })
                    }
                  >
                    <option value="milk">Sữa tươi</option>
                    <option value="oat">Sữa yến mạch</option>
                    <option value="none">Không sữa</option>
                  </select>
                </label>
                {range("Lượng sữa", "milkAmount", 0, 220, "ml")}
                {range("Đường", "sugar", 0, 30, "g")}
                {range("Đá", "ice", 0, 120, "g")}
                <label className="field">
                  Syrup
                  <select
                    aria-label="Syrup"
                    value={current.syrup}
                    onChange={(e) =>
                      patch({ syrup: e.target.value as Formula["syrup"] })
                    }
                  >
                    {[
                      ["none", "Không"],
                      ["strawberry", "Dâu"],
                      ["caramel", "Caramel"],
                      ["lemon", "Chanh"],
                      ["mango", "Xoài"],
                    ].map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                {range("Lượng syrup", "syrupAmount", 0, 50, "ml")}
                <label className="field">
                  Topping
                  <select
                    aria-label="Topping"
                    value={current.topping}
                    onChange={(e) =>
                      patch({ topping: e.target.value as Formula["topping"] })
                    }
                  >
                    {[
                      ["none", "Không"],
                      ["cream", "Kem sữa"],
                      ["cheese", "Kem cheese"],
                      ["pearl", "Trân châu trắng"],
                      ["jelly", "Thạch trà"],
                      ["redbean", "Đậu đỏ"],
                    ].map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                {range("Lượng topping", "toppingAmount", 0, 50, "g")}
                {range("Nhiệt độ", "temperature", 5, 70, "°C")}
                <div className="field">
                  Hòa tan {current.dissolution}% · trình bày{" "}
                  {current.presentation}%
                  <span className="small-text">
                    Điểm minigame đánh trà và rót sữa thay đổi hai chỉ số này.
                  </span>
                </div>
              </div>
              {order.status === "waiting" ? (
                <div className="actions">
                  <Button
                    kind="primary"
                    icon="recipe"
                    onClick={() =>
                      dispatch({
                        type: "START_DRINK",
                        orderId: order.id,
                        formula,
                      })
                    }
                  >
                    Thêm nguyên liệu vào ly
                  </Button>
                  <Button onClick={() => setFormula({ ...order.requested })}>
                    Đúng phiếu gọi món
                  </Button>
                </div>
              ) : (
                <>
                  <p className="small-text">
                    Sửa món chỉ bổ sung khi hợp lý. Đổi loại trà hoặc lấy bớt
                    nguyên liệu đã pha phải bỏ ly, chịu hao hụt.
                  </p>
                  <div className="techniques">
                    {[
                      ["whisk", "Đánh trà chữ W"],
                      ["milk", "Rót sữa"],
                      ["layers", "Tạo tầng"],
                      ["shake", "Lắc theo nhịp"],
                    ].map(([kind, label]) => (
                      <Button key={kind} onClick={() => onGame(kind)}>
                        {label}
                        {scores[
                          kind === "milk"
                            ? "pour"
                            : kind === "layers"
                              ? "layer"
                              : kind
                        ] !== undefined
                          ? ` · ${Math.round(scores[kind === "milk" ? "pour" : kind === "layers" ? "layer" : kind])}`
                          : ""}
                      </Button>
                    ))}
                  </div>
                  <div className="actions" style={{ marginTop: 16 }}>
                    <Button
                      kind="primary"
                      icon="orders"
                      onClick={() =>
                        dispatch({
                          type: "FINISH_DRINK",
                          orderId: order.id,
                          scores: Object.keys(scores).length
                            ? scores
                            : undefined,
                          technique: Object.keys(scores).length
                            ? undefined
                            : mastered
                              ? 88
                              : 40,
                        })
                      }
                    >
                      {Object.keys(scores).length
                        ? "Hoàn tất món"
                        : mastered
                          ? "Pha nhanh đã thành thạo · 88/100"
                          : "Pha nhanh · kỹ thuật 40/100"}
                    </Button>
                    <Button
                      kind="danger"
                      onClick={() =>
                        dispatch({ type: "DISCARD", orderId: order.id })
                      }
                    >
                      Bỏ món & pha lại
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : order.worker && order.status === "making" ? (
            <div className="success-note">
              Nhân viên đã nhận tác vụ. Nguyên liệu đã được dùng; bạn có thể
              theo dõi thời gian trong sổ nhân viên.
            </div>
          ) : (
            <>
              <div className="score-display">
                <span className="score-big">{order.score?.total ?? 0}</span>
                <div>
                  <strong>Điểm đồ uống /100</strong>
                  <p className="score-details">
                    Đúng yêu cầu {order.score?.requirement}/30 · khẩu vị{" "}
                    {order.score?.taste}/30
                    <br />
                    Kỹ thuật {order.score?.technique}/20 · nhiệt{" "}
                    {order.score?.temperature}/10 · trình bày{" "}
                    {order.score?.presentation}/10
                  </p>
                </div>
              </div>
              <blockquote className="feedback">
                {feedback?.text || order.score?.feedback || "Món đã hoàn tất."}
                <small>
                  {feedback?.source === "ai"
                    ? "Nhận xét AI từ thông số mô phỏng"
                    : "Nhận xét cục bộ theo quy tắc"}{" "}
                  · Không phải nếm đồ uống thật
                </small>
              </blockquote>
              {order.status === "ready" && (
                <div className="actions">
                  <Button kind="primary" icon="orders" onClick={onServed}>
                    Giao đúng đơn & thu tiền
                  </Button>
                  <Button
                    kind="danger"
                    onClick={() =>
                      dispatch({ type: "DISCARD", orderId: order.id })
                    }
                  >
                    Bỏ món & pha lại
                  </Button>
                </div>
              )}
              {order.status === "served" && (
                <p>Món đã thanh toán; giao lại không tạo thêm doanh thu.</p>
              )}
              {order.status === "left" && (
                <p>
                  Khách đã rời quán. Nguyên liệu pha dở được ghi nhận là hao
                  hụt.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
