import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import manifestSource from './assetsManifest.json';
import type { CafeSceneProps, SceneAction, SceneView } from './sceneTypes';

type Asset = { path: string; width: number; height: number; frames: number; frameWidth: number; frameHeight: number; group: string };
const manifest = manifestSource as unknown as { assets: Record<string, Asset>; humanStates: string[]; catStates: string[] };
type Person = { sprite: Phaser.GameObjects.Sprite; label: Phaser.GameObjects.Text; bubble: Phaser.GameObjects.Container; x: number; y: number; targetX: number; targetY: number; phase: number; appearance: string; kind: 'customer' | 'staff' | 'player' | 'event'; status: string; route: {x:number;y:number}[]; };
type CatActor = { sprite: Phaser.GameObjects.Sprite; label: Phaser.GameObjects.Text; x: number; y: number; targetX: number; targetY: number; phase: number; appearance: string; energy: number; mood: number; expression: string; activity: string; reactionUntil: number };
type Bridge = { view: SceneView; onSelect: CafeSceneProps['onSelect']; onPlace?: CafeSceneProps['onPlace'] };
const WIDTH = 1120, HEIGHT = 740;
const gridToWorld = (x: number, y: number) => ({ x: 120 + x * 60, y: 245 + y * 37 });
const frameIndex = (state: string, cat = false) => (cat ? manifest.catStates : manifest.humanStates).indexOf(state);
const normalAppearance = (kind: 'customer' | 'staff' | 'cat', appearance: number | string) => {
 if (typeof appearance === 'number') return `${kind}-${Math.abs(appearance) % (kind === 'customer' ? 12 : 6)}`;
 if (manifest.assets[appearance]) return appearance;
 const digits = appearance.match(/\d+/)?.[0];
 return `${kind}-${digits ? +digits % (kind === 'customer' ? 12 : 6) : 0}`;
};
const playerAppearance = (player: SceneView['player']) => {
 const choice = (value: string | number, names: string[]) => typeof value === 'number' ? Math.abs(value) % 3 : Math.max(0, names.indexOf(value));
 return `player-${choice(player.hair, ['bob', 'short', 'bun'])}-${choice(player.skin, ['light', 'tan', 'deep'])}-${choice(player.outfit, ['matcha', 'cream', 'rose'])}`;
};

class CafeWorld extends Phaser.Scene {
 private bridge: Bridge;
 private people = new Map<string, Person>();
 private cats = new Map<string, CatActor>();
 private furniture = new Map<string, { signature: string; object: Phaser.GameObjects.Container }>();
 private decorGrid?: Phaser.GameObjects.Graphics;
 private night?: Phaser.GameObjects.Rectangle;
 private rain?: Phaser.GameObjects.Graphics;
 private steam: Phaser.GameObjects.Sprite[] = [];
 private pour?: Phaser.GameObjects.Sprite;
 private entrance?: Phaser.GameObjects.Sprite;
 private bell?: Phaser.GameObjects.Sprite;
 private ovenGlow?: Phaser.GameObjects.Ellipse;
 private doorUntil = 0;
 private bellUntil = 0;
 private lastSignature = '';
 private routeLayout = '';
 private selection?: Phaser.GameObjects.Ellipse;
 private selectedUntil = 0;
 private worldClock = 0;
 private caption?: Phaser.GameObjects.Text;

