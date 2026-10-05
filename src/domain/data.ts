import type { Ingredient, Recipe, Formula, Customer, Cat, Staff, Cake, Supplier, Equipment, FurnitureDef, Settings } from './types';

export const ingredients: Ingredient[] = [
 ['matcha','Bột matcha','g',180,7],['houjicha','Bột houjicha','g',130,9],['sencha','Trà sencha','g',100,12],['genmaicha','Trà genmaicha','g',150,10],
 ['milk','Sữa tươi','ml',35,3],['oat','Sữa yến mạch','ml',45,4],['sugar','Đường','g',20,30],['strawberry','Syrup dâu','ml',95,5],['caramel','Caramel','ml',70,10],['lemon','Nước chanh','ml',50,3],['mango','Xoài','ml',85,3],
 ['cream','Kem sữa','g',65,3],['cheese','Kem cheese','g',90,3],['ice','Đá sạch','g',2,2],['pearl','Trân châu trắng','g',45,2],['jelly','Thạch trà','g',40,3],['redbean','Đậu đỏ','g',60,4],['flour','Bột bánh','g',20,20],['egg','Trứng','quả',3000,7],['butter','Bơ','g',90,10],['cocoa','Cacao','g',100,20],['catfood','Thức ăn mèo','g',35,14],
].map(([id,name,unit,price,shelfLife])=>({id,name,unit,price,shelfLife})) as Ingredient[];

