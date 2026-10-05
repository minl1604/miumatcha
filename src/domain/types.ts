export type Phase = 'preparation' | 'open' | 'closing' | 'after';
export type Mode = 'relax' | 'business';
export type Tea = 'matcha' | 'houjicha' | 'sencha' | 'genmaicha';
export type IngredientId = Tea | 'milk' | 'oat' | 'sugar' | 'strawberry' | 'caramel' | 'lemon' | 'mango' | 'cream' | 'cheese' | 'ice' | 'pearl' | 'jelly' | 'redbean' | 'flour' | 'egg' | 'butter' | 'cocoa' | 'catfood';
export interface Ingredient { id: IngredientId; name: string; unit: string; price: number; shelfLife: number; }
export interface Batch { id: string; ingredient: IngredientId; quantity: number; unitCost: number; expiresDay: number; quality: number; quarantined?: boolean; }
export interface Formula { tea: Tea; teaAmount: number; milk: 'milk' | 'oat' | 'none'; milkAmount: number; sugar: number; syrup: 'none' | 'strawberry' | 'caramel' | 'lemon' | 'mango'; syrupAmount: number; ice: number; temperature: number; topping: 'none' | 'cream' | 'cheese' | 'pearl' | 'jelly' | 'redbean'; toppingAmount: number; dissolution: number; presentation: number; }
export interface Recipe { id: string; name: string; price: number; level: number; time: number; formula: Formula; custom?: boolean; }
export interface Customer { id: string; name: string; personality: string; tea: Tea; sweet: number; creamy: number; temperature: number; topping: Formula['topping']; budget: number; patience: number; favoriteCat: string; avoid: IngredientId[]; story: string[]; }
export interface DrinkScore { requirement: number; taste: number; technique: number; temperature: number; presentation: number; total: number; feedback: string; }
export interface Draft { id: string; formula: Formula; cost: number; technique: number; steps: string[]; worker?: string; ingredientQuality?: number; }
export interface Order { id: string; customerId: string; recipeId: string; requested: Formula; price: number; createdAt: number; remaining: number; status: 'waiting' | 'making' | 'ready' | 'served' | 'left' | 'discarded'; kind: 'table' | 'takeaway' | 'delivery' | 'combo'; draft?: Draft; score?: DrinkScore; service?: number; worker?: string; paid: boolean; cake?: string; refunded: number; discount?: number; lingerUntil?: number; seatReleased?: boolean; serviceAdjustment?: number; visitId?: string; }
export interface Cat { id: string; name: string; personality: string; favorite: string; spot: string; unlocked: boolean; hunger: number; joy: number; energy: number; cleanliness: number; trust: number; cooldownUntil: number; interactions: number; gamesToday: number; expression: string; activity: string; restingUntil: number; health: number; }
export type Role = 'barista' | 'baker' | 'cashier' | 'carer' | 'manager';
export interface Staff { id: string; name: string; role: Role; salary: number; speed: number; skill: number; communication: number; experience: number; energy: number; satisfaction: number; hired: boolean; former: boolean; onShift: boolean; taskId?: string; hireDay?: number; secondsWorked: number; salaryPaidDay: number; trained: number; warnings: number; history: string[]; sensitiveAllowed: boolean; traits: { responsibility: number; motivation: number; attachment: number }; noticeDay?: number; }
export interface Task { id: string; type: 'drink' | 'bake' | 'serve' | 'cat' | 'clean' | 'inspect'; workerId: string; targetId?: string; remaining: number; duration: number; status: 'working' | 'done' | 'handed-over'; claimed: boolean; result?: string; }
export interface Baking { id: string; cakeId: string; elapsed: number; readyAt: number; burnAt: number; cost: number; status: 'oven' | 'ready' | 'burned' | 'taken'; decoration: number; workerId?: string; ingredientQuality?: number; }
export interface Cake { id: string; name: string; price: number; level: number; ingredients: Partial<Record<IngredientId, number>>; time: number; }
export interface CakeStock { id: string; cakeId: string; quantity: number; quality: number; cost: number; expiresDay: number; }
export interface Supplier { id: string; name: string; multiplier: number; quality: number; delay: number; description: string; }
export interface Delivery { id: string; ingredient: IngredientId; quantity: number; unitCost: number; quality: number; remaining: number; supplierId: string; status: 'travel' | 'arrived' | 'quarantined' | 'returned'; batchId?: string; expectedQuantity?: number; discrepancy?: number; inspected?: boolean; expectedQuality?: number; receivedQuantity?: number; }
export interface Equipment { id: string; name: string; level: number; durability: number; baseCost: number; broken: boolean; }
export interface FurnitureDef { id: string; name: string; cost: number; width: number; height: number; seats: number; comfort: number; cat: boolean; level: number; }
export interface PlacedFurniture { id: string; kind: string; x: number; y: number; rotation: number; }
export interface Transaction { id: string; day: number; at: number; category: string; label: string; cash: number; revenue: number; cogs: number; expense: number; investment: number; debt: number; orderId?: string; ingredient?: IngredientId; quantity?: number; used?: { ingredient: IngredientId; quantity: number; cost: number }[]; gross?: number; discount?: number; loanId?: string; ingredientQuality?: number; }
export interface Payable { id: string; label: string; amount: number; dueDay: number; category: string; paid: boolean; extended: boolean; loanId?: string; }
export interface Loan { id: string; principal: number; remaining: number; rate: number; installment: number; nextDay: number; arrears?: number; }
export interface Report { day: number; revenue: number; discounts: number; refunds: number; netRevenue: number; cogs: number; operating: number; tax: number; profit: number; startCash: number; endCash: number; cashFlow: number; investment: number; financing: number; liabilities: number; served: number; lost: number; averageOrder: number; drinkScore: number; serviceScore: number; bestSeller: string; mostProfitable: string; waste: { ingredient: string; quantity: number; cost: number }[]; suggestions: string[]; categories: Record<string, number>; }
export interface Evidence { id: string; label: string; fact: string; confidence: number; checked: boolean; }
export interface IncidentChoice { id: string; label: string; description: string; cost: number; duration: number; requiresEvidence?: number; }
export interface Incident { id: string; type: string; title: string; description: string; sign: string; stage: 'observed' | 'investigating' | 'resolved'; createdAt: number; day: number; severity: 'light' | 'serious' | 'positive'; participants: string[]; evidence: Evidence[]; choices: IncidentChoice[]; cause: 'accident' | 'miscount' | 'misunderstanding' | 'procedure' | 'fraud' | 'theft' | 'positive'; lossCash: number; lossIngredient?: IngredientId; lossQuantity: number; resolvedChoice?: string; outcome?: string; resolving?: { choice: string; remaining: number }; orderId?: string; deliveryId?: string; furnitureId?: string; lostFurniture?: PlacedFurniture; insuranceEligible?: boolean; }
export interface JournalEntry { id: string; day: number; at: number; text: string; kind: 'info' | 'event' | 'cat' | 'finance' | 'staff'; }
export interface AlbumPhoto { id: string; catId: string; day: number; caption: string; pose: string; }
export interface Mission { id: string; title: string; target: number; progress: number; reward: number; claimed: boolean; kind: 'serve' | 'cat' | 'bake' | 'clean' | 'photo' | 'quality'; }
export interface Settings { music: number; effects: number; reducedMotion: boolean; dayDuration: number; eventFrequency: 'low' | 'medium' | 'high'; theft: boolean; fraud: boolean; taxRate: number; tutorial: boolean; }
export interface GameState { version: 3; id: string; sequence: number; seed: number; day: number; phase: Phase; elapsed: number; clock: number; dayDuration: number; closingElapsed: number; paused: boolean; mode: Mode; cash: number; startCash: number; reserve: number; reputation: number; level: number; xp: number; hygiene: number; inventory: Batch[]; orders: Order[]; recipes: Recipe[]; menu: string[]; customers: Record<string, { visits: number; affinity: number; loyalty: number; story: number }>; cats: Cat[]; staff: Staff[]; tasks: Task[]; baking: Baking[]; cakes: CakeStock[]; deliveries: Delivery[]; equipment: Equipment[]; furniture: PlacedFurniture[]; storage: { id: string; kind: string }[]; transactions: Transaction[]; payables: Payable[]; loans: Loan[]; reports: Report[]; incidents: Incident[]; journal: JournalEntry[]; album: AlbumPhoto[]; missions: Mission[]; flags: Record<string, number | boolean | string>; tutorial: number; settings: Settings; weather: 'sun' | 'rain' | 'cool'; nextCustomerAt: number; nextIncidentAt: number; insured: boolean; insuranceClaimDay: number; collection: string[]; lastMessage: string; avatar: { hair: number; skin: number; outfit: number }; }
export type CatInteraction = 'head' | 'cheek' | 'back' | 'chin' | 'paw' | 'sniff' | 'call' | 'treat' | 'brush' | 'lap' | 'photo' | 'rest' | 'vet';
export type GameAction =
 | { type: 'STEP'; seconds?: number }
 | { type: 'PAUSE'; paused?: boolean }
 | { type: 'OPEN' | 'CLOSE' | 'NEXT_DAY' | 'CLEAN' }
 | { type: 'ORDER'; customerId?: string; recipeId?: string; kind?: Order['kind'] }
 | { type: 'START_DRINK'; orderId: string; formula?: Formula }
 | { type: 'ADJUST_DRINK'; orderId: string; patch: Partial<Formula> }
 | { type: 'FINISH_DRINK'; orderId: string; scores?: { whisk?: number; pour?: number; layer?: number; shake?: number }; technique?: number }
 | { type: 'SERVE' | 'DISCARD'; orderId: string }
 | { type: 'REFUND'; orderId: string; amount: number }
 | { type: 'BUY_INGREDIENT'; ingredient: IngredientId; quantity: number; supplierId: string }
 | { type: 'BAKE'; cakeId: string; decoration?: number }
 | { type: 'TAKE_BAKE'; bakingId: string; decoration?: number }
 | { type: 'CAT_INTERACT'; catId: string; interaction: CatInteraction }
 | { type: 'CAT_GAME'; catId: string; game: 'feather' | 'ball' | 'hide' | 'boxes' | 'trail' | 'train' | 'photo'; score: number }
 | { type: 'ADOPT'; catId: string }
 | { type: 'HIRE'; staffId: string }
 | { type: 'ASSIGN'; staffId: string; task: Task['type']; targetId?: string }
 | { type: 'FIRE'; staffId: string; reason: string; confirm: boolean }
 | { type: 'STAFF_ACTION'; staffId: string; action: 'shift' | 'rest' | 'train' | 'bonus' | 'warn' | 'restrict' | 'transfer' | 'meal' | 'promote' | 'raise'; role?: Role }
 | { type: 'BUY_FURNITURE'; kind: string }
 | { type: 'PLACE_FURNITURE'; furnitureId: string; x: number; y: number; rotation: number }
 | { type: 'STORE_FURNITURE'; furnitureId: string }
 | { type: 'UPGRADE' | 'REPAIR' | 'SELL_EQUIPMENT'; equipmentId: string }
 | { type: 'INVESTIGATE'; incidentId: string; evidenceId: string }
 | { type: 'RESOLVE'; incidentId: string; choiceId: string }
 | { type: 'SAVE_RECIPE'; recipe: Recipe }
 | { type: 'PRICE'; recipeId: string; price: number }
 | { type: 'MENU'; recipeId: string; enabled: boolean }
 | { type: 'SETTINGS'; patch: Partial<Settings> }
 | { type: 'CLAIM_MISSION'; missionId: string }
 | { type: 'LOAN'; amount: number }
 | { type: 'REPAY'; loanId: string; amount: number }
 | { type: 'RESERVE'; amount: number }
 | { type: 'INSURE' }
 | { type: 'PAY_BILL' | 'EXTEND_BILL'; payableId: string }
 | { type: 'RETURN_DELIVERY'; deliveryId: string }
 | { type: 'MARKETING' | 'WORKSHOP' | 'COMMUNITY' }
 | { type: 'AUDIT'; kind: 'cash' | 'count' | 'inspect'; transactionIds?: string[]; inventoryCount?: { ingredient: string; quantity: number }[]; deliveryIds?: string[]; quarantineIds?: string[] }
 | { type: 'AVATAR'; patch: Partial<GameState['avatar']> }
 | { type: 'TUTORIAL'; step: number };