 constructor(bridge: Bridge) { super('CafeWorld'); this.bridge = bridge; }
 preload() {
   for (const [key, info] of Object.entries(manifest.assets)) {
     if (key.startsWith('portrait-') || key.startsWith('icon-') || info.group === 'ui') continue;
     this.load.svg(key, info.path, { width: info.width, height: info.height });
   }
 }
 private image(key: string, x: number, y: number, scale = 1, depth = y) {
   return this.add.image(x, y, key).setOrigin(.5, 1).setScale(scale).setDepth(depth);
 }
 private text(x: number, y: number, text: string, size = 12, color = '#66513f', depth = 1000) {
   return this.add.text(x, y, text, { fontFamily: 'system-ui, sans-serif', fontSize: `${size}px`, color, align: 'center' }).setOrigin(.5, .5).setDepth(depth);
 }
 private station(key: string, x: number, y: number, scale: number, action: SceneAction, label: string, id?: string) {
   const object = this.image(key, x, y, scale);
   object.setInteractive({ useHandCursor: true, pixelPerfect: false });
   object.on('pointerover', () => { if(this.bridge.view.interactive===false)return; object.setTint(0xf4f7db); this.caption?.setText(label); });
   object.on('pointerout', () => { object.clearTint(); this.caption?.setText('Chạm vào người, mèo hoặc đồ vật trong quán'); });
   object.on('pointerdown', (pointer: Phaser.Input.Pointer) => { if(this.bridge.view.interactive===false)return; pointer.event?.stopPropagation(); this.select(x, y - 12); if (action === 'order') this.bellUntil = this.worldClock + 1; this.bridge.onSelect(action, id); });
   return object;
 }
 private select(x: number, y: number) {
   this.selection?.setPosition(x, y).setVisible(true);
   this.selectedUntil = this.worldClock + 1.4;
   // A small authored sparkle responds to each object selection.
   for (let i = 0; i < 5; i++) {
    const sprite = this.image('sparkle', x + (i - 2) * 14, y - 15 - Math.abs(i - 2) * 8, .25, 1500);
    this.tweens.add({ targets: sprite, y: sprite.y - 22, alpha: 0, duration: this.bridge.view.reducedMotion ? 120 : 650, onComplete: () => sprite.destroy() });
   }
 }
 create() {
   this.input.enabled=this.bridge.view.interactive!==false;
   for (const [key, info] of Object.entries(manifest.assets)) {
    if (!this.textures.exists(key) || info.frames <= 1) continue;
    const texture = this.textures.get(key);
    for (let i = 0; i < info.frames; i++) texture.add(i, 0, i * info.frameWidth, 0, info.frameWidth, info.frameHeight);
   }
   this.cameras.main.setBackgroundColor('#e2decb');
   this.add.rectangle(566, 397, 1058, 646, 0x9b8061, .2).setDepth(-4);
   this.image('street', 560, 100, 1, -3);
   this.image('floor', 575, 734, 1, -2);
   this.image('wall', 575, 223, 1, -1);
   this.add.rectangle(48, 464, 12, 530, 0xb28863).setDepth(2);
   this.add.rectangle(1104, 466, 12, 532, 0xb28863).setDepth(2);
   this.add.rectangle(575, 733, 1055, 9, 0xaa7c54).setDepth(1000);
   this.image('window', 198, 205, .91, 3);
   this.image('window', 678, 205, .91, 3);
   this.image('window', 956, 205, .91, 3);
   this.image('awning', 562, 105, .68, 4);
   this.image('sign', 433, 187, .91, 5);
   this.image('hanging-plant', 78, 217, .84, 6);
   this.image('hanging-plant', 1061, 219, .84, 6);
   // Shadow and tiled work surface define the preparation area.
   const tiles = this.add.graphics().setDepth(0);
   tiles.fillStyle(0xe6dfc4, .88); tiles.fillRoundedRect(80, 220, 650, 106, 10);
   tiles.lineStyle(1, 0xb5b797, .4);
   for (let x = 85; x < 730; x += 28) tiles.lineBetween(x, 221, x, 325);
   for (let y = 225; y < 326; y += 25) tiles.lineBetween(81, y, 729, y);
   this.station('fridge', 108, 315, .67, 'stock', 'Tủ lạnh · quản lý nguyên liệu', 'fridge');
   this.station('shelf', 690, 319, .67, 'stock', 'Kho nguyên liệu · nhập hàng', 'shelf');
   this.station('oven', 424, 300, .67, 'bakery', 'Lò bánh · nướng và trang trí', 'oven');
   this.station('sink', 560, 287, .72, 'brew', 'Rửa dụng cụ · pha trà', 'sink');
   this.station('ice-maker', 625, 303, .54, 'stock', 'Máy đá · bảo trì thiết bị', 'ice-maker');
   this.station('counter', 295, 353, 1.04, 'brew', 'Quầy trà · chạm để pha chế').setScale(1.04,.7);
   this.station('bakery', 578, 354, 1.06, 'bakery', 'Tủ bánh · làm bánh và giao combo');
   this.station('whisk', 268, 286, .73, 'brew', 'Bát matcha · đánh trà').setDepth(360);
   this.station('register', 397, 285, .61, 'order', 'Quầy thu ngân · hàng chờ').setDepth(360);
   this.bell = this.add.sprite(458, 309, 'bell', 0).setOrigin(.5, 1).setScale(.62).setDepth(310).setInteractive({useHandCursor: true});
   this.bell.on('pointerdown', () => { if(this.bridge.view.interactive===false)return; this.bellUntil = this.worldClock + 1.2; this.bridge.onSelect('order'); });
   this.ovenGlow = this.add.ellipse(424, 260, 47, 23, 0xf2c476, .13).setDepth(301);
   this.image('matcha', 175, 278, .5, 360);
   this.image('houjicha', 212, 278, .46, 360);
   this.image('milk', 336, 279, .48, 360);
   this.image('matcha-latte', 310, 299, .59, 360);
   this.text(283, 340, 'TRÀ TƯƠI MỖI NGÀY', 9, '#82634b', 355);
   this.text(578, 342, 'BÁNH NHÀ LÀM', 9, '#80624b', 356);
   // Cat room is physically separate from the kitchen with a low gate.
   this.add.rectangle(943, 486, 308, 389, 0xb9c5a3, .42).setDepth(0);
   this.add.rectangle(790, 408, 7, 170, 0xd4bd92).setDepth(1);
   this.add.rectangle(790, 617, 7, 90, 0xd4bd92).setDepth(1);
   this.image('fence', 852, 351, .84, 352);
   this.image('fence', 971, 351, .84, 352);
   this.image('rug', 935, 607, .95, 2);
   this.station('cat-tree', 991, 465, .96, 'cat', 'Kệ leo · khu chơi của các bé');
   this.station('bench', 910, 415, .91, 'cat', 'Ghế cửa sổ · góc ngủ và ngắm mưa');
   this.station('toy', 841, 491, .72, 'cat', 'Cần câu lông vũ · chơi với mèo');
   this.station('cat-food', 1025, 648, .6, 'cat', 'Góc ăn · chăm sóc các bé');
   this.image('plant', 754, 381, .8, 381);
   this.image('plant', 1048, 563, .85, 563);
   this.image('plant', 88, 689, .95, 689);
   this.image('lamp', 719, 651, .95, 650);
   this.image('bin', 100, 384, .63, 384);
   this.text(944, 326, 'GÓC CỦA CÁC BÉ', 11, '#62744f', 400);
   // South entrance corresponds to the clear, reserved route in the 16×12 grid.
   this.add.ellipse(570, 707, 128, 23, 0x879b6e, .85).setDepth(3);
   this.add.rectangle(570, 718, 126, 12, 0xc99f73).setDepth(4);
   this.text(570, 704, 'chào bạn đến chơi', 10, '#fff0d4', 5);
   this.entrance = this.add.sprite(570, 738, 'entrance', 0).setOrigin(.5, 1).setDepth(1010);
   this.selection = this.add.ellipse(0, 0, 74, 25, 0xffffff, 0).setStrokeStyle(3, 0xf9eab1).setDepth(1450).setVisible(false);
   this.decorGrid = this.add.graphics().setDepth(1100).setVisible(false);
   this.caption = this.text(566, 729, 'Chạm vào người, mèo hoặc đồ vật trong quán', 10, '#836a50', 1600).setAlpha(.85);
   this.night = this.add.rectangle(560, 370, WIDTH, HEIGHT, 0x565d75, 0).setDepth(1200);
   this.rain = this.add.graphics().setDepth(9);
   for (const [x, y] of [[310, 251], [454, 260]]) {
    this.steam.push(this.add.sprite(x, y, 'steam', 0).setOrigin(.5, 1).setScale(.55).setDepth(y + 10).setAlpha(.7));
   }
   this.pour = this.add.sprite(309, 270, 'pour', 0).setOrigin(.5, 1).setScale(.4).setDepth(365).setAlpha(.9);
   this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objects: Phaser.GameObjects.GameObject[]) => {
    if (this.bridge.view.interactive===false||!this.bridge.view.decorating || objects.length) return;
    const x = Math.round((pointer.worldX - 120) / 60), y = Math.round((pointer.worldY - 245) / 37);
    if (x >= 0 && x < 16 && y >= 0 && y < 12) this.bridge.onPlace?.(x, y);
   });
   this.syncView();
 }
 private bubble(x: number, y: number, waiting: boolean) {
   const backing = this.add.rectangle(0, -2, 32, 29, 0xfff6e1).setStrokeStyle(1.5, 0xb9a17c);
   const cup = this.add.image(0, -4, 'matcha-latte').setScale(.29);
   const tail = this.add.triangle(0, 16, 0, 0, 9, 0, 3, 7, 0xfff6e1).setStrokeStyle(1, 0xb9a17c);
   return this.add.container(x, y, [backing, tail, cup]).setDepth(1020).setVisible(waiting);
 }
 private addPerson(id: string, appearance: string, name: string, kind: Person['kind'], x: number, y: number, phase: number, status: string) {
  const sprite = this.add.sprite(x, y, appearance, 0).setOrigin(.5, 1).setScale(kind === 'player' ? 1.0 : .88).setDepth(y);
  sprite.setInteractive(new Phaser.Geom.Rectangle(6, 9, 60, 87), Phaser.Geom.Rectangle.Contains, false).on('pointerdown', () => { if(this.bridge.view.interactive===false)return; this.select(sprite.x, sprite.y - 6); this.bridge.onSelect(kind === 'staff' || kind === 'event' ? 'stock' : kind === 'player' ? 'brew' : 'order', id); });
  sprite.input!.cursor = 'pointer';
  const label = this.text(x, y + 10, name, 10, '#645642', y + 1).setBackgroundColor('#fff3d8b8').setPadding(5, 2);
  const actor: Person = { sprite, label, bubble: this.bubble(x, y - 105, kind === 'customer'), x, y, targetX: x, targetY: y, phase, appearance, kind, status, route: [] };
  this.people.set(id, actor); return actor;
 }
 private routeTo(actor: Person, x: number, y: number) {
  if (actor.targetX === x && actor.targetY === y) return;
  actor.targetX = x; actor.targetY = y;
  const blocked = new Set<string>();
  const sizes: Record<string, [number, number]> = { table:[2,2],bench:[3,1],shelf:[2,1],rug:[2,2],rest:[2,1] };
  for (const item of this.bridge.view.furniture) {
   let [w,h] = sizes[item.kind] || [1,1]; if (item.rotation % 180) [w,h] = [h,w];
   for (let iy = item.y; iy < item.y+h; iy++) for (let ix = item.x; ix < item.x+w; ix++) blocked.add(`${ix},${iy}`);
  }
  // Main-room visitors use a clear floor aisle. Kitchen workers enter round
  // the right edge of the preparation counter, never through its front.
  const kitchen = y < 350 && actor.kind !== 'customer';
  const destination = kitchen ? {x:10,y:3} : {x:Math.max(0,Math.min(15,Math.round((x-120)/60))),y:Math.max(3,Math.min(11,Math.round((y-245)/37)))};
  const start = {x:Math.max(0,Math.min(15,Math.round((actor.x-120)/60))),y:Math.max(3,Math.min(11,Math.round((actor.y-245)/37)))};
  // Sitting is allowed only for the final step into a chair. Find the nearest
  // free adjacent cell first when the chair belongs to the table footprint.
  if (blocked.has(`${destination.x},${destination.y}`)) {
   const neighbors = [[destination.x-1,destination.y],[destination.x+1,destination.y],[destination.x,destination.y+1],[destination.x,destination.y-1]];
   const free = neighbors.find(([nx,ny]) => nx>=0&&nx<16&&ny>=3&&ny<12&&!blocked.has(`${nx},${ny}`));
   if (free) { destination.x=free[0];destination.y=free[1]; }
  }
  const queue=[start], seen=new Map<string,string|null>([[`${start.x},${start.y}`,null]]);
  const target=`${destination.x},${destination.y}`;
  while(queue.length) {
   const current=queue.shift()!,key=`${current.x},${current.y}`; if(key===target) break;
   for (const [nx,ny] of [[current.x+1,current.y],[current.x-1,current.y],[current.x,current.y-1],[current.x,current.y+1]]) {
    const next=`${nx},${ny}`;
    if(nx<0||nx>=16||ny<3||ny>=12||blocked.has(next)||seen.has(next))continue;
    // The low gate has one opening towards the bottom of the cat room.
    if ((current.x===10&&nx===11||current.x===11&&nx===10)&&ny<7)continue;
    if(actor.kind==='customer'&&nx>=11)continue;
    seen.set(next,key);queue.push({x:nx,y:ny});
   }
  }
  const route: {x:number;y:number}[]=[];
  if(seen.has(target)) {
   let key: string|null=target;
   while(key) { const [gx,gy]=key.split(',').map(Number);route.unshift(gridToWorld(gx,gy));key=seen.get(key)??null; }
  }
  if(kitchen)route.push({x:744,y:351},{x:744,y:214},{x,y:214});
  route.push({x,y});actor.route=route;
 }
 private syncView() {
  const view = this.bridge.view;
  const layout = JSON.stringify(view.furniture);
  if (layout !== this.routeLayout) { this.routeLayout = layout; for (const actor of this.people.values()) if (actor.kind !== 'player') actor.targetX = Number.NaN; }
  const keep = new Set<string>(['player']);
  let player = this.people.get('player');
  const playerKey = playerAppearance(view.player);
  if (!player) player = this.addPerson('player', playerKey, 'Bạn', 'player', 354, 330, 0, 'work');
  if (player.appearance !== playerKey) { player.appearance = playerKey; player.sprite.setTexture(playerKey, 0); }
  view.customers.slice(0, 12).forEach((person, i) => {
    keep.add(person.id); const appearance = normalAppearance('customer', person.appearance);
    const tables = view.furniture.filter(item => item.kind === 'table');
    const occupied = ['seated', 'served', 'drinking', 'eating', 'satisfied'].includes(person.status) || (person.kind === 'table' || !person.kind) && i < tables.length * 2;
    const table = tables[Math.floor(i / 2) % Math.max(1, tables.length)];
    const seat = table ? gridToWorld(table.x, table.y) : { x: 360, y: 500 };
    const x = occupied ? seat.x + (i % 2 ? 49 : -47) : 470 + (i % 3) * 64;
    const y = occupied ? seat.y + (i % 2 ? 24 : -16) : 405 + Math.floor(i / 3) * 59;
    let actor = this.people.get(person.id);
    if (!actor) { actor = this.addPerson(person.id, appearance, person.name, 'customer', 570, 690, i * .63, person.status); this.doorUntil = this.worldClock + 3; this.bellUntil = this.worldClock + 1; }
    this.routeTo(actor,x,y); actor.status = `${person.status}${occupied ? ':seated' : ''}`; actor.label.setText(person.name);
    actor.bubble.setVisible(!['served', 'drinking', 'eating'].includes(person.status) && !view.decorating);
    if (actor.appearance !== appearance) { actor.appearance = appearance; actor.sprite.setTexture(appearance, 0); }
  });
  view.staff.slice(0, 6).forEach((person, i) => {
    keep.add(person.id); const appearance = normalAppearance('staff', person.appearance);
    const places = [[211, 287], [428, 300], [455, 369], [911, 514], [686, 296], [526, 286]];
    const [x, y] = places[i % 6];
    let actor = this.people.get(person.id);
    if (!actor) actor = this.addPerson(person.id, appearance, person.name, 'staff', 570, 686, i * .84, person.task || 'idle');
    this.routeTo(actor,x,y); actor.status = person.task || 'idle'; actor.label.setText(person.name);
    if (actor.appearance !== appearance) { actor.appearance = appearance; actor.sprite.setTexture(appearance, 0); }
  });
  view.events?.slice(0, 4).forEach((event, i) => {
   const id = `event-${event.id}`; keep.add(id);
   let actor = this.people.get(id);
   if (!actor) actor = this.addPerson(id, event.kind === 'delivery' ? 'event-delivery' : event.kind, event.name, 'event', 570, 691, i, event.kind === 'delivery' ? 'carry' : 'idle');
   this.routeTo(actor,event.kind === 'vet' ? 949 : event.kind === 'technician' ? 433 : 631,event.kind === 'vet' ? 579 : event.kind === 'technician' ? 315 : 401 + i * 61);
  });
  for (const [id, actor] of this.people) if (!keep.has(id)) { actor.sprite.destroy(); actor.label.destroy(); actor.bubble.destroy(true); this.people.delete(id); }
  const catKeep = new Set<string>();
  view.cats.slice(0, 6).forEach((cat, i) => {
    catKeep.add(cat.id); const appearance = normalAppearance('cat', cat.appearance);
    let actor = this.cats.get(cat.id);
    if (!actor) {
     const x = 846 + (i % 3) * 79, y = 506 + Math.floor(i / 3) * 113;
     const sprite = this.add.sprite(x, y, appearance, 0).setOrigin(.5, 1).setScale(.82).setDepth(y);
     sprite.setInteractive(new Phaser.Geom.Rectangle(2, 5, 80, 77), Phaser.Geom.Rectangle.Contains).on('pointerdown', () => { if(this.bridge.view.interactive===false)return; this.select(sprite.x, sprite.y); this.bridge.onSelect('cat', cat.id); });
     sprite.input!.cursor = 'pointer';
     actor = { sprite, label: this.text(x, y + 9, cat.name, 10, '#6b604b', y + 1).setBackgroundColor('#fff3d8bd').setPadding(5, 2), x, y, targetX: x, targetY: y, phase: [0,26,44,8,16,35][i] ?? i*6, appearance, energy: cat.energy, mood: typeof cat.mood === 'number' ? cat.mood : /happy|purr|vui|calm/i.test(cat.mood) ? 85 : 50, expression: String(cat.mood), activity: cat.activity || '', reactionUntil: 0 };
     this.cats.set(cat.id, actor);
    }
    if (actor.expression !== String(cat.mood) || actor.activity !== (cat.activity || '')) { actor.expression = String(cat.mood); actor.activity = cat.activity || ''; actor.reactionUntil = this.worldClock + 6; }
    actor.energy = cat.energy; actor.mood = typeof cat.mood === 'number' ? cat.mood : /happy|purr|vui|calm|rừ rừ/i.test(cat.mood) ? 85 : 50; actor.label.setText(cat.name);
    if (actor.appearance !== appearance) { actor.appearance = appearance; actor.sprite.setTexture(appearance, 0); }
  });
  for (const [id, actor] of this.cats) if (!catKeep.has(id)) { actor.sprite.destroy(); actor.label.destroy(); this.cats.delete(id); }
  this.syncFurniture();
  this.decorGrid?.setVisible(!!view.decorating);
  if (view.decorating) {
   const graphics = this.decorGrid!; graphics.clear();
   for (let x = 0; x < 16; x++) for (let y = 0; y < 12; y++) {
    const point = gridToWorld(x, y), blocked = y <= 2 || ((x === 7 || x === 8) && y >= 10);
    graphics.lineStyle(1, blocked ? 0xc59576 : x >= 11 ? 0x839e73 : 0x9f916c, .45);
    graphics.strokeRect(point.x - 30, point.y - 18.5, 60, 37);
   }
  }
  this.night?.setAlpha(['closed', 'after', 'closing', 'afterhours'].includes(view.phase) ? .11 : 0);
 }
 private syncFurniture() {
  const keep = new Set<string>();
  const aliases: Record<string, string> = { roundtable: 'table', smalltable: 'table', catTree: 'cat-tree', cat_tree: 'cat-tree', 'cat-bed': 'cushion', bed: 'cushion', flowers: 'plant', bookshelf: 'shelf', cardboard: 'box', tunnel: 'bridge', poster: 'sign', rest: 'bench', delivery: 'shelf' };
  for (const item of this.bridge.view.furniture) {
   keep.add(item.id); const key = aliases[item.kind] || item.kind;
   if (!manifest.assets[key]) continue;
   const signature = `${key}:${item.x}:${item.y}:${item.rotation}`;
   const existing = this.furniture.get(item.id);
   if (existing?.signature === signature) continue;
   existing?.object.destroy(true);
   const point = item.x <= 20 && item.y <= 20 ? gridToWorld(item.x, item.y) : { x: item.x, y: item.y };
   const container = this.add.container(point.x, point.y).setDepth(point.y);
   const sprite = this.add.image(0, 0, key).setOrigin(.5, 1).setScale(key === 'table' ? .83 : key === 'rug' ? .65 : .8);
   if (key === 'table') {
    const turned = item.rotation % 180 !== 0;
    const behind = this.add.image(turned ? 0 : -55, turned ? -39 : -12, 'chair').setOrigin(.5, 1).setScale(.64);
    const front = this.add.image(turned ? 0 : 48, turned ? 37 : 27, 'chair').setOrigin(.5, 1).setScale(.64);
    container.add([behind, sprite, front]);
    const drink = this.add.image(19, -42, 'matcha-latte').setOrigin(.5, 1).setScale(.33);
    const cake = this.add.image(-24, -39, 'mochi').setOrigin(.5, 1).setScale(.29);
    container.add([drink, cake]);
   } else container.add(sprite);
   // Vertical 2D props keep their upright legs; footprint orientation changes
   // the seat arrangement or horizontal projection, while flat rugs turn.
   if (item.rotation) {
    sprite.setFlipX(item.rotation===180||item.rotation===270);
    if(key==='rug')sprite.setAngle(item.rotation);
    else if(key==='bench'||key==='shelf')sprite.setScale(item.rotation%180?.5:.8,item.rotation%180?1.04:.8);
   }
   sprite.setInteractive({ useHandCursor: true }).on('pointerdown', () => { if(this.bridge.view.interactive===false)return; this.select(point.x, point.y); this.bridge.onSelect(this.bridge.view.decorating ? 'decor' : item.x >= 11 ? 'cat' : 'order', item.id); });
   this.furniture.set(item.id, { signature, object: container });
  }
  for (const [id, item] of this.furniture) if (!keep.has(id)) { item.object.destroy(true); this.furniture.delete(id); }
 }
 update(_time: number, delta: number) {
   const view = this.bridge.view;
   this.input.enabled=view.interactive!==false;
   const signature = JSON.stringify([view.customers, view.staff, view.cats, view.furniture, view.player, view.phase, view.decorating, view.events]);
   if (signature !== this.lastSignature) { this.lastSignature = signature; this.syncView(); }
   if (view.paused) { this.tweens.pauseAll(); return; }
   this.tweens.resumeAll();
   const dt = Math.min(delta / 1000, .06); this.worldClock += dt;
   const t = this.worldClock, reduced = view.reducedMotion;
   this.selection?.setVisible(t < this.selectedUntil);
   for (const actor of this.people.values()) {
    const waypoint = actor.route[0] || {x:actor.targetX,y:actor.targetY};
    const dx = waypoint.x - actor.x, dy = waypoint.y - actor.y, distance = Math.hypot(dx, dy);
    if (distance<=3 && actor.route.length) actor.route.shift();
    let pose = actor.kind === 'player' ? (Math.floor(t * 3) % 2 ? 'work1' : 'work2') : actor.kind === 'staff' && actor.status !== 'idle' ? (Math.floor(t * 3 + actor.phase) % 2 ? 'work1' : 'work2') : actor.status.includes(':seated') || ['seated', 'drinking', 'eating', 'served'].includes(actor.status) ? 'sit' : actor.status === 'carry' || actor.status === 'ready' ? 'carry' : 'idle';
    if (actor.status === 'done' || actor.status === 'satisfied') pose = 'happy';
    if (actor.status === 'left' || actor.status === 'upset') pose = 'sad';
    if (distance > 2 && !reduced) {
     const step = Math.min(distance, dt * (actor.kind === 'staff' ? 67 : 52)); actor.x += dx / distance * step; actor.y += dy / distance * step;
     const direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'east' : 'west' : dy > 0 ? 'south' : 'north';
     pose = `${direction}${1 + Math.floor(t * 7 + actor.phase) % 3}`;
    } else if (reduced) { actor.x = actor.targetX; actor.y = actor.targetY; actor.route=[]; if (pose.startsWith('work')) pose = 'work1'; }
    actor.sprite.setPosition(actor.x, actor.y).setDepth(actor.y).setFrame(frameIndex(pose));
    actor.label.setPosition(actor.x, actor.y + 8).setDepth(actor.y + 1).setVisible(!view.decorating);
    actor.bubble.setPosition(actor.x + 23, actor.y - 88).setDepth(actor.y + 100);
   }
   let i = 0;
   for (const actor of this.cats.values()) {
    const cycle = (t + actor.phase) % 48, sleepy = actor.energy < 35;
    let pose = sleepy ? 'sleep' : cycle < 5 ? 'sit' : cycle < 8 ? 'lick' : cycle < 16 ? `walk${1 + Math.floor(t * 8) % 3}` : cycle < 19 ? 'stalk' : cycle < 20 ? 'pounce' : cycle < 23 ? 'tail1' : cycle < 25 ? 'yawn' : cycle < 31 ? 'sleep' : cycle < 35 ? 'eat' : cycle < 39 ? 'box' : cycle < 41 ? `run${1 + Math.floor(t * 9) % 2}` : actor.mood > 65 ? 'pet' : 'rub';
    if (t < actor.reactionUntil) {
     const expression = actor.expression;
     pose = /ăn ngon/.test(expression) ? 'eat' : /liếm/.test(expression) ? 'lick' : /ngáp/.test(expression) ? 'yawn' : /nghỉ|lim dim|cuộn mình/.test(expression) ? 'sleep' : /chạy lại/.test(expression) ? `run${1 + Math.floor(t * 9) % 2}` : /dụi|rừ rừ|mắt vui/.test(expression) ? 'pet' : /vồ/.test(actor.activity) ? Math.floor(t * 2) % 2 ? 'pounce' : 'stalk' : /hộp/.test(actor.activity) ? 'box' : /rụt|giãy|quay đầu/.test(expression) ? 'tail1' : 'rub';
    }
    if (!reduced && !sleepy && cycle >= 8 && cycle < 16) {
     const progress = (cycle - 8) / 8;
     actor.x = 824 + (i % 3) * 70 + Math.sin(progress * Math.PI) * 46;
     actor.y = 506 + Math.floor(i / 3) * 101 + Math.sin(progress * Math.PI * 2) * 20;
     actor.sprite.setFlipX(progress > .5);
    } else if (cycle < 8) { actor.x = 824 + (i % 3) * 79; actor.y = 506 + Math.floor(i / 3) * 101; actor.sprite.setFlipX(false); }
    if (reduced) pose = sleepy ? 'sleep' : 'sit';
    if (pose === 'tail1' && Math.floor(t * 3) % 2) pose = 'tail2';
    actor.sprite.setPosition(actor.x, actor.y).setDepth(actor.y).setFrame(frameIndex(pose, true));
    actor.label.setPosition(actor.x, actor.y + 7).setDepth(actor.y + 1).setVisible(!view.decorating); i++;
   }
   for (const steam of this.steam) steam.setFrame(Math.floor(t * 5) % 4).setVisible(!reduced);
   this.pour?.setFrame(Math.floor(t * 7) % 4).setVisible(!reduced && view.phase === 'open' && view.customers.some(customer => customer.status === 'making'));
   this.bell?.setFrame(t < this.bellUntil && !reduced ? 1 + Math.floor(t * 14) % 2 : 0);
   this.entrance?.setFrame(t < this.doorUntil ? 2 : 0);
   this.ovenGlow?.setAlpha(view.phase === 'preparation' || view.staff.some(staff => /bak/i.test(staff.task || '')) ? .16 + (reduced ? 0 : Math.sin(t * 3) * .07) : .04);
   this.rain?.clear();
   if (['rain', 'rainy', 'mưa', 'storm'].includes(view.weather.toLowerCase()) && !reduced) {
    this.rain!.lineStyle(1.4, 0xe8f1df, .65);
    for (const center of [198, 678, 956]) for (let drop = 0; drop < 24; drop++) {
      const x = center - 87 + (drop * 37 % 180), y = 110 + ((drop * 13 + t * 82) % 84);
      this.rain!.lineBetween(x, y, x - 5, y + 12);
    }
   }
 }
}

