import type { GameState, GameAction, Formula, IngredientId, Staff, Order, Mode, Task, Recipe, CatInteraction } from './types';
import * as data from './data';
import {consume,stock,formulaIngredients,validFormula} from './inventory';
import {scoreDrink} from './scoring';
import {post,charge,accrue,reportDay} from './finance';
import {canPlace,capacity,comfort} from './decor';
import {random,nextId,log,maybeIncident,beginResolution,completeResolution} from './events';
import {presentOrders,handoffStaff} from './eventSupport';

const clamp=(n:number,lo=0,hi=100)=>Math.max(lo,Math.min(hi,n));
const copy=<T>(a:T):T=>structuredClone(a);
export const activeOrders=(s:GameState)=>s.orders.filter(o=>['waiting','making','ready'].includes(o.status));
export const customersInCafe=presentOrders;
function freshMissions(day:number):GameState['missions'] {return [{id:`serve-${day}`,title:'Phục vụ 3 vị khách',target:3,progress:0,reward:12000,claimed:false,kind:'serve'},{id:`cat-${day}`,title:'Chăm mèo 3 lần có khoảng nghỉ',target:3,progress:0,reward:0,claimed:false,kind:'cat'},{id:`quality-${day}`,title:'Một món đạt từ 85 điểm',target:1,progress:0,reward:8000,claimed:false,kind:'quality'},{id:`photo-${day}`,title:'Một tấm ảnh mèo bình yên',target:1,progress:0,reward:0,claimed:false,kind:'photo'},{id:`bake-${day}`,title:'Lấy một mẻ bánh đúng lúc',target:1,progress:0,reward:5000,claimed:false,kind:'bake'}];}
function mission(s:GameState,kind:GameState['missions'][number]['kind'],n=1):void {for(const m of s.missions)if(m.kind===kind)m.progress=Math.min(m.target,m.progress+n);}
function awardXP(s:GameState,n:number):void {const before=s.level;s.xp+=n;s.level=Math.min(6,1+Math.floor(s.xp/80));if(s.level>before)log(s,`Quán lên cấp ${s.level}! Công thức, mèo và nội thất mới đã mở trong sổ.`);}
export function createGame(options:{mode?:Mode;dayDuration?:number;seed?:number}={}):GameState {
 const seed=(options.seed??574823)>>>0||1,dayDuration=clamp(Math.round(options.dayDuration??660),600,900);
 const initial:Partial<Record<IngredientId,number>>={matcha:100,houjicha:100,sencha:70,genmaicha:35,milk:2200,oat:900,sugar:500,strawberry:300,caramel:300,lemon:250,mango:200,cream:300,cheese:180,ice:1800,pearl:250,jelly:250,redbean:200,flour:700,egg:12,butter:250,cocoa:180,catfood:900};
 const s:GameState={version:3,id:`miu-${seed}`,sequence:0,seed,day:1,phase:'preparation',elapsed:0,clock:0,dayDuration,closingElapsed:0,paused:false,mode:options.mode??'relax',cash:850000,startCash:850000,reserve:0,reputation:55,level:1,xp:0,hygiene:92,inventory:[],orders:[],recipes:copy(data.recipes),menu:['matcha-latte','matcha-strawberry','matcha-salt','houjicha-latte','houjicha-caramel','sencha-lemon'],customers:Object.fromEntries(data.customers.map(c=>[c.id,{visits:0,affinity:30,loyalty:0,story:0}])),cats:copy(data.cats),staff:copy(data.staff),tasks:[],baking:[],cakes:[],deliveries:[],equipment:copy(data.equipment),furniture:[{id:'initial-table-1',kind:'table',x:3,y:5,rotation:0},{id:'initial-table-2',kind:'table',x:7,y:6,rotation:0},{id:'initial-cushion',kind:'cushion',x:12,y:6,rotation:0},{id:'initial-box',kind:'box',x:14,y:8,rotation:0}],storage:[],transactions:[],payables:[],loans:[],reports:[],incidents:[],journal:[],album:[],missions:freshMissions(1),flags:{},tutorial:0,settings:{...data.defaultSettings,dayDuration},weather:'sun',nextCustomerAt:2,nextIncidentAt:130,insured:false,insuranceClaimDay:0,collection:['ly-la-tra'],lastMessage:'Chào mừng đến Miu Matcha. Chuẩn bị kho, chọn menu và mở cửa!',avatar:{hair:0,skin:0,outfit:0}};
 for(const [id,quantity] of Object.entries(initial)){const ingredient=data.ingredientMap[id];s.inventory.push({id:nextId(s,'lot'),ingredient:id as IngredientId,quantity:quantity!,unitCost:ingredient.price,expiresDay:ingredient.shelfLife,quality:88});}
 log(s,'Vốn mở quán 850.000 VND và kho ban đầu đã được cấp. Thuế 5% là luật giả lập trong game.');return s;
}
function useIngredients(s:GameState,requirements:Partial<Record<IngredientId,number>>,id:string,label:string,category='cogs'):number|null {
 if(s.transactions.some(t=>t.id===id))return null;const result=consume(s.inventory,requirements,s.day);if(!result){s.lastMessage='Thiếu nguyên liệu bắt buộc hoặc lô đã hết hạn. Nhập hàng / đổi menu trước khi pha.';return null;}
 s.inventory=result.batches;post(s,{id,category,label,cogs:result.cost,used:result.used,ingredientQuality:result.quality});return result.cost;
}
function addOrder(s:GameState,customerId?:string,recipeId?:string,kind?:Order['kind']):void {
 if(s.phase!=='open'){s.lastMessage='Mở cửa để đón khách.';return;}
 if(activeOrders(s).length>=capacity(s)+3){s.lastMessage='Hàng chờ đang đầy. Hoàn tất đơn trước khi đón thêm khách.';return;}
 let customer=customerId?data.customers.find(c=>c.id===customerId):data.customers[Math.floor(random(s)*data.customers.length)];if(!customer)return;
 if(activeOrders(s).some(o=>o.customerId===customer!.id)){const other=data.customers.filter(c=>!activeOrders(s).some(o=>o.customerId===c.id));if(customerId||!other.length)return;customer=other[Math.floor(random(s)*other.length)];}
 const choices=s.recipes.filter(r=>s.menu.includes(r.id)&&r.level<=s.level&&r.price<=customer!.budget);if(!choices.length){s.lastMessage='Menu chưa có món phù hợp ngân sách khách.';return;}
 const preferredTea=Number(s.flags.trendUntil??0)>=s.day?s.flags.trendTea:customer.tea;const viral=choices.find(r=>r.id===s.flags.viralRecipe&&Number(s.flags.viralUntil??0)>=s.day);const recipe=recipeId?choices.find(r=>r.id===recipeId):viral&&random(s)<.4?viral:choices.filter(r=>r.formula.tea===preferredTea)[Math.floor(random(s)*Math.max(1,choices.filter(r=>r.formula.tea===preferredTea).length))]??choices[Math.floor(random(s)*choices.length)];if(!recipe)return;
 const requested={...recipe.formula};requested.sugar=customer.sweet;requested.temperature=s.weather==='rain'?Math.max(40,customer.temperature):customer.temperature;requested.ice=requested.temperature>35?0:recipe.formula.ice;
 requested.topping=customer.topping;requested.toppingAmount=customer.topping==='none'?0:25;if(customer.avoid.includes('milk'))requested.milk='oat';
 const roll=random(s);const occupied=presentOrders(s).filter(o=>o.kind==='table'||o.kind==='combo').length;const orderKind=kind??(occupied>=capacity(s)?'takeaway':roll<.12?'delivery':roll<.3?'takeaway':roll<.4&&s.cakes.some(c=>c.quantity>0)?'combo':'table');
 const cake=orderKind==='combo'?s.cakes.find(c=>c.quantity>0&&c.expiresDay>=s.day)?.cakeId:undefined;
 const loyalty=(s.customers[customer.id].loyalty>=5?5000:0)+Number(s.flags['coupon:'+customer.id]??0);s.flags['coupon:'+customer.id]=0;
 const price=Math.max(10000,recipe.price-loyalty)+(cake?data.cakes.find(c=>c.id===cake)!.price:0);
 const visitId=presentOrders(s).find(o=>o.customerId===customer.id)?.visitId??nextId(s,'visit');s.orders.push({id:nextId(s,'order'),customerId:customer.id,recipeId:recipe.id,requested,price,createdAt:s.clock,remaining:Math.round(customer.patience*(s.mode==='relax'?1.8:1)),status:'waiting',paid:false,cake,kind:orderKind,refunded:0,visitId});
 log(s,`${customer.name} gọi ${recipe.name}${orderKind==='delivery'?' · giao hàng':orderKind==='takeaway'?' · mang đi':''}.`);
}
function startDrink(s:GameState,orderId:string,formula?:Formula,workerId?:string):boolean {
 const o=s.orders.find(o=>o.id===orderId);if(!o||o.status!=='waiting'||o.worker&&o.worker!==workerId)return false;
 const f=copy(formula??o.requested);if(!validFormula(f)){s.lastMessage='Công thức không hợp lệ.';return false;}
 if(s.equipment.find(e=>e.id==='whisk')?.broken){s.lastMessage='Dụng cụ đánh trà hỏng; sửa trước khi pha.';return false;}
 const cost=useIngredients(s,formulaIngredients(f),`consume:${o.id}`,'Nguyên liệu pha '+s.recipes.find(r=>r.id===o.recipeId)?.name);if(cost===null)return false;
 o.status='making';o.worker=workerId;o.draft={id:nextId(s,'drink'),formula:f,cost,technique:0,steps:[],worker:workerId,ingredientQuality:s.transactions.find(t=>t.id===`consume:${o.id}`)!.ingredientQuality};s.lastMessage='Nguyên liệu đã trừ một lần. Đánh trà, rót / lắc rồi hoàn thành món.';return true;
}
function finishDrink(s:GameState,orderId:string,technique:number):void {
 const o=s.orders.find(o=>o.id===orderId);if(!o||o.status!=='making'||!o.draft)return;
 const whisk=s.equipment.find(e=>e.id==='whisk')!;o.draft.technique=clamp(Math.round(technique)+(whisk.level-1)*3);o.draft.steps.push('completed');o.score=scoreDrink(o.draft.formula,o,data.customers.find(c=>c.id===o.customerId)!,o.draft.technique,o.draft.ingredientQuality??100);o.status='ready';whisk.durability=clamp(whisk.durability-.7);whisk.broken=whisk.durability<=0;s.hygiene=clamp(s.hygiene-.8);s.flags.trash=Number(s.flags.trash??0)+1;s.lastMessage=`Món hoàn thành: ${o.score.total}/100. ${o.score.feedback}`;
}
function serve(s:GameState,orderId:string):boolean {
 const o=s.orders.find(o=>o.id===orderId);if(!o||o.status!=='ready'||o.paid||!o.draft||!o.score)return false;
 const customer=data.customers.find(c=>c.id===o.customerId)!;
 if(customer.avoid.some(id=>(formulaIngredients(o.draft!.formula)[id]??0)>0)){s.lastMessage='Chặn giao món: có thành phần khách yêu cầu tránh. Sửa công thức khi chưa hoàn thành hoặc bỏ và làm lại.';return false;}
 if(o.cake){const cake=s.cakes.find(c=>c.cakeId===o.cake&&c.quantity>0&&c.expiresDay>=s.day);if(!cake){s.lastMessage='Combo đang thiếu bánh. Nướng thêm trước khi giao.';return false;}cake.quantity--;}
 const discount=Math.min(o.price,(o.score.total<50?Math.round(o.price*.2):0)+(o.discount??0)),net=o.price-discount;
 if(!post(s,{id:`sale:${o.id}`,category:'sales',label:'Bán '+s.recipes.find(r=>r.id===o.recipeId)!.name,cash:net,revenue:net,gross:o.price,discount,orderId:o.id}))return false;
 if(o.kind==='delivery'||o.kind==='takeaway')accrue(s,`pack:${o.id}`,o.kind==='delivery'?5000:1500,o.kind==='delivery'?'Bao bì và giao hàng':'Bao bì mang đi','packaging');
 o.paid=true;o.status='served';o.price=net;o.lingerUntil=o.kind==='table'||o.kind==='combo'?s.clock+60:s.clock;o.service=Math.round(clamp(55+o.remaining*.18+s.hygiene*.12+comfort(s)*.08+(s.equipment.find(e=>e.id==='register')!.level-1)*2+(o.serviceAdjustment??0)-(s.flags.wetFloor?5:0)-(s.flags.trashFull?3:0)));const register=s.equipment.find(e=>e.id==='register')!;register.durability=clamp(register.durability-.25);register.broken=register.durability<=0;
 const history=s.customers[o.customerId];if(!o.visitId||!s.orders.some(other=>other.id!==o.id&&other.paid&&other.visitId===o.visitId))history.visits++;history.loyalty=history.loyalty>=5?0:history.loyalty+1;history.affinity=clamp(history.affinity+(o.score.total>=80?5:-3));history.story=Math.min(2,Math.floor(history.visits/3));
 s.reputation=clamp(s.reputation+(o.score.total>=80?1:-2));awardXP(s,10);mission(s,'serve');if(o.score.total>=85)mission(s,'quality');s.lastMessage=`Đã giao cho ${customer.name}, thu ${net.toLocaleString('vi-VN')} VND. ${o.score.feedback}`;return true;
}
function markDiscard(s:GameState,o:Order):void {
 if(!['making','ready'].includes(o.status)||!o.draft)return;
 const tx=s.transactions.find(t=>t.id===`consume:${o.id}`);if(tx){tx.category='waste';tx.label='Bỏ món: '+s.recipes.find(r=>r.id===o.recipeId)?.name;}
 for(const extra of s.transactions.filter(t=>t.orderId===o.id&&t.id.startsWith('adjust:')))extra.category='waste';
 o.status='waiting';o.worker=undefined;o.score=undefined;o.draft=undefined;
 // A fresh production attempt needs a new identity; order identity and one-sale guard remain stable.
 const consumed=s.transactions.find(t=>t.id===`consume:${o.id}`);if(consumed)consumed.id=`discarded:${o.id}:${s.sequence++}`;
 log(s,'Đã bỏ món; nguyên liệu thành hao hụt thật. Phiếu trở lại hàng chờ.');
}
function startBake(s:GameState,cakeId:string,decoration=80,workerId?:string):boolean {
 const recipe=data.cakes.find(c=>c.id===cakeId);if(!recipe||recipe.level>s.level)return false;
 const oven=s.equipment.find(e=>e.id==='oven')!;if(oven.broken){s.lastMessage='Lò hỏng, cần sửa.';return false;}if(s.baking.filter(b=>['oven','ready'].includes(b.status)).length>=oven.level){s.lastMessage='Lò đã đầy, lấy mẻ hiện tại trước.';return false;}
 const id=nextId(s,'bake');const cost=useIngredients(s,recipe.ingredients,`consume:${id}`,'Nguyên liệu '+recipe.name);if(cost===null)return false;
 s.baking.push({id,cakeId,elapsed:0,readyAt:recipe.time,burnAt:recipe.time+12,cost,status:'oven',decoration:clamp(decoration),workerId,ingredientQuality:s.transactions.find(t=>t.id===`consume:${id}`)!.ingredientQuality});s.lastMessage=`${recipe.name} đang nướng. Lấy ra trong giây ${recipe.time}–${recipe.time+12}.`;return true;
}
function takeBake(s:GameState,id:string,decoration?:number):void {const b=s.baking.find(b=>b.id===id);if(!b||b.status==='taken'||b.status==='burned')return;
 const timing=b.elapsed<b.readyAt?clamp(100-(b.readyAt-b.elapsed)*5):clamp(100-Math.max(0,b.elapsed-b.readyAt-5)*6);const quality=Math.round((timing*.65+clamp(decoration??b.decoration)*.35)*(.8+.2*(b.ingredientQuality??100)/100));b.status='taken';s.flags.trash=Number(s.flags.trash??0)+2;
 s.cakes.push({id:nextId(s,'cake'),cakeId:b.cakeId,quantity:4,quality,cost:b.cost,expiresDay:s.day+1});mission(s,'bake');awardXP(s,5);const oven=s.equipment.find(e=>e.id==='oven')!;oven.durability=clamp(oven.durability-1);s.lastMessage=`Mẻ ${data.cakes.find(c=>c.id===b.cakeId)!.name}: 4 phần, chất lượng ${quality}/100.`;
}
function staffTask(s:GameState,w:Staff,type:Task['type'],targetId?:string):boolean {
 if(!w.hired||w.former||!w.onShift||w.taskId||w.energy<10)return false;
 if(type==='drink'&&!['barista','manager'].includes(w.role)||type==='bake'&&!['baker','manager'].includes(w.role)||type==='serve'&&!['cashier','manager'].includes(w.role)||type==='cat'&&!['carer','manager'].includes(w.role)){s.lastMessage='Vai trò chưa phù hợp tác vụ. Điều chuyển hoặc đào tạo trước.';return false;}
 if(type==='serve'&&!w.sensitiveAllowed){s.lastMessage='Nhân viên đang tạm ngừng tác vụ nhạy cảm.';return false;}
 const taskId=nextId(s,'task');let duration=20;
 if(type==='drink'){const order=s.orders.find(o=>o.id===targetId);if(!order||order.worker||order.status!=='waiting'||!startDrink(s,order.id,undefined,w.id))return false;duration=s.recipes.find(r=>r.id===order.recipeId)!.time*(1-(s.equipment.find(e=>e.id==='whisk')!.level-1)*.08);}
 if(type==='serve'){const order=s.orders.find(o=>o.id===targetId);if(!order||order.status!=='ready'||s.tasks.some(t=>t.status==='working'&&t.type==='serve'&&t.targetId===targetId))return false;duration=8;}
 if(type==='bake'){const recipe=targetId??'cookie';if(!startBake(s,recipe,Math.round(w.skill),w.id))return false;targetId=s.baking.at(-1)!.id;duration=s.baking.at(-1)!.readyAt+3;}
 if(type==='cat'){if(!s.cats.some(c=>c.id===targetId&&c.unlocked))return false;const food=consume(s.inventory,{catfood:15},s.day);if(!food){s.lastMessage='Nhân viên cần 15g thức ăn mèo cho tác vụ chăm sóc.';return false;}s.inventory=food.batches;post(s,{id:`food:${taskId}`,category:'cats',label:'Thức ăn tác vụ chăm mèo',expense:food.cost,used:food.used});duration=18;}
 const coordinated=Number(s.flags.cooperationUntil??0)>=s.day||Number(s.flags.processUntil??0)>=s.day;duration=Math.max(3,Math.round(duration/w.speed*(coordinated?.95:1)));if(type==='bake')duration=s.baking.find(b=>b.id===targetId)!.readyAt+3;
 s.tasks.push({id:taskId,type,workerId:w.id,targetId,remaining:duration,duration,status:'working',claimed:false});w.taskId=taskId;s.lastMessage=`${w.name} đang làm tác vụ (${duration} giây).`;return true;
}
function finishTask(s:GameState,t:Task):void {
 if(t.claimed||t.status!=='working')return;t.claimed=true;t.status='done';const w=s.staff.find(w=>w.id===t.workerId);if(!w||w.former||!w.hired){t.status='handed-over';return;}
 if(t.type==='drink'&&t.targetId)finishDrink(s,t.targetId,Math.round(w.skill*(.66+w.energy*.003+w.traits.motivation*.0005)));
 if(t.type==='serve'&&t.targetId)serve(s,t.targetId);
 if(t.type==='bake'&&t.targetId)takeBake(s,t.targetId,w.skill);
 if(t.type==='clean'){s.hygiene=clamp(s.hygiene+18);mission(s,'clean');}
 if(t.type==='cat'&&t.targetId){const cat=s.cats.find(c=>c.id===t.targetId)!;cat.hunger=clamp(cat.hunger+8);cat.cleanliness=clamp(cat.cleanliness+8);cat.joy=clamp(cat.joy+5);}
 if(t.type==='inspect'){const i=s.incidents.find(i=>i.stage!=='resolved');if(i){const ev=i.evidence.find(e=>!e.checked);if(ev)ev.checked=true;}}
 w.taskId=undefined;w.experience++;w.energy=clamp(w.energy-3);if(w.experience%5===0)w.skill=clamp(w.skill+1);t.result='Đã hoàn thành một lần.';
}
function fireStaff(s:GameState,w:Staff,reason:string,confirm:boolean):void {
 if(!confirm||!w.hired||w.former)return;
 const salary=w.salaryPaidDay===s.day?0:Math.max(w.secondsWorked?1:0,Math.round(w.salary*Math.min(1,w.secondsWorked/s.dayDuration)));
 const compensation=w.warnings>=2?0:Math.round(w.salary*.25);
 accrue(s,`salary-fire:${w.id}:${s.day}`,salary+compensation,`Quyết toán ${w.name} (${reason.slice(0,80)})`,'salary');w.salaryPaidDay=s.day;
 handoffStaff(s,w);
 w.taskId=undefined;w.hired=false;w.former=true;w.onShift=false;w.history.push(`Ngày ${s.day}: kết thúc hợp đồng — ${reason.slice(0,80)}; lương ${salary}, hỗ trợ ${compensation}.`);log(s,`${w.name} đã nghỉ. Món đang pha / bánh vẫn còn để người chơi tiếp quản. Lương và hỗ trợ được ghi một lần.`,'staff');
}
function catInteract(s:GameState,id:string,interaction:CatInteraction):void {
 const c=s.cats.find(c=>c.id===id&&c.unlocked);if(!c)return;
 if(interaction==='rest'){const respected=c.restingUntil<=s.clock&&c.cooldownUntil>s.clock;c.restingUntil=s.clock+45;c.expression='lim dim nghỉ ngơi';c.trust=clamp(c.trust+(respected?1:0));c.cooldownUntil=s.clock+30;return;}
 if(c.cooldownUntil>s.clock||c.restingUntil>s.clock){c.expression='quay đầu, cần nghỉ';s.lastMessage=`${c.name} muốn nghỉ. Chờ ${Math.ceil(Math.max(c.cooldownUntil,c.restingUntil)-s.clock)} giây để tôn trọng bé.`;return;}
 if(interaction==='lap'&&c.trust<60){s.lastMessage='Bé cần thân thiết từ 60 trước khi ngồi lên đùi.';c.expression='giãy nhẹ';return;}
 if(interaction==='vet'){if(!charge(s,nextId(s,'vet'),25000,'Khám thú y giả lập','cats'))return;c.health=100;c.energy=95;c.restingUntil=s.clock+60;c.expression='nghỉ sau kiểm tra';}
 else if(interaction==='treat'){const used=consume(s.inventory,{catfood:20},s.day);if(!used){s.lastMessage='Cần 20g thức ăn mèo phù hợp.';return;}s.inventory=used.batches;post(s,{id:nextId(s,'catfood'),label:'Thức ăn mèo',category:'cats',expense:used.cost});c.hunger=clamp(c.hunger+25);c.joy=clamp(c.joy+5);c.expression='ăn ngon, rừ rừ';}
 else if(interaction==='photo'){const photo={id:nextId(s,'photo'),catId:c.id,day:s.day,caption:`${c.name} · ${c.activity}`,pose:c.activity};s.album.push(photo);mission(s,'photo');c.expression='ngước nhìn máy ảnh';}
 else if(interaction==='brush'){c.cleanliness=clamp(c.cleanliness+15);c.joy=clamp(c.joy+3);c.expression='liếm chân, lông mượt';}
 else if(interaction==='paw'){c.expression='rụt chân';c.joy=clamp(c.joy-2);c.trust=clamp(c.trust-1);}
 else {const favorite=c.spot===interaction;const houji=c.id==='houji';c.joy=clamp(c.joy+(favorite?7:3));c.trust=clamp(c.trust+(favorite?3:1));c.expression=interaction==='call'?'chạy lại':interaction==='sniff'?'ngửi tay':interaction==='lap'?'cuộn mình trên đùi':favorite?'dụi đầu, rừ rừ':houji?'lim dim, ngáp':'lăn người, mắt vui';c.energy=clamp(c.energy-2);}
 c.interactions++;c.cooldownUntil=s.clock+(c.id==='houji'?18:c.id==='matcha'?10:12);if(c.interactions%5===0){c.restingUntil=s.clock+40;c.expression+=' · muốn nghỉ một chút';}mission(s,'cat');log(s,`${c.name}: ${c.expression}.`,'cat');
}
function settle(s:GameState):void {
 if(s.reports.some(r=>r.day===s.day)){s.phase='after';return;}
 for(const o of activeOrders(s)){if(o.draft){const tx=s.transactions.find(t=>t.id===`consume:${o.id}`);if(tx){tx.category='waste';tx.label='Món chưa giao khi đóng cửa';}}o.status='left';log(s,'Một khách rời khi quán đóng.','info',`left:${o.id}`);}
 for(const t of s.tasks.filter(t=>t.status==='working')){t.status='handed-over';t.claimed=true;const w=s.staff.find(w=>w.id===t.workerId);if(w)w.taskId=undefined;const b=s.baking.find(b=>b.id===t.targetId);if(b)b.workerId=undefined;}for(const o of s.orders){o.worker=undefined;if(o.draft)o.draft.worker=undefined;}
 const factor=s.mode==='relax'?.65:1;
 accrue(s,`rent:${s.day}`,Math.round(35000*factor),'Tiền thuê ngày','rent');accrue(s,`utilities:${s.day}`,Math.round((12000+s.baking.filter(b=>b.status!=='oven').length*1500)*factor),'Điện nước ngày','utilities');
 accrue(s,`cleaning:${s.day}`,Math.round(4500*factor),'Vệ sinh và vật tư','cleaning');
 for(const w of s.staff.filter(w=>w.hired&&!w.former&&w.salaryPaidDay!==s.day)){if(w.secondsWorked>0){accrue(s,`salary:${w.id}:${s.day}`,Math.round(w.salary*Math.max(.2,Math.min(1,w.secondsWorked/s.dayDuration))),`Lương ${w.name}`,'salary');w.salaryPaidDay=s.day;}}
 for(const loan of s.loans.filter(l=>l.remaining>0&&l.nextDay<=s.day)){const interest=Math.round(loan.remaining*loan.rate);accrue(s,`interest:${loan.id}:${s.day}`,interest,'Lãi vay giả lập','interest');const principal=Math.min(Math.max(0,loan.remaining-(loan.arrears??0)),loan.installment);if(principal>0){const id=`installment:${loan.id}:${s.day}`;if(s.cash>=principal){post(s,{id,category:'loan-principal',label:'Trả gốc vay theo lịch',cash:-principal,debt:-principal,loanId:loan.id});loan.remaining-=principal;}else {post(s,{id,category:'loan-principal-due',label:'Gốc vay đến hạn, chưa thanh toán',loanId:loan.id});s.payables.push({id,label:'Gốc vay đến hạn',amount:principal,dueDay:s.day,category:'loan-principal',paid:false,extended:false,loanId:loan.id});loan.arrears=(loan.arrears??0)+principal;log(s,'Gốc vay đến hạn đã vào khoản phải trả, không tính thành chi phí lợi nhuận.','finance');}}loan.nextDay=s.day+2;}
 const net=s.transactions.filter(t=>t.day===s.day).reduce((a,b)=>a+b.revenue,0);accrue(s,`tax:${s.day}`,Math.max(0,Math.round(net*s.settings.taxRate)),'Thuế doanh thu giả lập','tax',s.day+1);
 s.phase='after';s.paused=false;s.reports.push(reportDay(s));log(s,`Đóng ngày ${s.day}: báo cáo đối soát từ giao dịch thật. Có thể trang trí rồi sang ngày mới.`);
 if(s.cash<20000&&!s.flags.recovery){s.flags.recovery=true;log(s,'Cảnh báo thiếu tiền: dùng quỹ dự phòng, vay, bán thiết bị hoặc gia hạn hóa đơn. Chế độ thư giãn có quà phục hồi ở nhiệm vụ.');if(s.mode==='relax')s.missions.push({id:`recovery-${s.day}`,title:'Quỹ cộng đồng phục hồi (một lần)',target:1,progress:1,reward:70000,claimed:false,kind:'clean'});}
 const shortage=s.cash+s.reserve<20000&&s.payables.some(p=>!p.paid&&p.dueDay<=s.day);s.flags.warningStreak=shortage?Number(s.flags.warningStreak??0)+1:0;if(shortage)log(s,`Cảnh báo phục hồi ${s.flags.warningStreak}/3: hóa đơn đến hạn và quỹ thấp. Có thể gia hạn, vay, bán thiết bị hoặc thay ca.`,'finance');if(s.mode==='business'&&Number(s.flags.warningStreak)>=3){s.flags.businessFailed=true;s.paused=true;log(s,'Quán tạm ngừng mở ngày mới sau 3 ngày cảnh báo. Báo cáo vẫn xem được; tạo đủ quỹ phục hồi hoặc bắt đầu lại.','finance');}
}
function tick(s:GameState):void {
 s.clock++;
 if(s.phase==='open'){s.elapsed++;if(s.clock>=s.nextCustomerAt){addOrder(s);const boost=Number(s.flags.publicityUntil??0)>=s.day||Number(s.flags.festivalUntil??0)>=s.day;const adverse=(Number(s.flags.competitorUntil??0)>=s.day?1.2:1)*(Number(s.flags.constructionUntil??0)>=s.day?1.35:1);const interval=s.mode==='relax'?42:30;s.nextCustomerAt=s.clock+Math.round(interval*(boost?.75:1)*adverse);}if(s.elapsed>=s.dayDuration){s.phase='closing';s.closingElapsed=0;log(s,'Sắp đóng cửa: hoàn tất đơn còn lại trong 30 giây.');}}
 if(s.phase==='closing'){s.closingElapsed++;if(s.closingElapsed>=30||!activeOrders(s).length)settle(s);}
 if(s.phase==='open'||s.phase==='closing')for(const o of activeOrders(s)){o.remaining--;if(o.remaining<=0){o.status='left';const tx=s.transactions.find(t=>t.id===`consume:${o.id}`);if(tx){tx.category='waste';tx.label='Món khách đã rời';}log(s,`${data.customers.find(c=>c.id===o.customerId)!.name} rời hàng chờ.`,'info',`left:${o.id}`);s.reputation=clamp(s.reputation-1);}}
 for(const d of s.deliveries.filter(d=>d.status==='travel')){d.remaining--;if(d.remaining<=0){const ingredient=data.ingredientMap[d.ingredient];const id=nextId(s,'lot');const cold=['milk','oat','cream','cheese'].includes(d.ingredient)?Math.max(0,s.equipment.find(e=>e.id==='fridge')!.level-1):0;s.inventory.push({id,ingredient:d.ingredient,quantity:d.quantity,unitCost:d.unitCost,expiresDay:s.day+ingredient.shelfLife+cold,quality:d.quality});d.status='arrived';d.batchId=id;log(s,`${data.suppliers.find(p=>p.id===d.supplierId)!.name} đã giao ${d.quantity}${ingredient.unit} ${ingredient.name}.`);}}
 for(const b of s.baking.filter(b=>b.status==='oven'||b.status==='ready')){b.elapsed++;if(b.elapsed>=b.readyAt)b.status='ready';if(b.elapsed>b.burnAt){b.status='burned';const tx=s.transactions.find(t=>t.id===`consume:${b.id}`);if(tx){tx.category='waste';tx.label='Bánh cháy';}log(s,'Một mẻ bánh cháy; giá vốn được chuyển sang hao hụt một lần.');}}
 for(const w of s.staff.filter(w=>w.hired&&!w.former)){if(w.onShift&&(s.phase==='open'||s.phase==='closing')){w.secondsWorked++;w.energy=clamp(w.energy-.018);}else w.energy=clamp(w.energy+.06);}
 for(const t of s.tasks.filter(t=>t.status==='working')){const worker=s.staff.find(w=>w.id===t.workerId);if(!worker||!worker.hired||worker.former||!worker.onShift)continue;t.remaining--;if(t.remaining<=0)finishTask(s,t);}
 if(s.phase==='open')for(const w of s.staff.filter(w=>w.hired&&!w.former&&w.onShift&&!w.taskId&&w.energy>15)){
  if(w.role==='barista'||w.role==='manager'){const order=activeOrders(s).find(o=>o.status==='waiting'&&!o.worker);if(order){staffTask(s,w,'drink',order.id);continue;}}
  if(w.role==='cashier'||w.role==='manager'){const order=activeOrders(s).find(o=>o.status==='ready'&&!s.tasks.some(t=>t.type==='serve'&&t.targetId===o.id&&t.status==='working'));if(order){staffTask(s,w,'serve',order.id);continue;}}
  if(w.role==='baker'&&s.cakes.reduce((n,c)=>n+c.quantity,0)<4)staffTask(s,w,'bake','cookie');
  if(w.role==='carer'){const cat=s.cats.filter(c=>c.unlocked).sort((a,b)=>a.hunger-b.hunger)[0];if(cat.hunger<70)staffTask(s,w,'cat',cat.id);else if(s.hygiene<70)staffTask(s,w,'clean');}
 }
 if(s.phase==='open'||s.phase==='preparation')for(const c of s.cats.filter(c=>c.unlocked)){c.hunger=clamp(c.hunger-.012);c.cleanliness=clamp(c.cleanliness-.006);c.joy=clamp(c.joy-.006);if(c.restingUntil>s.clock||c.activity==='ngủ cửa sổ')c.energy=clamp(c.energy+.1);else c.energy=clamp(c.energy-.009);if(c.hunger<20)c.health=clamp(c.health-.015);if(s.clock%22===0&&!s.flags['escaped:'+c.id])c.activity=['ngủ cửa sổ','ngồi đệm','chui hộp','chạm chuông','tha khăn','liếm chân','chơi cùng mèo'][Math.floor(random(s)*7)];}
 if(s.phase==='open'&&s.clock%45===0)s.hygiene=clamp(s.hygiene-1);
 for(const i of s.incidents.filter(i=>i.resolving)){i.resolving!.remaining--;if(i.resolving!.remaining<=0)completeResolution(s,i);}
 maybeIncident(s);
}

