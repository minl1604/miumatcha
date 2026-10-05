import type { Formula, Order, Customer, DrinkScore } from './types';
import { formulaIngredients } from './inventory';
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
export function scoreDrink(actual:Formula,order:Pick<Order,'requested'>,customer:Customer,technique:number,ingredientQuality=100):DrinkScore {
 const requested=order.requested;
 const expectedIngredients=formulaIngredients(requested),got=formulaIngredients(actual);
 const quantities=Object.entries(expectedIngredients).filter(([,n])=>(n??0)>0);
 const correct=quantities.reduce((sum,[id,n])=>sum+clamp(1-Math.abs((got[id as keyof typeof got]??0)-(n??0))/Math.max(n??0,5),0,1),0)/Math.max(1,quantities.length);
 const forbidden=customer.avoid.some(id=>(got[id]??0)>0);
 const requirement=Math.round(clamp(30*correct*(.8+.2*clamp(ingredientQuality)/100)-(actual.tea!==requested.tea?12:0)-(forbidden?30:0),0,30));
 const sweet=actual.sugar+actual.syrupAmount*.4;
 const creamy=actual.milk==='none'?0:actual.milkAmount+(actual.topping==='cream'||actual.topping==='cheese'?actual.toppingAmount:0);
 const taste=Math.round(clamp(30-Math.abs(sweet-(requested.sugar+requested.syrupAmount*.4))*.7-Math.abs(creamy-requested.milkAmount)*.055-(actual.topping!==requested.topping?5:0)-(actual.tea!==requested.tea?7:0),0,30));
 const technical=Math.round(clamp(technique)*.12+clamp(actual.dissolution)*.08);
 const temperature=Math.round(clamp(10-Math.abs(actual.temperature-requested.temperature)*.3,0,10));
 const presentation=Math.round(clamp(actual.presentation)*.1);
 const total=clamp(requirement+taste+technical+temperature+presentation);
 let detail=actual.tea==='houjicha'?'Trà rang thơm và ấm.':actual.tea==='matcha'?'Matcha có hương trà xanh rõ.':'Trà nhẹ và thanh.';
 if(forbidden)detail='Món chứa thành phần mình đã yêu cầu tránh; mình không thể nhận món này.';
 else if(requirement<22)detail='Một số lượng nguyên liệu chưa khớp yêu cầu trên phiếu.';
 else if(sweet>requested.sugar+requested.syrupAmount*.4+5)detail='Syrup hơi nhiều, át hương trà. Lần sau giảm ngọt giúp mình nhé!';
 else if(actual.dissolution<65)detail='Trà còn hơi lợn cợn; đánh đều theo chữ W sẽ dễ uống hơn.';
 else if(temperature<7)detail='Nhiệt độ chưa đúng; mình thích '+(requested.temperature>35?'món ấm hơn.':'món mát hơn.');
 else if(presentation<7)detail='Hương vị ổn rồi, trình bày gọn hơn sẽ đẹp lắm.';
 else if(total>=88)detail='Lượng trà, độ ngọt và lớp sữa rất hợp ý mình. Cảm ơn bạn!';
 const prefix=customer.personality==='thẳng thắn'?'Mình góp ý thật nhé: ':customer.personality==='vui tính'?'Ly trà hôm nay: ':'';
 return {requirement,taste,technique:technical,temperature,presentation,total,feedback:prefix+detail};
}
