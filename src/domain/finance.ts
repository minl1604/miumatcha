import type { GameState, Transaction, Report } from './types';
export function post(state:GameState,tx:Partial<Transaction>&Pick<Transaction,'id'|'label'|'category'>):boolean {
 if(state.transactions.some(t=>t.id===tx.id))return false;
 const entry:Transaction={day:state.day,at:state.clock,cash:0,revenue:0,cogs:0,expense:0,investment:0,debt:0,...tx};
 if([entry.cash,entry.revenue,entry.cogs,entry.expense,entry.investment,entry.debt].some(n=>!Number.isSafeInteger(n)))throw new Error('Giao dịch phải dùng số nguyên VND.');
 for(const key of ['cash','revenue','cogs','expense','investment','debt'] as const)if(Object.is(entry[key],-0))entry[key]=0;
 state.cash+=entry.cash;state.transactions.push(entry);return true;
}
export function charge(state:GameState,id:string,amount:number,label:string,category:string,expense=true):boolean {
 if(state.transactions.some(t=>t.id===id))return true;
 if(!Number.isSafeInteger(amount)||amount<0||state.cash<amount){state.lastMessage='Tiền mặt chưa đủ. Có thể rút quỹ dự phòng, vay hoặc gia hạn hóa đơn.';return false;}
 return post(state,{id,label,category,cash:-amount,expense:expense?amount:0});
}
export function accrue(state:GameState,id:string,amount:number,label:string,category:string,dueDay=state.day):void {
 if(state.transactions.some(t=>t.id===id))return;
 const paid=state.cash>=amount;post(state,{id,label,category,cash:paid?-amount:0,expense:amount});
 if(!paid)state.payables.push({id,label,amount,dueDay,category,paid:false,extended:false});
}
export function reportDay(state:GameState,day=state.day):Report {
 const tx=state.transactions.filter(t=>t.day===day);const sum=(key:'cash'|'revenue'|'cogs'|'expense'|'investment'|'debt')=>tx.reduce((a,b)=>a+b[key],0);
 const revenue=tx.filter(t=>t.revenue>0).reduce((a,b)=>a+(b.gross??b.revenue),0),discounts=tx.reduce((a,b)=>a+(b.discount??0),0),refunds=Math.max(0,-tx.filter(t=>t.revenue<0).reduce((a,b)=>a+b.revenue,0));
 const netRevenue=sum('revenue'),cogs=sum('cogs'),tax=tx.filter(t=>t.category==='tax').reduce((a,b)=>a+b.expense,0),operating=sum('expense')-tax;
 const served=state.orders.filter(o=>o.status==='served'&&tx.some(t=>t.id===`sale:${o.id}`));
 const lost=state.journal.filter(j=>j.day===day&&j.id.startsWith('left:')).length;
 const sold:Record<string,{n:number,profit:number}>={};for(const o of served){const a=sold[o.recipeId]??{n:0,profit:0};a.n++;a.profit+=o.price-o.refunded-(o.draft?.cost??0);sold[o.recipeId]=a;}
 const bestId=Object.entries(sold).sort((a,b)=>b[1].n-a[1].n)[0]?.[0];const profitId=Object.entries(sold).sort((a,b)=>b[1].profit-a[1].profit)[0]?.[0];
 const categories:Record<string,number>={};for(const t of tx)if(t.expense||t.cogs)categories[t.category]=(categories[t.category]??0)+t.expense+t.cogs;
 const wasteMap:Record<string,{ingredient:string;quantity:number;cost:number}>={};for(const t of tx.filter(t=>t.category==='waste'))for(const u of t.used??(t.ingredient?[{ingredient:t.ingredient,quantity:t.quantity??0,cost:t.cogs}]:[])){const row=wasteMap[u.ingredient]??{ingredient:u.ingredient,quantity:0,cost:0};row.quantity+=u.quantity;row.cost+=u.cost;wasteMap[u.ingredient]=row;}const waste=Object.values(wasteMap);
 const cashFlow=sum('cash'),previous=state.reports.find(r=>r.day===day-1),startCash=day===state.day?state.startCash:(state.reports.find(r=>r.day===day)?.startCash??previous?.endCash??state.startCash);
 const drinkScore=served.length?Math.round(served.reduce((a,o)=>a+(o.score?.total??0),0)/served.length):0;
 const serviceScore=served.length?Math.round(served.reduce((a,o)=>a+(o.service??0),0)/served.length):0;
 const suggestions:string[]=[];if(!served.length)suggestions.push('Hãy mở quán, hoàn thành một món rồi giao để tạo doanh thu.');if(lost)suggestions.push(`${lost} khách rời hàng chờ; cân nhắc phân công thu ngân hoặc giảm thời gian thao tác.`);if(drinkScore&&drinkScore<75)suggestions.push('Đọc nhiệt độ, sữa và topping trên phiếu trước khi pha.');if(waste.length)suggestions.push('Dùng lô gần hết hạn trước và nhập lượng nhỏ hơn.');if(netRevenue-cogs-operating-tax<0)suggestions.push('Rút gọn ca làm và menu để giảm chi phí, kiểm tra quỹ dự phòng.');if(!suggestions.length)suggestions.push('Món và dịch vụ ổn định; thử lưu công thức riêng hoặc mở rộng chỗ ngồi.');
 return {day,revenue,discounts,refunds,netRevenue,cogs,operating,tax,profit:netRevenue-cogs-operating-tax,startCash,endCash:startCash+cashFlow,cashFlow,investment:sum('investment'),financing:sum('debt'),liabilities:state.payables.filter(p=>!p.paid&&p.dueDay<=day).reduce((a,b)=>a+b.amount,0),served:served.length,lost,averageOrder:served.length?Math.round(netRevenue/served.length):0,drinkScore,serviceScore,bestSeller:state.recipes.find(r=>r.id===bestId)?.name??'Chưa có',mostProfitable:state.recipes.find(r=>r.id===profitId)?.name??'Chưa có',waste,suggestions,categories};
}
export const vnd=(n:number)=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(n);
