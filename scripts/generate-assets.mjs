import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Every shape, palette and animation frame in Miu Matcha is authored here.
// No downloaded images, icon sets, emoji or external font dependencies.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/assets');
const manifest = { version: 1, author: 'Miu Matcha original procedural illustration', license: 'Original artwork included with this game; CC0-1.0', assets: {} };
const ink = '#604c3b', cream = '#fff5dd', green = '#789b64', wood = '#bc8151';
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g stroke="${ink}" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const el = (cx,cy,rx,ry,fill,extra='') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const rect = (x,y,w,h,fill,r=7,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const p = (d,fill='none',extra='') => `<path d="${d}" fill="${fill}" ${extra}/>`;
async function asset(group,name,w,h,body,frames=1,frameWidth=w,frameHeight=h) {
 const directory=path.join(root,group); await mkdir(directory,{recursive:true});
 const filename=group==='ui'&&name.startsWith('icon-')?name.slice(5):name;
 const file=`${group}/${filename}.svg`; await writeFile(path.join(root,file),svg(w,h,body));
 manifest.assets[name]={path:`/assets/${file}`,group,width:w,height:h,frames,frameWidth,frameHeight,anchor:[.5,1]};
}

const humans = [
 ['customer-0','#c77546','#f4bc9a','#e7a18b','bob','dress','bow'],
 ['customer-1','#374e56','#be8468','#8ebbc0','short','jacket','glasses'],
 ['customer-2','#846246','#f2c5a5','#dbb578','bun','skirt','book'],
 ['customer-3','#d3b482','#e0a17c','#889c75','curly','sweater','scarf'],
 ['customer-4','#47403c','#995d42','#ca8eaa','braid','dress','earrings'],
 ['customer-5','#925d47','#efb291','#9f91bf','cap','hoodie','bag'],
 ['customer-6','#c0b5a4','#dda384','#ccb599','short','coat','glasses'],
 ['customer-7','#4d4340','#f6c6a7','#e6c94b','pigtail','skirt','bow'],
 ['customer-8','#aa7552','#b47958','#688d9d','curly','jacket','headphones'],
 ['customer-9','#74574c','#f0b894','#d78365','long','dress','flowers'],
 ['customer-10','#323e43','#d99670','#abbd7e','undercut','coat','book'],
 ['customer-11','#c5a477','#815039','#d7abcb','bun','sweater','scarf'],
 ['staff-0','#5a4a37','#efb992','#75946a','bob','apron','beret'],
 ['staff-1','#946749','#d28d68','#e6c5a0','short','chef','chef'],
 ['staff-2','#394944','#bd805f','#b5c2a4','pigtail','apron','bow'],
 ['staff-3','#c99f63','#f1b898','#c39baf','bun','overall','catpin'],
 ['staff-4','#4d3f38','#995c41','#829d91','undercut','vest','glasses'],
 ['staff-5','#aa744c','#f5c3a0','#c8a56b','curly','chef','chef'],
 ['event-delivery','#4e4b3f','#d59a73','#d4915c','cap','jacket','bag'],
 ['technician','#776247','#dba47f','#7498aa','short','overall','cap'],
 ['inspector','#3c4144','#aa7254','#bc9a86','bun','coat','glasses'],
 ['vet','#967654','#ecc09e','#b8c8c1','bob','coat','catpin'],
];
const skins=['#f4bf9e','#c88b65','#895438'];
const clothes=['#83a071','#e8c999','#d6959d'];
for(let hair=0;hair<3;hair++)for(let skin=0;skin<3;skin++)for(let outfit=0;outfit<3;outfit++)
 humans.push([`player-${hair}-${skin}-${outfit}`,['#604535','#a7784f','#343b38'][hair],skins[skin],clothes[outfit],['bob','short','bun'][hair],'apron','leafpin']);

const humanStates=['idle','south1','south2','south3','north1','north2','north3','east1','east2','east3','west1','west2','west3','sit','carry','work1','work2','happy','sad','tired','surprised'];
function humanFrame(spec,state) {
 const [,hair,skin,shirt,style,wear,accessory]=spec;
 const north=state.startsWith('north'), side=state.startsWith('east')||state.startsWith('west'), flip=state.startsWith('west');
 const stride=state.endsWith('1')?-3:state.endsWith('3')?3:0, seated=state==='sit';
 const work=state==='work1'||state==='work2', carry=state==='carry', faceX=side?40:36;
 const headY=seated?31:27, torsoY=seated?51:48;
 let out=el(36,89,20,seated?5:6,'#5a514633','stroke="none"');
 let body='';
 body+=p(`M${seated?26:29} 72 l${seated?-7:stride} ${seated?8:13} h10 l${-stride} -13 M${seated?44:43} 72 l${seated?9:-stride} ${seated?8:13} h-10 l${stride} -13`,wear==='dress'||wear==='skirt'?'#74635c':'#555e59');
 body+=el(seated?21:29+stride,85,7,3.4,'#654d40')+el(seated?50:43-stride,85,7,3.4,'#654d40');
 if(style==='long'||style==='braid'||style==='pigtail')body+=p(`M20 22 Q8 40 19 58 L26 52 L26 24 M49 22 Q61 38 52 60 L44 53 L43 22`,hair);
 body+=rect(22,torsoY,28,26,shirt,10);
 if(wear==='dress'||wear==='skirt')body+=p(`M25 ${torsoY+9} L19 75 Q35 83 53 75 L47 ${torsoY+9}`,shirt);
 if(wear==='coat'||wear==='jacket')body+=p(`M27 ${torsoY+2} L36 59 L45 ${torsoY+2} M36 58 V75`,cream);
 if(wear==='hoodie')body+=p('M23 50 Q36 63 49 50 M31 59 v8 M41 59 v8','#d4d5c4');
 if(wear==='sweater')body+=p('M25 64 H48 M25 68 H48', 'none','stroke="#f5e4c3" stroke-width="2"');
 if(['apron','chef','overall'].includes(wear))body+=p(`M29 ${torsoY} v8 h-5 v21 q12 5 24 0 V${torsoY+8} h-5 V${torsoY} M30 67 h12 v6 H30 Z`,wear==='chef'?'#fff2dc':'#e6d6ae');
 if(wear==='vest')body+=p('M25 49 L36 58 L47 49 V73 H25 Z','#4e6961')+p('M36 58 V73',cream);
 const leftHandX=work?(state==='work1'?21:25):carry?25:18, rightHandX=work?(state==='work1'?54:48):carry?48:54;
 body+=p(`M24 ${torsoY+6} Q13 ${torsoY+12} ${leftHandX} ${work||carry?59:70}`,shirt,'stroke-width="7"')+p(`M48 ${torsoY+6} Q60 ${torsoY+10} ${rightHandX} ${work||carry?56:70}`,shirt,'stroke-width="7"');
 body+=el(leftHandX,work||carry?59:70,4,4,skin)+el(rightHandX,work||carry?56:70,4,4,skin);
 body+=el(faceX,headY,21,22,skin)+el(faceX-21,headY+3,3.5,5,skin)+el(faceX+20,headY+3,3.5,5,skin);
 const fringe=style==='short'||style==='undercut'?'M16 26 Q12 1 36 3 Q59 0 58 25 L49 14 L44 23 L36 13 L28 23 L25 14 Z':style==='curly'?'M15 26 Q9 19 15 13 Q10 4 22 6 Q28 -2 36 5 Q47 -1 52 8 Q64 8 58 22 L51 25 L48 14 L43 24 L35 15 L27 25 L22 16 Z':'M15 29 Q9 0 36 4 Q61 1 58 32 L51 26 L48 16 Q34 27 20 19 L22 37 L15 35 Z';
 body+=p(fringe,hair);
 if(style==='bob')body+=p('M15 22 L16 44 L24 45 L22 27 M55 22 L55 43 L49 45 L49 28',hair);
 if(style==='bun')body+=el(36,7,11,8,hair);
 if(style==='pigtail')body+=el(13,26,7,13,hair)+el(59,26,7,13,hair);
 if(style==='braid')for(let i=0;i<4;i++)body+=el(57-i,41+i*5,4,4,hair);
 if(north)body+=el(36,27,20,21,hair)+p('M21 24 Q35 13 51 24','none','stroke="#ffffff24"');
 else {
  let eyes=state==='happy'?p(`M${faceX-10} ${headY+3} q4 -5 7 0 M${faceX+4} ${headY+3} q4 -5 7 0`):state==='tired'?p(`M${faceX-10} ${headY+4} h6 M${faceX+4} ${headY+4} h6`):el(faceX-7,headY+3,2.3,state==='surprised'?4:3.3,ink)+el(faceX+8,headY+3,2.3,state==='surprised'?4:3.3,ink);
  if(side)eyes=el(faceX+9,headY+3,2.5,3.5,ink);
  body+=eyes+el(faceX-12,headY+10,4,2,'#df9985','stroke="none"')+el(faceX+14,headY+10,4,2,'#df9985','stroke="none"');
  body+=state==='surprised'?el(faceX,headY+13,3,4,'#9f5a4c'):state==='sad'?p(`M${faceX-4} ${headY+14} q4 -4 8 0`):p(`M${faceX-3} ${headY+12} q3 3 6 0`);
 }
 if(accessory==='glasses'&&!north)body+=rect(faceX-14,headY-1,12,10,'#dbe8de77',4)+rect(faceX+2,headY-1,12,10,'#dbe8de77',4)+p(`M${faceX-2} ${headY+3} h4`);
 if(accessory==='bow')body+=p('M48 11 L58 7 L58 18 L48 13 L40 6 L39 17 Z','#d48782');
 if(accessory==='flowers')body+=el(51,15,6,6,'#f2cea7')+el(52,15,2,2,green);
 if(accessory==='earrings')body+=el(16,36,2.5,4,'#ebc86c')+el(57,36,2.5,4,'#ebc86c');
 if(accessory==='scarf')body+=p('M24 47 Q36 53 49 47 L43 54 L47 67 L40 67 L35 53 L25 53 Z','#d7976b');
 if(accessory==='headphones')body+=p('M15 27 Q13 0 37 0 Q62 1 59 29','none','stroke="#658679" stroke-width="5"')+rect(12,25,6,12,'#59766d',3)+rect(56,25,6,12,'#59766d',3);
 if(style==='cap'||accessory==='cap')body+=p('M15 15 Q20 -2 44 6 Q57 8 58 18 H28 L19 22 L11 20 Z','#9aaf7e');
 if(accessory==='chef')body+=p('M21 14 V9 Q13 3 21 1 Q24 -1 31 3 Q39 -3 45 3 Q57 0 58 8 L51 11 V15 Z','#fff6e5');
 if(accessory==='beret')body+=p('M13 11 Q19 -3 40 1 Q58 1 58 13 L49 17 L21 15 Z',green);
 if(accessory==='bag')body+=p('M18 49 L51 73','none','stroke="#76584a" stroke-width="4"')+rect(43,64,16,16,'#ae7b52',4);
 if(accessory==='book'&&!carry)body+=rect(8,62,15,18,'#a9b997',2)+p('M12 64 V78',cream);
 if(accessory==='leafpin')body+=p('M33 61 Q43 51 43 61 Q39 67 33 61 Z',green);
 if(accessory==='catpin')body+=p('M33 58 L35 55 L37 58 L40 55 L42 59 Q42 65 37 65 Q32 65 33 58',cream);
 if(carry)body+=el(36,63,18,4,'#b7875a')+rect(30,50,12,13,'#eff3db',2)+rect(31,52,10,8,green,1)+p('M35 48 V45 L41 41');
 if(work)body+=rect(25,58,27,8,'#d9bf90',2)+p(`M35 52 L${state==='work1'?44:29} 39`,'none','stroke="#b38756" stroke-width="4"');
 return out+`<g ${flip?'transform="translate(72 0) scale(-1 1)"':''}>${body}</g>`;
}
for(const spec of humans) {
 const body=humanStates.map((s,i)=>`<g transform="translate(${i*72} 4)">${humanFrame(spec,s)}</g>`).join('');
 await asset('characters',spec[0],72*humanStates.length,100,body,humanStates.length,72,100);
 await asset('characters',`portrait-${spec[0]}`,72,100,`<g transform="translate(0 4)">${humanFrame(spec,'happy')}</g>`);
}

const cats=[['#b59c68','#746345','tabby','pointy','long','slim'],['#967052','#644c3a','brown','round','fluffy','round'],['#fff4df','#e1cba9','white','pointy','curved','round'],['#555c59','#ded2b9','tuxedo','fold','short','slim'],['#e8b78a','#77634d','calico','pointy','fluffy','round'],['#c8c2bd','#9f948d','spots','round','long','slim']];
const catStates=['idle','walk1','walk2','walk3','run1','run2','sit','lie','sleep','yawn','tail1','tail2','lick','stalk','pounce','rub','pet','eat','box'];
function catFrame(spec,state) {
 const [coat,mark,pattern,ears,tail,body]=spec;
 const lying=['lie','sleep'].includes(state), sitting=['sit','yawn','lick','pet'].includes(state), pounce=state==='pounce', stalking=state==='stalk';
 const stride=state.endsWith('1')?-4:state.endsWith('3')?4:state==='run2'?7:0;
 const bx=36,by=lying?54:sitting?46:pounce?29:stalking?53:46,headY=lying||state==='eat'?51:pounce?27:stalking?43:32;
 let out=el(36,69,28,5,'#5a514625','stroke="none"');
 const td=tail==='short'?`M15 ${by} Q2 ${by-6} 8 ${by-10}`:tail==='fluffy'?`M15 ${by+1} Q2 ${Math.max(5,by-25)} 8 ${Math.max(5,by-28)} Q17 ${by-21} 12 ${by-17} L19 ${by-1}`:`M15 ${by} Q2 ${by-6} 8 ${Math.max(4,by-27)} Q${state==='tail1'?23:state==='tail2'?2:13} ${Math.max(3,by-35)} 15 ${by-23}`;
 out+=p(td,tail==='fluffy'?coat:'none',`stroke="${coat}" stroke-width="${tail==='fluffy'?6:6}"`);
 if(!lying)out+=p(`M26 ${by+9} L${23+stride} ${pounce?53:66} M40 ${by+10} L${39-stride} ${pounce?52:66} M52 ${by+7} L${52+stride} ${pounce?43:66}`,'none',`stroke="${coat}" stroke-width="8"`);
 out+=el(bx,by,body==='round'?22:25,lying?12:sitting?(body==='round'?23:21):(body==='round'?18:12),coat);
 if(pattern==='tuxedo')out+=el(48,by+3,10,lying?9:13,'#f8eedc');
 if(pattern==='calico')out+=el(27,by-4,11,9,mark)+el(39,by+8,7,5,'#bd7f54');
 if(pattern==='spots')out+=el(24,by-4,6,4,mark)+el(35,by+5,5,5,mark);
 if(pattern==='tabby')out+=p(`M23 ${by-10} l5 7 M34 ${by-14} l3 8 M42 ${by-11} l-2 5`, 'none',`stroke="${mark}" stroke-width="3"`);
 if(lying)out+=el(47,61,11,4,coat);
 const hx=lying?54:51;
 out+=ears==='fold'?p(`M${hx-16} ${headY-5} L${hx-19} ${headY-17} L${hx-8} ${headY-14} M${hx+10} ${headY-13} L${hx+18} ${headY-13} L${hx+13} ${headY-3}`,coat):ears==='round'?el(hx-13,headY-13,8,9,coat)+el(hx+14,headY-13,8,9,coat):p(`M${hx-16} ${headY-4} L${hx-14} ${headY-23} L${hx-3} ${headY-13} M${hx+5} ${headY-13} L${hx+15} ${headY-23} L${hx+19} ${headY-1}`,coat);
 out+=el(hx,headY,20,lying?14:18,coat);
 if(!lying&&ears!=='fold')out+=ears==='round'?el(hx-13,headY-15,4,5,'#dfa494','stroke="none"')+el(hx+14,headY-15,4,5,'#dfa494','stroke="none"'):p(`M${hx-12} ${headY-13} l-1 -6 l7 6 M${hx+9} ${headY-13} l5 -6 l1 9`,'#dfa494','stroke="none"');
 if(pattern==='tuxedo')out+=p(`M${hx-4} ${headY-16} l7 16 l9 9 q-12 12 -22 0 Z`,'#fff1db','stroke="none"');
 if(pattern==='calico')out+=p(`M${hx-17} ${headY-12} Q${hx-3} ${headY-22} ${hx} ${headY} L${hx-12} ${headY+6} Z`,mark,'stroke="none"');
 if(pattern==='tabby')out+=p(`M${hx-7} ${headY-14} l4 6 l4 -7 l3 7 l4 -7`, 'none',`stroke="${mark}" stroke-width="2.3"`);
 const closed=['sleep','pet','rub','lick'].includes(state);
 out+=closed?p(`M${hx-11} ${headY+1} q4 4 7 0 M${hx+3} ${headY+1} q4 4 7 0`):el(hx-7,headY,2.8,state==='stalk'?1.8:4,'#557345')+el(hx+7,headY,2.8,state==='stalk'?1.8:4,'#557345');
 out+=p(`M${hx-2} ${headY+5} h4 l-2 3 Z`,'#c9827c')+p(`M${hx} ${headY+8} q-3 4 -6 1 M${hx} ${headY+8} q3 4 6 1`);
 out+=p(`M${hx-11} ${headY+5} l-12 -3 M${hx-12} ${headY+8} l-12 1 M${hx+11} ${headY+5} l8 -3 M${hx+12} ${headY+8} l8 1`,'none','stroke-width="1"');
 if(state==='yawn')out+=el(hx,headY+11,5,7,'#a95c59')+el(hx,headY+15,3,2,'#e8b0a0');
 if(state==='lick')out+=el(50,49,6,7,coat)+p(`M${hx} ${headY+9} l-2 6 l4 0 Z`,'#df958d');
 if(state==='pet')out+=p('M12 7 Q16 0 21 7 Q27 0 30 7 Q29 13 21 18 Q13 13 12 7','#d9969b','stroke-width="1.5"');
 if(state==='eat')out+=el(62,64,17,6,'#96b088')+el(62,62,12,3,'#bb8b5d');
 if(state==='box')out+=p('M11 48 L54 48 L69 57 V73 H11 Z','#c39160')+p('M11 48 L3 55 L13 61 L24 53 M54 48 L70 45 L78 54 L69 58','#ddad78')+p('M31 53 V72 M39 61 h12','none','stroke="#976b48"');
 return out;
}
for(let i=0;i<cats.length;i++) {
 await asset('cats',`cat-${i}`,84*catStates.length,84,catStates.map((s,j)=>`<g transform="translate(${j*84} 5)">${catFrame(cats[i],s)}</g>`).join(''),catStates.length,84,84);
 await asset('cats',`portrait-cat-${i}`,84,84,`<g transform="translate(0 5)">${catFrame(cats[i],'sit')}</g>`);
}

function drink(color,accent,kind='latte') {
 return el(40,71,23,5,'#604c3b22','stroke="none"')+p('M20 18 H60 L56 66 Q40 75 24 66 Z','#fff7eaaa')+p('M24 35 H57 L54 65 Q40 72 26 65 Z',color)+p('M24 23 H58 L56 39 Q40 46 25 38 Z',accent)+el(40,19,21,5,'#ffeed4')+el(40,18,17,3,kind==='tea'?color:'#f1e8ce')+p('M44 19 V7 L50 3',wood,'stroke-width="3"')+p('M31 30 V58','none','stroke="#ffffff90" stroke-width="3"')+(kind==='cream'?p('M29 19 Q31 11 36 13 Q42 2 47 14 Q53 14 52 19','#fff5e4'):kind==='fruit'?el(44,38,4,3,'#d78677')+el(32,51,3,2,'#c87564'):p('M33 18 q6 -5 13 0 q-7 5 -13 0',green));
}
const drinks=[['matcha-latte','#8fab65','#dadfc0'],['matcha-strawberry','#87a668','#e2a198','fruit'],['matcha-salt','#809e5f','#eee3c3','cream'],['houjicha-latte','#a77b51','#e6ceaa'],['houjicha-caramel','#ac7746','#d8a46a','cream'],['sencha-lemon','#bac979','#f0d278','tea'],['matcha-mango','#8da66d','#e8b356','fruit'],['houjicha-cheese','#957053','#ede0b7','cream'],['genmaicha-latte','#a4ae6d','#ece0ba'],['seasonal-tea','#ca9287','#b2c194','fruit']];
for(const [name,color,accent,kind] of drinks)await asset('items',name,80,80,drink(color,accent,kind));
const bakery={
 mochi:el(40,67,29,8,'#f2e6cc')+el(29,52,19,15,'#c4d3a3')+el(51,47,18,16,'#efcdba')+p('M16 49 q10 -12 20 -5 M40 43 q10 -10 18 -2','none','stroke="#ffffff77"'),
 cookie:el(40,65,29,7,'#f2e6cc')+el(39,43,28,23,'#d4a568')+p('M18 32 q20 -13 39 4 M22 57 q17 12 31 -4','none','stroke="#e6be87"')+[ [25,35],[45,32],[36,46],[54,49],[22,52] ].map(([x,y])=>p(`M${x} ${y} l5 -2 l3 5 l-5 3 Z`,'#826045')).join(''),
 'cheesecake-matcha':el(40,69,31,7,'#f2e6cc')+p('M13 45 L48 23 L66 46 V64 L13 65 Z','#ebe2b9')+p('M13 45 L48 23 L66 46 L31 59 Z','#91ad6f')+p('M13 59 L31 70 L66 58 V65 L31 75 L13 65 Z','#bd9261')+p('M24 45 q10 -8 19 -5',cream),
 'brownie-houjicha':el(40,68,31,8,'#f2e6cc')+p('M13 33 L51 25 L67 35 V60 L27 69 L13 58 Z','#785541')+p('M13 33 L51 25 L67 35 L28 44 Z','#a77651')+p('M23 34 l9 3 M43 32 l7 2 M39 39 l6 1',cream,'stroke-width="3"'),
 'tiramisu-matcha':el(40,70,31,7,'#f2e6cc')+p('M17 31 L55 26 L64 36 V63 L25 70 L17 60 Z','#f1e1bd')+p('M17 31 L55 26 L64 36 L25 43 Z','#8eaa65')+p('M18 46 L25 53 L64 47 M18 56 L25 63 L64 56','none','stroke="#9b8053" stroke-width="5"'),
};
for(const [name,body] of Object.entries(bakery))await asset('items',name,80,80,body);
for(const [name,color] of [['pearl','#eee2ba'],['jelly','#8c9b69'],['milk-cream','#fff5dd'],['red-bean','#9e665d']]) {
 let body=el(40,65,28,8,'#e5d5b5')+p('M12 45 Q40 62 68 45 L63 63 Q40 77 17 63 Z','#b1c594');
 for(let i=0;i<8;i++)body+=name==='jelly'?rect(20+(i%4)*11,37+Math.floor(i/4)*12,10,10,color,2):el(24+(i%4)*11,42+Math.floor(i/4)*10,5,name==='red-bean'?3:5,color);
 await asset('items',name,80,80,body);
}
const ingredients=[['matcha','#879f63','tea'],['houjicha','#a68158','tea'],['sencha','#a9b777','tea'],['genmaicha','#a8a277','tea'],['milk','#eee8d2','bottle'],['oatmilk','#d9c494','bottle'],['sugar','#f5e8cf','jar'],['syrup','#c99967','bottle'],['strawberry','#d89586','fruit'],['mango','#e4b45d','fruit'],['lemon','#e3cd6c','fruit'],['ice','#c5dad7','ice'],['flour','#f1ddad','bag'],['egg','#e5c59a','egg'],['butter','#e2c577','block'],['cream','#f4e5cd','bottle'],['coffee','#a48263','tea'],['cat-food','#b19a72','bag']];
for(const [name,color,kind] of ingredients) {
 let body=el(40,71,25,5,'#604c3b22','stroke="none"');
 if(kind==='bottle')body+=rect(27,16,25,51,color,9)+rect(31,10,17,10,'#9ca880',3)+rect(28,35,23,17,cream,2)+p('M36 43 q4 -6 8 0 q-4 7 -8 0',green);
 else if(kind==='fruit')body+=el(40,44,24,name==='lemon'?19:23,color)+p('M38 24 Q30 5 48 17 Q52 24 38 24',green)+p('M30 39 q0 -7 4 -8','none','stroke="#fff2cf77"');
 else if(kind==='ice')body+=rect(18,32,24,27,color,4)+rect(40,19,25,27,'#d4e5dc',4)+p('M23 37 l11 -1 M45 24 h13','none','stroke="#f7fff7" stroke-width="3"');
 else if(kind==='egg')body+=el(41,44,20,27,color)+p('M30 30 q4 -8 8 -8','none','stroke="#fff6db"');
 else if(kind==='block')body+=p('M13 35 L49 24 L66 35 V59 L30 70 L13 58 Z',color)+p('M13 35 L30 45 L66 35 M30 45 V69',cream);
 else body+=p('M19 19 Q40 15 61 19 L65 62 Q40 73 15 62 Z',kind==='bag'?'#dfc699':color)+rect(18,40,43,21,cream,2)+p('M32 48 Q40 36 48 48 Q44 57 32 48',green)+p('M22 27 H58','none','stroke="#ffffff55" stroke-width="4"');
 await asset('items',name,80,80,body);
}
// Semantic aliases match the structured game catalog while retaining distinct
// original illustration source above.
for (const [alias,original] of Object.entries({ 'autumn-latte':'seasonal-tea','sencha-latte':'sencha-lemon',cheesecake:'cheesecake-matcha',brownie:'brownie-houjicha',tiramisu:'tiramisu-matcha',oat:'oatmilk',caramel:'syrup',cheese:'milk-cream',redbean:'red-bean',catfood:'cat-food',cocoa:'coffee' })) {
 const originalAsset=manifest.assets[original];
 const {readFile}=await import('node:fs/promises');
 await writeFile(path.join(root,'items',`${alias}.svg`),await readFile(path.join(root,originalAsset.path.replace('/assets/',''))));
 manifest.assets[alias]={...originalAsset,path:`/assets/items/${alias}.svg`};
}

const furn={
 table:el(75,98,64,11,'#5e4c3722','stroke="none"')+p('M31 50 L26 99 M113 50 L117 99 M73 59 V105','none','stroke="#8c6444" stroke-width="9"')+el(75,49,66,27,'#aa7750')+el(75,43,66,27,'#d4aa78')+p('M22 38 Q68 17 121 38 M27 48 Q78 29 123 47','none','stroke="#c39464" stroke-width="1.5"')+el(76,41,15,6,'#faf0d5')+rect(71,23,10,18,'#adbd8c',3)+p('M75 29 Q66 13 79 15 Q88 23 75 29',green),
 chair:el(40,75,30,5,'#5e4c3722','stroke="none"')+p('M18 37 V74 M60 37 V74','none','stroke="#946944" stroke-width="5"')+rect(13,11,52,37,'#cea06e',10)+p('M23 17 v25 M37 16 v24 M53 17 v25','none','stroke="#b98a5c" stroke-width="3"')+el(39,49,30,12,'#b88654')+el(39,45,29,10,'#d8b47e'),
 counter:p('M8 32 L268 32 L270 104 L10 104 Z','#bd8b5f')+rect(1,21,280,19,'#e2c49a',5)+p('M17 49 H264 M75 40 V101 M145 40 V101 M218 40 V101','none','stroke="#a17450"')+rect(21,49,44,42,'#cba071',4)+rect(153,49,54,42,'#cba071',4)+p('M37 58 h12 M173 58 h14','none','stroke="#755a40" stroke-width="3"'),
 bakery:p('M9 49 H150 V111 H9 Z','#b48558')+p('M8 49 V12 H151 V49 Z','#d0e1d177')+rect(13,14,132,28,'#d4e5db55',3)+p('M8 11 H151 M8 33 H151 M81 13 V48','none','stroke="#7e9a87" stroke-width="3"')+p('M20 22 h20 M91 22 h18 M49 42 h19 M113 42 h17','none','stroke="#aa805a" stroke-width="7"')+rect(0,48,159,12,'#e6cca4',3)+rect(19,68,121,29,'#c59b70',4)+p('M29 79 H130',cream),
 oven:rect(12,8,108,100,'#93a393',9)+rect(23,35,85,58,'#5d6459',5)+rect(28,41,75,40,'#e5ac6999',4)+p('M36 65 H95 M37 53 H92','none','stroke="#d1b28b" stroke-width="3"')+el(35,21,5,5,'#d2c2a1')+el(63,21,5,5,'#d2c2a1')+el(94,21,3,3,'#cda45d')+p('M31 104 V113 M105 104 V113','none','stroke="#62705f" stroke-width="6"'),
 fridge:rect(14,3,91,131,'#c4d1b7',9)+p('M15 55 H104',cream)+rect(24,14,69,30,'#a8bda2',4)+p('M88 65 v27 M88 26 v12','none','stroke="#7d9873" stroke-width="5"')+p('M26 125 V138 M92 125 V138','none','stroke="#7b8875" stroke-width="5"')+p('M41 21 l-12 17 M50 21 l-12 17','none','stroke="#f4f5d84d"'),
 register:el(47,78,40,5,'#5e4c3722','stroke="none"')+rect(9,53,74,23,'#b3bca0',5)+p('M23 53 L30 18 H75 L68 53 Z','#77977b')+p('M30 47 L35 23 H69 L64 47 Z','#e0e8bf')+p('M40 30 h17 M38 37 h14','none','stroke="#738e61"')+rect(25,58,42,6,'#859675',2)+el(47,71,2,2,'#69785e'),
 sink:rect(3,33,118,27,'#d0b087',5)+el(62,42,43,13,'#819f9b')+el(63,39,36,9,'#acd0c4')+p('M63 38 V15 Q63 2 79 10 V23','none','stroke="#90a9a0" stroke-width="6"')+p('M20 63 V93 M106 62 V93','none','stroke="#b08862" stroke-width="8"'),
 whisk:el(44,75,35,7,'#e4ceb0')+p('M9 49 Q44 77 78 49 L71 67 Q44 85 17 67 Z','#d0dda7')+el(44,49,35,12,'#bdd08d')+p('M39 51 L53 15 M39 48 l-5 -8 M45 50 l9 -8 M42 44 l-2 -8','none','stroke="#b39058" stroke-width="3"')+rect(50,5,8,18,'#cbae73',3),
 'cat-tree':el(68,136,60,8,'#5e4c3722','stroke="none"')+rect(15,124,108,12,'#d5b591',6)+p('M49 122 V34 M90 123 V78','none','stroke="#c0ad86" stroke-width="15"')+p('M44 51 H53 M44 60 H53 M44 69 H53 M44 78 H53 M44 87 H53 M44 96 H53','none','stroke="#e6d4ac" stroke-width="2"')+el(48,33,36,12,'#bd9972')+el(48,28,37,12,'#e7cdaa')+el(92,80,33,11,'#b69570')+el(92,75,34,11,'#cbd8ae')+rect(7,84,42,39,'#dfc6a4',9)+el(30,107,12,14,'#a98963'),
 cushion:el(55,63,48,8,'#5e4c3722','stroke="none"')+el(55,49,49,20,'#b2c69a')+el(55,44,42,16,'#d1dab4')+p('M31 41 q24 -9 48 1','none','stroke="#ebedd3" stroke-width="2"'),
 plant:el(40,101,25,5,'#5e4c3722','stroke="none"')+p('M19 63 H61 L55 99 H25 Z','#c78b67')+el(40,64,22,6,'#dfac82')+p('M40 65 V24',green)+p('M39 48 Q11 51 15 27 Q38 28 39 48 M41 35 Q62 39 67 17 Q43 17 41 35 M40 27 Q22 16 32 3 Q49 11 40 27 M41 55 Q65 61 66 41 Q47 41 41 55',green),
 shelf:rect(8,5,116,118,'#c79c71',4)+rect(15,12,102,99,'#dcb788',2)+p('M13 46 H120 M13 82 H120','none','stroke="#98764f" stroke-width="7"')+rect(25,21,15,20,'#97b382',2)+rect(45,24,17,17,'#c68e70',2)+rect(70,22,31,19,'#d6c48a',2)+rect(25,57,18,18,'#d3c9ad',2)+rect(49,57,18,18,'#acb789',2)+rect(80,53,20,22,'#adbabc',2)+rect(26,88,37,20,'#b49266',2)+rect(76,89,31,19,'#cca176',2),
 box:p('M5 30 L69 23 L90 37 V83 L26 91 L5 75 Z','#c29266')+p('M5 30 L26 42 L90 37 M26 42 V91 M48 26 L59 39 V87','none','stroke="#edd1a2" stroke-width="6"')+rect(37,50,34,23,'#eddfbf',1)+p('M44 56 h19 M44 62 h15',wood),
 toy:p('M14 81 L51 14 Q59 2 64 12','none','stroke="#b88756" stroke-width="4"')+p('M64 11 Q95 29 76 64','none','stroke="#a99575" stroke-width="1"')+p('M76 65 Q59 55 68 46 Q81 44 78 59 Q91 48 95 59 Q95 68 81 71 Z','#cda2ae')+el(77,70,3,4,'#aaba7c'),
 lamp:el(43,109,28,6,'#5e4c3722','stroke="none"')+el(43,106,26,5,'#9e805b')+p('M43 105 V30','none','stroke="#8f775b" stroke-width="5"')+p('M18 8 H67 L77 38 Q43 47 9 38 Z','#ead49d')+p('M28 14 L22 35 M57 14 L64 35','none','stroke="#f6e8c5"')+el(43,40,25,5,'#f7df9e'),
 rug:el(130,59,125,48,'#c7b09a')+el(130,55,121,45,'#ecd4b9')+el(130,55,107,36,'#afbe96')+p('M37 52 Q131 12 222 53 Q129 95 37 52 Z','#d3d7b0'),
 bridge:p('M10 63 Q61 -3 110 63 L105 80 Q60 18 15 79 Z','#d7b17d')+p('M20 49 l3 16 M36 34 l5 16 M54 25 l2 18 M73 30 l-3 19 M91 43 l-5 17','none','stroke="#a78155"'),
 bench:p('M9 37 H133 V80 H9 Z','#bc8c60')+rect(2,15,137,41,'#d5b381',8)+p('M18 24 h104 M16 38 H125','none','stroke="#ba9367"')+p('M19 65 V91 M121 65 V91','none','stroke="#8f6b48" stroke-width="7"'),
 'ice-maker':rect(4,14,96,89,'#b4c4bc',8)+rect(14,22,76,30,'#e1e7d1',4)+rect(13,62,78,31,'#9caca7',3)+p('M20 72 H83 M34 79 h36','none','stroke="#d6ddcb"')+el(79,36,4,4,green),
 bin:el(41,78,27,5,'#5e4c3722','stroke="none"')+p('M15 23 H68 L63 72 Q40 84 20 72 Z','#91a287')+el(41,24,28,8,'#bfd0ad')+p('M39 12 h11','none','stroke="#769276" stroke-width="5"')+p('M28 36 v26 M40 37 v27 M54 36 v26','none','stroke="#bac7a4"'),
};
const furnSize={table:[150,115],chair:[80,85],counter:[285,115],bakery:[162,119],oven:[135,120],fridge:[120,145],register:[95,86],sink:[128,105],whisk:[88,85],'cat-tree':[138,148],cushion:[112,78],plant:[82,110],shelf:[135,132],box:[100,98],toy:[105,90],lamp:[90,120],rug:[260,113],bridge:[120,90],bench:[145,100],'ice-maker':[108,112],bin:[82,85]};
for(const [name,body] of Object.entries(furn))await asset('furniture',name,...furnSize[name],body);
await asset('furniture','rest',...furnSize.bench,furn.bench);
await asset('furniture','delivery',...furnSize.shelf,furn.shelf);

// Modular environment textures. Furniture, actors and interactive stations are
// always individual objects above these architectural surfaces.
let floor=rect(0,0,1050,555,'#ddbb8c',0,'stroke="none"');
for(let y=0;y<555;y+=37) {
 floor+=p(`M0 ${y} H1050`,'none','stroke="#bc966f77" stroke-width="1.5"');
 for(let x=(Math.floor(y/37)%2)*72;x<1050;x+=144)floor+=p(`M${x} ${y} v37 M${x+15} ${y+9} h35 M${x+64} ${y+25} h26`,'none','stroke="#c39b7270" stroke-width="1"');
}
await asset('environment','floor',1050,555,floor);
let wall=rect(0,0,1050,160,'#f3e5c8',0)+rect(0,135,1050,25,'#c29a73',0)+p('M0 140 H1050 M0 154 H1050','none','stroke="#a8805c"');
for(let x=0;x<1050;x+=62)wall+=p(`M${x} 135 V159`,'none','stroke="#b48963"');
await asset('environment','wall',1050,160,wall);
let window=rect(4,4,226,114,'#b88961',6)+rect(13,12,208,97,'#bed3b5',3)+rect(17,16,200,43,'#d7e1c9',1)+p('M17 67 Q50 37 85 58 Q132 39 160 60 Q187 39 217 54 V105 H17 Z','#aec49c','stroke="none"')+p('M17 86 Q66 72 119 87 Q175 71 217 87 V108 H17 Z','#90ad83','stroke="none"')+rect(100,74,83,16,'#c9b995',1)+p('M14 65 H220 M119 12 V109','none','stroke="#b88961" stroke-width="6"')+p('M26 17 l-9 28 M44 17 L18 68 M175 17 l-18 52','none','stroke="#ffffff4a" stroke-width="7"')+rect(0,112,236,12,'#d1ad7b',3);
await asset('environment','window',238,128,window);
await asset('environment','door',114,172,rect(3,2,108,163,'#b2845e',7)+rect(13,10,88,87,'#bed4b6',3)+p('M16 16 L98 90 M98 16 L16 90','none','stroke="#d5e2c7" stroke-width="2"')+rect(12,105,88,47,'#d1ac7e',3)+el(94,107,3,3,'#8b7753')+p('M56 13 V94',wood)+rect(28,32,60,21,'#f4e3c0',2)+p('M39 42 h38','none','stroke="#96a36d" stroke-width="3"'));
await asset('environment','awning',520,75,p('M8 0 H510 L516 55 Q492 81 473 56 Q450 81 427 55 Q405 82 380 54 Q355 80 332 55 Q308 79 285 55 Q260 83 238 55 Q213 79 191 55 Q167 81 143 56 Q120 80 98 55 Q73 82 49 55 Q25 79 3 55 Z','#e5dec0')+[0,1,2,3,4,5].map(i=>p(`M${48+i*94} 1 h47 l-5 54 q-24 25 -47 0 Z`,'#879e6d')).join('')+p('M4 4 H514','none','stroke="#faf1d7" stroke-width="4"'));
await asset('environment','sign',235,85,p('M20 10 Q110 -3 217 10 L225 65 Q112 81 9 65 Z','#e3c69b')+p('M16 20 Q112 5 215 20 M17 60 Q112 71 217 60','none','stroke="#b68d65"')+p('M99 17 Q79 2 74 17 Q80 26 99 25 Q115 7 122 19 Q117 33 99 30',green)+`<text x="116" y="49" font-family="Georgia,serif" font-size="23" text-anchor="middle" fill="${ink}" stroke="none">miu matcha</text>`);
await asset('environment','fence',140,98,p('M5 50 H132 M5 78 H132','none','stroke="#cfb483" stroke-width="6"')+[10,38,66,94,122].map(x=>p(`M${x} 96 V27 L${x+5} 18 L${x+10} 27 V96 Z`,'#e3cca1')).join(''));
await asset('environment','street',1120,95,rect(0,0,1120,95,'#b1bcaa',0,'stroke="none"')+rect(0,17,1120,57,'#cfccba',0,'stroke="none"')+p('M0 23 H1120 M0 72 H1120','none','stroke="#f3ebd6" stroke-width="4"')+[0,1,2,3,4,5,6,7].map(i=>p(`M${i*160} 49 h69`,'none','stroke="#ebe3cd" stroke-width="3"')).join(''));
await asset('environment','hanging-plant',84,145,p('M40 0 L17 66 M40 0 L65 66',wood,'stroke-width="1.5"')+p('M15 61 H67 L59 86 H23 Z','#c9946c')+p('M25 66 Q2 72 13 109 Q23 121 20 140 M45 65 Q61 83 69 109 M43 68 Q32 83 43 116','none','stroke="#819b62" stroke-width="4"')+[ [14,93],[17,118],[61,91],[66,109],[40,97],[43,112],[24,70],[48,73] ].map(([x,y])=>el(x,y,7,10,'#91ae6f')).join(''));
await asset('environment','entrance',140*3,65,[0,1,2].map(i=>`<g transform="translate(${i*140} 0)">${rect(4,30,8,31,'#b58861',3)+rect(128,30,8,31,'#b58861',3)+(i===0?rect(11,35,118,20,'#d7b27f',3)+p('M21 43 H121','none','stroke="#b78b5e"')+el(113,48,2,2,'#8c7652'):p(i===1?'M11 36 L72 7 L81 20 L19 54 Z':'M11 36 L38 4 L53 13 L19 55 Z','#d7b27f')+p(i===1?'M20 40 L71 16':'M20 40 L40 15','none','stroke="#b78b5e"'))}</g>`).join(''),3,140,65);
await asset('furniture','bell',56*3,62,[0,1,2].map(i=>`<g transform="translate(${i*56} 0) rotate(${i===1?-9:i===2?9:0} 28 43)">${el(28,53,24,5,'#604c3b22','stroke="none"')+el(28,49,23,6,'#b09260')+p('M8 43 Q10 16 28 17 Q45 16 48 43 Z','#e2c895')+el(28,15,4,4,'#aa8b59')+p('M15 37 Q15 27 21 24','none','stroke="#f9e6b8" stroke-width="3"')}</g>`).join(''),3,56,62);

const icons={
 cat:p('M7 20 L7 7 L18 14 Q24 10 30 14 L41 7 V20 Q48 42 24 45 Q0 42 7 20','#9db57c')+el(17,26,2,3,ink)+el(31,26,2,3,ink)+p('M21 33 h6 l-3 3 Z','#d49a86')+p('M7 30 L1 27 M7 34 H1 M41 30 l6 -3 M41 34 h6','none','stroke-width="1.5"'),
 money:el(24,25,18,18,'#dcc277')+el(24,25,13,13,'#eddda3')+p('M30 17 Q14 11 16 22 Q18 27 28 25 Q36 34 17 34 M24 12 V38'),
 orders:rect(10,7,29,36,'#e8d7b8',4)+rect(16,3,17,9,'#a9bc8f',3)+p('M17 20 h14 M17 27 h14 M17 34 h8'),
 recipe:rect(5,8,37,34,'#c7d6af',4)+p('M24 9 V40 M10 17 h9 M29 17 h8 M10 24 h9 M29 24 h8 M11 31 h8'),
 staff:el(24,15,9,10,'#dfb590')+p('M6 44 Q7 24 24 27 Q42 24 42 44 Z','#9db391')+p('M18 29 L24 36 L30 29 M24 36 V44',cream),
 stock:p('M5 14 L25 6 L43 15 V36 L23 44 L5 35 Z','#c99f71')+p('M5 14 L23 23 L43 15 M23 23 V44 M15 10 L34 20 V39',cream),
 decor:p('M7 20 Q24 9 41 20 V31 Q24 40 7 31 Z','#d0ad7a')+p('M12 31 v11 M36 31 v11 M24 35 v9'),
 report:p('M7 43 V7 H42','none','stroke-width="3"')+rect(13,28,6,12,'#c3b076',1)+rect(23,20,6,20,'#9cb281',1)+rect(33,11,6,29,'#d1a28c',1),
 settings:el(24,24,15,15,'#c4ccb2')+el(24,24,6,6,cream)+[0,1,2,3,4,5,6,7].map(i=>`<g transform="rotate(${i*45} 24 24)">${rect(21,2,6,10,'#c4ccb2',2)}</g>`).join(''),
 pause:rect(12,9,8,31,green,3)+rect(28,9,8,31,green,3),
 play:p('M15 8 L39 24 L15 40 Z',green),
 sun:el(24,24,10,10,'#e5c376')+[0,1,2,3,4,5,6,7].map(i=>`<g transform="rotate(${i*45} 24 24)">${p('M24 3 V9','none','stroke="#d2ad5c" stroke-width="3"')}</g>`).join(''),
 moon:p('M35 5 Q9 4 7 27 Q11 49 35 41 Q16 39 20 22 Q24 11 35 5 Z','#d6c491'),
 leaf:p('M8 40 Q1 6 41 6 Q40 44 8 40 Z',green)+p('M6 43 L33 15 M17 32 L17 21 M26 23 h9',cream),
 help:el(24,24,19,19,'#e4cf9e')+p('M17 17 Q19 9 27 13 Q37 19 25 26 V30','none','stroke-width="3"')+el(25,36,1.5,1.5,ink),
 save:rect(6,6,36,36,'#9caf89',4)+rect(12,6,21,13,'#e5d6ae',1)+rect(12,27,25,15,cream,2)+p('M28 9 v7 M17 33 h14'),
 camera:rect(4,14,40,27,'#a6b9a1',5)+p('M14 15 L17 8 H31 L35 15 Z','#a6b9a1')+el(24,27,10,10,'#e4dcc2')+el(24,27,6,6,'#90aaa0')+el(38,20,2,2,cream),
 warning:p('M22 5 Q24 1 26 5 L45 39 Q47 43 41 44 H7 Q1 44 3 39 Z','#e3c17f')+p('M24 14 V29','none','stroke-width="3"')+el(24,36,2,2,ink),
 heart:p('M24 41 Q1 26 5 13 Q12 2 24 15 Q36 2 43 13 Q47 26 24 41 Z','#d69b9b'),
 energy:p('M29 3 L10 28 H22 L18 45 L39 20 H27 Z','#d8c176'),
 trophy:p('M14 6 H35 V24 Q24 41 14 24 Z','#d5b26d')+p('M14 12 H5 Q3 26 15 25 M35 12 H43 Q45 26 34 25 M24 33 V42 M14 43 H35','none','stroke-width="3"'),
 calendar:rect(6,10,37,33,'#eddfc3',4)+rect(6,10,37,10,'#a4b892',3)+p('M16 5 V15 M33 5 V15 M13 26 h5 M24 26 h5 M13 34 h5 M24 34 h5'),
 clean:p('M12 7 L29 27','none','stroke="#b38d63" stroke-width="5"')+p('M24 25 L39 21 L45 36 L27 44 L19 31 Z','#c7b27d')+p('M28 29 L34 40 M34 27 l6 11',wood),
 close:p('M13 13 L35 35 M35 13 L13 35','none','stroke-width="4"'),
 arrow:p('M9 24 H39 L27 12 M39 24 L27 36','none','stroke-width="3"'),
 sound:p('M5 20 H13 L26 9 V40 L13 29 H5 Z','#aabc99')+p('M33 17 Q41 24 33 31 M38 11 Q52 24 38 37'),
 training:p('M2 17 L24 7 L46 17 L24 28 Z','#a8bc90')+p('M11 23 V34 Q24 44 37 34 V23 M44 18 V34'),
 rest:p('M8 42 V13 M40 42 V30 M8 32 H40','none','stroke-width="4"')+rect(11,25,28,9,'#d3b196',2)+el(17,22,6,5,'#eed8b1'),
 repair:p('M30 5 Q22 5 23 14 L8 29 Q1 36 9 42 Q15 47 20 39 L34 23 Q45 25 45 13 L37 20 L29 13 Z','#a5b8a6'),
 evidence:rect(8,6,27,36,'#eee2c7',3)+p('M15 14 h11 M15 21 h11 M15 28 h6')+el(33,31,9,9,'#c1d4aeaa')+p('M39 38 L46 45','none','stroke-width="4"'),
 debt:p('M8 11 H40 V40 H8 Z','#d8bea1')+p('M15 18 h19 M15 26 h9 M15 33 h8 M29 33 L39 24 M30 25 H39 V34'),
 tax:rect(6,8,36,33,'#d6c699',3)+el(17,18,3,3,cream)+el(32,31,3,3,cream)+p('M16 35 L33 14'),
 revenue:p('M7 42 V25 M18 42 V18 M29 42 V11 M40 42 V4','none','stroke="#9cb081" stroke-width="6"')+p('M5 18 L39 6 M31 5 H40 V14'),
 album:rect(7,6,33,38,'#d1ad98',4)+rect(12,12,23,25,cream,2)+p('M13 30 L20 20 L28 28 L33 24 L35 36 H13 Z','#a7ba8c')+el(29,18,3,3,'#d0bc76'),
 food:p('M6 25 H43 L38 39 Q24 47 11 39 Z','#b4c59b')+el(24,25,19,6,'#ddc18c')+el(16,24,4,3,'#b48f68')+el(28,24,4,3,'#b48f68')+el(35,23,3,3,'#b48f68'),
 joy:el(24,24,19,19,'#e2d099')+p('M11 21 q5 -7 10 0 M28 21 q5 -7 10 0 M14 30 Q24 43 35 30'),
 shop:p('M6 18 H42 V42 H6 Z','#d8c7a0')+p('M3 18 L8 5 H40 L45 18 Q39 25 34 18 Q28 25 24 18 Q19 25 14 18 Q8 25 3 18','#aabc90')+rect(12,27,10,15,cream,1)+rect(27,27,10,9,'#a4bcad',1),
 loss:el(23,24,16,16,'#d3b886')+p('M14 14 L31 33 M31 14 L14 33 M34 35 L45 45','none','stroke="#a57263" stroke-width="3"'),
 cursor:p('M9 3 L37 28 L25 31 L20 44 L9 3 Z',cream),
 rain:p('M10 23 Q0 19 8 12 Q12 0 25 7 Q40 3 42 17 Q49 22 41 27 H11','#bbcbbb')+p('M14 33 L10 41 M25 33 L21 41 M36 33 L32 41','none','stroke="#92aea5" stroke-width="3"'),
 menu:rect(6,7,37,35,'#cfdaa9',4)+p('M14 16 h23 M14 24 h23 M14 32 h23'),
 star:p('M24 4 L30 17 L44 19 L34 29 L36 43 L24 36 L11 43 L14 29 L3 19 L18 17 Z','#ddc177'),
 bell:p('M10 34 H39 L35 27 V19 Q35 7 24 7 Q13 7 13 19 V27 Z','#dbc290')+el(24,39,5,4,'#b79764')+el(24,5,3,3,'#b79764'),
 clock:el(24,24,19,19,'#e5d6b4')+p('M24 11 V25 L33 30','none','stroke-width="3"'),
};
for(const [name,body] of Object.entries(icons))await asset('ui',`icon-${name}`,48,48,body);
const additionalIcons={
 profit:icons.money+p('M29 40 Q34 29 44 31 Q46 44 29 40 Z',green),
 equipment:rect(5,7,36,36,'#a8bba7',4)+rect(11,18,24,19,'#e3d4b0',3)+el(14,12,2,2,green)+el(32,12,2,2,'#d4aa69'),
 quest:icons.orders+p('M20 29 L24 33 L33 23','none','stroke="#78985e" stroke-width="3"'),
 shift:icons.calendar+el(35,35,10,10,'#e5d6b4')+p('M35 28 v7 l5 3'),
 quit:p('M7 7 H30 V43 H7 Z','#bd9c76')+p('M20 24 H44 L36 16 M44 24 L36 32','none','stroke-width="3"'),
 paw:el(24,32,12,10,'#c4ad8c')+el(10,20,5,7,'#c4ad8c')+el(21,12,5,7,'#c4ad8c')+el(33,14,5,7,'#c4ad8c')+el(41,25,5,7,'#c4ad8c'),
};
for(const [name,body] of Object.entries(additionalIcons))await asset('ui',`icon-${name}`,48,48,body);
await asset('ui','panel',320,200,rect(3,3,314,194,'#fff7e5',20)+rect(8,8,304,184,'none',15,'stroke="#dfd0b2" stroke-width="1"'));
await asset('ui','badge',80,90,p('M17 9 H63 L70 57 L40 79 L10 57 Z','#bac798')+p('M21 16 H59 L64 55 L40 71 L16 55 Z','#e9d8a7')+p('M40 23 L46 36 L61 38 L49 48 L51 63 L40 55 L28 63 L31 48 L19 38 L34 36 Z','#a4b67f'));
await asset('effects','sparkle',40,40,p('M20 2 Q22 16 38 20 Q22 22 20 38 Q17 23 2 20 Q17 17 20 2 Z','#f8e7b1','stroke="none"'));
await asset('effects','steam',32*4,60,[0,1,2,3].map(i=>`<g transform="translate(${i*32} 0)">${p(`M10 56 Q${i%2?28:0} 41 13 30 Q${i%2?0:28} 18 17 5`,'none','stroke="#fbf5deaa" stroke-width="3"')}</g>`).join(''),4,32,60);
await asset('effects','pour',36*4,70,[0,1,2,3].map(i=>`<g transform="translate(${i*36} 0)">${p(`M16 5 Q${12+i*3} 24 17 57`,'none','stroke="#f8ecd3" stroke-width="5"')+el(17,59,8+i,3,'#f2e5c3','stroke="none"')}</g>`).join(''),4,36,70);
await asset('effects','heart-burst',56,56,icons.heart.replaceAll('24','28'));
await asset('effects','paw',48,48,el(24,32,12,10,'#c4ad8c')+el(10,20,5,7,'#c4ad8c')+el(21,12,5,7,'#c4ad8c')+el(33,14,5,7,'#c4ad8c')+el(41,25,5,7,'#c4ad8c'));
manifest.humanStates=humanStates;manifest.catStates=catStates;
await writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
await mkdir(path.resolve(root,'../../src'),{recursive:true});
await writeFile(path.resolve(root,'../../src/assetsManifest.json'),JSON.stringify(manifest,null,2));
await writeFile(path.resolve(root,'../favicon.svg'),svg(48,48,icons.cat));
await writeFile(path.join(root,'CREDITS.md'),'# Miu Matcha — original art\n\nAll SVG illustrations, animation frames, character designs, icons and modular environment pieces are authored in `scripts/generate-assets.mjs`. No external artwork, image pack, emoji or icon library is used. The game uses browser system fonts. Generated artwork is released under CC0-1.0.\n\nRegenerate with `npm run assets`.\n');
console.log(`Created ${Object.keys(manifest.assets).length} original SVG assets, ${humans.length} character sheets and 6 cat sheets.`);
