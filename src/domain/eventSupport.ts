import type { GameState, Staff } from './types';
export function random(state:GameState):number {let x=state.seed>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.seed=x>>>0||1;return state.seed/4294967296;}
export function nextId(state:GameState,prefix:string):string {return `${prefix}:${state.id}:${++state.sequence}`;}
export function log(state:GameState,text:string,kind:GameState['journal'][number]['kind']='info',id?:string):void {state.journal.push({id:id??nextId(state,'log'),day:state.day,at:state.clock,text,kind});if(state.journal.length>450)state.journal.splice(0,state.journal.length-450);state.lastMessage=text;}
export const presentOrders=(s:GameState)=>s.orders.filter(o=>['waiting','making','ready'].includes(o.status)||(o.status==='served'&&!o.seatReleased&&(o.lingerUntil??0)>s.clock));
export function handoffStaff(s:GameState,w:Staff):void {for(const t of s.tasks.filter(t=>t.workerId===w.id&&t.status==='working')){t.status='handed-over';t.claimed=true;const o=s.orders.find(o=>o.id===t.targetId);if(o){o.worker=undefined;if(o.draft)o.draft.worker=undefined;}const b=s.baking.find(b=>b.id===t.targetId);if(b)b.workerId=undefined;}w.taskId=undefined;}
