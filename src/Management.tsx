import { useState } from "react";
import {
  baseFormula,
  cakes,
  customers,
  furniture,
  ingredients,
  suppliers,
  roleNames,
  recipeCost,
  stock,
  reportDay,
  canPlace,
  occupiedCells,
} from "./domain";
import type { Formula, GameState, IngredientId, Recipe, Role } from "./domain";
import { dispatch, getState, newGame, replaceGame, useGame } from "./store";
import { exportGame, importGame } from "./persistence";
import { Button, Empty, Icon, Meter, Section, money } from "./ui";
import IncidentNarration from "./IncidentNarration";
import CatPhoto from "./CatPhoto";

type Props = {
  page: string;
  onCat: (id: string) => void;
  onMinigame: (kind: string, bakingId?: string) => void;
  onToast: (message: string) => void;
};
const cIndex = (id: string) =>
  ["matcha", "houji", "mochi", "sesame", "chestnut", "snow"].indexOf(id);
const art = (name: string, group = "items") => `/assets/${group}/${name}.svg`;
const labels: Record<string, string> = {
  ingredients: "Nguyên liệu",
  cogs: "Giá vốn",
  waste: "Hao hụt",
  salary: "Lương",
  rent: "Thuê mặt bằng",
  utilities: "Điện nước",
  cats: "Chăm mèo",
  maintenance: "Bảo trì",
  marketing: "Quảng cáo",
  packaging: "Bao bì",
  delivery: "Giao hàng",
  tax: "Thuế giả lập",
  refund: "Hoàn tiền",
  sale: "Bán món",
  training: "Đào tạo",
  insurance: "Bảo hiểm",
  interest: "Lãi vay",
  loss: "Thất thoát",
  investment: "Đầu tư",
  cleaning: "Vệ sinh",
  advertising: "Giới thiệu tiệm",
  management: "Xử lý vụ việc",
  workshop: "Workshop",
  community: "Cộng đồng",
  bonus: "Thưởng đội ngũ",
  "staff-meal": "Bữa ăn ca",
  "loan-principal": "Trả gốc vay",
  payable: "Thanh toán hóa đơn",
  sales: "Bán món",
  inventory: "Nhập nguyên liệu",
  "inventory-return": "Trả hàng nhập",
  "investment-sale": "Bán lại thiết bị",
  "community-capital": "Hỗ trợ và thưởng nhiệm vụ",
  reserve: "Quỹ dự phòng",
};
export function Management(props: Props) {
  const game = useGame();
  switch (props.page) {
    case "menu":
      return <Menu />;
    case "cats":
      return <Cats onCat={props.onCat} />;
    case "stock":
      return <Stock onMinigame={props.onMinigame} />;
    case "staff":
      return <Team />;
    case "decor":
      return <Decor />;
    case "report":
      return <Reports />;
    case "more":
    case "journal":
      return <Life onMinigame={props.onMinigame} onCat={props.onCat} />;
    case "settings":
      return <Settings onToast={props.onToast} />;
    case "help":
      return <Help />;
    default:
      return <Empty>Tiệm đang sẵn sàng.</Empty>;
  }
}
function Tabs({
  items,
  value,
  onChange,
}: {
  items: [string, string][];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="tabs">
      {items.map(([id, label]) => (
        <button
          key={id}
          className={value === id ? "active" : ""}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
function Menu() {
  const g = useGame();
  const [tab, setTab] = useState("list");
  const [name, setName] = useState("Mây matcha của mình");
  const [price, setPrice] = useState(42000);
  const [formula, setFormula] = useState<Formula>({ ...baseFormula });
  const [editing, setEditing] = useState<string>();
  const patch = (p: Partial<Formula>) => setFormula((f) => ({ ...f, ...p }));
  return (
    <>
      <Tabs
        items={[
          ["list", "Thực đơn"],
          ["create", "Tạo công thức"],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "list" ? (
        <div className="grid-3">
          {g.recipes.map((r) => (
            <div className="panel" key={r.id}>
              <img
                className="product-art"
                src={art(r.custom ? `${r.formula.tea}-latte` : r.id)}
                alt={r.name}
              />
              <h3 className="recipe-name">{r.name}</h3>
              <p>
                {r.formula.tea} · {r.time}s · {r.formula.temperature}°C
              </p>
              <p>Giá vốn {money(recipeCost(r.formula))}</p>
              <div className="price">
                {money(r.price)} · lãi gộp{" "}
                {money(r.price - recipeCost(r.formula))}
              </div>
              {r.level > g.level ? (
                <div className="warning">
                  Mở ở cấp {r.level}. Phục vụ và chăm mèo để tích kinh nghiệm.
                </div>
              ) : (
                <>
                  <label className="field">
                    Giá bán
                    <input
                      aria-label={`Giá ${r.name}`}
                      type="number"
                      min="10000"
                      max="100000"
                      step="1000"
                      defaultValue={r.price}
                      key={r.price}
                      onBlur={(e) =>
                        dispatch({
                          type: "PRICE",
                          recipeId: r.id,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <div className="actions">
                    <Button
                      kind={g.menu.includes(r.id) ? "primary" : ""}
                      onClick={() =>
                        dispatch({
                          type: "MENU",
                          recipeId: r.id,
                          enabled: !g.menu.includes(r.id),
                        })
                      }
                    >
                      {g.menu.includes(r.id)
                        ? "Đang trong menu"
                        : "Đưa vào menu"}
                    </Button>
                    <Button
                      kind="small"
                      onClick={() => {
                        setEditing(undefined);
                        setName(`${r.name} riêng`);
                        setFormula({ ...r.formula });
                        setPrice(r.price);
                        setTab("create");
                      }}
                    >
                      Biến tấu
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-2">
          <div className="panel">
            <h3>Một công thức mang tên bạn</h3>
            <p>
              Công thức được lưu thật; nhân viên có thể pha từ menu khi đạt cấp
              2.
            </p>
            <label className="field" style={{ marginTop: 15 }}>
              Tên món
              <input
                value={name}
                maxLength={48}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="brew-fields">
              <label className="field">
                Trà
                <select
                  value={formula.tea}
                  onChange={(e) =>
                    patch({ tea: e.target.value as Formula["tea"] })
                  }
                >
                  {["matcha", "houjicha", "sencha", "genmaicha"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Lượng trà (g)
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formula.teaAmount}
                  onChange={(e) => patch({ teaAmount: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                Sữa
                <select
                  value={formula.milk}
                  onChange={(e) =>
                    patch({ milk: e.target.value as Formula["milk"] })
                  }
                >
                  <option value="milk">Sữa tươi</option>
                  <option value="oat">Yến mạch</option>
                  <option value="none">Không</option>
                </select>
              </label>
              <label className="field">
                Sữa (ml)
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={formula.milkAmount}
                  onChange={(e) =>
                    patch({ milkAmount: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                Đường (g)
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formula.sugar}
                  onChange={(e) => patch({ sugar: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                Nhiệt độ °C
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={formula.temperature}
                  onChange={(e) =>
                    patch({ temperature: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                Syrup
                <select
                  value={formula.syrup}
                  onChange={(e) =>
                    patch({ syrup: e.target.value as Formula["syrup"] })
                  }
                >
                  {["none", "strawberry", "caramel", "lemon", "mango"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="field">
                Syrup ml
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formula.syrupAmount}
                  onChange={(e) =>
                    patch({ syrupAmount: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                Topping
                <select
                  value={formula.topping}
                  onChange={(e) =>
                    patch({ topping: e.target.value as Formula["topping"] })
                  }
                >
                  {["none", "cream", "cheese", "pearl", "jelly", "redbean"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="field">
                Topping g
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formula.toppingAmount}
                  onChange={(e) =>
                    patch({ toppingAmount: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                Đá g
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formula.ice}
                  onChange={(e) => patch({ ice: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                Giá bán VND
                <input
                  type="number"
                  min="10000"
                  max="100000"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </label>
            </div>
            <Button
              kind="primary"
              icon="save"
              onClick={() => {
                dispatch({
                  type: "SAVE_RECIPE",
                  recipe: {
                    id: editing || `custom-${getState().sequence + 1}`,
                    name,
                    formula,
                    price,
                    level: 1,
                    time: 24,
                    custom: true,
                  },
                });
                if (getState().recipes.some((r) => r.name === name)) {
                  setTab("list");
                }
              }}
            >
              Lưu vào sổ công thức
            </Button>
          </div>
          <div className="panel">
            <img
              className="product-art"
              src={art(`${formula.tea}-latte`)}
              alt="Công thức tự pha"
            />
            <h3>{name}</h3>
            <p className="price">Giá vốn {money(recipeCost(formula))}</p>
            <p>Lãi gộp dự kiến {money(price - recipeCost(formula))}</p>
            <p>
              Giá vốn là nguyên liệu, chưa trừ lương, vận hành và thuế giả lập.
              Chất lượng món được tính khi pha và giao cho khách.
            </p>
            <div className="warning">
              Tên công thức là dữ liệu. Backend AI chỉ diễn đạt nhận xét từ điểm
              và thông số đã tính trong game.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Cats({ onCat }: { onCat: (id: string) => void }) {
  const g = useGame();
  return (
    <>
      <p className="small-text" style={{ marginBottom: 16 }}>
        Nhu cầu chỉ thay đổi khi game đang chạy. Thoát game không làm các bé đói
        thêm.
      </p>
      <div className="grid-3">
        {g.cats.map((c, i) => (
          <div className="panel" key={c.id}>
            <img
              className="product-art"
              src={art(`portrait-cat-${i}`, "cats")}
              alt={c.name}
            />
            <h3>{c.name}</h3>
            <p>{c.personality}</p>
            <p>
              {c.activity} · {c.expression}
            </p>
            {c.unlocked ? (
              <>
                <Meter value={c.hunger} label="No bụng" />
                <Meter value={c.joy} label="Vui vẻ" tone="pink" />
                <Meter value={c.trust} label="Thân thiết" />
                <Button kind="primary" icon="cat" onClick={() => onCat(c.id)}>
                  Đến bên {c.name}
                </Button>
              </>
            ) : (
              <>
                <div className="warning">
                  Mở ở cấp {i - 1}. Nhận nuôi tốn 35.000đ cho góc nghỉ và chăm
                  sóc ban đầu.
                </div>
                <Button
                  disabled={g.level < i - 1}
                  onClick={() => dispatch({ type: "ADOPT", catId: c.id })}
                >
                  Đón bé về tiệm
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
function Stock({
  onMinigame,
}: {
  onMinigame: (kind: string, bakingId?: string) => void;
}) {
  const g = useGame();
  const [tab, setTab] = useState("ingredients");
  const [supplier, setSupplier] = useState("local");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  return (
    <>
      <Tabs
        items={[
          ["ingredients", "Kho & nhập hàng"],
          ["bake", "Lò bánh"],
          ["equipment", "Thiết bị"],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "ingredients" ? (
        <>
          <div className="form-row">
            <label>Nhà cung cấp</label>
            <select
              aria-label="Nhà cung cấp"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <p className="small-text" style={{ marginBottom: 16 }}>
            {suppliers.find((s) => s.id === supplier)?.description} Hàng mua làm
            giảm tiền mặt và tăng kho; chỉ ghi giá vốn khi sử dụng.
          </p>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nguyên liệu</th>
                  <th>Tồn sẵn dùng</th>
                  <th>Lô / hạn</th>
                  <th>Nhập thêm</th>
                  <th>Giá mua</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((i) => {
                  const batches = g.inventory.filter(
                    (b) => b.ingredient === i.id && b.quantity > 0,
                  );
                  const qty =
                    quantities[i.id] ??
                    (i.unit === "quả" ? 5 : i.unit === "ml" ? 500 : 100);
                  return (
                    <tr key={i.id}>
                      <td>
                        <strong>{i.name}</strong>
                        <p className="small-text">
                          {money(i.price)}/{i.unit}
                        </p>
                      </td>
                      <td>
                        {Math.round(stock(g, i.id))} {i.unit}
                        {stock(g, i.id) < (i.unit === "ml" ? 100 : 5) && (
                          <Icon name="warning" size={15} />
                        )}
                      </td>
                      <td>
                        {batches.map((b) => (
                          <p className="small-text" key={b.id}>
                            Ngày {b.expiresDay} · {Math.round(b.quantity)}
                            {i.unit}
                            {b.quarantined ? " · cách ly" : ""}
                          </p>
                        ))}
                      </td>
                      <td>
                        <input
                          aria-label={`Nhập ${i.name}`}
                          style={{ width: 76 }}
                          type="number"
                          min="1"
                          max="10000"
                          value={qty}
                          onChange={(e) =>
                            setQuantities((q) => ({
                              ...q,
                              [i.id]: Number(e.target.value),
                            }))
                          }
                        />
                      </td>
                      <td>
                        <Button
                          kind="small"
                          onClick={() =>
                            dispatch({
                              type: "BUY_INGREDIENT",
                              ingredient: i.id,
                              quantity: qty,
                              supplierId: supplier,
                            })
                          }
                        >
                          {money(
                            Math.round(
                              qty *
                                i.price *
                                (suppliers.find((s) => s.id === supplier)
                                  ?.multiplier || 1) *
                                (i.id === "milk" &&
                                Number(g.flags.marketUntil ?? 0) >= g.day
                                  ? 1.1
                                  : 1),
                            ),
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Section title="Các chuyến giao hàng">
            <div className="grid-2">
              {g.deliveries.length ? (
                g.deliveries
                  .slice(-8)
                  .reverse()
                  .map((d) => (
                    <div className="panel" key={d.id}>
                      <h4>
                        {ingredients.find((i) => i.id === d.ingredient)?.name} ·{" "}
                        {d.quantity}
                      </h4>
                      <p>
                        {d.status === "travel"
                          ? `Đang đến · ${d.remaining}s`
                          : d.status === "returned"
                            ? "Đã trả nhà cung cấp"
                            : d.status === "quarantined"
                              ? "Cách ly chờ trả"
                              : "Đã nhập kho"}{" "}
                        · chất lượng {d.quality}%
                      </p>
                      <p className="small-text">
                        {d.id} ·{" "}
                        {suppliers.find((s) => s.id === d.supplierId)?.name}
                      </p>
                      {["arrived", "quarantined"].includes(d.status) && (
                        <Button
                          kind="small"
                          onClick={() =>
                            dispatch({
                              type: "RETURN_DELIVERY",
                              deliveryId: d.id,
                            })
                          }
                        >
                          Trả lô hàng còn nguyên
                        </Button>
                      )}
                    </div>
                  ))
              ) : (
                <Empty icon="stock">Chưa có chuyến hàng mới.</Empty>
              )}
            </div>
          </Section>
          <Button icon="evidence" onClick={() => onMinigame("inspect")}>
            Kiểm hàng nhập
          </Button>
        </>
      ) : tab === "bake" ? (
        <>
          <div className="grid-3">
            {cakes.map((c) => (
              <div className="panel" key={c.id}>
                <img className="product-art" src={art(c.id)} alt={c.name} />
                <h3>{c.name}</h3>
                <p>
                  {c.time}s trong lò · {money(c.price)}
                </p>
                <p>
                  Nguyên liệu{" "}
                  {Object.entries(c.ingredients)
                    .map(
                      ([id, q]) =>
                        `${ingredients.find((i) => i.id === id)?.name} ${q}`,
                    )
                    .join(", ")}
                </p>
                <p>
                  Đã làm:{" "}
                  {g.cakes
                    .filter((s) => s.cakeId === c.id)
                    .reduce((a, s) => a + s.quantity, 0)}{" "}
                  phần
                </p>
                <Button
                  disabled={g.level < c.level}
                  kind="primary"
                  onClick={() => dispatch({ type: "BAKE", cakeId: c.id })}
                >
                  {g.level < c.level
                    ? `Mở ở cấp ${c.level}`
                    : "Cho một mẻ vào lò"}
                </Button>
              </div>
            ))}
          </div>
          <Section title="Những mẻ đang nướng">
            <div className="grid-2">
              {g.baking
                .filter((b) => b.status !== "taken")
                .map((b) => (
                  <div className="panel" key={b.id}>
                    <h4>{cakes.find((c) => c.id === b.cakeId)?.name}</h4>
                    <p>
                      {b.elapsed}/{b.readyAt}s ·{" "}
                      {b.status === "burned"
                        ? "Quá lửa, sẽ ghi hao hụt"
                        : b.elapsed >= b.readyAt
                          ? "Bánh đang vừa chín!"
                          : "Đợi đến khoảng chín"}
                    </p>
                    <Meter
                      value={(b.elapsed / b.burnAt) * 100}
                      tone={b.elapsed > b.readyAt ? "gold" : "green"}
                    />
                    <div className="actions">
                      <Button
                        kind="primary"
                        onClick={() =>
                          dispatch({
                            type: "TAKE_BAKE",
                            bakingId: b.id,
                            decoration: 60,
                          })
                        }
                      >
                        Lấy bánh ra
                      </Button>
                      <Button onClick={() => onMinigame("decorate", b.id)}>
                        Trang trí rồi lấy bánh
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            {!g.baking.some((b) => b.status !== "taken") && (
              <Empty icon="food">
                Lò đang nghỉ. Bánh đã làm sẽ được dùng cho combo.
              </Empty>
            )}
          </Section>
          <div className="warning">
            Lấy bánh quá sớm hoặc để quá lửa làm giảm chất lượng. Thời gian lò
            vẫn chạy khi trang trí; bạn có thể tạm dừng bằng phím cách.
          </div>
        </>
      ) : (
        <>
          <div className="grid-2">
            {g.equipment.map((e) => (
              <div className="panel" key={e.id}>
                <div className="catalog-item">
                  <img
                    className="catalog-art"
                    src={art(e.id, "furniture")}
                    alt={e.name}
                  />
                  <div>
                    <h4>{e.name}</h4>
                    <p>
                      Cấp {e.level} · {e.broken ? "Đang hỏng" : "Hoạt động"}
                    </p>
                  </div>
                </div>
                <Meter
                  value={e.durability}
                  label="Độ bền"
                  tone={e.durability < 30 ? "gold" : "green"}
                />
                <div className="actions">
                  <Button
                    kind="small"
                    icon="repair"
                    disabled={e.level === 0 || e.durability >= 100}
                    onClick={() =>
                      dispatch({ type: "REPAIR", equipmentId: e.id })
                    }
                  >
                    Bảo trì / sửa
                  </Button>
                  <Button
                    kind="small"
                    disabled={e.level >= 4}
                    onClick={() =>
                      dispatch({ type: "UPGRADE", equipmentId: e.id })
                    }
                  >
                    {e.level === 0 ? "Mua" : "Nâng cấp"} ·{" "}
                    {money(Math.round(e.baseCost * (1 + e.level * 0.35)))}
                  </Button>
                  {e.level > 0 && (
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({ type: "SELL_EQUIPMENT", equipmentId: e.id })
                      }
                    >
                      Bán lại
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="warning">
            Camera chỉ quan sát cửa và quầy, cần bằng chứng đối chiếu. Tiền mua
            thiết bị được ghi vào dòng tiền đầu tư.
          </div>
        </>
      )}
    </>
  );
}
function Team() {
  const g = useGame();
  const [firing, setFiring] = useState<string>();
  const [reason, setReason] = useState("Điều chỉnh nhân sự và ca làm");
  const hired = g.staff.find((s) => s.id === firing);
  return (
    <>
      {g.level < 2 && (
        <div className="warning">
          Ngày đầu bạn có thể tự vận hành. Nhân viên nhận tác vụ ở cấp 2; tích
          kinh nghiệm bằng phục vụ và chăm mèo.
        </div>
      )}
      <div className="grid-2">
        {g.staff.map((s, i) => {
          const task = g.tasks.find(
            (t) => t.id === s.taskId && t.status === "working",
          );
          return (
            <div className="panel" key={s.id}>
              <div className="person-card">
                <img
                  src={art(`portrait-staff-${i}`, "characters")}
                  alt={s.name}
                />
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    {roleNames[s.role]} · {money(s.salary)}/ngày
                  </p>
                  <p>
                    Kỹ năng {s.skill} · giao tiếp {s.communication} · tốc độ ×
                    {s.speed.toFixed(2)}
                  </p>
                  <p>
                    Kinh nghiệm {s.experience} · đào tạo {s.trained}
                  </p>
                </div>
              </div>
              {s.hired && !s.former ? (
                <>
                  <Meter value={s.energy} label="Năng lượng" />
                  <Meter value={s.satisfaction} label="Hài lòng" tone="pink" />
                  <p>
                    {task
                      ? `${task.type} · ${Math.ceil(task.remaining)}s còn lại`
                      : s.onShift
                        ? "Đang trong ca, sẵn sàng nhận việc"
                        : "Đang nghỉ"}
                  </p>
                  <div className="actions">
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: s.onShift ? "rest" : "shift",
                        })
                      }
                    >
                      {s.onShift ? "Cho nghỉ" : "Xếp vào ca"}
                    </Button>
                    <Button
                      kind="small"
                      icon="training"
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: "train",
                        })
                      }
                    >
                      Đào tạo
                    </Button>
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: "bonus",
                        })
                      }
                    >
                      Thưởng
                    </Button>
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: "meal",
                        })
                      }
                    >
                      Bữa ăn ca
                    </Button>
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: "raise",
                        })
                      }
                    >
                      Tăng lương
                    </Button>
                    <Button
                      kind="small"
                      disabled={s.experience < 5}
                      onClick={() =>
                        dispatch({
                          type: "STAFF_ACTION",
                          staffId: s.id,
                          action: "promote",
                        })
                      }
                    >
                      Thăng cấp
                    </Button>
                  </div>
                  <div className="actions" style={{ marginTop: 8 }}>
                    {s.role === "barista" &&
                      g.orders
                        .filter((o) => o.status === "waiting")
                        .slice(0, 4)
                        .map((o) => (
                          <Button
                            key={o.id}
                            kind="small"
                            onClick={() =>
                              dispatch({
                                type: "ASSIGN",
                                staffId: s.id,
                                task: "drink",
                                targetId: o.id,
                              })
                            }
                          >
                            Pha cho{" "}
                            {customers.find((c) => c.id === o.customerId)?.name}
                          </Button>
                        ))}
                    {s.role === "baker" && (
                      <Button
                        kind="small"
                        onClick={() =>
                          dispatch({
                            type: "ASSIGN",
                            staffId: s.id,
                            task: "bake",
                            targetId: "cookie",
                          })
                        }
                      >
                        Nướng cookie
                      </Button>
                    )}
                    {s.role === "carer" &&
                      g.cats
                        .filter((c) => c.unlocked)
                        .map((c) => (
                          <Button
                            kind="small"
                            key={c.id}
                            onClick={() =>
                              dispatch({
                                type: "ASSIGN",
                                staffId: s.id,
                                task: "cat",
                                targetId: c.id,
                              })
                            }
                          >
                            Chăm {c.name}
                          </Button>
                        ))}
                    {(s.role === "cashier" || s.role === "manager") &&
                      g.orders
                        .filter((o) => o.status === "ready")
                        .slice(0, 3)
                        .map((o) => (
                          <Button
                            key={o.id}
                            kind="small"
                            onClick={() =>
                              dispatch({
                                type: "ASSIGN",
                                staffId: s.id,
                                task: "serve",
                                targetId: o.id,
                              })
                            }
                          >
                            Giao đơn {o.id}
                          </Button>
                        ))}
                    <Button
                      kind="small"
                      onClick={() =>
                        dispatch({
                          type: "ASSIGN",
                          staffId: s.id,
                          task: "clean",
                        })
                      }
                    >
                      Dọn tiệm
                    </Button>
                  </div>
                  <details style={{ marginTop: 12 }}>
                    <summary className="small-text">
                      Hồ sơ và điều chuyển
                    </summary>
                    <div className="actions" style={{ marginTop: 10 }}>
                      <select
                        aria-label={`Vai trò ${s.name}`}
                        value={s.role}
                        onChange={(e) =>
                          dispatch({
                            type: "STAFF_ACTION",
                            staffId: s.id,
                            action: "transfer",
                            role: e.target.value as Role,
                          })
                        }
                      >
                        {Object.entries(roleNames).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <Button
                        kind="small"
                        onClick={() =>
                          dispatch({
                            type: "STAFF_ACTION",
                            staffId: s.id,
                            action: "restrict",
                          })
                        }
                      >
                        Tạm dừng việc nhạy cảm
                      </Button>
                      <Button
                        kind="small"
                        onClick={() =>
                          dispatch({
                            type: "STAFF_ACTION",
                            staffId: s.id,
                            action: "warn",
                          })
                        }
                      >
                        Cảnh cáo có ghi nhận
                      </Button>
                      <Button
                        kind="danger small"
                        onClick={() => setFiring(s.id)}
                      >
                        Chấm dứt hợp đồng
                      </Button>
                    </div>
                    {s.history.map((h, j) => (
                      <p className="small-text" key={j}>
                        {h}
                      </p>
                    ))}
                  </details>
                </>
              ) : s.former ? (
                <>
                  <p>
                    Hồ sơ cũ được giữ. Nhân viên đã nghỉ không nhận việc hoặc
                    lương mới.
                  </p>
                  <p className="small-text">
                    Tuyển người khác trong danh sách để thay ca.
                  </p>
                </>
              ) : (
                <div className="actions">
                  <Button
                    kind="primary"
                    disabled={g.level < 2}
                    onClick={() => dispatch({ type: "HIRE", staffId: s.id })}
                  >
                    Tuyển {s.name}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hired && (
        <div className="incident" style={{ marginTop: 20 }}>
          <h3>Chấm dứt hợp đồng với {hired.name}</h3>
          <p>
            Lương còn phải thanh toán dự kiến{" "}
            {money(
              Math.round(
                hired.salary * Math.min(1, hired.secondsWorked / g.dayDuration),
              ),
            )}
            ; trợ cấp theo hợp đồng game{" "}
            {money(Math.round(hired.salary * 0.25))}.
          </p>
          <p>
            Ca {roleNames[hired.role]} sẽ thiếu người. Tác vụ{" "}
            {hired.taskId || "không có"} được bàn giao; nguyên liệu đã pha vẫn
            nằm trong món.
          </p>
          <p className="small-text">
            Đây là quy tắc hợp đồng mô phỏng. Hồ sơ:{" "}
            {hired.history.join(" · ") || "Chưa có vi phạm ghi nhận"}.
          </p>
          <label className="field">
            Lý do
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Điều chỉnh nhân sự và ca làm</option>
              <option>Không phù hợp sau đào tạo</option>
              <option>Vi phạm đã có bằng chứng</option>
              <option>Thỏa thuận nghỉ việc</option>
            </select>
          </label>
          <div className="actions">
            <Button
              kind="danger"
              onClick={() => {
                dispatch({
                  type: "FIRE",
                  staffId: hired.id,
                  reason,
                  confirm: true,
                });
                setFiring(undefined);
              }}
            >
              Xác nhận chấm dứt & thanh toán
            </Button>
            <Button onClick={() => setFiring(undefined)}>Giữ hợp đồng</Button>
          </div>
        </div>
      )}
    </>
  );
}
function Decor() {
  const g = useGame();
  const [tab, setTab] = useState("floor");
  const [selected, setSelected] = useState<string>();
  const [rotation, setRotation] = useState(0);
  const [hover, setHover] = useState(
    "Chọn đồ trong kho hoặc trên sàn, rồi chạm ô để đặt.",
  );
  const item =
    g.storage.find((s) => s.id === selected) ||
    g.furniture.find((s) => s.id === selected);
  const place = (x: number, y: number) => {
    if (!item) {
      const f = g.furniture.find((f) => occupiedCells(f).includes(`${x},${y}`));
      if (f) {
        setSelected(f.id);
        setRotation(f.rotation);
      }
      return;
    }
    const v = canPlace(g, item.kind, x, y, rotation, selected);
    setHover(v.reason);
    dispatch({ type: "PLACE_FURNITURE", furnitureId: item.id, x, y, rotation });
  };
  return (
    <>
      <Tabs
        items={[
          ["floor", "Sắp xếp theo ô"],
          ["shop", "Mua nội thất"],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "shop" ? (
        <div className="grid-3">
          {furniture.map((f) => (
            <div className="panel" key={f.id}>
              <img
                className="product-art"
                src={art(f.id, "furniture")}
                alt={f.name}
              />
              <h3>{f.name}</h3>
              <p>
                {f.width}×{f.height} ô · {f.seats} chỗ ngồi · êm dịu +
                {f.comfort}
              </p>
              <p>{f.cat ? "Dành cho khu mèo" : "Khu khách & đội ngũ"}</p>
              <div className="price">{money(f.cost)}</div>
              <Button
                kind="primary"
                disabled={g.level < f.level}
                onClick={() => {
                  dispatch({ type: "BUY_FURNITURE", kind: f.id });
                  const bought = getState().storage.at(-1);
                  if (bought?.kind === f.id) {
                    setSelected(bought.id);
                    setTab("floor");
                  }
                }}
              >
                {g.level < f.level
                  ? `Mở ở cấp ${f.level}`
                  : "Mua & chọn vị trí"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="decor-toolbar">
            <select
              aria-label="Chọn nội thất"
              value={selected || ""}
              onChange={(e) => setSelected(e.target.value || undefined)}
            >
              <option value="">Chọn đồ</option>
              {[...g.storage, ...g.furniture].map((f) => (
                <option key={f.id} value={f.id}>
                  {furniture.find((d) => d.id === f.kind)?.name}{" "}
                  {g.storage.some((s) => s.id === f.id)
                    ? "· trong kho"
                    : "· trên sàn"}
                </option>
              ))}
            </select>
            <Button
              icon="decor"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              Xoay {rotation}°
            </Button>
            {selected && g.furniture.some((f) => f.id === selected) && (
              <Button
                onClick={() =>
                  dispatch({ type: "STORE_FURNITURE", furnitureId: selected })
                }
              >
                Cất vào kho
              </Button>
            )}
            <Button onClick={() => setSelected(undefined)}>Bỏ chọn</Button>
          </div>
          <p className="small-text">
            Ba hàng trên là quầy; cửa ở hai ô giữa phía dưới; năm cột bên phải
            là khu mèo. Luôn giữ đường từ cửa tới quầy và khu mèo.
          </p>
          <div
            className="decor-grid"
            style={{ gridTemplateColumns: "repeat(16,1fr)" }}
          >
            {Array.from({ length: 192 }, (_, i) => {
              const x = i % 16,
                y = Math.floor(i / 16),
                f = g.furniture.find((f) =>
                  occupiedCells(f).includes(`${x},${y}`),
                );
              return (
                <button
                  key={i}
                  aria-label={`Ô ${x},${y}${f ? " " + f.kind : ""}`}
                  className={`decor-cell ${y <= 2 || ((x === 7 || x === 8) && y >= 10) ? "path" : ""} ${f ? "occupied" : ""}`}
                  style={{
                    outline:
                      f?.id === selected ? "2px solid #597748" : undefined,
                    background: x >= 11 ? "#e5ead6" : undefined,
                  }}
                  onClick={() => place(x, y)}
                  onPointerEnter={() => {
                    if (item)
                      setHover(
                        canPlace(g, item.kind, x, y, rotation, selected).reason,
                      );
                  }}
                >
                  {f && f.x === x && f.y === y && (
                    <img src={art(f.kind, "furniture")} alt="" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="success-note">{hover}</div>
          <p className="small-text">
            Mèo sử dụng đệm, hộp và kệ đã đặt. Bàn tăng sức chứa; va chạm và
            đường đi được kiểm tra trước khi lưu.
          </p>
        </>
      )}
    </>
  );
}
function Reports() {
  const g = useGame();
  const [day, setDay] = useState(g.day);
  const [tab, setTab] = useState("report");
  const r =
    day === g.day
      ? reportDay(g)
      : g.reports.find((r) => r.day === day) || reportDay(g, day);
  const previous = g.reports.find((p) => p.day === day - 1);
  return (
    <>
      <div className="form-row">
        <label>Ngày báo cáo</label>
        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
          {Array.from({ length: g.day }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Ngày {i + 1}
              {i + 1 === g.day ? " · đang ghi nhận" : ""}
            </option>
          ))}
        </select>
      </div>
      <Tabs
        items={[
          ["report", "Kết quả kinh doanh"],
          ["ledger", "Sổ giao dịch"],
          ["sales", "Đơn đã giao"],
          ["cash", "Tiền mặt & phục hồi"],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "report" ? (
        <>
          <div className="ledger-summary">
            {[
              ["Doanh thu thuần", r.netRevenue],
              ["Lợi nhuận", r.profit],
              ["Tiền cuối ngày", r.endCash],
              ["Khoản phải trả", r.liabilities],
            ].map(([name, v]) => (
              <div className="panel" key={name}>
                <p>{name}</p>
                <strong
                  className={
                    Number(v) < 0 ? "amount-negative" : "amount-positive"
                  }
                >
                  {money(Number(v))}
                </strong>
              </div>
            ))}
          </div>
          <div className="grid-2">
            <div className="panel">
              <h3>Đối soát lợi nhuận</h3>
              <table className="data-table">
                <tbody>
                  {[
                    ["Doanh thu gộp", r.revenue],
                    ["Giảm giá / hoàn tiền", -(r.discounts + r.refunds)],
                    ["Doanh thu thuần", r.netRevenue],
                    ["Giá vốn đã tiêu thụ", -r.cogs],
                    ["Chi phí vận hành", -r.operating],
                    ["Thuế giả lập", -r.tax],
                    ["Lợi nhuận", r.profit],
                  ].map(([l, v]) => (
                    <tr key={l}>
                      <td>{l}</td>
                      <td className="align-right">{money(Number(v))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="small-text">
                Thuế mặc định 5% doanh thu thuần theo luật game. Không phải
                hướng dẫn thuế thực tế.{" "}
                {g.phase !== "after" && day === g.day
                  ? "Chi phí cuối ngày sẽ ghi nhận sau khi đóng cửa."
                  : ""}
              </p>
            </div>
            <div className="panel">
              <h3>Tiền và trải nghiệm</h3>
              <table className="data-table">
                <tbody>
                  {[
                    ["Tiền đầu ngày", money(r.startCash)],
                    ["Dòng tiền", money(r.cashFlow)],
                    ["Đầu tư", money(r.investment)],
                    ["Vay / trả gốc", money(r.financing)],
                    ["Đã phục vụ / bỏ đi", `${r.served} / ${r.lost}`],
                    ["Giá trị đơn trung bình", money(r.averageOrder)],
                    [
                      "Điểm đồ uống / dịch vụ",
                      `${r.drinkScore} / ${r.serviceScore}`,
                    ],
                    ["Món bán chạy", r.bestSeller],
                    ["Món lời nhất", r.mostProfitable],
                  ].map(([l, v]) => (
                    <tr key={l}>
                      <td>{l}</td>
                      <td className="align-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previous && (
                <p>
                  So với ngày trước: doanh thu{" "}
                  {money(r.netRevenue - previous.netRevenue)}, lợi nhuận{" "}
                  {money(r.profit - previous.profit)}.
                </p>
              )}
            </div>
          </div>
          <Section title="Chi phí thực tế">
            <div className="grid-3">
              {Object.entries(r.categories).map(([id, v]) => (
                <div className="panel" key={id}>
                  <h4>{labels[id] || id}</h4>
                  <p>{money(v)}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Nguyên liệu hao hụt">
            {r.waste.length ? (
              r.waste.map((w, i) => (
                <p key={i}>
                  {ingredients.find((x) => x.id === w.ingredient)?.name ||
                    w.ingredient}
                  : {w.quantity} · {money(w.cost)}
                </p>
              ))
            ) : (
              <p className="small-text">Chưa ghi nhận nguyên liệu bỏ phí.</p>
            )}
          </Section>
          <Section title="Gợi ý từ ngày đã chơi">
            {r.suggestions.map((s) => (
              <div className="success-note" key={s}>
                {s}
              </div>
            ))}
          </Section>
        </>
      ) : tab === "ledger" ? (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã duy nhất / sự kiện</th>
                <th>Tiền mặt</th>
                <th>Doanh thu</th>
                <th>Giá vốn</th>
                <th>Chi phí</th>
              </tr>
            </thead>
            <tbody>
              {g.transactions
                .filter((t) => t.day === day)
                .slice()
                .reverse()
                .map((t) => (
                  <tr key={t.id}>
                    <td>
                      {t.label}
                      <p className="small-text">
                        {t.id} · {labels[t.category] || t.category}
                      </p>
                    </td>
                    <td>{money(t.cash)}</td>
                    <td>{money(t.revenue)}</td>
                    <td>{money(t.cogs)}</td>
                    <td>{money(t.expense)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : tab === "sales" ? (
        <Sales day={day} />
      ) : (
        <Recovery />
      )}
    </>
  );
}
function Sales({ day }: { day: number }) {
  const g = useGame();
  const orders = g.orders.filter(
    (o) =>
      o.paid &&
      g.transactions.some(
        (t) => t.orderId === o.id && t.day === day && t.revenue > 0,
      ),
  );
  return (
    <>
      <p className="small-text" style={{ marginBottom: 16 }}>
        Hoàn tiền ghi âm doanh thu và tiền mặt, giữ giá vốn đã tiêu thụ. Chỉ xử
        lý khi sổ ngày hiện tại còn mở.
      </p>
      <div className="grid-2">
        {orders.map((o) => (
          <div className="panel" key={o.id}>
            <h3>
              {customers.find((c) => c.id === o.customerId)?.name} ·{" "}
              {g.recipes.find((r) => r.id === o.recipeId)?.name}
            </h3>
            <p>
              {o.id} · đã thu {money(o.price)} · đã hoàn {money(o.refunded)}
            </p>
            <p>
              Điểm đồ uống {o.score?.total}/100 · dịch vụ {o.service}/100
            </p>
            <div className="actions">
              <Button
                kind="small"
                disabled={
                  day !== g.day ||
                  !["open", "closing"].includes(g.phase) ||
                  o.refunded >= o.price
                }
                onClick={() =>
                  dispatch({
                    type: "REFUND",
                    orderId: o.id,
                    amount: Math.min(
                      Math.round(o.price * 0.25),
                      o.price - o.refunded,
                    ),
                  })
                }
              >
                Hoàn 25% ·{" "}
                {money(
                  Math.min(Math.round(o.price * 0.25), o.price - o.refunded),
                )}
              </Button>
              <Button
                kind="danger small"
                disabled={
                  day !== g.day ||
                  !["open", "closing"].includes(g.phase) ||
                  o.refunded >= o.price
                }
                onClick={() =>
                  dispatch({
                    type: "REFUND",
                    orderId: o.id,
                    amount: o.price - o.refunded,
                  })
                }
              >
                Hoàn phần còn lại
              </Button>
            </div>
          </div>
        ))}
      </div>
      {!orders.length && (
        <Empty icon="orders">Chưa có món đã giao trong ngày này.</Empty>
      )}
    </>
  );
}
function Recovery() {
  const g = useGame();
  const [amount, setAmount] = useState(100000);
  return (
    <>
      <div className="ledger-summary">
        <div className="panel">
          <p>Tiền khả dụng</p>
          <strong>{money(g.cash)}</strong>
        </div>
        <div className="panel">
          <p>Quỹ dự phòng</p>
          <strong>{money(g.reserve)}</strong>
        </div>
        <div className="panel">
          <p>Dư nợ gốc</p>
          <strong>{money(g.loans.reduce((a, l) => a + l.remaining, 0))}</strong>
        </div>
        <div className="panel">
          <p>Bảo hiểm game</p>
          <strong>{g.insured ? "Đang hiệu lực" : "Chưa mua"}</strong>
        </div>
      </div>
      <div className="grid-2">
        <div className="panel">
          <h3>Quỹ dự phòng</h3>
          <label className="field">
            Số tiền VND
            <input
              type="number"
              min="10000"
              max="1000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </label>
          <div className="actions">
            <Button onClick={() => dispatch({ type: "RESERVE", amount })}>
              Đưa vào quỹ
            </Button>
            <Button
              onClick={() => dispatch({ type: "RESERVE", amount: -amount })}
            >
              Rút quỹ
            </Button>
          </div>
          <p>Chuyển quỹ chỉ chuyển tiền, không tạo doanh thu hay chi phí.</p>
        </div>
        <div className="panel">
          <h3>Vay để phục hồi</h3>
          <p>
            Vay {money(amount)}. Lãi và lịch trả là luật giả lập; gốc vay không
            được tính doanh thu. Đọc lịch khoản vay sau khi nhận.
          </p>
          <div className="actions">
            <Button
              icon="debt"
              onClick={() => dispatch({ type: "LOAN", amount })}
            >
              Nhận khoản vay
            </Button>
            <Button onClick={() => dispatch({ type: "INSURE" })}>
              {g.insured ? "Bảo hiểm đã mua" : "Mua bảo hiểm · 12.000đ"}
            </Button>
          </div>
        </div>
      </div>
      <Section title="Lịch trả nợ">
        <div className="grid-2">
          {g.loans.map((l) => (
            <div className="panel" key={l.id}>
              <h4>
                {l.id} · dư gốc {money(l.remaining)}
              </h4>
              <p>
                Đến ngày {l.nextDay} · trả gốc mỗi kỳ {money(l.installment)} ·
                lãi {l.rate * 100}%
              </p>
              <Button
                kind="small"
                disabled={l.remaining <= 0}
                onClick={() =>
                  dispatch({
                    type: "REPAY",
                    loanId: l.id,
                    amount: Math.min(amount, l.remaining),
                  })
                }
              >
                Trả gốc {money(Math.min(amount, l.remaining))}
              </Button>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Hóa đơn còn phải trả">
        <div className="grid-2">
          {g.payables
            .filter((p) => !p.paid)
            .map((p) => (
              <div className="panel" key={p.id}>
                <h4>{p.label}</h4>
                <p>
                  {money(p.amount)} · hạn ngày {p.dueDay}
                </p>
                <div className="actions">
                  <Button
                    onClick={() =>
                      dispatch({ type: "PAY_BILL", payableId: p.id })
                    }
                  >
                    Thanh toán
                  </Button>
                  <Button
                    disabled={p.extended}
                    onClick={() =>
                      dispatch({ type: "EXTEND_BILL", payableId: p.id })
                    }
                  >
                    Xin gia hạn
                  </Button>
                </div>
              </div>
            ))}
        </div>
        {!g.payables.some((p) => !p.paid) && (
          <Empty icon="money">Chưa có hóa đơn chưa thanh toán.</Empty>
        )}
      </Section>
      <div className="success-note">
        Nếu thiếu tiền, rút quỹ, giảm menu, giảm ca hoặc bán lại thiết bị trong
        kho. Chế độ thư giãn có hỗ trợ cộng đồng khi cần.
      </div>
    </>
  );
}
function Life({
  onMinigame,
  onCat,
}: {
  onMinigame: (kind: string) => void;
  onCat: (id: string) => void;
}) {
  const g = useGame();
  const [tab, setTab] = useState("events");
  return (
    <>
      <Tabs
        items={[
          ["events", "Việc cần xử lý"],
          ["missions", "Nhiệm vụ"],
          ["album", "Album & bộ sưu tập"],
          ["regulars", "Khách quen"],
          ["journal", "Nhật ký"],
          ["activities", "Hoạt động quán"],
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "events" ? (
        <>
          {g.incidents
            .filter((i) => i.stage !== "resolved")
            .map((i) => (
              <div className="incident" key={i.id}>
                <h4>{i.title}</h4>
                <p>{i.description}</p>
                <div className="evidence">Dấu hiệu quan sát: {i.sign}</div>
                <IncidentNarration incident={i} />
                <p className="small-text">
                  Ngày {i.day} · {i.participants.join(", ")} ·{" "}
                  {i.severity === "positive"
                    ? "Sự kiện tích cực"
                    : "Chưa kết luận nguyên nhân"}
                </p>
                <Section title="Kiểm chứng dữ kiện">
                  {i.evidence.map((e) => (
                    <div className="form-row" key={e.id}>
                      <div style={{ flex: 1 }}>
                        <h4>{e.label}</h4>
                        <p>
                          {e.checked
                            ? e.fact
                            : "Chưa kiểm tra. Không kết luận từ nghi ngờ."}
                        </p>
                        {e.checked && (
                          <p className="small-text">
                            Độ chắc chắn {e.confidence}% · vẫn cần xem khả năng
                            nguyên nhân khác
                          </p>
                        )}
                      </div>
                      <Button
                        disabled={e.checked}
                        kind="small"
                        icon="evidence"
                        onClick={() =>
                          dispatch({
                            type: "INVESTIGATE",
                            incidentId: i.id,
                            evidenceId: e.id,
                          })
                        }
                      >
                        {e.checked ? "Đã đối chiếu" : "Kiểm tra"}
                      </Button>
                    </div>
                  ))}
                </Section>
                {i.resolving ? (
                  <div className="success-note">
                    Đang xử lý · {i.resolving.remaining}s còn lại. Hậu quả được
                    ghi nhận khi tác vụ hoàn tất.
                  </div>
                ) : (
                  <div className="grid-2">
                    {i.choices.map((c) => (
                      <div className="panel" key={c.id}>
                        <h4>{c.label}</h4>
                        <p>{c.description}</p>
                        <p>
                          {money(c.cost)} · {c.duration}s
                          {c.requiresEvidence
                            ? ` · cần ${c.requiresEvidence} bằng chứng`
                            : ""}
                        </p>
                        <Button
                          kind="small"
                          disabled={
                            i.evidence.filter((e) => e.checked).length <
                            (c.requiresEvidence || 0)
                          }
                          onClick={() =>
                            dispatch({
                              type: "RESOLVE",
                              incidentId: i.id,
                              choiceId: c.id,
                            })
                          }
                        >
                          Chọn cách xử lý
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          {!g.incidents.some((i) => i.stage !== "resolved") && (
            <Empty icon="leaf">
              Tiệm đang yên ổn. Những chuyện mới chỉ xuất hiện khi có điều kiện
              trong mô phỏng.
            </Empty>
          )}
          <Section title="Những việc đã giải quyết">
            {g.incidents
              .filter((i) => i.stage === "resolved")
              .slice(-10)
              .reverse()
              .map((i) => (
                <div className="journal-entry" key={i.id}>
                  <h4>{i.title}</h4>
                  <p>{i.outcome}</p>
                  <IncidentNarration incident={i} />
                </div>
              ))}
          </Section>
        </>
      ) : tab === "missions" ? (
        <>
          <div className="grid-2">
            {g.missions.map((m) => (
              <div className="panel" key={m.id}>
                <h3>{m.title}</h3>
                <Meter value={(m.progress / m.target) * 100} />
                <p>
                  {Math.min(m.progress, m.target)}/{m.target} · thưởng{" "}
                  {money(m.reward)}
                </p>
                <Button
                  disabled={m.claimed || m.progress < m.target}
                  kind="primary"
                  icon="trophy"
                  onClick={() =>
                    dispatch({ type: "CLAIM_MISSION", missionId: m.id })
                  }
                >
                  {m.claimed ? "Đã nhận" : "Nhận phần thưởng"}
                </Button>
              </div>
            ))}
          </div>
          <div className="success-note">
            Cấp tiệm {g.level} · {g.xp} kinh nghiệm · danh tiếng{" "}
            {Math.round(g.reputation)}. Đây là thành tích cá nhân lưu trên thiết
            bị.
          </div>
        </>
      ) : tab === "album" ? (
        <>
          <Section title="Album của những người bạn nhỏ">
            <div className="album-grid">
              {g.album.map((p) => (
                <div className="album-photo" key={p.id}>
                  <CatPhoto
                    index={cIndex(p.catId)}
                    pose={p.pose}
                    caption={p.caption}
                  />
                  <h4>{g.cats.find((c) => c.id === p.catId)?.name}</h4>
                  <p>
                    Ngày {p.day} · {p.caption} · {p.pose}
                  </p>
                </div>
              ))}
            </div>
            {!g.album.length && (
              <Empty icon="camera">Đến góc mèo và chụp bức ảnh đầu tiên.</Empty>
            )}
          </Section>
          <Section title="Nhật ký mèo">
            {g.journal
              .filter((j) => j.kind === "cat")
              .slice(-15)
              .reverse()
              .map((j) => (
                <p className="journal-entry" key={j.id}>
                  <small>Ngày {j.day}</small>
                  {j.text}
                </p>
              ))}
          </Section>
          <Section title="Bộ sưu tập ly, đĩa & túi">
            <div className="grid-3">
              {g.collection.map((id) => (
                <div className="panel" key={id}>
                  <Icon name="trophy" size={30} />
                  <h4>
                    {id === "ly-la-tra"
                      ? "Ly lá trà"
                      : id.startsWith("ly-meo-")
                        ? "Ly kỷ niệm " +
                          (g.cats.find((c) => id.endsWith(c.id))?.name || "mèo")
                        : id.startsWith("huy-hieu-")
                          ? "Huy hiệu chăm tiệm"
                          : id.replaceAll("-", " ")}
                  </h4>
                </div>
              ))}
            </div>
            {!g.collection.length && (
              <p className="small-text">
                Hoàn thành nhiệm vụ và sự kiện để mở các vật kỷ niệm.
              </p>
            )}
          </Section>
        </>
      ) : tab === "regulars" ? (
        <div className="grid-3">
          {customers.map((c, i) => {
            const h = g.customers[c.id];
            return (
              <div className="panel" key={c.id}>
                <div className="catalog-item">
                  <img
                    className="portrait"
                    src={art(`portrait-customer-${i}`, "characters")}
                    alt={c.name}
                  />
                  <div>
                    <h3>{c.name}</h3>
                    <p>
                      {c.personality} · thích {c.tea}
                    </p>
                  </div>
                </div>
                <p>
                  Ngọt {c.sweet}g · béo {c.creamy}ml · {c.temperature}°C
                </p>
                <p>
                  Ngân sách {money(c.budget)} · thích mèo{" "}
                  {g.cats.find((cat) => cat.id === c.favoriteCat)?.name}
                </p>
                <p>
                  {h?.visits || 0} lần ghé · {Math.round(h?.affinity || 0)}{" "}
                  thiện cảm · {h?.loyalty || 0} điểm thẻ
                </p>
                <div className="success-note">
                  {c.story[Math.min(c.story.length - 1, h?.story || 0)]}
                  {g.incidents
                    .filter(
                      (i) =>
                        i.stage === "resolved" && i.participants.includes(c.id),
                    )
                    .slice(-1)
                    .map((i) => (
                      <p key={i.id}>
                        Lần gặp ngày {i.day}: {i.outcome}
                      </p>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : tab === "journal" ? (
        <>
          {g.journal
            .slice(-100)
            .reverse()
            .map((j) => (
              <div className="journal-entry" key={j.id}>
                <small>
                  Ngày {j.day} · {j.at}s
                </small>
                {j.text}
              </div>
            ))}
          {!g.journal.length && (
            <Empty>
              Nhật ký sẽ ghi lại giao dịch, khách và những quyết định của bạn.
            </Empty>
          )}
        </>
      ) : (
        <>
          <div className="grid-3">
            <div className="panel">
              <h3>Workshop đánh trà</h3>
              <p>
                Cần cấp 2 và ít nhất hai khách hiện diện khi tiệm mở. Tiêu thụ
                trà, tăng gắn bó cộng đồng và ghi nhận doanh thu thật.
              </p>
              <Button
                disabled={
                  g.level < 2 ||
                  g.phase !== "open" ||
                  g.orders.filter((o) =>
                    ["waiting", "making", "ready"].includes(o.status),
                  ).length < 2 ||
                  !!g.flags["workshop-" + g.day]
                }
                onClick={() => dispatch({ type: "WORKSHOP" })}
              >
                Tổ chức workshop
              </Button>
            </div>
            <div className="panel">
              <h3>Ngày hội nhận nuôi</h3>
              <p>
                Hỗ trợ cộng đồng và tiến trình nhận nuôi. Có điều kiện và giới
                hạn mỗi ngày.
              </p>
              <Button
                disabled={g.level < 3 || !!g.flags["community-" + g.day]}
                onClick={() => dispatch({ type: "COMMUNITY" })}
              >
                Chuẩn bị ngày hội
              </Button>
            </div>
            <div className="panel">
              <h3>Giới thiệu tiệm</h3>
              <p>
                Chi 18.000đ cho một buổi giới thiệu, tăng lượng khách hôm nay
                trong giới hạn.
              </p>
              <Button onClick={() => dispatch({ type: "MARKETING" })}>
                Quảng bá tiệm
              </Button>
            </div>
          </div>
          <Section title="Quản lý bằng thao tác">
            <div className="game-list">
              {[
                ["cash", "Đối soát quầy tiền"],
                ["count", "Kiểm kho"],
                ["inspect", "Kiểm hàng nhập"],
                ["schedule", "Xếp lịch ca"],
                ["clean", "Dọn tiệm"],
                ["rush", "Phân luồng giờ cao điểm"],
                ["lost", "Tìm đồ thất lạc"],
                ["taste", "Thử vị bí mật"],
              ].map(([k, l]) => (
                <Button key={k} onClick={() => onMinigame(k)}>
                  {l}
                </Button>
              ))}
            </div>
            <p className="small-text" style={{ marginTop: 12 }}>
              Đối soát, kiểm kho và điều phối sử dụng dữ kiện của tiệm. Các tác
              vụ lặp có thể giao nhân viên.
            </p>
          </Section>
          <Section title="Góc thư giãn">
            <p>
              Mưa bên cửa sổ, mèo nằm ngủ. Tiệm không phạt bạn khi đóng trò
              chơi.
            </p>
            <div className="actions">
              {g.cats
                .filter((c) => c.unlocked)
                .map((c) => (
                  <Button key={c.id} icon="cat" onClick={() => onCat(c.id)}>
                    Ngồi cùng {c.name}
                  </Button>
                ))}
            </div>
          </Section>
        </>
      )}
    </>
  );
}
function Settings({ onToast }: { onToast: (m: string) => void }) {
  const g = useGame();
  const [confirm, setConfirm] = useState<"new" | "import">();
  const [incoming, setIncoming] = useState<GameState>();
  const [mode, setMode] = useState<"relax" | "business">(g.mode);
  const download = () => {
    const blob = new Blob([exportGame(g)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `miu-matcha-ngay-${g.day}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast("Đã xuất bản lưu JSON. Hãy giữ bản dự phòng này.");
  };
  return (
    <>
      <Section title="Âm thanh & chuyển động">
        <div className="form-row">
          <label>Âm lượng nhạc · {Math.round(g.settings.music * 100)}%</label>
          <input
            aria-label="Âm lượng nhạc"
            type="range"
            min="0"
            max="1"
            step=".05"
            value={g.settings.music}
            onChange={(e) =>
              dispatch({
                type: "SETTINGS",
                patch: { music: Number(e.target.value) },
              })
            }
          />
        </div>
        <div className="form-row">
          <label>Hiệu ứng · {Math.round(g.settings.effects * 100)}%</label>
          <input
            aria-label="Âm lượng hiệu ứng"
            type="range"
            min="0"
            max="1"
            step=".05"
            value={g.settings.effects}
            onChange={(e) =>
              dispatch({
                type: "SETTINGS",
                patch: { effects: Number(e.target.value) },
              })
            }
          />
        </div>
        <label className="field">
          <span>
            <input
              type="checkbox"
              checked={g.settings.reducedMotion}
              onChange={(e) =>
                dispatch({
                  type: "SETTINGS",
                  patch: { reducedMotion: e.target.checked },
                })
              }
            />
            Giảm chuyển động
          </span>
        </label>
        <p className="small-text">
          Âm thanh chỉ bắt đầu sau lần chạm đầu tiên; tạm dừng cùng game.
        </p>
      </Section>
      <Section title="Một ngày theo nhịp của bạn">
        <div className="form-row">
          <label>Độ dài ngày tiếp theo</label>
          <select
            value={g.settings.dayDuration}
            onChange={(e) =>
              dispatch({
                type: "SETTINGS",
                patch: { dayDuration: Number(e.target.value) },
              })
            }
          >
            {[600, 660, 720, 900].map((n) => (
              <option key={n} value={n}>
                {n / 60} phút
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Tần suất biến cố</label>
          <select
            value={g.settings.eventFrequency}
            onChange={(e) =>
              dispatch({
                type: "SETTINGS",
                patch: { eventFrequency: e.target.value as "low" },
              })
            }
          >
            <option value="low">Ít</option>
            <option value="medium">Vừa</option>
            <option value="high">Nhiều</option>
          </select>
        </div>
        <label className="field">
          <span>
            <input
              type="checkbox"
              checked={g.settings.theft}
              onChange={(e) =>
                dispatch({
                  type: "SETTINGS",
                  patch: { theft: e.target.checked },
                })
              }
            />
            Có tình huống thất thoát / trộm cắp
          </span>
        </label>
        <label className="field">
          <span>
            <input
              type="checkbox"
              checked={g.settings.fraud}
              onChange={(e) =>
                dispatch({
                  type: "SETTINGS",
                  patch: { fraud: e.target.checked },
                })
              }
            />
            Có tình huống gian lận nhân viên
          </span>
        </label>
        <p className="small-text">
          Ngày đầu chỉ có sự việc nhẹ. Mọi sự cố đều có nhật ký và hướng xử lý.
        </p>
      </Section>
      <Section title="Diện mạo chủ tiệm">
        <div className="avatar-options">
          {[0, 1, 2].map((h) => (
            <button
              key={h}
              className={g.avatar.hair === h ? "selected" : ""}
              aria-label={`Kiểu tóc ${h + 1}`}
              onClick={() => dispatch({ type: "AVATAR", patch: { hair: h } })}
            >
              <img
                src={art(
                  `portrait-player-${h}-${g.avatar.skin}-${g.avatar.outfit}`,
                  "characters",
                )}
                alt={`Tóc ${h + 1}`}
              />
            </button>
          ))}
        </div>
        <div className="form-row" style={{ marginTop: 12 }}>
          <label>Màu da</label>
          <select
            value={g.avatar.skin}
            onChange={(e) =>
              dispatch({
                type: "AVATAR",
                patch: { skin: Number(e.target.value) },
              })
            }
          >
            <option value="0">Sáng</option>
            <option value="1">Ấm</option>
            <option value="2">Nâu</option>
          </select>
        </div>
        <div className="form-row">
          <label>Trang phục</label>
          <select
            value={g.avatar.outfit}
            onChange={(e) =>
              dispatch({
                type: "AVATAR",
                patch: { outfit: Number(e.target.value) },
              })
            }
          >
            <option value="0">Xanh matcha</option>
            <option value="1">Kem sữa</option>
            <option value="2">Hồng đào</option>
          </select>
        </div>
      </Section>
      <Section title="Bản lưu trên thiết bị">
        <p className="small-text">
          IndexedDB có kiểm tra phiên bản, bản dự phòng và kiểm tra dữ liệu
          trước khi nhập. Cài đặt âm thanh được lưu riêng.
        </p>
        <div className="actions" style={{ marginTop: 12 }}>
          <Button icon="save" onClick={download}>
            Xuất JSON
          </Button>
          <label className="btn">
            <Icon name="save" />
            Nhập bản lưu
            <input
              className="file-input"
              type="file"
              accept=".json,application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 3_000_000) throw new Error("Tệp quá lớn.");
                  const state = importGame(await file.text());
                  setIncoming(state);
                  setConfirm("import");
                } catch (error) {
                  onToast(
                    `Không nhập: ${error instanceof Error ? error.message : "Dữ liệu không hợp lệ."}`,
                  );
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div className="warning">
          Game không đồng bộ đám mây. Xóa dữ liệu trình duyệt có thể xóa tiệm;
          xuất JSON để mang sang thiết bị khác.
        </div>
      </Section>
      <Section title="Nhận xét AI tùy chọn">
        <p>
          Game đang chấm điểm bằng thuật toán trên thiết bị. Backend
          /api/feedback có thể thêm lời nhận xét khi cấu hình khóa riêng ở máy
          chủ.
        </p>
        <p className="small-text">
          Không nhập API key ở giao diện. Xem README và .env.example trong dự
          án. Mất mạng không chặn phục vụ hoặc xử lý sự cố.
        </p>
      </Section>
      <div className="danger-zone">
        <h3>Mở một tiệm mới</h3>
        <div className="form-row" style={{ marginTop: 12 }}>
          <label>Chế độ tiệm mới</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "relax")}
          >
            <option value="relax">Thư giãn</option>
            <option value="business">Kinh doanh</option>
          </select>
        </div>
        <Button kind="danger" onClick={() => setConfirm("new")}>
          Chơi mới
        </Button>
      </div>
      {confirm && (
        <div className="incident" style={{ marginTop: 18 }}>
          <h3>
            {confirm === "new"
              ? "Xác nhận thay tiệm hiện tại?"
              : `Nhập tiệm ngày ${incoming?.day}?`}
          </h3>
          <p>
            Hành động này thay bản lưu đang chơi. Xuất JSON trước nếu muốn giữ
            tiệm cũ.
          </p>
          <div className="actions">
            <Button
              kind="danger"
              onClick={async () => {
                if (confirm === "new") await newGame(mode);
                else if (incoming) replaceGame(incoming);
                setConfirm(undefined);
                onToast("Đã thay bản lưu. Trở về cảnh quán để tiếp tục.");
              }}
            >
              Xác nhận thay bản lưu
            </Button>
            <Button onClick={() => setConfirm(undefined)}>
              Giữ tiệm hiện tại
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
function Help() {
  return (
    <>
      <div className="onboarding">
        <img src={art("portrait-cat-2", "cats")} alt="Mochi" />
        <div>
          <h2>Pha trà, chăm mèo, chăm tiệm.</h2>
          <p>
            Mỗi ngày gồm chuẩn bị, mở quán, đơn cuối và sau giờ làm. Game theo
            nhịp giây cố định, bạn có thể tạm dừng bất kỳ lúc nào.
          </p>
        </div>
      </div>
      <Section title="Ngày đầu tiên">
        <ol
          style={{
            paddingLeft: 19,
            fontSize: 13,
            color: "#798b68",
            lineHeight: 2,
          }}
        >
          <li>
            Mở kho nếu muốn nướng bánh; nguyên liệu ban đầu đủ cho vài món.
          </li>
          <li>Chọn “Mở cửa tiệm”. Khách đến và mang một phiếu khẩu vị.</li>
          <li>
            Chọn món cần pha, kiểm tra trà, sữa, nhiệt và topping. Thêm nguyên
            liệu một lần.
          </li>
          <li>
            Rê chữ W, rót hoặc lắc để tăng điểm. Hoàn tất rồi “Giao đúng đơn &
            thu tiền”.
          </li>
          <li>Chạm mèo để chăm, nhưng để bé nghỉ khi bé tránh tay.</li>
          <li>
            Đóng cửa, xử lý các đơn cuối. Sau đó đọc báo cáo và chuyển ngày.
          </li>
        </ol>
      </Section>
      <Section title="Điểm và tài chính">
        <p>
          Đồ uống có 100 điểm: đúng yêu cầu 30, khẩu vị 30, kỹ thuật 20, nhiệt
          độ 10, trình bày 10. Dịch vụ và không gian được tính riêng. Mua kho là
          chuyển tiền thành hàng; sử dụng mới ghi giá vốn. Thiết bị là đầu tư.
          Thuế và hợp đồng là luật mô phỏng.
        </p>
      </Section>
      <Section title="Điều khiển">
        <p>
          Chuột và cảm ứng đều hỗ trợ. Phím cách tạm dừng, Escape đóng bảng.
          Chuyển tab tự tạm dừng; trở lại chọn tiếp tục. Cảnh quán có quầy,
          khách, kho, lò và mèo tương tác được.
        </p>
      </Section>
      <Section title="Mở thêm hệ thống">
        <p>
          Cấp 2 mở nhân viên, món xoài, bánh và nội thất mới; cấp cao hơn mở các
          bé mèo, kệ leo và trà mới. Sự cố cần kiểm tra chứng cứ; đừng kết luận
          từ nghi ngờ. Đội ngũ có thể học hỏi và cùng bạn phục hồi.
        </p>
      </Section>
    </>
  );
}
