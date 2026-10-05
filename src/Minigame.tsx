import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { audio } from './audio';
import './minigames.css';

export type Point = { x: number; y: number; t?: number; rate?: number };
export interface InspectionDelivery { id: string; ingredient: string; quantity: number; status: string; quality?: number; expectedQuality?: number; expectedQuantity?: number; receivedQuantity?: number; discrepancy?: number }
export function deliveryNeedsReview(delivery: InspectionDelivery) {
  const expectedQuantity=delivery.expectedQuantity??delivery.quantity;
  const receivedQuantity=delivery.receivedQuantity??(delivery.discrepancy!==undefined?expectedQuantity-delivery.discrepancy:delivery.quantity);
  const quantityMismatch=!Number.isFinite(expectedQuantity)||!Number.isFinite(receivedQuantity)||Math.abs(expectedQuantity-receivedQuantity)>1e-6;
  const qualityMismatch=delivery.quality!==undefined&&(!Number.isFinite(delivery.quality)||delivery.quality<(delivery.expectedQuality??65));
  const legacyQuarantine=delivery.expectedQuality===undefined&&delivery.status==='quarantined';
  return quantityMismatch||qualityMismatch||legacyQuarantine;
}
export interface MinigameContext {
  transactions?: { id: string; label: string; cash: number }[];
  inventory?: { ingredient: string; quantity: number; quarantined?: boolean }[];
  deliveries?: InspectionDelivery[];
  staff?: { id: string; name: string; role: string; skill: number; salary: number }[];
  orders?: { id: string; status: string; recipeId: string }[];
  incidents?: { id: string; title: string; sign: string; stage?: string; evidence: { id: string; label: string; fact: string; checked: boolean }[] }[];
}
const ingredientNames: Record<string,string> = { matcha:'Matcha',houjicha:'Houjicha',sencha:'Sencha',genmaicha:'Genmaicha',milk:'Sữa tươi',oat:'Sữa yến mạch',sugar:'Đường',strawberry:'Syrup dâu',caramel:'Caramel',lemon:'Nước chanh',mango:'Xoài',cream:'Kem sữa',cheese:'Kem cheese',ice:'Đá',pearl:'Trân châu',jelly:'Thạch trà',redbean:'Đậu đỏ',flour:'Bột bánh',egg:'Trứng',butter:'Bơ',cocoa:'Cacao',catfood:'Thức ăn mèo' };
const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export const W_PATH: Point[] = [{ x: 70, y: 70 }, { x: 145, y: 225 }, { x: 240, y: 75 }, { x: 335, y: 225 }, { x: 410, y: 70 }];
const pathPoint = (i: number): Point => { const segment = Math.min(3, Math.floor(i / 10)), f = (i % 10) / 10; return { x: W_PATH[segment].x + (W_PATH[segment + 1].x - W_PATH[segment].x) * f, y: W_PATH[segment].y + (W_PATH[segment + 1].y - W_PATH[segment].y) * f }; };
export function scoreWhisk(samples: Point[]) {
  if (!samples.length) return 0;
  const targets = Array.from({ length: 41 }, (_, i) => i === 40 ? W_PATH[4] : pathPoint(i));
  const coverage = targets.filter(p => samples.some(s => distance(p, s) < 26)).length / targets.length;
  const accuracy = samples.filter(s => targets.some(p => distance(p, s) < 30)).length / samples.length;
  const segments = samples.slice(1).filter((s, i) => (s.t ?? 0) > (samples[i].t ?? 0));
  const rhythm = segments.length ? segments.filter((s, i) => { const d = distance(s, samples[i]), dt = ((s.t ?? 0) - (samples[i].t ?? 0)) / 1000; return d / dt >= 40 && d / dt <= 950; }).length / segments.length : 0;
  return Math.round(clamp(coverage * 55 + accuracy * 25 + rhythm * 20));
}
export function scoreTiming(errors: number[], expected = 8, tolerance = .23) { return Math.round(clamp(errors.slice(0, expected).reduce((n, error) => n + Math.max(0, 1 - Math.abs(error) / tolerance), 0) / expected * 100)); }
export function scoreLayers(good: number, total: number, volume: number) { return Math.round(clamp((total > 0 ? good / total : 0) * 70 + Math.min(volume, 100) * .3)); }
export function scoreTaste(tea: number, sweet: number) { return Math.round(clamp(100 - Math.abs(tea - 65) - Math.abs(sweet - 30))); }
export function scoreSchedule(assignments: number[], people: { role: string; skill: number; salary: number }[]) {
  let cost = 0, adequacy = 0; const used = new Set<number>();
  assignments.slice(0, 3).forEach((a, role) => { const person=people[a];if (!person || used.has(a)) return; used.add(a); cost += person.salary; adequacy += person.skill * (person.role===['barista','baker','cashier'][role]||person.role==='manager'?1:.55) / 3; });
  return Math.round(clamp(adequacy - Math.max(0, cost - 350000) / 1000 * .3));
}
const heart = Array.from({ length: 33 }, (_, i) => { const a = i / 32 * Math.PI * 2; return { x: 240 + 6 * 16 * Math.sin(a) ** 3, y: 145 - 5 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) }; });
const defs: Record<string, { title: string; instruction: string; seconds: number; rule: string }> = {
  whisk: { title: 'Đánh trà thật mịn', instruction: 'Giữ và rê theo đường W. Phủ cả bốn nét, giữ nhịp đều tay.', seconds: 14, rule: '55% độ phủ + 25% bám đường + 20% nhịp.' },
  milk: { title: 'Một trái tim bằng sữa', instruction: 'Chọn tốc độ 25–45, giữ và rê theo nét tim trong cốc để rót sữa.', seconds: 16, rule: '70% phủ hình tim + 30% vị trí và tốc độ rót.' },
  layers: { title: 'Rót tầng trà', instruction: 'Giữ trong cốc để rót. Điều chỉnh tốc độ trong vùng 45–65 để tầng không hòa lẫn.', seconds: 16, rule: '70% thời gian đúng tốc độ + 30% thể tích hoàn thành.' },
  shake: { title: 'Lắc theo nhịp', instruction: 'Chạm khi vòng tròn co tới vạch xanh. Có 8 nhịp cách nhau 0,7 giây.', seconds: 7, rule: 'Mỗi nhịp càng gần mốc xanh càng nhiều điểm; nhấn lặp không cộng điểm.' },
  bake: { title: 'Canh lò bánh', instruction: 'Quan sát thanh chín, lấy bánh trong vùng xanh. Bánh sẽ quá lửa nếu chờ lâu.', seconds: 12, rule: '100 điểm tại giây 7; giảm 30 điểm cho mỗi giây lệch.' },
  decorate: { title: 'Trang trí chiếc bánh', instruction: 'Chọn hoặc kéo topping vào ba dấu tròn. Chọn kem rồi giữ ở giữa bánh để bóp kem.', seconds: 35, rule: 'Ba topping đúng vị trí: 75 điểm. Kem vừa đủ: 25 điểm.' },
  taste: { title: 'Thử vị bí mật', instruction: 'Thử một mẫu, đọc lời gợi ý, điều chỉnh trà và đường. Tối đa ba lần thử.', seconds: 75, rule: '100 trừ sai lệch lượng trà và đường với công thức bí mật.' },
  feather: { title: 'Cần câu lông vũ', instruction: 'Giữ và rê lông vũ. Khi mèo đến gần, dừng một nhịp để bé vồ. Chơi nhẹ nhàng.', seconds: 20, rule: 'Ba lần mèo bắt được đồ chơi đạt 100 điểm; có khoảng nghỉ giữa các lần.' },
  ball: { title: 'Bóng qua đường hầm', instruction: 'Giữ bóng ở góc trái, kéo qua lối trống tới đường hầm xanh. Tránh hai khối gỗ.', seconds: 30, rule: 'Tới đích: 100 điểm. Mỗi lần chạm khối gỗ giảm 20 điểm.' },
  hide: { title: 'Bé trốn ở đâu?', instruction: 'Quan sát tai và đuôi nhô ra sau đồ đạc. Chạm nơi mèo đang trốn.', seconds: 25, rule: 'Tìm đúng đạt 100 điểm; mỗi nơi tìm nhầm giảm 20 điểm.' },
  boxes: { title: 'Hộp nào có mèo?', instruction: 'Ghi nhớ hộp có mèo. Theo dõi hai lần đổi chỗ, rồi chọn hộp ở vị trí cuối.', seconds: 20, rule: 'Chọn đúng đạt 100 điểm. Hộp đổi chỗ theo trình tự cố định, có thể theo dõi.' },
  explore: { title: 'Đường chơi an toàn', instruction: 'Chạm từng chỗ trống để chọn: cầu cho khe, đệm cho chỗ nhảy, hộp cho góc nghỉ.', seconds: 60, rule: 'Mỗi vật phù hợp đạt 1/3 điểm. Không dùng cầu cao hoặc đường bị chặn.' },
  train: { title: 'Dạy bé chạm tay', instruction: 'Quan sát bé giơ chân. Chạm nút thưởng khi chân ở trên, đợi lần tiếp theo.', seconds: 16, rule: 'Tối đa năm lần; thưởng đúng cửa sổ động tác, không thưởng liên tục.' },
  photo: { title: 'Khoảnh khắc của Mochi', instruction: 'Rê khung ảnh theo bé, chụp khi bé ngáp hoặc ngồi. Có ba tấm ảnh.', seconds: 25, rule: '70% căn giữa + 30% đúng khoảnh khắc. Giữ tấm tốt nhất.' },
  cash: { title: 'Đối soát quầy tiền', instruction: 'Cộng các dòng tiền thực trong sổ: nhận tiền cộng, chi tiền trừ. Nhập dòng tiền ròng của nhóm giao dịch này.', seconds: 75, rule: 'Điểm theo sai lệch số tiền đã cộng. Đối soát sổ không tự kết luận có người gian lận.' },
  count: { title: 'Kiểm kho thật kỹ', instruction: 'Mỗi hũ là một lô thực trong kho; nhãn ghi lượng còn lại. Cộng theo nguyên liệu, loại lô cách ly có vạch đỏ.', seconds: 60, rule: 'Điểm theo sai lệch tồn khả dụng với các lô thực của quán.' },
  inspect: { title: 'Kiểm tra hàng nhập', instruction: 'So phiếu đặt với lượng thực nhận và chất lượng đã hứa. Đánh dấu lô thiếu, thừa hoặc thấp hơn chất lượng cam kết.', seconds: 60, rule: 'Chọn đủ lô sai lệch đạt 100. Lô đúng cam kết của nhà cung cấp tiết kiệm vẫn được chấp nhận. Phiếu cũ thiếu cam kết dùng mốc chất lượng 65 và dấu cách ly.' },
  schedule: { title: 'Xếp ca cân bằng', instruction: 'Chọn nhân viên thực của tiệm cho pha chế, bánh và phục vụ. So kỹ năng, đúng vai trò; ngân sách 350 nghìn.', seconds: 75, rule: 'Kỹ năng trung bình, vai trò phù hợp và ngân sách quyết định điểm. Một người không làm hai vị trí.' },
  clean: { title: 'Dọn quán gọn ghẽ', instruction: 'Giữ và rê khăn qua từng vết bẩn 3 lần. Ưu tiên sàn ướt màu xanh để khách không trượt.', seconds: 18, rule: 'Bốn khu sạch: 80 điểm. Dọn sàn ướt trước: thêm 20.' },
  rush: { title: 'Luồng đơn giờ cao điểm', instruction: 'Chọn đơn đang có trong quán. Đơn chờ tới quầy pha, đang pha tiếp tục tại quầy, món sẵn sàng tới phục vụ.', seconds: 35, rule: 'Mỗi đơn chuyển đúng trạm được điểm; chuyển sai giảm 10. Nhân viên sẽ nhận việc theo khả năng thực.' },
  lost: { title: 'Lần theo dấu vết', instruction: 'Đọc dấu hiệu vụ việc đang có ở tiệm. Chọn nguồn để kiểm tra, đọc sự thật mới thu thập trước khi quyết định xử lý.', seconds: 60, rule: 'Điểm theo số nguồn đã kiểm tra. Bằng chứng thực được lưu trong hồ sơ; nghi ngờ chưa phải sự thật.' },
};
export const MINIGAMES = Object.fromEntries(Object.entries(defs).map(([key, def]) => [key, def.title]));

