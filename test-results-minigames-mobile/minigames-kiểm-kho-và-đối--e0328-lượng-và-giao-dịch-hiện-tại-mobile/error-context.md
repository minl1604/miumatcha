# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: minigames.spec.ts >> kiểm kho và đối soát sử dụng lượng và giao dịch hiện tại
- Location: tests\browser\minigames.spec.ts:65:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Đời sống tiệm', exact: true })
    - locator resolved to <button class="nav-item ">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - element is outside of the viewport
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - element is outside of the viewport
    - retrying click action
      - waiting 100ms
    115 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - element is outside of the viewport
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e7]:
      - text: Miu Matcha
      - emphasis [ref=e8]: TIỆM TRÀ & BÁNH MÈO
    - generic [ref=e9]:
      - generic [ref=e10]: 832.000 ₫
      - button "Cài đặt" [ref=e11] [cursor=pointer]
      - button "Tạm dừng" [ref=e12] [cursor=pointer]
  - generic [ref=e13]:
    - navigation "Sổ tiệm" [ref=e14]:
      - button "Tiệm của mình" [ref=e15] [cursor=pointer]
      - button "Thực đơn" [ref=e17] [cursor=pointer]
      - button "Các bé mèo" [ref=e19] [cursor=pointer]
      - button "Kho & bánh" [ref=e21] [cursor=pointer]
      - button "Nhân viên" [ref=e23] [cursor=pointer]
      - button "Trang trí" [ref=e25] [cursor=pointer]
      - button "Thu chi" [ref=e27] [cursor=pointer]
      - button "Đời sống tiệm" [ref=e30] [cursor=pointer]
    - main [ref=e32]:
      - generic [ref=e33]:
        - generic [ref=e34]:
          - paragraph [ref=e35]: MỘT GÓC NHỎ, NHIỀU ĐIỀU DỄ THƯƠNG
          - heading "Ngày đầu tiên của tiệm" [level=1] [ref=e36]
          - paragraph [ref=e37]: Pha một tách trà ngon. Chăm một bé mèo vui. Chậm lại một chút.
        - generic [ref=e38]: Nắng nhẹ · 24°C
      - generic [ref=e39]:
        - generic [ref=e40]:
          - strong [ref=e42]: Ngày 1
          - generic [ref=e43]: ·
          - strong [ref=e44]: 08:00
          - meter [ref=e47]
        - generic [ref=e48]:
          - button "Dọn tiệm" [ref=e49] [cursor=pointer]
          - button "Mở cửa tiệm" [ref=e50] [cursor=pointer]
      - generic [ref=e51]:
        - generic [ref=e52]:
          - region "Cảnh quán Miu Matcha" [ref=e53]:
            - generic:
              - generic: GÓC TIỆM CỦA BẠN
              - generic: MIU · CHẬM VÀ THƠM
            - 'img "Cảnh quán Miu Matcha tương tác: quầy trà, tủ bánh, khách hàng và khu mèo" [ref=e55]'
            - generic [ref=e57]: Chạm vào quầy, khách hoặc mèo để tương tác.
          - generic [ref=e59]:
            - generic [ref=e60]:
              - heading "Những người bạn nhỏ" [level=3] [ref=e61]
              - button "Ghé góc mèo" [ref=e62] [cursor=pointer]
            - generic [ref=e63]:
              - button [ref=e64] [cursor=pointer]:
                - img "Mèo Matcha" [ref=e65]
                - generic [ref=e66]:
                  - heading "Matcha" [level=4] [ref=e67]
                  - meter [ref=e69]
              - button [ref=e71] [cursor=pointer]:
                - img "Mèo Houji" [ref=e72]
                - generic [ref=e73]:
                  - heading "Houji" [level=4] [ref=e74]
                  - meter [ref=e76]
              - button [ref=e78] [cursor=pointer]:
                - img "Mèo Mochi" [ref=e79]
                - generic [ref=e80]:
                  - heading "Mochi" [level=4] [ref=e81]
                  - meter [ref=e83]
        - complementary [ref=e85]:
          - generic [ref=e86]:
            - heading "Khách đang chờ" [level=3] [ref=e87]
            - generic [ref=e88]: 0 đơn
          - paragraph [ref=e89]: Một món ngon, một nụ cười.
          - paragraph [ref=e92]: Khách sẽ đến sau khi bạn mở tiệm. Kho ban đầu đã sẵn sàng cho một ngày nhỏ.
          - generic [ref=e93]:
            - generic [ref=e94]:
              - strong [ref=e95]: "0"
              - text: đã phục vụ
            - generic [ref=e96]:
              - strong [ref=e97]: 92%
              - text: sạch sẽ
      - generic [ref=e98]:
        - generic [ref=e100]:
          - heading "Phục vụ 3 vị khách" [level=4] [ref=e101]
          - paragraph [ref=e102]: 0/3 · Mở sổ đời sống để nhận phần thưởng.
        - generic [ref=e103]:
          - generic [ref=e104]:
            - heading "Âm thanh của một buổi chiều" [level=4] [ref=e105]
            - paragraph [ref=e106]: Giai điệu tự tạo · tiếng mưa & mèo
          - button "Bật hoặc tắt nhạc" [ref=e107] [cursor=pointer]
      - generic [ref=e108]:
        - generic [ref=e109]: Miu Matcha · Được lưu trên thiết bị này
        - generic [ref=e110]: Nhận xét cục bộ · Không cần tài khoản
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | type P={x:number,y:number};
  3  | async function start(page:Page){
  4  |   await page.goto('/');
  5  |   await page.waitForFunction(()=>Boolean((window as any).__MIU_DEBUG));
  6  |   const welcome=page.getByRole('button',{name:'Bắt đầu chăm tiệm',exact:true});
  7  |   if(await welcome.isVisible())await welcome.click();
  8  | }
  9  | async function actions(page:Page,items:unknown[]){await page.evaluate(items=>{for(const item of items)(window as any).__MIU_DEBUG.dispatch(item);},items);}
  10 | async function getGame(page:Page){return page.evaluate(()=>(window as any).__MIU_DEBUG.getState());}
  11 | async function drag(page:Page,points:P[],isMobile:boolean,delay=45,hold=0){
  12 |   if(isMobile){
  13 |     const session=await page.context().newCDPSession(page);
  14 |     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...points[0],radiusX:3,radiusY:3,force:1,id:1}]});
  15 |     for(const point of points.slice(1)){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...point,radiusX:3,radiusY:3,force:1,id:1}]});if(delay)await page.waitForTimeout(delay);}
  16 |     if(hold)await page.waitForTimeout(hold);
  17 |     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();
  18 |   }else{
  19 |     await page.mouse.move(points[0].x,points[0].y);await page.mouse.down();
  20 |     for(const point of points.slice(1)){await page.mouse.move(point.x,point.y);if(delay)await page.waitForTimeout(delay);}
  21 |     if(hold)await page.waitForTimeout(hold);await page.mouse.up();
  22 |   }
  23 | }
  24 | async function boardPoint(page:Page,p:P):Promise<P>{const b=await page.locator('.mg-board').boundingBox();if(!b)throw new Error('Minigame board is absent');return{x:b.x+p.x/480*b.width,y:b.y+p.y/300*b.height};}
  25 | async function begin(page:Page,title:string){const dialog=page.getByRole('dialog',{name:title,exact:true});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:/^Bắt đầu ·/}).click();return dialog;}
  26 | async function finish(page:Page,min:number){await page.getByRole('button',{name:'Hoàn tất thao tác',exact:true}).click();await expect(page.locator('.mg-result')).toBeVisible();const score=parseInt(await page.locator('.mg-result strong').innerText());expect(score).toBeGreaterThanOrEqual(min);await page.getByRole('button',{name:'Dùng kết quả',exact:true}).click();return score;}
