import type { Batch, Formula, IngredientId, GameState } from './types';
import { ingredientMap } from './data';

export function formulaIngredients(f: Formula): Partial<Record<IngredientId, number>> {
 const r: Partial<Record<IngredientId,number>> = {[f.tea]:f.teaAmount,sugar:f.sugar,ice:f.ice};
 if(f.milk!=='none' && f.milkAmount>0) r[f.milk]=(r[f.milk]??0)+f.milkAmount;
 if(f.syrup!=='none' && f.syrupAmount>0) r[f.syrup]=(r[f.syrup]??0)+f.syrupAmount;
 if(f.topping!=='none' && f.toppingAmount>0) r[f.topping]=(r[f.topping]??0)+f.toppingAmount;
 return r;
}
export function stock(state: Pick<GameState,'inventory'|'day'>, ingredient: IngredientId): number {
 return state.inventory.filter(b=>b.ingredient===ingredient && !b.quarantined && b.expiresDay>=state.day).reduce((a,b)=>a+b.quantity,0);
}
export function recipeCost(f: Formula): number {return Object.entries(formulaIngredients(f)).reduce((sum,[id,qty])=>sum+(qty??0)*ingredientMap[id].price,0);}
export interface Consumption { batches: Batch[]; cost: number; quality: number; used: {ingredient: IngredientId; quantity: number; cost: number}[]; }
/** Plan every ingredient first; shortages leave ALL lots untouched. Uses earliest expiry, then lot id. */
export function consume(inventory: Batch[], requirements: Partial<Record<IngredientId, number>>, day: number): Consumption | null {
 const req=Object.entries(requirements).filter(([,n])=>n!==undefined && n>0) as [IngredientId,number][];
 if(req.some(([id,qty])=>!ingredientMap[id] || !Number.isInteger(qty) || qty<0 || inventory.filter(b=>b.ingredient===id&&!b.quarantined&&b.expiresDay>=day).reduce((a,b)=>a+b.quantity,0)<qty)) return null;
 const batches=inventory.map(b=>({...b})); const used:Consumption['used']=[];let qualitySum=0,qualityWeight=0;
 for(const [id,qty] of req){let left=qty,cost=0;
  for(const batch of batches.filter(b=>b.ingredient===id&&!b.quarantined&&b.expiresDay>=day).sort((a,b)=>a.expiresDay-b.expiresDay || a.id.localeCompare(b.id))){const n=Math.min(left,batch.quantity);batch.quantity-=n;left-=n;cost+=n*batch.unitCost;const weight=n*Math.max(1,batch.unitCost);qualitySum+=batch.quality*weight;qualityWeight+=weight;if(!left)break;}
  used.push({ingredient:id,quantity:qty,cost});
 }
 return {batches:batches.filter(b=>b.quantity>0),cost:used.reduce((a,b)=>a+b.cost,0),quality:qualityWeight?Math.round(qualitySum/qualityWeight):100,used};
}
export function validFormula(f: unknown): f is Formula {
 if(!f || typeof f!=='object')return false;const a=f as Formula;
 const ints:[number,number][]=[[a.teaAmount,20],[a.milkAmount,350],[a.sugar,60],[a.syrupAmount,100],[a.ice,200],[a.temperature,90],[a.toppingAmount,100],[a.dissolution,100],[a.presentation,100]];
 return ['matcha','houjicha','sencha','genmaicha'].includes(a.tea)&&['milk','oat','none'].includes(a.milk)&&['none','strawberry','caramel','lemon','mango'].includes(a.syrup)&&['none','cream','cheese','pearl','jelly','redbean'].includes(a.topping)&&ints.every(([n,max])=>Number.isInteger(n)&&n>=0&&n<=max)&&a.teaAmount>0;
}