export const baseFormula: Formula = {tea:'matcha',teaAmount:3,milk:'milk',milkAmount:140,sugar:12,syrup:'none',syrupAmount:0,ice:70,temperature:12,topping:'none',toppingAmount:0,dissolution:90,presentation:85};
const formula = (patch: Partial<Formula>): Formula => ({...baseFormula,...patch});
export const recipes: Recipe[] = [
 {id:'matcha-latte',name:'Matcha latte',price:35000,level:1,time:18,formula:formula({})},
 {id:'matcha-strawberry',name:'Matcha dâu',price:42000,level:1,time:22,formula:formula({syrup:'strawberry',syrupAmount:25,sugar:5})},
 {id:'matcha-salt',name:'Matcha kem muối',price:44000,level:1,time:25,formula:formula({topping:'cream',toppingAmount:30})},
 {id:'houjicha-latte',name:'Houjicha latte',price:35000,level:1,time:18,formula:formula({tea:'houjicha'})},
 {id:'houjicha-caramel',name:'Houjicha caramel',price:42000,level:1,time:24,formula:formula({tea:'houjicha',syrup:'caramel',syrupAmount:20,sugar:4})},
 {id:'sencha-lemon',name:'Sencha chanh',price:32000,level:1,time:16,formula:formula({tea:'sencha',milk:'none',milkAmount:0,syrup:'lemon',syrupAmount:30,sugar:18})},
 {id:'matcha-mango',name:'Matcha xoài',price:46000,level:2,time:25,formula:formula({syrup:'mango',syrupAmount:35,sugar:4})},
 {id:'houjicha-cheese',name:'Houjicha kem cheese',price:48000,level:3,time:28,formula:formula({tea:'houjicha',topping:'cheese',toppingAmount:30})},
 {id:'genmaicha-latte',name:'Genmaicha latte',price:45000,level:4,time:20,formula:formula({tea:'genmaicha'})},
 {id:'autumn-latte',name:'Latte mùa thu',price:50000,level:5,time:28,formula:formula({tea:'houjicha',syrup:'caramel',syrupAmount:15,topping:'redbean',toppingAmount:20,temperature:55,ice:0})},
];
export const cakes: Cake[] = [
 {id:'mochi',name:'Mochi',price:18000,level:1,ingredients:{flour:60,sugar:15,milk:30},time:32},
 {id:'cookie',name:'Cookie',price:16000,level:1,ingredients:{flour:70,butter:20,sugar:18,egg:1},time:40},
 {id:'cheesecake',name:'Cheesecake matcha',price:32000,level:2,ingredients:{flour:40,cheese:50,matcha:4,egg:1,sugar:20},time:55},
 {id:'brownie',name:'Brownie houjicha',price:28000,level:2,ingredients:{flour:50,houjicha:4,cocoa:15,butter:25,egg:1,sugar:20},time:48},
 {id:'tiramisu',name:'Tiramisu matcha',price:38000,level:3,ingredients:{flour:35,cream:50,matcha:5,egg:1,sugar:20},time:60},
];
export const customers: Customer[] = [
 ['linh','Linh','tinh tế','matcha',12,140,12,'none',65000,145,'mochi',[],['Mình đang tập vẽ cây ngoài cửa sổ.','Miu là nơi mình vẽ xong bức tranh đầu tiên.','Mình tặng quán một bức tranh nhỏ.']],
 ['an','An','ấm áp','houjicha',10,150,55,'cream',70000,170,'houji',[],['Mùi trà rang gợi nhớ những chiều bên bà.','Bà mình cũng thích houjicha.','Hôm nay mình đưa bà đến quán.']],
 ['mai','Mai','thẳng thắn','matcha',5,120,10,'jelly',58000,120,'matcha',['milk'],['Mình thích sữa yến mạch.','Món mới của bạn hợp với mình đấy.','Mình đã giới thiệu quán cho đồng nghiệp.']],
 ['bao','Bảo','vui tính','houjicha',18,160,12,'pearl',65000,130,'matcha',[],['Cho mình một ly trước giờ chạy bộ.','Matcha còn thích chuông hơn mình!','Mình muốn đặt tiệc nhỏ ở quán.']],
 ['vy','Vy','nhẹ nhàng','sencha',10,0,10,'none',50000,190,'mochi',['milk'],['Một trà sencha và một góc đọc sách nhé.','Quyển sách hôm nay kể về một chú mèo.','Mình để lại sách ở góc cộng đồng.']],
 ['minh','Minh','bận rộn','matcha',12,140,12,'none',55000,100,'sesame',[],['Mình mang đi, kịp chuyến xe nữa.','Hôm nay mình có thời gian ngồi một chút.','Có quán nhỏ khiến phố này dễ chịu hơn.']],
 ['thao','Thảo','tò mò','houjicha',8,130,55,'redbean',75000,160,'chestnut',[],['Mình muốn tìm hiểu cách đánh trà.','Bạn mở workshop chưa?','Mình đã tự đánh được một bát trà.']],
 ['nam','Nam','kiên nhẫn','sencha',15,0,15,'jelly',60000,180,'mochi',[],['Hôm nay trời đẹp quá.','Mochi cho mình vuốt má rồi.','Mình mang đệm mới đến tặng các bé.']],
 ['ha','Hà','cẩn thận','matcha',8,150,12,'cream',72000,150,'snow',[],['Cho mình ít đường thôi nhé.','Lớp kem vừa đủ là thích nhất.','Mình đặt combo cho nhóm bạn.']],
 ['duc','Đức','trầm lắng','houjicha',10,140,55,'none',70000,160,'houji',[],['Mình thích góc cửa sổ.','Nghe mưa và nhìn Houji ngủ thật yên.','Mình đem về một chiếc ly kỷ niệm.']],
 ['ngoc','Ngọc','năng động','matcha',16,150,12,'pearl',68000,125,'matcha',[],['Ly của mình thêm trân châu nhé.','Mèo chạy theo cần câu đáng yêu ghê.','Mình chụp bộ ảnh cho sinh nhật mèo.']],
 ['phuc','Phúc','chu đáo','houjicha',12,140,45,'none',80000,175,'chestnut',[],['Mình đến tìm quán cho buổi gặp bạn.','Quán giữ khu mèo riêng rất tốt.','Cảm ơn đã giúp tìm đồ mình bỏ quên.']],
].map(([id,name,personality,tea,sweet,creamy,temperature,topping,budget,patience,favoriteCat,avoid,story])=>({id,name,personality,tea,sweet,creamy,temperature,topping,budget,patience,favoriteCat,avoid,story})) as Customer[];
export const cats: Cat[] = [
 ['matcha','Matcha','Mướp tinh nghịch','feather','chin',true,70,75,90,90,30,'chơi chuông'],
 ['houji','Houji','Nâu ham ngủ','boxes','back',true,65,70,65,88,28,'ngủ cửa sổ'],
 ['mochi','Mochi','Trắng quấn người','train','cheek',true,72,82,85,94,42,'ngồi đệm'],
 ['sesame','Mè Đen','Tuxedo tò mò','ball','head',false,80,70,90,90,20,'chui hộp'],
 ['chestnut','Hạt Dẻ','Tam thể nhút nhát','hide','sniff',false,80,65,85,90,10,'nấp kệ'],
 ['snow','Tuyết','Bicolor điềm đạm','photo','back',false,80,75,90,95,25,'liếm chân'],
].map(([id,name,personality,favorite,spot,unlocked,hunger,joy,energy,cleanliness,trust,activity])=>({id,name,personality,favorite,spot,unlocked,hunger,joy,energy,cleanliness,trust,activity,cooldownUntil:0,interactions:0,gamesToday:0,expression:'bình yên',restingUntil:0,health:100})) as Cat[];
export const staff: Staff[] = [
 ['lan','Lan','barista',90000,1.1,82,75],['tuan','Tuấn','baker',95000,1,88,70],['yen','Yến','cashier',75000,1.2,70,90],['khoa','Khoa','carer',70000,1,80,85],['nhi','Nhi','manager',125000,1.3,90,94],['quang','Quang','barista',65000,.85,65,72],
].map(([id,name,role,salary,speed,skill,communication],index)=>({id,name,role,salary,speed,skill,communication,experience:0,energy:100,satisfaction:85,hired:false,former:false,onShift:false,secondsWorked:0,salaryPaidDay:0,trained:0,warnings:0,history:[],sensitiveAllowed:true,traits:{responsibility:72+index*3,motivation:80-index*2,attachment:70+index*2}})) as Staff[];
export const roleNames = {barista:'Pha chế',baker:'Thợ bánh',cashier:'Phục vụ / thu ngân',carer:'Chăm mèo',manager:'Quản lý ca'};
export const suppliers: Supplier[] = [
 {id:'local',name:'Vườn Trà Gần Nhà',multiplier:1,quality:85,delay:28,description:'Giá ổn định, giao trong 28 giây mô phỏng.'},
 {id:'premium',name:'Trà Xanh Chọn Lọc',multiplier:1.25,quality:98,delay:45,description:'Chất lượng cao, giao trong 45 giây.'},
 {id:'budget',name:'Kho Bếp Tiết Kiệm',multiplier:.8,quality:70,delay:65,description:'Tiết kiệm, kiểm tra nhãn khi nhận.'},
];
export const equipment: Equipment[] = [
 {id:'whisk',name:'Dụng cụ đánh trà',level:1,durability:100,baseCost:130000,broken:false},
 {id:'fridge',name:'Tủ lạnh',level:1,durability:100,baseCost:220000,broken:false},
 {id:'oven',name:'Lò bánh',level:1,durability:100,baseCost:180000,broken:false},
 {id:'ice',name:'Máy làm đá',level:1,durability:100,baseCost:160000,broken:false},
 {id:'register',name:'Máy tính tiền',level:1,durability:100,baseCost:120000,broken:false},
 {id:'camera',name:'Camera khu cửa (vùng cửa và quầy)',level:0,durability:100,baseCost:95000,broken:false},
 {id:'catgate',name:'Cửa ngăn khu mèo',level:1,durability:100,baseCost:80000,broken:false},
];
export const furniture: FurnitureDef[] = [
 {id:'table',name:'Bàn gỗ tròn',cost:95000,width:2,height:2,seats:2,comfort:4,cat:false,level:1},
 {id:'bench',name:'Ghế băng cửa sổ',cost:120000,width:3,height:1,seats:3,comfort:5,cat:false,level:2},
 {id:'cushion',name:'Đệm mèo lá trà',cost:45000,width:1,height:1,seats:0,comfort:3,cat:true,level:1},
 {id:'box',name:'Hộp khám phá',cost:30000,width:1,height:1,seats:0,comfort:2,cat:true,level:1},
 {id:'shelf',name:'Kệ leo thấp',cost:85000,width:2,height:1,seats:0,comfort:4,cat:true,level:2},
 {id:'plant',name:'Cây xanh an toàn',cost:40000,width:1,height:1,seats:0,comfort:3,cat:false,level:1},
 {id:'lamp',name:'Đèn gỗ ấm',cost:55000,width:1,height:1,seats:0,comfort:3,cat:false,level:2},
 {id:'rug',name:'Thảm hoa matcha',cost:65000,width:2,height:2,seats:0,comfort:4,cat:true,level:3},
 {id:'rest',name:'Góc nghỉ nhân viên',cost:90000,width:2,height:1,seats:0,comfort:3,cat:false,level:2},
 {id:'delivery',name:'Kệ xác minh đơn giao',cost:70000,width:1,height:1,seats:0,comfort:1,cat:false,level:2},
];
export const defaultSettings: Settings = {music:.25,effects:.45,reducedMotion:false,dayDuration:660,eventFrequency:'medium',theft:true,fraud:true,taxRate:.05,tutorial:true};
export const ingredientMap = Object.fromEntries(ingredients.map(i=>[i.id,i])) as Record<string, Ingredient>;
export const catalog = {ingredients,recipes,cakes,customers,cats,staff,suppliers,equipment,furniture};
