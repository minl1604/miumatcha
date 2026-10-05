# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: minigames.spec.ts >> lau từng vết bẩn bằng cảm ứng, tạm dừng giữ đồng hồ
- Location: tests\browser\minigames.spec.ts:54:1

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 95
Received:    92
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e7]:
      - text: Miu Matcha
      - emphasis [ref=e8]: TIỆM TRÀ & BÁNH MÈO
    - generic [ref=e9]:
      - generic [ref=e10]: 847.000 ₫
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
            - 'img "Cảnh quán Miu Matcha tương tác: quầy trà, tủ bánh, khách hàng và khu mèo" [ref=e55]':
              - generic [ref=e56] [cursor=pointer]
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
              - strong [ref=e97]: 100%
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
  - dialog "Kho nguyên liệu & lò bánh" [ref=e112]:
    - banner [ref=e113]:
      - generic [ref=e114]:
        - paragraph [ref=e115]: MIU MATCHA · SỔ TIỆM
        - heading "Kho nguyên liệu & lò bánh" [level=2] [ref=e116]
      - button "Đóng bảng" [ref=e117] [cursor=pointer]
    - generic [ref=e118]:
      - generic [ref=e119]:
        - button "Kho & nhập hàng" [ref=e120] [cursor=pointer]
        - button "Lò bánh" [ref=e121] [cursor=pointer]
        - button "Thiết bị" [ref=e122] [cursor=pointer]
      - generic [ref=e123]:
        - generic [ref=e124]: Nhà cung cấp
        - combobox "Nhà cung cấp" [ref=e125]:
          - option "Vườn Trà Gần Nhà" [selected]
          - option "Trà Xanh Chọn Lọc"
          - option "Kho Bếp Tiết Kiệm"
      - paragraph [ref=e126]: Giá ổn định, giao trong 28 giây mô phỏng. Hàng mua làm giảm tiền mặt và tăng kho; chỉ ghi giá vốn khi sử dụng.
      - table [ref=e128]:
        - rowgroup [ref=e129]:
          - row [ref=e130]:
            - columnheader "Nguyên liệu" [ref=e131]
            - columnheader "Tồn sẵn dùng" [ref=e132]
            - columnheader "Lô / hạn" [ref=e133]
            - columnheader "Nhập thêm" [ref=e134]
            - columnheader "Giá mua" [ref=e135]
        - rowgroup [ref=e136]:
          - row [ref=e137]:
            - cell [ref=e138]:
              - strong [ref=e139]: Bột matcha
              - paragraph [ref=e140]: 180 ₫/g
            - cell "100 g" [ref=e141]
            - cell [ref=e142]:
              - paragraph [ref=e143]: Ngày 7 · 100g
            - cell [ref=e144]:
              - spinbutton "Nhập Bột matcha" [ref=e145]: "100"
            - cell [ref=e146]:
              - button "18.000 ₫" [ref=e147] [cursor=pointer]
          - row [ref=e148]:
            - cell [ref=e149]:
              - strong [ref=e150]: Bột houjicha
              - paragraph [ref=e151]: 130 ₫/g
            - cell "100 g" [ref=e152]
            - cell [ref=e153]:
              - paragraph [ref=e154]: Ngày 9 · 100g
            - cell [ref=e155]:
              - spinbutton "Nhập Bột houjicha" [ref=e156]: "100"
            - cell [ref=e157]:
              - button "13.000 ₫" [ref=e158] [cursor=pointer]
          - row [ref=e159]:
            - cell [ref=e160]:
              - strong [ref=e161]: Trà sencha
              - paragraph [ref=e162]: 100 ₫/g
            - cell "70 g" [ref=e163]
            - cell [ref=e164]:
              - paragraph [ref=e165]: Ngày 12 · 70g
            - cell [ref=e166]:
              - spinbutton "Nhập Trà sencha" [ref=e167]: "100"
            - cell [ref=e168]:
              - button "10.000 ₫" [ref=e169] [cursor=pointer]
          - row [ref=e170]:
            - cell [ref=e171]:
              - strong [ref=e172]: Trà genmaicha
              - paragraph [ref=e173]: 150 ₫/g
            - cell "35 g" [ref=e174]
            - cell [ref=e175]:
              - paragraph [ref=e176]: Ngày 10 · 35g
            - cell [ref=e177]:
              - spinbutton "Nhập Trà genmaicha" [ref=e178]: "100"
            - cell [ref=e179]:
              - button "15.000 ₫" [ref=e180] [cursor=pointer]
          - row [ref=e181]:
            - cell [ref=e182]:
              - strong [ref=e183]: Sữa tươi
              - paragraph [ref=e184]: 35 ₫/ml
            - cell "2200 ml" [ref=e185]
            - cell [ref=e186]:
              - paragraph [ref=e187]: Ngày 3 · 2200ml
            - cell [ref=e188]:
              - spinbutton "Nhập Sữa tươi" [ref=e189]: "500"
            - cell [ref=e190]:
              - button "17.500 ₫" [ref=e191] [cursor=pointer]
          - row [ref=e192]:
            - cell [ref=e193]:
              - strong [ref=e194]: Sữa yến mạch
              - paragraph [ref=e195]: 45 ₫/ml
            - cell "900 ml" [ref=e196]
            - cell [ref=e197]:
              - paragraph [ref=e198]: Ngày 4 · 900ml
            - cell [ref=e199]:
              - spinbutton "Nhập Sữa yến mạch" [ref=e200]: "500"
            - cell [ref=e201]:
              - button "22.500 ₫" [ref=e202] [cursor=pointer]
          - row [ref=e203]:
            - cell [ref=e204]:
              - strong [ref=e205]: Đường
              - paragraph [ref=e206]: 20 ₫/g
            - cell "500 g" [ref=e207]
            - cell [ref=e208]:
              - paragraph [ref=e209]: Ngày 30 · 500g
            - cell [ref=e210]:
              - spinbutton "Nhập Đường" [ref=e211]: "100"
            - cell [ref=e212]:
              - button "2.000 ₫" [ref=e213] [cursor=pointer]
          - row [ref=e214]:
            - cell [ref=e215]:
              - strong [ref=e216]: Syrup dâu
              - paragraph [ref=e217]: 95 ₫/ml
            - cell "300 ml" [ref=e218]
            - cell [ref=e219]:
              - paragraph [ref=e220]: Ngày 5 · 300ml
            - cell [ref=e221]:
              - spinbutton "Nhập Syrup dâu" [ref=e222]: "500"
            - cell [ref=e223]:
              - button "47.500 ₫" [ref=e224] [cursor=pointer]
          - row [ref=e225]:
            - cell [ref=e226]:
              - strong [ref=e227]: Caramel
              - paragraph [ref=e228]: 70 ₫/ml
            - cell "300 ml" [ref=e229]
            - cell [ref=e230]:
              - paragraph [ref=e231]: Ngày 10 · 300ml
            - cell [ref=e232]:
              - spinbutton "Nhập Caramel" [ref=e233]: "500"
            - cell [ref=e234]:
              - button "35.000 ₫" [ref=e235] [cursor=pointer]
          - row [ref=e236]:
            - cell [ref=e237]:
              - strong [ref=e238]: Nước chanh
              - paragraph [ref=e239]: 50 ₫/ml
            - cell "250 ml" [ref=e240]
            - cell [ref=e241]:
              - paragraph [ref=e242]: Ngày 3 · 250ml
            - cell [ref=e243]:
              - spinbutton "Nhập Nước chanh" [ref=e244]: "500"
            - cell [ref=e245]:
              - button "25.000 ₫" [ref=e246] [cursor=pointer]
          - row [ref=e247]:
            - cell [ref=e248]:
              - strong [ref=e249]: Xoài
              - paragraph [ref=e250]: 85 ₫/ml
            - cell "200 ml" [ref=e251]
            - cell [ref=e252]:
              - paragraph [ref=e253]: Ngày 3 · 200ml
            - cell [ref=e254]:
              - spinbutton "Nhập Xoài" [ref=e255]: "500"
            - cell [ref=e256]:
              - button "42.500 ₫" [ref=e257] [cursor=pointer]
          - row [ref=e258]:
            - cell [ref=e259]:
              - strong [ref=e260]: Kem sữa
              - paragraph [ref=e261]: 65 ₫/g
            - cell "300 g" [ref=e262]
            - cell [ref=e263]:
              - paragraph [ref=e264]: Ngày 3 · 300g
            - cell [ref=e265]:
              - spinbutton "Nhập Kem sữa" [ref=e266]: "100"
            - cell [ref=e267]:
              - button "6.500 ₫" [ref=e268] [cursor=pointer]
          - row [ref=e269]:
            - cell [ref=e270]:
              - strong [ref=e271]: Kem cheese
              - paragraph [ref=e272]: 90 ₫/g
            - cell "180 g" [ref=e273]
            - cell [ref=e274]:
              - paragraph [ref=e275]: Ngày 3 · 180g
            - cell [ref=e276]:
              - spinbutton "Nhập Kem cheese" [ref=e277]: "100"
            - cell [ref=e278]:
              - button "9.000 ₫" [ref=e279] [cursor=pointer]
          - row [ref=e280]:
            - cell [ref=e281]:
              - strong [ref=e282]: Đá sạch
              - paragraph [ref=e283]: 2 ₫/g
            - cell "1800 g" [ref=e284]
            - cell [ref=e285]:
              - paragraph [ref=e286]: Ngày 2 · 1800g
            - cell [ref=e287]:
              - spinbutton "Nhập Đá sạch" [ref=e288]: "100"
            - cell [ref=e289]:
              - button "200 ₫" [ref=e290] [cursor=pointer]
          - row [ref=e291]:
            - cell [ref=e292]:
              - strong [ref=e293]: Trân châu trắng
              - paragraph [ref=e294]: 45 ₫/g
            - cell "250 g" [ref=e295]
            - cell [ref=e296]:
              - paragraph [ref=e297]: Ngày 2 · 250g
            - cell [ref=e298]:
              - spinbutton "Nhập Trân châu trắng" [ref=e299]: "100"
            - cell [ref=e300]:
              - button "4.500 ₫" [ref=e301] [cursor=pointer]
          - row [ref=e302]:
            - cell [ref=e303]:
              - strong [ref=e304]: Thạch trà
              - paragraph [ref=e305]: 40 ₫/g
            - cell "250 g" [ref=e306]
            - cell [ref=e307]:
              - paragraph [ref=e308]: Ngày 3 · 250g
            - cell [ref=e309]:
              - spinbutton "Nhập Thạch trà" [ref=e310]: "100"
            - cell [ref=e311]:
              - button "4.000 ₫" [ref=e312] [cursor=pointer]
          - row [ref=e313]:
            - cell [ref=e314]:
              - strong [ref=e315]: Đậu đỏ
              - paragraph [ref=e316]: 60 ₫/g
            - cell "200 g" [ref=e317]
            - cell [ref=e318]:
              - paragraph [ref=e319]: Ngày 4 · 200g
            - cell [ref=e320]:
              - spinbutton "Nhập Đậu đỏ" [ref=e321]: "100"
            - cell [ref=e322]:
              - button "6.000 ₫" [ref=e323] [cursor=pointer]
          - row [ref=e324]:
            - cell [ref=e325]:
              - strong [ref=e326]: Bột bánh
              - paragraph [ref=e327]: 20 ₫/g
            - cell "700 g" [ref=e328]
            - cell [ref=e329]:
              - paragraph [ref=e330]: Ngày 20 · 700g
            - cell [ref=e331]:
              - spinbutton "Nhập Bột bánh" [ref=e332]: "100"
            - cell [ref=e333]:
              - button "2.000 ₫" [ref=e334] [cursor=pointer]
          - row [ref=e335]:
            - cell [ref=e336]:
              - strong [ref=e337]: Trứng
              - paragraph [ref=e338]: 3.000 ₫/quả
            - cell "12 quả" [ref=e339]
            - cell [ref=e340]:
              - paragraph [ref=e341]: Ngày 7 · 12quả
            - cell [ref=e342]:
              - spinbutton "Nhập Trứng" [ref=e343]: "5"
            - cell [ref=e344]:
              - button "15.000 ₫" [ref=e345] [cursor=pointer]
          - row [ref=e346]:
            - cell [ref=e347]:
              - strong [ref=e348]: Bơ
              - paragraph [ref=e349]: 90 ₫/g
            - cell "250 g" [ref=e350]
            - cell [ref=e351]:
              - paragraph [ref=e352]: Ngày 10 · 250g
            - cell [ref=e353]:
              - spinbutton "Nhập Bơ" [ref=e354]: "100"
            - cell [ref=e355]:
              - button "9.000 ₫" [ref=e356] [cursor=pointer]
          - row [ref=e357]:
            - cell [ref=e358]:
              - strong [ref=e359]: Cacao
              - paragraph [ref=e360]: 100 ₫/g
            - cell "180 g" [ref=e361]
            - cell [ref=e362]:
              - paragraph [ref=e363]: Ngày 20 · 180g
            - cell [ref=e364]:
              - spinbutton "Nhập Cacao" [ref=e365]: "100"
            - cell [ref=e366]:
              - button "10.000 ₫" [ref=e367] [cursor=pointer]
          - row [ref=e368]:
            - cell [ref=e369]:
              - strong [ref=e370]: Thức ăn mèo
              - paragraph [ref=e371]: 35 ₫/g
            - cell "900 g" [ref=e372]
            - cell [ref=e373]:
              - paragraph [ref=e374]: Ngày 14 · 900g
            - cell [ref=e375]:
              - spinbutton "Nhập Thức ăn mèo" [ref=e376]: "100"
            - cell [ref=e377]:
              - button "3.500 ₫" [ref=e378] [cursor=pointer]
      - generic [ref=e379]:
        - heading "Các chuyến giao hàng" [level=3] [ref=e380]
        - paragraph [ref=e383]: Chưa có chuyến hàng mới.
      - button "Kiểm hàng nhập" [ref=e384] [cursor=pointer]
  - status [ref=e385]: Đã dọn lối đi, đặt biển và giữ khu mèo tách biệt.
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
> 62 |   await page.screenshot({path:info.outputPath('clean-touch.png')});await finish(page,100);expect((await getGame(page)).hygiene).toBeGreaterThanOrEqual(95);
     |                                                                                                                                 ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
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