/** Only this reducer changes simulation state; Phaser and React render the same snapshots. */
export function reduceGame(previous:GameState,action:GameAction):GameState {
 const s=copy(previous);
 switch(action.type){
 case 'STEP': {if(s.paused)return previous;const n=clamp(Math.round(action.seconds??1),1,60);for(let i=0;i<n;i++)tick(s);break;}
 case 'PAUSE':s.paused=action.paused??!s.paused;s.lastMessage=s.paused?'Quán đã tạm dừng.':'Tiếp tục mô phỏng.';break;
 case 'OPEN':if(s.phase==='preparation'&&s.menu.some(id=>s.recipes.some(r=>r.id===id&&r.level<=s.level))){s.phase='open';s.paused=false;s.nextCustomerAt=s.clock+2;log(s,'Miu đã mở cửa! Hãy đọc phiếu, pha rồi giao món.');}break;
 case 'CLOSE':if(s.phase==='open'){s.phase='closing';s.closingElapsed=0;s.lastMessage='Đang đóng cửa. Hoàn tất các đơn hoặc đóng sổ ngay.';if(!activeOrders(s).length)settle(s);}else if(s.phase==='closing')settle(s);break;
 case 'NEXT_DAY':if(s.flags.businessFailed){s.lastMessage='Quán cần kế hoạch phục hồi sau 3 cảnh báo: tạo quỹ tối thiểu 50.000 hoặc bắt đầu lại.';break;}if(s.phase==='after'){
  s.day++;s.phase='preparation';s.elapsed=0;s.closingElapsed=0;s.startCash=s.cash;s.dayDuration=s.settings.dayDuration;s.nextCustomerAt=s.clock+2;s.nextIncidentAt=s.clock+120;s.weather=['sun','rain','cool'][Math.floor(random(s)*3)] as GameState['weather'];s.missions=freshMissions(s.day);
  for(const c of s.cats){c.interactions=0;c.gamesToday=0;c.restingUntil=0;c.cooldownUntil=s.clock;}
  for(const w of s.staff){w.secondsWorked=0;if(w.hired&&!w.former&&w.noticeDay!==undefined&&w.noticeDay<=s.day){fireStaff(s,w,'Nghỉ sau thời hạn thông báo đã trao đổi',true);}w.energy=clamp(w.energy+35);}
  for(const b of s.inventory.filter(b=>b.expiresDay<s.day)){post(s,{id:`expire:${b.id}`,label:'Lô hết hạn: '+data.ingredientMap[b.ingredient].name,category:'waste',cogs:b.quantity*b.unitCost,ingredient:b.ingredient,quantity:b.quantity});}
  s.inventory=s.inventory.filter(b=>b.expiresDay>=s.day);s.cakes=s.cakes.filter(c=>c.expiresDay>=s.day);for(const e of s.equipment){e.durability=clamp(e.durability-1.5);e.broken=e.durability<=0;}
  log(s,`Ngày ${s.day}: ${s.weather==='rain'?'mưa nhẹ, khách thích món ấm':s.weather==='cool'?'trời dịu mát':'nắng ấm, món lạnh được ưa thích'}. Kho hết hạn đã ghi hao hụt.`);
 }break;
 case 'ORDER':addOrder(s,action.customerId,action.recipeId,action.kind);break;
 case 'START_DRINK':startDrink(s,action.orderId,action.formula);break;
 case 'ADJUST_DRINK':{const o=s.orders.find(o=>o.id===action.orderId);if(!o||o.status!=='making'||!o.draft||o.worker)break;const f={...o.draft.formula,...action.patch};if(!validFormula(f))break;const before=formulaIngredients(o.draft.formula),after=formulaIngredients(f),extra:Partial<Record<IngredientId,number>>={};if(Object.entries(before).some(([id,qty])=>(after[id as IngredientId]??0)<(qty??0))){s.lastMessage='Không thể lấy lại hoặc đổi loại nguyên liệu đã rót. Có thể thêm, đổi nhiệt độ / hòa tan / trình bày, hoặc bỏ món để pha lại.';break;}for(const [id,qty] of Object.entries(after)){const n=(qty??0)-(before[id as IngredientId]??0);if(n>0)extra[id as IngredientId]=n;}const id=nextId(s,'adjust');const cost=useIngredients(s,extra,id,'Sửa món bổ sung');if(cost!==null){const oldCost=o.draft.cost;o.draft.formula=f;o.draft.cost+=cost;const tx=s.transactions.find(t=>t.id===id);if(tx){tx.orderId=o.id;if(cost>0)o.draft.ingredientQuality=Math.round(((o.draft.ingredientQuality??100)*oldCost+(tx.ingredientQuality??100)*cost)/(oldCost+cost));}s.lastMessage='Đã sửa món; chỉ phần nguyên liệu bổ sung bị trừ. Phần đã dùng không trở về kho.';}break;}
 case 'FINISH_DRINK':{const scores=Object.values(action.scores??{}).filter(n=>Number.isFinite(n));const technical=action.technique??(scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:70);if(Number.isFinite(technical)){const o=s.orders.find(o=>o.id===action.orderId);if(o&&!o.worker)finishDrink(s,action.orderId,technical);}break;}
 case 'SERVE':serve(s,action.orderId);break;
 case 'DISCARD':{const o=s.orders.find(o=>o.id===action.orderId);if(o&&!o.worker)markDiscard(s,o);break;}
 case 'REFUND':{const o=s.orders.find(o=>o.id===action.orderId);if(!['open','closing'].includes(s.phase)||!o||!o.paid||!Number.isSafeInteger(action.amount)||action.amount<=0||action.amount>o.price-o.refunded||s.cash<action.amount)break;const id=`refund:${o.id}:${o.refunded}`;if(post(s,{id,label:'Hoàn tiền món đã bán',category:'refund',cash:-action.amount,revenue:-action.amount,orderId:o.id}))o.refunded+=action.amount;break;}
 case 'BUY_INGREDIENT':{const ingredient=data.ingredientMap[action.ingredient],supplier=data.suppliers.find(p=>p.id===action.supplierId);if(!ingredient||!supplier||!Number.isInteger(action.quantity)||action.quantity<=0||action.quantity>10000)break;const market=(action.ingredient==='milk'&&Number(s.flags.marketStart??0)<=s.day&&Number(s.flags.marketUntil??0)>=s.day)?1.1:1;const backup=s.flags.backupSupplier&&supplier.id==='budget'?.95:1;const unitCost=Math.round(ingredient.price*supplier.multiplier*market*backup);const id=nextId(s,'delivery');if(!charge(s,`purchase:${id}`,unitCost*action.quantity,'Nhập '+ingredient.name,'inventory',false))break;const delay=supplier.delay+(Number(s.flags.constructionUntil??0)>=s.day?20:0);s.deliveries.push({id,ingredient:action.ingredient,quantity:action.quantity,unitCost,quality:supplier.quality,remaining:delay,supplierId:supplier.id,status:'travel',expectedQuantity:action.quantity});log(s,`Đã đặt ${action.quantity}${ingredient.unit} ${ingredient.name}; giao sau ${delay} giây. Tiền mua kho chưa tính vào lợi nhuận.`,'finance');break;}
 case 'RETURN_DELIVERY':{const d=s.deliveries.find(d=>d.id===action.deliveryId);if(!d||!['arrived','quarantined'].includes(d.status))break;const b=s.inventory.find(b=>b.id===d.batchId);if(!b)break;post(s,{id:`return:${d.id}`,label:'Trả phần hàng còn lại',category:'inventory-return',cash:b.quantity*b.unitCost});s.inventory=s.inventory.filter(i=>i.id!==b.id);d.status='returned';break;}
 case 'BAKE':startBake(s,action.cakeId,action.decoration);break;
 case 'TAKE_BAKE':takeBake(s,action.bakingId,action.decoration);break;
 case 'CAT_INTERACT':catInteract(s,action.catId,action.interaction);break;
 case 'CAT_GAME':{const c=s.cats.find(c=>c.id===action.catId&&c.unlocked);if(!c||c.cooldownUntil>s.clock||c.restingUntil>s.clock||c.gamesToday>=3||!Number.isFinite(action.score)){s.lastMessage='Bé cần nghỉ hoặc đã đủ 3 lượt chơi hôm nay.';break;}const score=clamp(Math.round(action.score)),favorite=c.favorite===action.game;c.gamesToday++;c.joy=clamp(c.joy+Math.round(score*.12));c.trust=clamp(c.trust+Math.round(score*.045)+(favorite?2:0));c.energy=clamp(c.energy-8);c.cooldownUntil=s.clock+30;c.activity=action.game==='feather'?'rình và vồ đồ chơi':action.game==='ball'?'lăn bóng qua hộp':action.game==='train'?'chạm tay':action.game==='boxes'?'chui hộp':'chạy tìm đồ chơi';c.expression=score>=70?'mắt sáng, bắt được đồ chơi':'ngáp, thử lại sau';if(action.game==='photo'){s.album.push({id:nextId(s,'photo'),catId:c.id,day:s.day,caption:'Nhiệm vụ ảnh · '+score+' điểm',pose:c.activity});mission(s,'photo');}if(score>=80&&!s.collection.includes('ly-meo-'+c.id))s.collection.push('ly-meo-'+c.id);mission(s,'cat');log(s,`${c.name} chơi ${score} điểm; thưởng thân thiết và album, không sinh tiền.`,'cat');break;}
 case 'ADOPT':{const c=s.cats.find(c=>c.id===action.catId);const needed={sesame:2,chestnut:3,snow:4}[action.catId as 'sesame'|'chestnut'|'snow'];if(!c||c.unlocked||!needed||s.level<needed)break;if(charge(s,`adopt:${c.id}`,35000,'Chuẩn bị góc nhận nuôi '+c.name,'cats')){c.unlocked=true;log(s,`${c.name} đã đến Miu. Cho bé thời gian làm quen.`,'cat');}break;}
 case 'HIRE':{const w=s.staff.find(w=>w.id===action.staffId);if(!w||w.hired||w.former)break;if(charge(s,`hire:${w.id}`,15000,'Tuyển và hướng dẫn '+w.name,'training')){w.hired=true;w.onShift=true;w.hireDay=s.day;w.history.push(`Ngày ${s.day}: bắt đầu hợp đồng giả lập.`);log(s,`${w.name} vào ca ${data.roleNames[w.role]}; nhận tác vụ thật và có lương cuối ngày.`,'staff');}break;}
 case 'ASSIGN':{const w=s.staff.find(w=>w.id===action.staffId);if(w)staffTask(s,w,action.task,action.targetId);break;}
 case 'FIRE':{const w=s.staff.find(w=>w.id===action.staffId);if(w)fireStaff(s,w,action.reason,action.confirm);break;}
 case 'STAFF_ACTION':{const w=s.staff.find(w=>w.id===action.staffId&&w.hired&&!w.former);if(!w)break;const id=nextId(s,'staff-action');
  if(action.action==='shift')w.onShift=!w.onShift;
  if(action.action==='rest'){w.onShift=false;w.satisfaction=clamp(w.satisfaction+4);}
  if(action.action==='train'&&charge(s,id,18000,'Đào tạo '+w.name,'training')){w.skill=clamp(w.skill+5);w.trained++;w.satisfaction=clamp(w.satisfaction+5);}
  if(action.action==='bonus'&&charge(s,id,10000,'Thưởng '+w.name+' theo công việc','bonus')){w.satisfaction=clamp(w.satisfaction+10);}
  if(action.action==='meal'&&charge(s,id,8000,'Bữa ăn ca '+w.name,'staff-meal')){w.energy=clamp(w.energy+20);w.satisfaction=clamp(w.satisfaction+6);}
  if(action.action==='warn'){w.warnings++;w.history.push('Cảnh cáo do người quản lý; cần hồ sơ trước khi kết luận.');w.satisfaction=clamp(w.satisfaction-5);}
  if(action.action==='restrict')w.sensitiveAllowed=!w.sensitiveAllowed;
  if(action.action==='transfer'&&action.role&&!w.taskId){w.role=action.role;w.history.push('Điều chuyển sang '+data.roleNames[w.role]);}
  if(action.action==='promote'&&w.experience>=5){w.skill=clamp(w.skill+3);w.salary=Math.round(w.salary*1.1);w.satisfaction=clamp(w.satisfaction+10);w.history.push('Thăng cấp sau ít nhất 5 tác vụ thật.');}
  if(action.action==='raise'){w.salary+=5000;w.satisfaction=clamp(w.satisfaction+5);}
  s.lastMessage=`Đã cập nhật hồ sơ ${w.name}.`;break;}
 case 'BUY_FURNITURE':{const def=data.furniture.find(f=>f.id===action.kind);if(!def||def.level>s.level)break;const id=nextId(s,'furniture');if(charge(s,`buy:${id}`,def.cost,'Mua '+def.name,'investment',false)){const tx=s.transactions.find(t=>t.id===`buy:${id}`)!;tx.investment=def.cost;s.storage.push({id,kind:def.id});log(s,`${def.name} ở kho nội thất; chọn ô để đặt.`);}break;}
 case 'PLACE_FURNITURE':{const item=s.storage.find(f=>f.id===action.furnitureId)??s.furniture.find(f=>f.id===action.furnitureId);if(!item)break;const result=canPlace(s,item.kind,action.x,action.y,action.rotation,item.id);if(!result.valid){s.lastMessage=result.reason;break;}s.furniture=s.furniture.filter(f=>f.id!==item.id);s.furniture.push({id:item.id,kind:item.kind,x:action.x,y:action.y,rotation:action.rotation});s.storage=s.storage.filter(f=>f.id!==item.id);s.lastMessage='Đã đặt nội thất, sức chứa và không gian được cập nhật.';break;}
 case 'STORE_FURNITURE':{const item=s.furniture.find(f=>f.id===action.furnitureId);if(item){s.storage.push({id:item.id,kind:item.kind});s.furniture=s.furniture.filter(f=>f.id!==item.id);}break;}
 case 'UPGRADE':{const e=s.equipment.find(e=>e.id===action.equipmentId);if(!e||e.level>=4)break;const amount=Math.round(e.baseCost*(1+e.level*.35)),id=nextId(s,'upgrade');if(charge(s,id,amount,'Nâng cấp '+e.name,'investment',false)){s.transactions.find(t=>t.id===id)!.investment=amount;e.level++;e.durability=100;e.broken=false;log(s,`${e.name} lên cấp ${e.level}.`);}break;}
 case 'REPAIR':{const e=s.equipment.find(e=>e.id===action.equipmentId);if(!e||e.level<=0)break;if(charge(s,nextId(s,'repair'),Math.max(5000,Math.round((100-e.durability)*220)),'Bảo trì '+e.name,'maintenance')){e.durability=100;e.broken=false;}break;}
 case 'SELL_EQUIPMENT':{const e=s.equipment.find(e=>e.id===action.equipmentId);if(!e||e.level<=0||s.tasks.some(t=>t.status==='working'&&((e.id==='oven'&&t.type==='bake')||(e.id==='whisk'&&t.type==='drink'))))break;const proceeds=Math.round(e.baseCost*.4*e.level);post(s,{id:nextId(s,'sell-equipment'),label:'Bán lại '+e.name,category:'investment-sale',cash:proceeds,investment:-proceeds});e.level=0;e.broken=true;break;}
 case 'CLEAN':{if(charge(s,nextId(s,'clean'),3000,'Lau sàn và thay biển an toàn','cleaning')){s.hygiene=clamp(s.hygiene+18);s.flags.floorSafe=true;s.flags.wetFloor=false;s.flags.trash=0;s.flags.trashFull=false;mission(s,'clean');s.lastMessage='Đã dọn lối đi, đặt biển và giữ khu mèo tách biệt.';}break;}
 case 'INVESTIGATE':{const i=s.incidents.find(i=>i.id===action.incidentId&&i.stage!=='resolved');const e=i?.evidence.find(e=>e.id===action.evidenceId);if(i&&e&&!e.checked){e.checked=true;i.stage='investigating';log(s,`${e.label}: ${e.fact}`,'event');}break;}
 case 'RESOLVE':beginResolution(s,action.incidentId,action.choiceId);break;
 case 'SAVE_RECIPE':{const r=copy(action.recipe);if(!validFormula(r.formula)||typeof r.name!=='string'||!r.name.trim()||!Number.isSafeInteger(r.price)||r.price<10000||r.price>100000||s.recipes.length>=40)break;r.id=s.recipes.some(a=>a.id===r.id&&a.custom)?r.id:nextId(s,'recipe');r.name=r.name.trim().slice(0,48);r.level=1;r.time=22;r.custom=true;const old=s.recipes.findIndex(a=>a.id===r.id);if(old>=0)s.recipes[old]=r;else s.recipes.push(r);s.lastMessage='Công thức riêng đã lưu. Đưa vào menu khi muốn bán.';break;}
 case 'PRICE':{const r=s.recipes.find(r=>r.id===action.recipeId);if(r&&Number.isSafeInteger(action.price)&&action.price>=10000&&action.price<=100000)r.price=action.price;break;}
 case 'MENU':{const r=s.recipes.find(r=>r.id===action.recipeId);if(r&&r.level<=s.level)s.menu=action.enabled?[...new Set([...s.menu,r.id])]:s.menu.filter(id=>id!==r.id);break;}
 case 'SETTINGS':{const p=action.patch;s.settings={...s.settings,...p,music:clamp(p.music??s.settings.music,0,1),effects:clamp(p.effects??s.settings.effects,0,1),dayDuration:clamp(Math.round(p.dayDuration??s.settings.dayDuration),600,900),taxRate:clamp(p.taxRate??s.settings.taxRate,0,.15)};break;}
 case 'CLAIM_MISSION':{const m=s.missions.find(m=>m.id===action.missionId);if(!m||m.claimed||m.progress<m.target)break;m.claimed=true;if(m.reward)post(s,{id:`mission:${m.id}`,label:'Thưởng nhiệm vụ '+m.title,category:'community-capital',cash:m.reward,debt:m.reward});else {s.collection.push('huy-hieu-'+m.id);awardXP(s,8);}s.lastMessage='Đã nhận phần thưởng một lần.';break;}
 case 'LOAN':{if(!Number.isSafeInteger(action.amount)||action.amount<50000||action.amount>300000||s.loans.filter(l=>l.remaining>0).length>=2)break;const id=nextId(s,'loan');post(s,{id,label:'Khoản vay giả lập (gốc không phải doanh thu)',category:'loan',cash:action.amount,debt:action.amount});s.loans.push({id,principal:action.amount,remaining:action.amount,rate:.02,installment:Math.round(action.amount/4),nextDay:s.day+2});log(s,'Vay được ghi riêng: lãi 2% mỗi kỳ, 4 đợt gốc cách nhau 2 ngày.','finance');break;}
 case 'REPAY':{const loan=s.loans.find(l=>l.id===action.loanId);if(!loan||!Number.isSafeInteger(action.amount)||action.amount<=0||action.amount>loan.remaining-(loan.arrears??0)||s.cash<action.amount){s.lastMessage='Trả hóa đơn gốc quá hạn trước; số gốc trả sớm không gồm phần đang phải trả.';break;}post(s,{id:nextId(s,'repay'),label:'Trả gốc vay',category:'loan-principal',cash:-action.amount,debt:-action.amount,loanId:loan.id});loan.remaining-=action.amount;break;}
 case 'RESERVE':{const n=action.amount;if(!Number.isSafeInteger(n)||n===0||n>0&&s.cash<n||n<0&&s.reserve<-n)break;post(s,{id:nextId(s,'reserve'),label:n>0?'Chuyển vào quỹ dự phòng':'Rút quỹ dự phòng',category:'reserve',cash:-n});s.reserve+=n;break;}
 case 'INSURE':if(!s.insured&&charge(s,`insurance-premium:${s.day}`,12000,'Bảo hiểm giả lập · bồi thường 70%, tối đa 10.000/ngày, cần xác minh','insurance'))s.insured=true;break;
 case 'PAY_BILL':{const p=s.payables.find(p=>p.id===action.payableId&&!p.paid);if(p&&charge(s,`pay:${p.id}`,p.amount,'Thanh toán '+p.label,'payable',false)){p.paid=true;if(p.loanId){const loan=s.loans.find(l=>l.id===p.loanId);if(loan){loan.remaining-=p.amount;loan.arrears=Math.max(0,(loan.arrears??0)-p.amount);const tx=s.transactions.find(t=>t.id===`pay:${p.id}`)!;tx.debt=-p.amount;tx.loanId=loan.id;tx.category='loan-principal';}}}break;}
 case 'EXTEND_BILL':{const p=s.payables.find(p=>p.id===action.payableId&&!p.paid&&!p.extended);if(p&&['rent','utilities','tax'].includes(p.category)){p.dueDay+=2;p.extended=true;log(s,'Hóa đơn được gia hạn hai ngày theo luật giả lập.','finance');}break;}
 case 'MARKETING':if(charge(s,nextId(s,'marketing'),18000,'Quảng bá quán địa phương','advertising')){s.flags.publicityUntil=s.day+2;s.reputation=clamp(s.reputation+3);}break;
 case 'WORKSHOP':{const attendees=activeOrders(s).slice(0,3).map(o=>o.customerId);if(s.level<2||s.phase!=='open'||attendees.length<2){s.lastMessage='Workshop cần cấp 2, đang mở cửa và ít nhất 2 khách hiện diện.';break;}if(s.flags['workshop-'+s.day])break;const req={matcha:attendees.length*4,milk:attendees.length*100};if(stock(s,'matcha')<req.matcha||stock(s,'milk')<req.milk||s.cash<20000){s.lastMessage='Workshop cần đủ trà, sữa và 20.000 vật tư.';break;}const cost=useIngredients(s,req,`workshop-cogs:${s.day}`,'Trà và sữa workshop');if(cost===null)break;charge(s,`workshop:${s.day}`,20000,'Vật tư workshop đánh trà','workshop');s.flags['workshop-'+s.day]=true;s.incidents.push({id:nextId(s,'workshop'),type:'workshop',title:'Workshop đánh trà',description:'Khách tham gia học đánh trà.',sign:`${attendees.length} khách đã đăng ký; phí 20.000/người sau khi hoàn thành.`,stage:'investigating',createdAt:s.clock,day:s.day,severity:'positive',participants:attendees,evidence:[],choices:[{id:'teach',label:'Hướng dẫn đánh trà',description:'40 giây, thu phí người tham dự thật.',cost:0,duration:40}],cause:'positive',lossCash:0,lossQuantity:0,resolving:{choice:'teach',remaining:40}});log(s,'Workshop đang diễn ra 40 giây, đã dùng trà/sữa và vật tư một lần.');break;}
 case 'AUDIT':{let valid=false;if(action.kind==='cash'){valid=!!action.transactionIds?.length&&new Set(action.transactionIds).size===action.transactionIds.length&&action.transactionIds.every(id=>s.transactions.some(t=>t.id===id));}if(action.kind==='count'){valid=!!action.inventoryCount?.length&&new Set(action.inventoryCount.map(i=>i.ingredient)).size===action.inventoryCount.length&&action.inventoryCount.every(i=>!!data.ingredientMap[i.ingredient]&&Number.isInteger(i.quantity)&&stock(s,i.ingredient as IngredientId)===i.quantity);}if(action.kind==='inspect'){valid=!!action.deliveryIds?.length&&action.deliveryIds.every(id=>s.deliveries.some(d=>d.id===id&&d.status==='arrived'));}if(!valid){s.lastMessage='Kết quả đối soát chưa khớp dữ liệu hiện tại. Đếm / xem lại bản ghi trước khi xác nhận.';break;}for(const i of s.incidents.filter(i=>i.stage!=='resolved'))if(action.kind==='cash'&&['theft','fraud','mistake','unpaid'].includes(i.type)||action.kind==='count'&&['count','fridge'].includes(i.type)||action.kind==='inspect'&&i.type==='supplier'){const ev=i.evidence.find(e=>!e.checked);if(ev)ev.checked=true;i.stage='investigating';}s.flags.audit=true;log(s,'Đối soát '+(action.kind==='cash'?'quầy tiền':action.kind==='count'?'kho nguyên liệu':'hàng nhập')+' đã khớp bản ghi; bằng chứng liên quan được cập nhật.','event');break;}
 case 'COMMUNITY':if(s.level>=3&&!s.flags['community-'+s.day]&&charge(s,`community:${s.day}`,20000,'Ngày hội nhận nuôi trong game','community')){s.flags['community-'+s.day]=true;s.reputation=clamp(s.reputation+7);awardXP(s,20);for(const c of s.cats.filter(c=>c.unlocked))c.trust=clamp(c.trust+3);log(s,'Ngày hội cộng đồng kết thúc yên tĩnh; danh tiếng và lòng tin tăng.');}break;
 case 'AVATAR':s.avatar={hair:clamp(Math.round(action.patch.hair??s.avatar.hair),0,5),skin:clamp(Math.round(action.patch.skin??s.avatar.skin),0,4),outfit:clamp(Math.round(action.patch.outfit??s.avatar.outfit),0,4)};break;
 case 'TUTORIAL':s.tutorial=clamp(Math.round(action.step),0,10);break;
 }
 if(s.phase==='after'&&s.reports.some(r=>r.day===s.day)){const target=Math.max(0,Math.round(s.transactions.filter(t=>t.day===s.day).reduce((n,t)=>n+t.revenue,0)*s.settings.taxRate));const assessed=s.transactions.filter(t=>t.day===s.day&&t.category==='tax').reduce((n,t)=>n+t.expense,0);const difference=target-assessed;if(difference>0)accrue(s,nextId(s,'tax-adjust'),difference,'Điều chỉnh thuế cho giao dịch sau giờ','tax',s.day+1);else if(difference<0){let credit=-difference;for(const p of s.payables.filter(p=>!p.paid&&p.category==='tax')){const deduction=Math.min(credit,p.amount);p.amount-=deduction;credit-=deduction;if(!p.amount)p.paid=true;if(!credit)break;}post(s,{id:nextId(s,'tax-credit'),label:'Đối soát giảm thuế sau hoàn tiền',category:'tax',cash:credit,expense:difference});}}
 if(s.flags.businessFailed&&s.cash+s.reserve>=50000){s.flags.businessFailed=false;s.flags.warningStreak=0;s.paused=false;log(s,'Quỹ phục hồi đã đạt 50.000; quán được chuẩn bị ngày mới.','finance');}
 if(s.phase==='after'&&s.reports.some(r=>r.day===s.day)){const current=reportDay(s);s.reports=s.reports.map(r=>r.day===s.day?current:r);}
 return s;
}
