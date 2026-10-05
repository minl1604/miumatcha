export interface DrinkFeedbackFacts {
  type?: 'drink';
  recipeName: string;
  customerName?: string;
  personality?: string;
  score: number;
  criteria?: { ingredients: number; taste: number; technique: number; temperature: number; presentation: number };
  actual?: { tea?: string; sweetness?: number; milk?: number; temperature?: number; topping?: string };
  requested?: { tea?: string; sweetness?: number; milk?: number; temperature?: number; topping?: string };
  history?: string;
}
export interface EventFacts {
  title: string;
  description: string;
  sign: string;
  evidence: { label: string; fact?: string; checked: boolean }[];
  choiceLabel?: string;
  outcome?: string;
}
export interface EventFeedbackFacts { type: 'event'; event: EventFacts; personality?: string; history?: string }
export type FeedbackFacts = DrinkFeedbackFacts | EventFeedbackFacts;
export interface FeedbackResult { text: string; source: 'local' | 'ai'; reason?: string }
const safe = (value: unknown, max = 80) => typeof value === 'string' ? value.replace(/[\u0000-\u001f]/g, '').slice(0, max) : '';
/** Hidden facts are excluded even before the request leaves the browser. */
export function publicEventFacts(event: EventFacts): EventFacts {
  return { title:safe(event.title,100),description:safe(event.description,600),sign:safe(event.sign,300),evidence:event.evidence.slice(0,8).map(e=>({label:safe(e.label,100),checked:e.checked===true,...(e.checked===true?{fact:safe(e.fact,300)}:{})})),...(event.choiceLabel?{choiceLabel:safe(event.choiceLabel,120)}:{}),...(event.outcome?{outcome:safe(event.outcome,400)}:{}) };
}
export function localEventNarration(event: EventFacts): FeedbackResult {
  const facts=publicEventFacts(event),parts:string[]=[];
  if(facts.outcome)parts.push(`Kết quả đã ghi nhận: ${facts.outcome}`);
  else {
    parts.push(`Dấu hiệu quan sát: ${facts.sign||facts.description||facts.title}.`);
    const verified=facts.evidence.find(e=>e.checked&&e.fact);
    if(verified)parts.push(`Đã kiểm chứng (${verified.label}): ${verified.fact}`);
    if(facts.evidence.some(e=>!e.checked))parts.push('Những nguồn chưa kiểm tra vẫn chưa thể dùng để kết luận.');
  }
  return {text:parts.join(' ').slice(0,500),source:'local'};
}
export function localFeedback(facts: FeedbackFacts): FeedbackResult {
  if(facts.type==='event')return localEventNarration(facts.event);
  const score = Math.max(0, Math.min(100, Number(facts.score) || 0));
  const comments: string[] = [];
  const actual = facts.actual, requested = facts.requested;
  if (actual && requested) {
    if (actual.tea && requested.tea && actual.tea !== requested.tea) comments.push('Loại trà chưa đúng món mình gọi.');
    if (typeof actual.sweetness === 'number' && typeof requested.sweetness === 'number' && Math.abs(actual.sweetness - requested.sweetness) > 12)
      comments.push(actual.sweetness > requested.sweetness ? 'Độ ngọt hơi cao, lần sau giảm syrup để vị trà rõ hơn nhé.' : 'Mình thích vị ngọt rõ hơn một chút.');
    if (typeof actual.temperature === 'number' && typeof requested.temperature === 'number' && Math.abs(actual.temperature - requested.temperature) > 15) comments.push('Nhiệt độ chưa đúng sở thích của mình.');
    if (actual.topping !== requested.topping) comments.push('Topping khác yêu cầu, hãy kiểm tra lại phiếu gọi món.');
  }
  if (facts.criteria && facts.criteria.technique < 12) comments.push('Đánh trà đều tay hơn sẽ giúp món mịn và hòa tan tốt hơn.');
  if (!comments.length) comments.push(score >= 85 ? 'Vị trà hài hòa, thao tác gọn gàng và cách trình bày rất dễ thương.' : score >= 65 ? 'Món khá dễ uống. Chăm chút thao tác và kiểm tra khẩu vị sẽ giúp lần sau tốt hơn.' : 'Món cần được kiểm tra lại công thức và thao tác trước khi phục vụ.');
  return { text: `${safe(facts.recipeName) || 'Món trà'}: ${comments.slice(0, 2).join(' ')}`, source: 'local' };
}
/** Called after a completed drink or an explicit request about a case revision. */
export async function requestFeedback(facts: FeedbackFacts, options: { fetcher?: typeof fetch; timeoutMs?: number } = {}): Promise<FeedbackResult> {
  const fallback = localFeedback(facts), controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);
  try {
    const response = await (options.fetcher ?? fetch)('/api/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
      body: JSON.stringify(facts.type==='event'?{type:'event',event:publicEventFacts(facts.event),personality:safe(facts.personality),history:safe(facts.history,200)}:{...facts,recipeName:safe(facts.recipeName),customerName:safe(facts.customerName),personality:safe(facts.personality),history:safe(facts.history,200)}),
    });
    if (!response.ok) return { ...fallback, reason: 'Máy chủ nhận xét chưa sẵn sàng.' };
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') return fallback;
    const result = data as Partial<FeedbackResult>;
    if (typeof result.text !== 'string' || result.text.length < 5 || result.text.length > 500 || !['local', 'ai'].includes(result.source || '')) return fallback;
    return { text: result.text, source: result.source!, reason: typeof result.reason === 'string' ? safe(result.reason, 120) : undefined };
  } catch { return { ...fallback, reason: 'Mất kết nối hoặc hết thời gian chờ; dùng nhận xét cục bộ.' }; }
  finally { clearTimeout(timer); }
}
export function requestEventNarration(event: EventFacts, options: { fetcher?: typeof fetch; timeoutMs?: number } = {}) { return requestFeedback({type:'event',event},options); }
