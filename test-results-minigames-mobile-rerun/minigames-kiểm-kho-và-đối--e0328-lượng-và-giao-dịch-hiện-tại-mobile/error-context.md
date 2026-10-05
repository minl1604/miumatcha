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
  - waiting for getByRole('button', { name: 'Hoàn tất thao tác', exact: true })
    - locator resolved to <button disabled class="mg-primary">Hoàn tất thao tác</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    37 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - generic [ref=f1e7]:
      - text: Miu Matcha
      - emphasis [ref=f1e8]: TIỆM TRÀ & BÁNH MÈO
    - generic [ref=f1e9]:
      - generic [ref=f1e10]: 832.000 ₫
      - button "Cài đặt" [ref=f1e11] [cursor=pointer]
      - button "Tiếp tục" [ref=f1e12] [cursor=pointer]
  - generic [ref=f1e13]:
    - navigation "Sổ tiệm" [ref=f1e14]:
      - button "Tiệm của mình" [ref=f1e15] [cursor=pointer]
      - button "Thực đơn" [ref=f1e17] [cursor=pointer]
      - button "Các bé mèo" [ref=f1e19] [cursor=pointer]
      - button "Kho & bánh" [ref=f1e21] [cursor=pointer]
      - button "Nhân viên" [ref=f1e23] [cursor=pointer]
      - button "Trang trí" [ref=f1e25] [cursor=pointer]
      - button "Thu chi" [ref=f1e27] [cursor=pointer]
      - button "Đời sống tiệm" [ref=f1e30] [cursor=pointer]
    - main [ref=f1e32]:
      - generic [ref=f1e33]:
        - generic [ref=f1e34]:
          - paragraph [ref=f1e35]: MỘT GÓC NHỎ, NHIỀU ĐIỀU DỄ THƯƠNG
          - heading "Ngày đầu tiên của tiệm" [level=1] [ref=f1e36]
          - paragraph [ref=f1e37]: Pha một tách trà ngon. Chăm một bé mèo vui. Chậm lại một chút.
        - generic [ref=f1e38]: Nắng nhẹ · 24°C
      - generic [ref=f1e39]:
        - generic [ref=f1e40]:
          - strong [ref=f1e42]: Ngày 1
          - generic [ref=f1e43]: ·
          - strong [ref=f1e44]: 08:00
          - meter [ref=f1e47]
        - generic [ref=f1e48]:
          - button "Dọn tiệm" [ref=f1e49] [cursor=pointer]
          - button "Mở cửa tiệm" [ref=f1e50] [cursor=pointer]
      - generic [ref=f1e51]:
        - generic [ref=f1e52]:
          - region "Cảnh quán Miu Matcha" [ref=f1e53]:
            - generic:
              - generic: GÓC TIỆM CỦA BẠN
              - generic: MIU · CHẬM VÀ THƠM
            - generic [ref=f1e54]:
              - 'img "Cảnh quán Miu Matcha tương tác: quầy trà, tủ bánh, khách hàng và khu mèo" [ref=f1e55]'
              - generic [ref=f1e57]:
                - strong [ref=f1e58]: Tiệm đang nghỉ một chút
                - button "Tiếp tục chơi" [ref=f1e59] [cursor=pointer]
            - generic [ref=f1e60]: Chạm vào quầy, khách hoặc mèo để tương tác.
          - generic [ref=f1e62]:
            - generic [ref=f1e63]:
              - heading "Những người bạn nhỏ" [level=3] [ref=f1e64]
              - button "Ghé góc mèo" [ref=f1e65] [cursor=pointer]
            - generic [ref=f1e66]:
              - button [ref=f1e67] [cursor=pointer]:
                - img "Mèo Matcha" [ref=f1e68]
                - generic [ref=f1e69]:
                  - heading "Matcha" [level=4] [ref=f1e70]
                  - meter [ref=f1e72]
              - button [ref=f1e74] [cursor=pointer]:
                - img "Mèo Houji" [ref=f1e75]
                - generic [ref=f1e76]:
                  - heading "Houji" [level=4] [ref=f1e77]
                  - meter [ref=f1e79]
              - button [ref=f1e81] [cursor=pointer]:
                - img "Mèo Mochi" [ref=f1e82]
                - generic [ref=f1e83]:
                  - heading "Mochi" [level=4] [ref=f1e84]
                  - meter [ref=f1e86]
        - complementary [ref=f1e88]:
          - generic [ref=f1e89]:
            - heading "Khách đang chờ" [level=3] [ref=f1e90]
            - generic [ref=f1e91]: 0 đơn
          - paragraph [ref=f1e92]: Một món ngon, một nụ cười.
          - paragraph [ref=f1e95]: Khách sẽ đến sau khi bạn mở tiệm. Kho ban đầu đã sẵn sàng cho một ngày nhỏ.
          - generic [ref=f1e96]:
            - generic [ref=f1e97]:
              - strong [ref=f1e98]: "0"
              - text: đã phục vụ
            - generic [ref=f1e99]:
              - strong [ref=f1e100]: 92%
              - text: sạch sẽ
      - generic [ref=f1e101]:
        - generic [ref=f1e103]:
          - heading "Phục vụ 3 vị khách" [level=4] [ref=f1e104]
          - paragraph [ref=f1e105]: 0/3 · Mở sổ đời sống để nhận phần thưởng.
        - generic [ref=f1e106]:
          - generic [ref=f1e107]:
            - heading "Âm thanh của một buổi chiều" [level=4] [ref=f1e108]
            - paragraph [ref=f1e109]: Giai điệu tự tạo · tiếng mưa & mèo
          - button "Bật hoặc tắt nhạc" [ref=f1e110] [cursor=pointer]
      - generic [ref=f1e111]:
        - generic [ref=f1e112]: Miu Matcha · Được lưu trên thiết bị này
        - generic [ref=f1e113]: Nhận xét cục bộ · Không cần tài khoản
  - dialog "Đời sống tiệm" [ref=f1e115]:
    - banner [ref=f1e116]:
      - generic [ref=f1e117]:
        - paragraph [ref=f1e118]: MIU MATCHA · SỔ TIỆM
        - heading "Đời sống tiệm" [level=2] [ref=f1e119]
      - button "Đóng bảng" [ref=f1e120] [cursor=pointer]
    - generic [ref=f1e121]:
      - generic [ref=f1e122]:
        - button "Việc cần xử lý" [ref=f1e123] [cursor=pointer]
        - button "Nhiệm vụ" [ref=f1e124] [cursor=pointer]
        - button "Album & bộ sưu tập" [ref=f1e125] [cursor=pointer]
        - button "Khách quen" [ref=f1e126] [cursor=pointer]
        - button "Nhật ký" [ref=f1e127] [cursor=pointer]
        - button "Hoạt động quán" [ref=f1e128] [cursor=pointer]
      - generic [ref=f1e129]:
        - generic [ref=f1e130]:
          - heading "Workshop đánh trà" [level=3] [ref=f1e131]
          - paragraph [ref=f1e132]: Tổ chức buổi học khi đủ danh tiếng. Tiêu thụ trà, tăng gắn bó cộng đồng và ghi nhận doanh thu thật.
          - button "Tổ chức workshop" [ref=f1e133] [cursor=pointer]
        - generic [ref=f1e134]:
          - heading "Ngày hội nhận nuôi" [level=3] [ref=f1e135]
          - paragraph [ref=f1e136]: Hỗ trợ cộng đồng và tiến trình nhận nuôi. Có điều kiện và giới hạn mỗi ngày.
          - button "Chuẩn bị ngày hội" [ref=f1e137] [cursor=pointer]
        - generic [ref=f1e138]:
          - heading "Giới thiệu tiệm" [level=3] [ref=f1e139]
          - paragraph [ref=f1e140]: Chi 18.000đ cho một buổi giới thiệu, tăng lượng khách hôm nay trong giới hạn.
          - button "Quảng bá tiệm" [ref=f1e141] [cursor=pointer]
      - generic [ref=f1e142]:
        - heading "Quản lý bằng thao tác" [level=3] [ref=f1e143]
        - generic [ref=f1e144]:
          - button "Đối soát quầy tiền" [ref=f1e145] [cursor=pointer]
          - button "Kiểm kho" [ref=f1e146] [cursor=pointer]
          - button "Kiểm hàng nhập" [ref=f1e147] [cursor=pointer]
          - button "Xếp lịch ca" [ref=f1e148] [cursor=pointer]
          - button "Dọn tiệm" [ref=f1e149] [cursor=pointer]
          - button "Phân luồng giờ cao điểm" [ref=f1e150] [cursor=pointer]
          - button "Tìm đồ thất lạc" [ref=f1e151] [cursor=pointer]
          - button "Thử vị bí mật" [ref=f1e152] [cursor=pointer]
        - paragraph [ref=f1e153]: Đối soát, kiểm kho và điều phối sử dụng dữ kiện của tiệm. Các tác vụ lặp có thể giao nhân viên.
      - generic [ref=f1e154]:
        - heading "Góc thư giãn" [level=3] [ref=f1e155]
        - paragraph [ref=f1e156]: Mưa bên cửa sổ, mèo nằm ngủ. Tiệm không phạt bạn khi đóng trò chơi.
        - generic [ref=f1e157]:
          - button "Ngồi cùng Matcha" [ref=f1e158] [cursor=pointer]
          - button "Ngồi cùng Houji" [ref=f1e159] [cursor=pointer]
          - button "Ngồi cùng Mochi" [ref=f1e160] [cursor=pointer]
  - dialog [ref=f1e161]:
    - generic [ref=f1e162]:
      - generic [ref=f1e163]:
        - generic [ref=f1e164]:
          - text: XƯỞNG NHỎ MIU MATCHA
          - heading "Kiểm kho thật kỹ" [level=2] [ref=f1e165]
        - button "Đóng minigame" [ref=f1e166] [cursor=pointer]: Đóng
      - paragraph [ref=f1e167]: Mỗi hũ là một lô thực trong kho; nhãn ghi lượng còn lại. Cộng theo nguyên liệu, loại lô cách ly có vạch đỏ.
      - generic [ref=f1e168]:
        - generic [ref=f1e169]: 60 giây
        - progressbar [ref=f1e170]
        - button "Tiếp tục" [ref=f1e171] [cursor=pointer]
      - 'img "Kiểm kho thật kỹ: Mỗi hũ là một lô thực trong kho; nhãn ghi lượng còn lại. Cộng theo nguyên liệu, loại lô cách ly có vạch đỏ." [ref=f1e172]':
        - generic [ref=f1e174]:
          - generic [ref=f1e179]: "100"
          - generic [ref=f1e180]: Matcha
        - generic [ref=f1e181]:
          - generic [ref=f1e186]: "100"
          - generic [ref=f1e187]: Houjicha
        - generic [ref=f1e188]:
          - generic [ref=f1e193]: "100"
          - generic [ref=f1e194]: Matcha
      - generic [ref=f1e195]:
        - generic [ref=f1e196]:
          - text: Matcha khả dụng
          - spinbutton "Matcha khả dụng" [ref=f1e197]: "100"
        - generic [ref=f1e198]:
          - text: Houjicha khả dụng
          - spinbutton "Houjicha khả dụng" [active] [ref=f1e199]: "100"
      - paragraph [ref=f1e200]: Điểm theo sai lệch tồn khả dụng với các lô thực của quán.
      - generic [ref=f1e201]:
        - button "Bỏ thao tác" [ref=f1e202] [cursor=pointer]
        - button "Hoàn tất thao tác" [disabled] [ref=f1e203]
      - generic [ref=f1e204]:
        - paragraph [ref=f1e205]: Thao tác đã tạm dừng. Đồng hồ không trôi.
        - button "Tiếp tục" [ref=f1e206] [cursor=pointer]
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
> 26 | async function finish(page:Page,min:number){await page.getByRole('button',{name:'Hoàn tất thao tác',exact:true}).click();await expect(page.locator('.mg-result')).toBeVisible();const score=parseInt(await page.locator('.mg-result strong').innerText());expect(score).toBeGreaterThanOrEqual(min);await page.getByRole('button',{name:'Dùng kết quả',exact:true}).click();return score;}
     |                                                                                                                  ^ Error: locator.click: Test timeout of 60000ms exceeded.
  27 | async function activities(page:Page){await page.getByRole('button',{name:'Đời sống tiệm',exact:true}).click();await page.getByRole('button',{name:'Hoạt động quán',exact:true}).click();}
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