> 27 | async function activities(page:Page){await page.getByRole('button',{name:'Đời sống tiệm',exact:true}).click();await page.getByRole('button',{name:'Hoạt động quán',exact:true}).click();}
     |                                                                                                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
  28 | 
  29 | test('đánh W bằng con trỏ thật thay đổi kỹ thuật, không tự thu tiền',async({page,isMobile},info)=>{
  30 |   await start(page);await actions(page,[{type:'OPEN'},{type:'ORDER',customerId:'linh',recipeId:'matcha-latte'}]);
  31 |   await page.getByRole('button',{name:'Pha món này',exact:true}).first().click();
  32 |   await page.getByRole('button',{name:'Thêm nguyên liệu vào ly',exact:true}).click();
  33 |   const before=await getGame(page);
  34 |   await page.getByRole('button',{name:'Đánh trà chữ W',exact:true}).click();await begin(page,'Đánh trà thật mịn');
  35 |   const path=[{x:70,y:70},{x:145,y:225},{x:240,y:75},{x:335,y:225},{x:410,y:70}],points:P[]=[];
  36 |   for(let s=0;s<4;s++)for(let i=0;i<=10;i++)points.push(await boardPoint(page,{x:path[s].x+(path[s+1].x-path[s].x)*i/10,y:path[s].y+(path[s+1].y-path[s].y)*i/10}));
  37 |   await drag(page,points,isMobile,45);await page.screenshot({path:info.outputPath('whisk-pointer.png')});const score=await finish(page,85);
  38 |   const after=await getGame(page);expect(after.cash).toBe(before.cash);expect(after.orders.find((o:any)=>o.id===before.orders[0].id).draft.formula.dissolution).toBe(score);expect(after.orders[0].paid).toBe(false);
  39 | });
  40 | 
  41 | test('kéo topping, bóp kem và lấy bánh thực',async({page,isMobile},info)=>{
  42 |   await start(page);await actions(page,[{type:'BAKE',cakeId:'mochi'},{type:'STEP',seconds:32}]);
  43 |   await page.getByRole('button',{name:'Kho & bánh',exact:true}).click();await page.getByRole('button',{name:'Lò bánh',exact:true}).click();
  44 |   await page.getByRole('button',{name:'Trang trí rồi lấy bánh',exact:true}).first().click();await begin(page,'Trang trí chiếc bánh');
  45 |   for(const [i,p] of [{x:170,y:140},{x:240,y:115},{x:310,y:140}].entries()){
  46 |     const palette=page.locator('.mg-options button').nth(i),box=await palette.boundingBox();if(!box)throw new Error('Palette absent');
  47 |     const target=await boardPoint(page,p);await drag(page,[{x:box.x+box.width/2,y:box.y+box.height/2},target],isMobile,50);
  48 |   }
  49 |   await page.getByRole('button',{name:'Kem',exact:true}).click();const center=await boardPoint(page,{x:240,y:173});await drag(page,[center],isMobile,0,1100);
  50 |   await page.screenshot({path:info.outputPath('decorate-drag.png')});await finish(page,95);
  51 |   const after=await getGame(page);expect(after.baking[0].status).toBe('taken');expect(after.cakes.some((c:any)=>c.cakeId==='mochi'&&c.quantity>0)).toBe(true);
  52 | });
  53 | 
  54 | test('lau từng vết bẩn bằng cảm ứng, tạm dừng giữ đồng hồ',async({page,isMobile},info)=>{
  55 |   await start(page);await page.getByRole('button',{name:'Dọn tiệm',exact:true}).click();await begin(page,'Dọn quán gọn ghẽ');
  56 |   await page.locator('.mg-status').getByRole('button',{name:'Tạm dừng',exact:true}).click();
  57 |   const pausedClock=await page.locator('.mg-status>span').innerText();await page.waitForTimeout(1100);expect(await page.locator('.mg-status>span').innerText()).toBe(pausedClock);
  58 |   await page.locator('.mg-pause').getByRole('button',{name:'Tiếp tục',exact:true}).click();
  59 |   for(const p of [{x:95,y:215},{x:250,y:100},{x:365,y:225},{x:180,y:215}]){
  60 |     const points:P[]=[];for(let i=0;i<7;i++)points.push(await boardPoint(page,{x:p.x+(i%2?8:-8),y:p.y+(i%2?4:-4)}));await drag(page,points,isMobile,180);
  61 |   }
  62 |   await page.screenshot({path:info.outputPath('clean-touch.png')});await finish(page,100);expect((await getGame(page)).hygiene).toBeGreaterThanOrEqual(95);
  63 | });
  64 | 
  65 | test('kiểm kho và đối soát sử dụng lượng và giao dịch hiện tại',async({page},info)=>{
  66 |   await start(page);await actions(page,[{type:'BUY_INGREDIENT',ingredient:'matcha',quantity:100,supplierId:'local'}]);const game=await getGame(page);
  67 |   await activities(page);await page.getByRole('button',{name:'Kiểm kho',exact:true}).click();await begin(page,'Kiểm kho thật kỹ');
  68 |   const ids:string[]=[...new Set<string>(game.inventory.filter((b:any)=>b.quantity>0).map((b:any)=>b.ingredient))].slice(0,2);
  69 |   const names:Record<string,string>={matcha:'Matcha',houjicha:'Houjicha'};
  70 |   for(const id of ids){const total=game.inventory.filter((b:any)=>b.ingredient===id&&!b.quarantined).reduce((sum:number,b:any)=>sum+b.quantity,0);await page.getByRole('spinbutton',{name:`${names[id]||id} khả dụng`,exact:true}).fill(String(total));}
  71 |   await page.screenshot({path:info.outputPath('inventory-real.png')});await finish(page,100);
  72 |   await page.getByRole('button',{name:'Đối soát quầy tiền',exact:true}).click();await begin(page,'Đối soát quầy tiền');
  73 |   const current=await getGame(page),total=current.transactions.slice(-6).reduce((sum:number,row:any)=>sum+row.cash,0);
  74 |   await page.getByRole('spinbutton',{name:'Dòng tiền ròng',exact:true}).fill(String(total));await finish(page,100);const after=await getGame(page);expect(after.cash).toBe(current.cash);expect(after.transactions.length).toBe(current.transactions.length);
  75 | });
  76 | 
```