function Cat({ x = 240, y = 180, paw = false, sleeping = false, color = '#f4e9d7' }: { x?: number; y?: number; paw?: boolean; sleeping?: boolean; color?: string }) {
  return <g transform={`translate(${x} ${y})`} stroke="#5d493b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M24 25q45 13 37-18q-8-14-19-3" fill="none"/><ellipse cy="20" rx="31" ry="28" fill={color}/><path d="M-29-6l-2-27 22 15M8-18l23-15-2 27" fill={color}/><ellipse cy="-5" rx="31" ry="24" fill={color}/><path d={sleeping ? 'M-20-6q6-7 12 0M8-6q6-7 12 0' : 'M-16-9v5M16-9v5'} fill="none"/><path d="M-4 1h8l-4 4z" fill="#c48986"/><path d="M0 5v5m-9-1q9 9 18 0M-28 0l-13-3M28 0l13-3" fill="none"/><ellipse cx={paw ? -32 : -16} cy={paw ? -15 : 41} rx="9" ry="6" fill={color}/><ellipse cx="17" cy="41" rx="9" ry="6" fill={color}/></g>;
}
function Cup({ fill = '#71975a', amount = 1 }: { fill?: string; amount?: number }) { return <g stroke="#675040" strokeWidth="4"><path d="M148 78h184l-19 174H169z" fill="#fff9ea"/><path d={`M${169 - 21 * amount} ${252 - 174 * amount}h${144 + 42 * amount}L313 252H169z`} fill={fill} stroke="none"/><ellipse cx="240" cy="78" rx="92" ry="21" fill="#c9d8a3"/><path d="M332 105q69-3 52 71q-11 31-61 25" fill="none"/></g>; }
function Jar({ x, y, brown = false, damaged = false }: { x: number; y: number; brown?: boolean; damaged?: boolean }) { return <g transform={`translate(${x} ${y})`} stroke="#624c3d" strokeWidth="3"><rect x="-23" y="-31" width="46" height="65" rx="10" fill={brown ? '#af825b' : '#8baf6c'}/><rect x="-25" y="-38" width="50" height="12" rx="4" fill="#e1c79c"/><rect x="-13" y="-9" width="26" height="22" rx="4" fill="#f9f2d7"/>{damaged && <path d="M-26-23L27 25M-26 25L27-23" stroke="#be6256" strokeWidth="5"/>}</g>; }
type Model = { elapsed: number; progress: number; good: number; total: number; hits: number; misses: number; holding: boolean; pointer: Point; ball: Point; cat: Point; lastPounce: number; trace: Point[]; errors: number[]; beats: number[]; decor: Point[]; cream: number; cleaned: number[]; firstClean: number; choices: number[]; selected: number; attempts: number; message: string; photoBest: number; routed: number[] };
const initial = (): Model => ({ elapsed: 0, progress: 0, good: 0, total: 0, hits: 0, misses: 0, holding: false, pointer: { x: 240, y: 145 }, ball: { x: 55, y: 235 }, cat: { x: 65, y: 215 }, lastPounce: -3, trace: [], errors: [], beats: [], decor: [], cream: 0, cleaned: [0, 0, 0, 0], firstClean: -1, choices: [], selected: 0, attempts: 0, message: '', photoBest: 0, routed: [] });
const mess = [{ x: 95, y: 215 }, { x: 250, y: 100 }, { x: 365, y: 225 }, { x: 180, y: 215 }];
const toppingTargets = [{ x: 170, y: 140 }, { x: 240, y: 115 }, { x: 310, y: 140 }];
export default function Minigame({ kind: requestedKind, onComplete, onCancel, reducedMotion = false, context, externallyPaused = false, onPauseChange }: { kind: string; onComplete: (score: number, detail?: string) => void; onCancel: () => void; reducedMotion?: boolean; context?: MinigameContext; externallyPaused?: boolean; onPauseChange?: (paused: boolean) => void }) {
  const kind = defs[requestedKind] ? requestedKind : 'whisk', def = defs[kind];
  const [m, setM] = useState<Model>(initial), [started, setStarted] = useState(false), [paused, setPaused] = useState(false), [result, setResult] = useState<{ score: number; detail: string }>();
  const effectivePaused=paused||externallyPaused;
  const togglePause=(value:boolean)=>{setPaused(value);setM(p=>({...p,holding:false}));if(onPauseChange)onPauseChange(value);};
  const [rate, setRate] = useState(50), [tea, setTea] = useState(40), [sweet, setSweet] = useState(50), [counts, setCounts] = useState([0, 0]), [cashAnswer,setCashAnswer] = useState(0), [assignments, setAssignments] = useState([-1, -1, -1]);
  const facts = useRef(context || {}).current;
  const cashRows = facts.transactions?.slice(-6) || [];
  const countIngredients = [...new Set(facts.inventory?.filter(b=>b.quantity>0).map(b=>b.ingredient))].slice(0,2);
  const countBatches = facts.inventory?.filter(b=>countIngredients.includes(b.ingredient)&&b.quantity>0) || [];
  const countTargets = countIngredients.map(id=>countBatches.filter(b=>b.ingredient===id&&!b.quarantined).reduce((sum,b)=>sum+b.quantity,0));
  const inspection = facts.deliveries?.filter(d=>d.status!=='travel'&&d.status!=='returned').slice(-6)||[];
  const inspectionTargets = inspection.map((d,i)=>deliveryNeedsReview(d)?i:-1).filter(i=>i>=0);
  const people = facts.staff || [];
  const rushOrders = facts.orders?.filter(o=>['waiting','making','ready'].includes(o.status)).slice(0,6).map(o=>({...o,name:`${o.id} · ${o.recipeId}`,lane:o.status==='ready'?2:o.status==='making'?1:0}))||[];
  const investigation = facts.incidents?.find(i=>i.stage!=='resolved'&&i.evidence.some(e=>!e.checked))||facts.incidents?.find(i=>i.stage!=='resolved');
  const completeRef = useRef(false), modelRef = useRef(m), rateRef = useRef(rate), boardRef = useRef<SVGSVGElement>(null);
  modelRef.current = m; rateRef.current = rate;
  const finish = (score: number, detail: string) => { if (!result) { setResult({ score: Math.round(clamp(score)), detail }); audio.play('success'); } };
  const calculate = () => {
    if (kind === 'whisk') return scoreWhisk(m.trace);
    if (kind === 'milk') { const coverage = heart.filter(p => m.trace.some(q => distance(p, q) < 24)).length / heart.length; const accuracy = m.trace.length ? m.trace.filter(q => heart.some(p => distance(p, q) < 30) && (q.rate ?? 0) >= 25 && (q.rate ?? 0) <= 45).length / m.trace.length : 0; return coverage * 70 + accuracy * 30; }
    if (kind === 'layers') return scoreLayers(m.good, m.total, m.progress);
    if (kind === 'shake') return scoreTiming(m.errors);
    if (kind === 'bake') return 100 - Math.abs(m.elapsed - 7) * 30;
    if (kind === 'decorate') return toppingTargets.filter(p => m.decor.some(q => distance(p, q) < 29)).length * 25 + (m.cream >= .8 && m.cream <= 2 ? 25 : m.cream > 0 ? 8 : 0);
    if (kind === 'taste') return scoreTaste(tea, sweet);
    if (kind === 'feather') return m.hits / 3 * 100 - m.misses * 10;
    if (kind === 'lost') return investigation?.evidence.length ? m.choices.length/investigation.evidence.length*100 : 0;
    if (kind === 'ball') return distance(m.ball, { x: 423, y: 65 }) < 42 ? 100 - m.misses * 20 : m.ball.x / 480 * 40;
    if (kind === 'hide' || kind === 'boxes') return m.hits ? 100 - m.misses * 20 : 0;
    if (kind === 'explore') return [1, 2, 3].filter((v, i) => m.choices[i] === v).length / 3 * 100;
    if (kind === 'train') return m.hits / 5 * 100 - m.misses * 8;
    if (kind === 'photo') return m.photoBest;
    if (kind === 'cash') return cashRows.length ? clamp(100-Math.abs(cashAnswer-cashRows.reduce((sum,row)=>sum+row.cash,0))/100) : 0;
    if (kind === 'count') return countTargets.length ? countTargets.reduce((sum,target,i)=>sum+clamp(1-Math.abs(counts[i]-target)/Math.max(1,target),0,1)*100/countTargets.length,0) : 0;
    if (kind === 'inspect') return inspection.length ? clamp(100-((inspectionTargets.filter(i=>!m.choices.includes(i)).length+m.choices.filter(i=>!inspectionTargets.includes(i)).length)/inspection.length)*100) : 0;
    if (kind === 'schedule') return scoreSchedule(assignments,people);
    if (kind === 'clean') return m.cleaned.filter(v => v >= 3).length * 20 + (m.firstClean === 0 ? 20 : 0);
    if (kind === 'rush') return rushOrders.length ? m.hits / rushOrders.length * 100 - m.misses * 10 : 0;
    return 0;
  };
  useEffect(() => {
    const handle = () => { if (document.hidden) { setPaused(true); setM(p => ({ ...p, holding: false })); } };
    document.addEventListener('visibilitychange', handle); return () => document.removeEventListener('visibilitychange', handle);
  }, []);
  useEffect(() => {
    if (!started || effectivePaused || result) return;
    let previous = performance.now();
    const timer = setInterval(() => { const now = performance.now(), dt = Math.min(.2, (now - previous) / 1000); previous = now;
      if (document.hidden) return;
      setM(p => {
        const next = { ...p, elapsed: p.elapsed + dt };
        if (kind === 'layers' && p.holding) { next.total += dt; next.good += rateRef.current >= 45 && rateRef.current <= 65 ? dt : 0; next.progress = Math.min(100, p.progress + rateRef.current / 6 * dt); }
        if (kind === 'decorate' && p.holding && p.selected === 3 && distance(p.pointer, { x: 240, y: 173 }) < 45) next.cream += dt;
        if (kind === 'feather' && p.holding) {
          const dx = p.pointer.x - p.cat.x, dy = p.pointer.y - p.cat.y, d = Math.hypot(dx, dy), speed = Math.min(110 * dt, d);
          next.cat = d > 0 ? { x: p.cat.x + dx / d * speed, y: p.cat.y + dy / d * speed } : p.cat;
          if (d < 30 && p.elapsed - p.lastPounce > 2 && p.hits < 3) { next.hits++; next.lastPounce = p.elapsed; next.message = 'Bé bắt được lông vũ! Đợi bé nghỉ một nhịp.'; }
        }
        return next;
      });
    }, 50); return () => clearInterval(timer);
  }, [kind, started, effectivePaused, result]);
  useEffect(() => { if (started && !result && m.elapsed >= def.seconds) finish(calculate(), 'Đã hết thời gian thao tác.'); }, [m.elapsed, started, result]);
  const act = (event: PointerEvent<SVGSVGElement>, down = false) => {
    if (!started || effectivePaused || result) return;
    const bounds = event.currentTarget.getBoundingClientRect(), point = { x: clamp((event.clientX - bounds.left) / bounds.width * 480, 0, 480), y: clamp((event.clientY - bounds.top) / bounds.height * 300, 0, 300) };
    if (down) event.currentTarget.setPointerCapture(event.pointerId);
    setM(p => {
      const holding = down || p.holding, next = { ...p, pointer: point, holding };
      if ((kind === 'whisk' || kind === 'milk') && holding) next.trace = [...p.trace.slice(-1999), { ...point, t: p.elapsed * 1000, rate }];
      if (kind === 'decorate' && down && p.selected < 3 && p.decor.length < 3 && point.y > 80) next.decor = [...p.decor, {...point,rate:p.selected}];
      if (kind === 'ball' && holding && (p.holding || distance(point, p.ball) < 45)) {
        const blocked = Array.from({length:16},(_,i)=>({x:p.ball.x+(point.x-p.ball.x)*(i+1)/16,y:p.ball.y+(point.y-p.ball.y)*(i+1)/16})).some(q=>(q.x > 122 && q.x < 233 && q.y > 137) || (q.x > 252 && q.x < 353 && q.y < 173));
        if (blocked) { if (p.elapsed - p.lastPounce > .65) { next.misses++; next.lastPounce = p.elapsed; } }
        else next.ball = point;
      }
      if (kind==='ball' && down && distance(point,p.ball)>=45) next.holding=false;
      if (kind === 'clean' && holding) {
        const i = mess.findIndex(v => distance(v, point) < 38);
        if (i >= 0 && p.cleaned[i] < 3 && p.elapsed - p.lastPounce > .14) { next.cleaned = [...p.cleaned]; next.cleaned[i]++; next.lastPounce = p.elapsed; if (next.cleaned[i] === 3 && p.firstClean < 0) next.firstClean = i; }
      }
      return next;
    });
  };
  const click = (update: (p: Model) => Model) => { if (!started || effectivePaused || result) return; audio.play('click'); setM(update); };
  const tapBeat = () => click(p => { const beat = Math.round((p.elapsed - 1) / .7), error = p.elapsed - (1 + beat * .7); if (beat < 0 || beat >= 8 || p.beats.includes(beat)) return p; return { ...p, errors: [...p.errors, error], beats: [...p.beats, beat], hits: p.hits + (Math.abs(error) < .23 ? 1 : 0), message: Math.abs(error) < .12 ? 'Đúng nhịp!' : Math.abs(error) < .23 ? 'Gần đúng!' : 'Lệch nhịp, đợi vòng tiếp theo.' }; });
  const reward = () => click(p => { const cycle = Math.floor(p.elapsed / 3), phase = p.elapsed % 3; if (p.beats.includes(cycle) || cycle >= 5) return p; const good = phase >= 1.4 && phase <= 2.1; return { ...p, beats: [...p.beats, cycle], hits: p.hits + (good ? 1 : 0), misses: p.misses + (good ? 0 : 1), message: good ? 'Thưởng đúng lúc, bé đã hiểu!' : 'Thưởng hơi sớm hoặc muộn. Chờ bé giơ chân.' }; });
  const snapshot = () => click(p => { if (p.attempts >= 3) return p; const target = { x: 240 + Math.sin(p.elapsed * .6) * 110, y: 165 }; const composition = Math.max(0, 1 - distance(p.pointer, target) / 140) * 70, moment = p.elapsed % 4 >= 2 ? 30 : 5; return { ...p, photoBest: Math.max(p.photoBest, composition + moment), attempts: p.attempts + 1, message: moment === 30 ? 'Bắt được khoảnh khắc đáng yêu!' : 'Bé đang đi. Chờ ngáp hoặc ngồi để chụp đẹp hơn.' }; });
  const finishAction = () => finish(calculate(), kind === 'whisk' ? 'Điểm thao tác đánh trà được dùng cho chất lượng thành phẩm.' : 'Kết quả được áp dụng một lần vào công việc hoặc tương tác.');
  const dropTopping = (event: PointerEvent<HTMLButtonElement>, selected: number) => {
    const bounds=boardRef.current?.getBoundingClientRect(); if(!bounds||!started||effectivePaused||result||selected===3)return;
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)return;
    const point={x:(event.clientX-bounds.left)/bounds.width*480,y:(event.clientY-bounds.top)/bounds.height*300,rate:selected};
    setM(p=>p.decor.length<3?{...p,decor:[...p.decor,point]}:p);
  };
  const buttons = (labels: string[], select: (i: number) => void, selected?: number) => <div className="mg-options">{labels.map((label, i) => <button key={label} className={selected === i ? 'selected' : ''} onClick={() => select(i)}>{label}</button>)}</div>;
  const resultDetail = () => {
    if(kind==='cash')return JSON.stringify({kind,transactionIds:cashRows.map(row=>row.id),cashExpected:cashRows.reduce((sum,row)=>sum+row.cash,0),cashAnswer});
    if(kind==='count')return JSON.stringify({kind,inventoryCount:countIngredients.map((ingredient,i)=>({ingredient,quantity:counts[i]}))});
    if(kind==='inspect')return JSON.stringify({kind,deliveryIds:inspection.map(d=>d.id),inspectedIds:inspection.map(d=>d.id),quarantineIds:m.choices.filter(i=>inspectionTargets.includes(i)).map(i=>inspection[i].id)});
    if(kind==='schedule')return JSON.stringify({kind,shiftAssignments:assignments.map((a,i)=>({staffId:people[a]?.id,role:['barista','baker','cashier'][i]})).filter(a=>a.staffId)});
    if(kind==='rush')return JSON.stringify({kind,routes:m.routed.filter(i=>m.choices[i]===rushOrders[i].lane).map(i=>({orderId:rushOrders[i].id,task:rushOrders[i].status==='ready'?'serve':'drink'}))});
    if(kind==='lost')return JSON.stringify({kind,evidence:m.choices.map(i=>({incidentId:investigation?.id,evidenceId:investigation?.evidence[i]?.id})).filter(e=>e.evidenceId)});
    return def.title;
  };
  const svg = <svg ref={boardRef} className={`mg-board ${reducedMotion ? 'reduce-motion' : ''}`} viewBox="0 0 480 300" role="img" aria-label={`${def.title}: ${def.instruction}`} onPointerDown={e => act(e, true)} onPointerMove={e => act(e)} onPointerUp={() => setM(p => ({ ...p, holding: false }))} onPointerCancel={() => setM(p => ({ ...p, holding: false }))}>
    <defs><pattern id="mg-wood" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill="#eddbc0"/><path d="M0 39H80M25 0v39" stroke="#cfb994" strokeWidth="1"/></pattern></defs><rect width="480" height="300" rx="18" fill="url(#mg-wood)"/>
    {kind === 'whisk' && <><ellipse cx="240" cy="165" rx="201" ry="122" fill="#faf6df" stroke="#655044" strokeWidth="6"/><ellipse cx="240" cy="160" rx="180" ry="100" fill="#8dad63"/><path d="M70 70L145 225L240 75L335 225L410 70" fill="none" stroke="#e5edd4" strokeWidth="18" strokeDasharray="10 8" strokeLinecap="round"/>{m.trace.length > 1 && <polyline points={m.trace.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#496333" strokeWidth="6" strokeLinecap="round"/>}<g transform={`translate(${m.pointer.x} ${m.pointer.y}) rotate(-24)`} stroke="#6c4e32"><path d="M-4-43h8v34h-8z" fill="#caa06d"/>{[-13, -7, 0, 7, 13].map(x => <path key={x} d={`M${x/2}-9Q${x*1.8} 16 ${x} 26`} fill="none" strokeWidth="3"/> )}</g></>}
    {(kind === 'milk' || kind === 'layers') && <><Cup amount={kind === 'layers' ? m.progress / 100 : 1}/>{kind === 'milk' ? <><polyline points={heart.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#fcf8e9" strokeWidth="5" strokeDasharray="7 6"/>{m.trace.length > 1 && <polyline points={m.trace.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#fffdf2" strokeWidth="9" strokeLinecap="round"/>}</> : <><path d="M174 199h134v20H174" fill="#dac198"/><text x="240" y="280" textAnchor="middle">{Math.round(m.progress)}% đầy cốc</text></>}{m.holding && <path d={`M${m.pointer.x} 15V${m.pointer.y}`} stroke="#fdf9ed" strokeWidth={rate / 8} strokeLinecap="round"/>}<g transform={`translate(${m.pointer.x-20} 5)`}><path d="M0 0h48l-8 35H5z" fill="#b0c6b4" stroke="#635140" strokeWidth="3"/><path d="M5 35l26 8" stroke="#635140" strokeWidth="3"/></g></>}
    {kind === 'shake' && <><path d="M195 75h90l15 147q-58 30-120 0z" fill="#abc5ac" stroke="#655044" strokeWidth="5"/><rect x="200" y="52" width="80" height="25" rx="8" fill="#6e8b70"/><circle cx="240" cy="160" r="58" fill="none" stroke="#5f8251" strokeWidth="8"/><circle cx="240" cy="160" r={58 + Math.abs(((m.elapsed - 1 + .35) % .7) - .35) * 160} fill="none" stroke="#f8f1d9" strokeWidth="5"/><text x="240" y="275" textAnchor="middle">Nhịp đúng {m.hits}/8</text></>}
    {kind === 'bake' && <><rect x="70" y="35" width="340" height="220" rx="18" fill="#9d795b" stroke="#654d3c" strokeWidth="6"/><rect x="92" y="80" width="296" height="145" rx="15" fill="#52443b"/><circle cx="115" cy="56" r="9" fill="#d99168"/><circle cx="150" cy="56" r="9" fill="#e9d7a9"/>{[160, 240, 320].map(x => <g key={x}><circle cx={x} cy="162" r="32" fill={m.elapsed < 6 ? '#e8cbaa' : m.elapsed < 8 ? '#cda05d' : '#846044'}/><path d={`M${x-15} 146l8 7m9 12l8-4m-26 11l3 7`} stroke="#77533c" strokeWidth="6" strokeLinecap="round"/></g>)}<rect x="90" y="272" width="300" height="14" rx="7" fill="#d4b68d"/><rect x="240" y="272" width="50" height="14" fill="#7c9f67"/><circle cx={90 + clamp(m.elapsed / 12, 0, 1) * 300} cy="279" r="10" fill="#fffaf0" stroke="#59493d" strokeWidth="3"/></>}
    {kind === 'decorate' && <><ellipse cx="240" cy="228" rx="160" ry="38" fill="#fbf6e5"/><path d="M115 150v58q125 59 250 0v-58" fill="#92704c" stroke="#624d3d" strokeWidth="4"/><ellipse cx="240" cy="149" rx="125" ry="52" fill="#a8be78" stroke="#624d3d" strokeWidth="4"/>{toppingTargets.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="18" fill="none" stroke="#eef0d9" strokeWidth="3" strokeDasharray="4 4"/>)}{m.decor.map((p, i) => <g key={i} transform={`translate(${p.x} ${p.y})`}><path d="M0-16q22 3 14 21L0 18-14 5Q-22-13 0-16" fill={p.rate === 1 ? '#805e45' : p.rate === 2 ? '#dba4a4' : '#d78779'} stroke="#6f5040" strokeWidth="3"/><path d="M-6-16l6-8 5 8" fill="#7d9b57"/></g>)}{m.cream > 0 && <path d={`M${230-m.cream*6} 188q-8-20 10-23q-6-14 10-21q17 12 7 24q25 1 15 20z`} fill="#fff8de" stroke="#d5bd94" strokeWidth="3"/>}</>}
    {kind === 'taste' && <><Cup fill="#9dac6b"/><path d="M250 175l45-90" stroke="#9b7555" strokeWidth="9" strokeLinecap="round"/><text x="240" y="284" textAnchor="middle">Công thức bí mật · mẫu {Math.min(m.attempts + 1, 3)}/3</text></>}
    {kind === 'feather' && <><path d="M35 20L445 30" stroke="#be9b75" strokeWidth="12" strokeLinecap="round"/><path d={`M430 30Q430 85 ${m.pointer.x} ${m.pointer.y}`} stroke="#675443" strokeWidth="2" fill="none"/><g transform={`translate(${m.pointer.x} ${m.pointer.y})`}><path d="M0-19q-32 19 0 42q32-20 0-42" fill="#ba889b" stroke="#634f40" strokeWidth="3"/><path d="M0-12v39" stroke="#f5e8d8" strokeWidth="3"/></g><Cat x={m.cat.x} y={m.cat.y} paw={m.elapsed - m.lastPounce < .55}/><text x="240" y="284" textAnchor="middle">Đã bắt {m.hits}/3 lần</text></>}
    {kind === 'ball' && <><path d="M32 232H102V97H248V245H377V66H450" fill="none" stroke="#f6ebd5" strokeWidth="76" strokeLinecap="round" strokeLinejoin="round"/><rect x="140" y="155" width="75" height="145" rx="10" fill="#b38b61" stroke="#70573f" strokeWidth="3"/><rect x="270" y="0" width="65" height="155" rx="10" fill="#b38b61" stroke="#70573f" strokeWidth="3"/><path d="M391 86v-45q32-25 64 0v45" fill="#8cac7a" stroke="#5b704f" strokeWidth="5"/><circle cx={m.ball.x} cy={m.ball.y} r="19" fill="#d69385" stroke="#684d41" strokeWidth="3"/><path d={`M${m.ball.x-17} ${m.ball.y}q17-20 34 0M${m.ball.x} ${m.ball.y-17}q20 17 0 34`} fill="none" stroke="#f4d9c7" strokeWidth="3"/></>}
    {kind === 'hide' && <>{[0, 1, 2, 3].map((i) => <g key={i} role="button" tabIndex={0} aria-label={['Sau ghế', 'Sau hộp', 'Sau kệ', 'Dưới đệm'][i]} onPointerDown={e => { e.stopPropagation(); click(p => ({ ...p, hits: i === 2 ? 1 : p.hits, misses: p.misses + (i === 2 ? 0 : 1), message: i === 2 ? 'Thấy đôi tai và chiếc đuôi! Bé ở sau kệ.' : 'Chỗ này trống. Quan sát dấu tai và đuôi nhé.' })); }} onKeyDown={e => { if (e.key === 'Enter') click(p => ({ ...p, hits: i === 2 ? 1 : p.hits, misses: p.misses + (i === 2 ? 0 : 1) })); }} transform={`translate(${65+i%2*230} ${60+Math.floor(i/2)*140})`}>{i === 2 && <><path d="M75 4l9-23 16 23" fill="#d6c298" stroke="#67503e" strokeWidth="3"/><path d="M120 79q30 17 42-7" fill="none" stroke="#ae9668" strokeWidth="11" strokeLinecap="round"/></>}<rect width="140" height="80" rx={i === 3 ? 28 : 8} fill={['#9ab486', '#c39b72', '#a98461', '#d0a09b'][i]} stroke="#66503e" strokeWidth="4"/>{i === 2 && <path d="M0 32h140M25 0v80M80 0v80" stroke="#67503e" strokeWidth="4"/>}<text x="70" y="104" textAnchor="middle">{['Ghế', 'Hộp', 'Kệ sách', 'Đệm'][i]}</text></g>)}</>}
    {kind === 'boxes' && <>{[0, 1, 2].map(i => { const phase = m.elapsed < 3 ? 0 : m.elapsed < 4 ? 1 : m.elapsed < 5 ? 2 : m.elapsed < 6 ? 3 : 4; const index = phase < 1 ? i : phase === 1 ? [1,0,2][i] : phase === 2 ? [1,0,2][i] : [2,0,1][i]; const offset = phase === 1 && !reducedMotion ? Math.sin((m.elapsed-3)*Math.PI)*-22 : phase === 3 && !reducedMotion ? Math.sin((m.elapsed-5)*Math.PI)*-22 : 0; return <g key={i} transform={`translate(${58+index*145} ${110+offset})`} role="button" tabIndex={0} aria-label={`Hộp ở vị trí ${index+1}`} onPointerDown={e => { e.stopPropagation(); if(m.elapsed >= 6) click(p => ({ ...p, hits: i === 0 ? 1 : 0, misses: p.misses + (i === 0 ? 0 : 1), message: i === 0 ? 'Đúng rồi, bé theo hộp tới bên phải!' : 'Hãy theo hộp từ trái sang giữa, rồi sang phải.' })); }} onKeyDown={e => { if(e.key === 'Enter' && m.elapsed >= 6) click(p => ({...p,hits:i===0?1:0})); }}>{m.elapsed < 3 && i === 0 && <Cat x={54} y={20}/>}<path d="M0 25h112v95H0z" fill="#c7a578" stroke="#67513d" strokeWidth="4"/><path d="M0 25l19-21h74l19 21M56 25v95" fill="#dfbd8b" stroke="#67513d" strokeWidth="3"/><text x="56" y="146" textAnchor="middle">Vị trí {index+1}</text></g>; })}<text x="240" y="35" textAnchor="middle">{m.elapsed < 3 ? 'Ghi nhớ bé trong hộp bên trái' : m.elapsed < 6 ? 'Đang đổi chỗ: trái → giữa → phải' : 'Chọn hộp có mèo'}</text></>}
    {kind === 'explore' && <><path d="M30 190H450" stroke="#abbd88" strokeWidth="44" strokeLinecap="round"/>{['Khe nhỏ', 'Chỗ nhảy', 'Góc nghỉ'].map((label,i)=><g key={label} transform={`translate(${105+i*135} 180)`} role="button" tabIndex={0} aria-label={`${label}, chọn đồ chơi`} onPointerDown={e => { e.stopPropagation(); click(p=>{ const choices=[...p.choices];choices[i]=((choices[i]||0)+1)%4;return {...p,choices};}); }} onKeyDown={e=>{if(e.key==='Enter')click(p=>{const choices=[...p.choices];choices[i]=((choices[i]||0)+1)%4;return {...p,choices};});}}><rect x="-45" y="-45" width="90" height="90" rx="12" fill={['#e5d9c2','#ba9870','#dca7a2','#bb9d75'][m.choices[i]||0]} stroke="#695641" strokeWidth="3"/>{m.choices[i]===1&&<path d="M-38 15H38M-38-10H38M-30-30V30M30-30V30" stroke="#70523e" strokeWidth="5"/>}{m.choices[i]===2&&<ellipse rx="33" ry="22" fill="#f3c4bb"/>}{m.choices[i]===3&&<path d="M-32-26H32V28H-32zM-32-26l15-15h36l13 15" fill="#d5b784" stroke="#775d44" strokeWidth="3"/>}<text y="75" textAnchor="middle">{label}</text><text y="-65" textAnchor="middle">{['Chưa đặt','Cầu thấp','Đệm','Hộp'][m.choices[i]||0]}</text></g>)}<Cat x={35} y={92} color="#c8ab79"/></>}
    {kind==='train'&&<><Cat paw={m.elapsed%3>=1.4&&m.elapsed%3<=2.1}/><path d="M88 171q33-36 62-6l-4 36H97z" fill="#e5b797" stroke="#684f3f" strokeWidth="4"/><text x="240" y="45" textAnchor="middle">{m.elapsed%3>=1.4&&m.elapsed%3<=2.1?'Bé giơ chân — thưởng lúc này!':'Đợi bé chủ động giơ chân'}</text><text x="240" y="280" textAnchor="middle">Đúng {m.hits}/5 · Thưởng lệch {m.misses}</text></>}
    {kind==='photo'&&<><rect x="5" y="5" width="470" height="290" rx="18" fill="#dae1b9"/><path d="M0 230h480" stroke="#bbbf90" strokeWidth="40"/><Cat x={240+Math.sin(m.elapsed*.6)*110} y={165} sleeping={m.elapsed%4>=2}/><g transform={`translate(${m.pointer.x} ${m.pointer.y})`} stroke="#fcf8e8" strokeWidth="6" fill="none"><rect x="-85" y="-82" width="170" height="165" rx="12"/><path d="M-20 0h40M0-20v40" strokeWidth="2"/></g><text x="240" y="30" textAnchor="middle">{m.elapsed%4>=2?'Mochi đang ngáp và ngồi yên':'Mochi đang đi dạo'}</text></>}
    {kind==='count'&&countBatches.map((batch,i)=><g key={i} transform={`translate(${60+i%6*72} ${80+Math.floor(i/6)*100})`}><Jar x={0} y={0} brown={batch.ingredient!==countIngredients[0]} damaged={batch.quarantined}/><text y="53" textAnchor="middle">{Number(batch.quantity.toFixed(1))}</text><text y="70" textAnchor="middle" style={{fontSize:10}}>{ingredientNames[batch.ingredient]||batch.ingredient}</text></g>)}
    {kind==='clean'&&<>{mess.map((p,i)=><g key={i} transform={`translate(${p.x} ${p.y})`}>{m.cleaned[i]<3?<><path d="M-32-8q-16-28 12-22q24-21 29 4q31-2 26 23q-17 27-38 18q-24 9-29-23" fill={i===0?'#8bbed0':'#ab805b'} opacity={1-m.cleaned[i]*.25}/><text y="50" textAnchor="middle">{['Sàn ướt','Vụn bánh','Rác','Bụi'][i]}</text></>:<path d="M-17 0L-3 15L22-19" stroke="#698752" strokeWidth="7" fill="none" strokeLinecap="round"/>}</g>)}{m.holding&&<rect x={m.pointer.x-22} y={m.pointer.y-15} width="44" height="30" rx="7" fill="#faf3d9" stroke="#839970" strokeWidth="3"/>}</>}
    {['cash','inspect','schedule','rush'].includes(kind)&&<><rect x="105" y="25" width="270" height="245" rx="16" fill="#fff9e8" stroke="#6c5744" strokeWidth="4"/><rect x="186" y="15" width="108" height="24" rx="8" fill="#93ac75"/>{[75,120,165,210].map(y=><g key={y}><path d={`M140 ${y}h200`} stroke="#d8c5a0" strokeWidth="4"/><rect x="141" y={y-15} width="17" height="17" rx="3" fill="#9dad7c"/></g>)}</>}
  </svg>;
  return <div className="mg-overlay" role="dialog" aria-modal="true" aria-labelledby="minigame-title"><section className="mg-panel"><header className="mg-header"><div><span className="mg-eyebrow">XƯỞNG NHỎ MIU MATCHA</span><h2 id="minigame-title">{def.title}</h2></div><button className="mg-close" aria-label="Đóng minigame" onClick={onCancel}>Đóng</button></header><p className="mg-instruction">{def.instruction}</p>
    {!started?<div className="mg-intro">{svg}<p className="mg-rule">{def.rule}</p><button className="mg-primary" onClick={()=>{void audio.unlock();setStarted(true);}}>Bắt đầu · {def.seconds} giây</button></div>:<><div className="mg-status"><span>{Math.max(0,Math.ceil(def.seconds-m.elapsed))} giây</span><progress max={def.seconds} value={m.elapsed}/><button onClick={()=>{togglePause(!effectivePaused);}}>{effectivePaused?'Tiếp tục':'Tạm dừng'}</button></div>
    {!['cash','inspect','schedule','rush','lost'].includes(kind)&&svg}
    {(kind==='milk'||kind==='layers')&&<label className="mg-slider">Tốc độ rót <strong>{rate}</strong><input aria-label="Tốc độ rót" type="range" min="5" max="100" value={rate} onChange={e=>setRate(Number(e.target.value))}/><span>Vùng tốt: {kind==='milk'?'25–45':'45–65'}</span></label>}
    {kind==='decorate'&&<><div className="mg-options">{['Dâu','Trà rang','Dâu hồng','Kem'].map((label,i)=><button key={label} className={m.selected===i?'selected':''} style={{touchAction:'none'}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);click(p=>({...p,selected:i}));}} onPointerUp={e=>dropTopping(e,i)} onClick={()=>click(p=>({...p,selected:i}))}>{label}</button>)}</div><p className="mg-tip">Kéo từ nút vào bánh hoặc chọn rồi chạm vị trí. Topping {m.decor.length}/3 · Kem {m.cream.toFixed(1)} giây (tốt: 0,8–2,0 giây)</p><button onClick={()=>click(p=>({...p,decor:[],cream:0}))}>Sắp lại trang trí</button></>}
    {kind==='taste'&&<><label className="mg-slider">Lượng trà <strong>{tea}</strong><input aria-label="Lượng trà bí mật" type="range" min="0" max="100" value={tea} onChange={e=>setTea(Number(e.target.value))}/></label><label className="mg-slider">Độ ngọt <strong>{sweet}</strong><input aria-label="Độ ngọt bí mật" type="range" min="0" max="100" value={sweet} onChange={e=>setSweet(Number(e.target.value))}/></label><button disabled={m.attempts>=3||effectivePaused} onClick={()=>click(p=>({...p,attempts:p.attempts+1,message:`${Math.abs(tea-65)<=5?'Trà đã vừa vị':tea<65?'Cần đậm trà hơn':'Trà hơi đậm'}, ${Math.abs(sweet-30)<=5?'đường đã vừa':'đường '+(sweet<30?'cần tăng':'cần giảm')}.`}))}>Thử mẫu {Math.min(m.attempts+1,3)}/3</button></>}
    {kind==='shake'&&<button className="mg-primary" disabled={effectivePaused} onClick={tapBeat}>Lắc lúc vòng chạm vạch</button>}
    {kind==='train'&&<button className="mg-primary" disabled={effectivePaused} onClick={reward}>Thưởng khi bé giơ chân</button>}
    {kind==='photo'&&<button className="mg-primary" disabled={m.attempts>=3||effectivePaused} onClick={snapshot}>Chụp ảnh · còn {3-m.attempts} tấm</button>}
    {kind==='cash'&&<><div className="mg-table">{cashRows.map(row=><div className="mg-inspect-row" key={row.id}><span>{row.id}</span><strong>{row.label}</strong><small>{row.cash>=0?'Nhận':'Chi'} {Math.abs(row.cash).toLocaleString('vi-VN')}đ</small></div>)}</div>{cashRows.length?<label className="mg-assignment">Dòng tiền ròng (VND)<input aria-label="Dòng tiền ròng" type="number" step="100" value={cashAnswer} onChange={e=>setCashAnswer(Number(e.target.value))}/></label>:<p className="mg-tip">Quán chưa có giao dịch để đối soát. Nhập hàng hoặc phục vụ một đơn trước.</p>}</>}
    {kind==='count'&&<div className="mg-options">{countIngredients.map((id,i)=><label key={id}>{ingredientNames[id]||id} khả dụng<input aria-label={`${ingredientNames[id]||id} khả dụng`} type="number" min="0" step="0.1" value={counts[i]} onChange={e=>setCounts(p=>p.map((v,n)=>n===i?Math.max(0,Number(e.target.value)):v))}/></label>)}</div>}
    {kind==='inspect'&&<div className="mg-table">{inspection.map((row,i)=><button key={row.id} className={`mg-inspect-row ${m.choices.includes(i)?'selected':''}`} onClick={()=>click(p=>({...p,choices:p.choices.includes(i)?p.choices.filter(v=>v!==i):[...p.choices,i]}))}><span>Lô giao {row.id} · {ingredientNames[row.ingredient]||row.ingredient}</span><strong>Phiếu đặt {row.expectedQuantity??row.quantity} · Thực nhận {row.receivedQuantity??(row.discrepancy!==undefined?(row.expectedQuantity??row.quantity)-row.discrepancy:row.quantity)}</strong><span>Chất lượng cam kết {row.expectedQuality??'mốc cũ 65'} · Thực nhận {row.quality??'đã kiểm tra'}</span><small>{row.status==='quarantined'?'Có dấu cách ly':row.status==='arrived'?'Đã đến tiệm':row.status} · {m.choices.includes(i)?'Đánh dấu sai lệch':'Chưa đánh dấu'}</small></button>)}{!inspection.length&&<p className="mg-tip">Chưa có lô đã giao. Hãy nhập nguyên liệu và đợi hàng tới.</p>}</div>}
    {kind==='schedule'&&<><div className="mg-staff">{people.map(person=><p key={person.id}>{person.name} · {Math.round(person.salary/1000)}k · tay nghề {person.skill} · {{barista:'Pha chế',baker:'Bánh',cashier:'Phục vụ',carer:'Chăm mèo',manager:'Quản lý'}[person.role]||person.role}</p>)}{!people.length&&<p>Hãy thuê nhân viên trước khi xếp lịch ca.</p>}</div>{['Pha chế','Làm bánh','Phục vụ'].map((label,i)=><label className="mg-assignment" key={label}>{label}<select aria-label={`Nhân viên ${label}`} value={assignments[i]} onChange={e=>setAssignments(p=>p.map((v,n)=>n===i?Number(e.target.value):v))}><option value={-1}>Chưa xếp</option>{people.map((person,n)=><option key={person.id} value={n}>{person.name}</option>)}</select></label>)}<p className="mg-tip">Ngân sách: 350k · Đã xếp {Math.round(assignments.reduce((sum,a)=>sum+(people[a]?.salary||0),0)/1000)}k</p></>}
    {kind==='rush'&&<><div className="mg-options">{rushOrders.map((order,i)=><button disabled={m.routed.includes(i)} key={order.id} className={m.selected===i?'selected':''} onClick={()=>click(p=>({...p,selected:i}))}>{order.name} · {order.status==='waiting'?'đang chờ':order.status==='making'?'đang pha':'món đã sẵn sàng'}{m.routed.includes(i)?' · đã chuyển':''}</button>)}</div>{rushOrders.length?<><p>Đưa đơn đã chọn tới:</p>{buttons(['Quầy pha · đơn chờ','Tiếp tục pha · đang làm','Phục vụ · món sẵn sàng'],lane=>click(p=>{if(!rushOrders[p.selected]||p.routed.includes(p.selected))return p;const good=rushOrders[p.selected].lane===lane,choices=[...p.choices];choices[p.selected]=lane;return {...p,choices,hits:p.hits+(good?1:0),misses:p.misses+(good?0:1),routed:[...p.routed,p.selected],selected:rushOrders.findIndex((_v,i)=>!p.routed.includes(i)&&i!==p.selected),message:good?'Đơn đã đến đúng trạm.':'Trạm chưa đúng trạng thái món, cần kiểm tra lại.'};}))}</>:<p className="mg-tip">Chưa có đơn đang xử lý. Mở quán và đợi khách đến trước.</p>}</>}
    {kind==='lost'&&<><h3>{investigation?.title||'Tiệm đang bình yên'}</h3><p className="mg-message">{investigation?.sign||'Chưa có vụ việc cần tìm dấu vết. Hồ sơ mới sẽ xuất hiện khi có dấu hiệu thực trong quán.'}</p><div className="mg-table">{investigation?.evidence.map((e,i)=><button className={`mg-inspect-row ${m.choices.includes(i)?'selected':''}`} key={e.id} onClick={()=>click(p=>({...p,choices:p.choices.includes(i)?p.choices:[...p.choices,i]}))}><strong>{e.label}</strong>{m.choices.includes(i)||e.checked?<span>{e.fact}</span>:<small>Kiểm tra nguồn này để đọc dữ kiện.</small>}</button>)}</div></>}
    {m.message&&<p className="mg-message" aria-live="polite">{m.message}</p>}<p className="mg-rule">{def.rule}</p><div className="mg-bottom"><button onClick={onCancel}>Bỏ thao tác</button><button className="mg-primary" disabled={effectivePaused} onClick={finishAction}>{kind==='bake'?'Lấy bánh khỏi lò':kind==='photo'?'Giữ tấm ảnh tốt nhất':kind==='explore'?'Cho bé thử đường chơi':'Hoàn tất thao tác'}</button></div>{effectivePaused&&<div className="mg-pause"><p>Thao tác đã tạm dừng. Đồng hồ không trôi.</p><button className="mg-primary" onClick={()=>togglePause(false)}>Tiếp tục</button></div>}
    </>}{result&&<div className="mg-result"><span className="mg-eyebrow">HOÀN TẤT</span><strong>{result.score}<small>/100</small></strong><p>{result.score>=85?'Một thao tác khéo léo!':result.score>=60?'Khá tốt, mỗi lần làm sẽ quen tay hơn.':'Lần này chưa trọn vẹn, kết quả vẫn được ghi đúng.'}</p><p className="mg-rule">{result.detail}</p><button className="mg-primary" onClick={()=>{if(!completeRef.current){completeRef.current=true;onComplete(result.score,resultDetail());}}}>Dùng kết quả</button></div>}</section></div>;
}
