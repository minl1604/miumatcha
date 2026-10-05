import type { GameState, PlacedFurniture } from './types';
import { furniture } from './data';
export const GRID={width:16,height:12};
export function occupiedCells(item:PlacedFurniture):string[]{const def=furniture.find(f=>f.id===item.kind);if(!def)return [];const rotate=item.rotation%180!==0,w=rotate?def.height:def.width,h=rotate?def.width:def.height;const cells=[];for(let y=item.y;y<item.y+h;y++)for(let x=item.x;x<item.x+w;x++)cells.push(`${x},${y}`);return cells;}
const reserved=(x:number,y:number)=>y<=2||(x===7||x===8)&&y>=10;
/** Door to counter and cat-zone access must remain reachable. Tables are collidable; cat items stay in cat zone. */
export function canPlace(state:Pick<GameState,'furniture'>,kind:string,x:number,y:number,rotation=0,ignoreId?:string):{valid:boolean;reason:string} {
 const def=furniture.find(f=>f.id===kind);if(!def)return {valid:false,reason:'Không tìm thấy nội thất.'};
 if(!Number.isInteger(x)||!Number.isInteger(y)||![0,90,180,270].includes(rotation))return {valid:false,reason:'Vị trí phải theo ô; xoay theo góc 90°.'};
 const candidate={id:ignoreId??'candidate',kind,x,y,rotation};const cells=occupiedCells(candidate);
 const blocking=new Set(state.furniture.filter(f=>f.id!==ignoreId).flatMap(occupiedCells));
 for(const c of cells){const [cx,cy]=c.split(',').map(Number);if(cx<0||cy<0||cx>=GRID.width||cy>=GRID.height)return {valid:false,reason:'Đồ nằm ngoài sàn quán.'};if(reserved(cx,cy))return {valid:false,reason:'Giữ cửa và khu pha chế thông thoáng.'};if(blocking.has(c))return {valid:false,reason:'Vị trí bị nội thất khác chiếm.'};if(def.cat&&cx<11)return {valid:false,reason:'Đồ mèo cần ở khu mèo riêng phía bên phải.'};if(!def.cat&&cx>=11)return {valid:false,reason:'Khu bên phải dành riêng cho mèo.'};blocking.add(c);}
 const queue:[[number,number]]|[number,number][]=[[7,11]],seen=new Set(['7,11']);
 while(queue.length){const [cx,cy]=queue.shift()!;for(const [nx,ny] of [[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]]){const key=`${nx},${ny}`;if(nx<0||ny<3||nx>=GRID.width||ny>=GRID.height||blocking.has(key)||seen.has(key))continue;seen.add(key);queue.push([nx,ny]);}}
 if(!seen.has('7,3')||!seen.has('11,8'))return {valid:false,reason:'Cần đường đi từ cửa tới quầy và khu mèo.'};
 return {valid:true,reason:'Vị trí hợp lệ.'};
}
export function capacity(state:Pick<GameState,'furniture'> & {flags?:GameState['flags']}):number{return Math.max(2,state.furniture.reduce((n,f)=>n+(state.flags?.['damaged:'+f.id]?0:furniture.find(d=>d.id===f.kind)?.seats??0),0));}
export function comfort(state:Pick<GameState,'furniture'>):number{return Math.min(100,65+state.furniture.reduce((n,f)=>n+(furniture.find(d=>d.id===f.kind)?.comfort??0),0));}
