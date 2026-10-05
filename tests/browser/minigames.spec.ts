import { test, expect, type Page } from '@playwright/test';
type P={x:number,y:number};
async function start(page:Page){
  await page.goto('/');
  await page.waitForFunction(()=>Boolean((window as any).__MIU_DEBUG));
  const welcome=page.getByRole('button',{name:'Bắt đầu chăm tiệm',exact:true});
  if(await welcome.isVisible())await welcome.click();
}
async function actions(page:Page,items:unknown[]){await page.evaluate(items=>{for(const item of items)(window as any).__MIU_DEBUG.dispatch(item);},items);}
async function getGame(page:Page){return page.evaluate(()=>(window as any).__MIU_DEBUG.getState());}
async function drag(page:Page,points:P[],isMobile:boolean,delay=45,hold=0){
  if(isMobile){
    const session=await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...points[0],radiusX:3,radiusY:3,force:1,id:1}]});
    for(const point of points.slice(1)){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...point,radiusX:3,radiusY:3,force:1,id:1}]});if(delay)await page.waitForTimeout(delay);}
    if(hold)await page.waitForTimeout(hold);
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
  }else{
    await page.mouse.move(points[0].x,points[0].y);await page.mouse.down();
    for(const point of points.slice(1)){await page.mouse.move(point.x,point.y);if(delay)await page.waitForTimeout(delay);}
    if(hold)await page.waitForTimeout(hold);await page.mouse.up();
  }
}
async function boardPoint(page:Page,p:P):Promise<P>{const b=await page.locator('.mg-board').boundingBox();if(!b)throw new Error('Minigame board is absent');return{x:b.x+p.x/480*b.width,y:b.y+p.y/300*b.height};}
async function begin(page:Page,title:string){const dialog=page.getByRole('dialog',{name:title,exact:true});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:/^Bắt đầu ·/}).click();return dialog;}
async function finish(page:Page,min:number){await page.getByRole('button',{name:'Hoàn tất thao tác',exact:true}).click();await expect(page.locator('.mg-result')).toBeVisible();const score=parseInt(await page.locator('.mg-result strong').innerText());expect(score).toBeGreaterThanOrEqual(min);await page.getByRole('button',{name:'Dùng kết quả',exact:true}).click();return score;}
async function activities(page:Page){await page.getByRole('button',{name:'Đời sống tiệm',exact:true}).click();await page.getByRole('button',{name:'Hoạt động quán',exact:true}).click();}

test('đánh W bằng con trỏ thật thay đổi kỹ thuật, không tự thu tiền',async({page,isMobile},info)=>{
  await start(page);await actions(page,[{type:'OPEN'},{type:'ORDER',customerId:'linh',recipeId:'matcha-latte'}]);
  await page.getByRole('button',{name:'Pha món này',exact:true}).first().click();
  await page.getByRole('button',{name:'Thêm nguyên liệu vào ly',exact:true}).click();
  const before=await getGame(page);
  await page.getByRole('button',{name:'Đánh trà chữ W',exact:true}).click();await begin(page,'Đánh trà thật mịn');
  const path=[{x:70,y:70},{x:145,y:225},{x:240,y:75},{x:335,y:225},{x:410,y:70}],points:P[]=[];
  for(let s=0;s<4;s++)for(let i=0;i<=10;i++)points.push(await boardPoint(page,{x:path[s].x+(path[s+1].x-path[s].x)*i/10,y:path[s].y+(path[s+1].y-path[s].y)*i/10}));
  await drag(page,points,isMobile,45);await page.screenshot({path:info.outputPath('whisk-pointer.png')});const score=await finish(page,85);
  const after=await getGame(page);expect(after.cash).toBe(before.cash);expect(after.orders.find((o:any)=>o.id===before.orders[0].id).draft.formula.dissolution).toBe(score);expect(after.orders[0].paid).toBe(false);
});