export default function CafeScene({ view, onSelect, onPlace }: CafeSceneProps) {
 const parentRef = useRef<HTMLDivElement>(null);
 const bridgeRef = useRef<Bridge>({ view, onSelect, onPlace });
 bridgeRef.current.view = view; bridgeRef.current.onSelect = onSelect; bridgeRef.current.onPlace = onPlace;
 useEffect(() => {
  if (!parentRef.current) return;
  const game = new Phaser.Game({ type: Phaser.AUTO, parent: parentRef.current, width: WIDTH, height: HEIGHT, transparent: false,
   backgroundColor: '#e2decb', scene: new CafeWorld(bridgeRef.current),
   scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: WIDTH, height: HEIGHT },
   render: { antialias: true, pixelArt: false, roundPixels: false }, audio: { noAudio: true },
   input: { activePointers: 3 }, fps: { target: 40, forceSetTimeOut: true }
  });
  const resize = new ResizeObserver(entries => { const bounds = entries[0]?.contentRect; if (bounds?.width && bounds?.height) game.scale.setParentSize(bounds.width, bounds.height); game.scale.refresh(); }); resize.observe(parentRef.current);
  return () => { resize.disconnect(); game.destroy(true); };
 }, []);
 return <div ref={parentRef} className="cafe-scene" role="img" aria-label="Cảnh quán Miu Matcha tương tác: quầy trà, tủ bánh, khách hàng và khu mèo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }} />;
}