test('kéo topping, bóp kem và lấy bánh thực',async({page,isMobile},info)=>{
  await start(page);await actions(page,[{type:'BAKE',cakeId:'mochi'},{type:'STEP',seconds:32}]);
  await page.getByRole('button',{name:'Kho & bánh',exact:true}).click();await page.getByRole('button',{name:'Lò bánh',exact:true}).click();
  await page.getByRole('button',{name:'Trang trí rồi lấy bánh',exact:true}).first().click();await begin(page,'Trang trí chiếc bánh');
  for(const [i,p] of [{x:170,y:140},{x:240,y:115},{x:310,y:140}].entries()){
    const palette=page.locator('.mg-options button').nth(i),box=await palette.boundingBox();if(!box)throw new Error('Palette absent');
    const target=await boardPoint(page,p);await drag(page,[{x:box.x+box.width/2,y:box.y+box.height/2},target],isMobile,50);
  }
  await page.getByRole('button',{name:'Kem',exact:true}).click();const center=await boardPoint(page,{x:240,y:173});await drag(page,[center],isMobile,0,1100);
  await page.screenshot({path:info.outputPath('decorate-drag.png')});await finish(page,95);
  const after=await getGame(page);expect(after.baking[0].status).toBe('taken');expect(after.cakes.some((c:any)=>c.cakeId==='mochi'&&c.quantity>0)).toBe(true);
});

test('lau từng vết bẩn bằng cảm ứng, tạm dừng giữ đồng hồ',async({page,isMobile},info)=>{
  await start(page);await page.getByRole('button',{name:'Dọn tiệm',exact:true}).click();await begin(page,'Dọn quán gọn ghẽ');
  await page.locator('.mg-status').getByRole('button',{name:'Tạm dừng',exact:true}).click();
  const pausedClock=await page.locator('.mg-status>span').innerText();await page.waitForTimeout(1100);expect(await page.locator('.mg-status>span').innerText()).toBe(pausedClock);
  await page.locator('.mg-pause').getByRole('button',{name:'Tiếp tục',exact:true}).click();
  for(const p of [{x:95,y:215},{x:250,y:100},{x:365,y:225},{x:180,y:215}]){
    const points:P[]=[];for(let i=0;i<7;i++)points.push(await boardPoint(page,{x:p.x+(i%2?8:-8),y:p.y+(i%2?4:-4)}));await drag(page,points,isMobile,180);
  }
  await page.screenshot({path:info.outputPath('clean-touch.png')});await finish(page,100);expect((await getGame(page)).hygiene).toBeGreaterThanOrEqual(95);
});

test('kiểm kho và đối soát sử dụng lượng và giao dịch hiện tại',async({page},info)=>{
  await start(page);await actions(page,[{type:'BUY_INGREDIENT',ingredient:'matcha',quantity:100,supplierId:'local'}]);const game=await getGame(page);
  await activities(page);await page.getByRole('button',{name:'Kiểm kho',exact:true}).click();await begin(page,'Kiểm kho thật kỹ');
  const ids:string[]=[...new Set<string>(game.inventory.filter((b:any)=>b.quantity>0).map((b:any)=>b.ingredient))].slice(0,2);
  const names:Record<string,string>={matcha:'Matcha',houjicha:'Houjicha'};
  for(const id of ids){const total=game.inventory.filter((b:any)=>b.ingredient===id&&!b.quarantined).reduce((sum:number,b:any)=>sum+b.quantity,0);await page.getByRole('spinbutton',{name:`${names[id]||id} khả dụng`,exact:true}).fill(String(total));}
  await page.screenshot({path:info.outputPath('inventory-real.png')});await finish(page,100);
  await page.getByRole('button',{name:'Đối soát quầy tiền',exact:true}).click();await begin(page,'Đối soát quầy tiền');
  const current=await getGame(page),total=current.transactions.slice(-6).reduce((sum:number,row:any)=>sum+row.cash,0);
  await page.getByRole('spinbutton',{name:'Dòng tiền ròng',exact:true}).fill(String(total));await finish(page,100);const after=await getGame(page);expect(after.cash).toBe(current.cash);expect(after.transactions.length).toBe(current.transactions.length);
});
