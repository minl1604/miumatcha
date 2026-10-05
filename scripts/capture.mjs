import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const [name,width,height] of [['desktop',1440,1060],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',e=>console.log('RUNTIME',name,e.message));
 page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',name,m.text().slice(0,240));});
 await page.goto('http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Bắt đầu chăm tiệm'}).click();
 await page.waitForSelector('canvas');
 await page.evaluate(()=>window.__MIU_DEBUG.dispatch({type:'PAUSE',paused:true}));
 await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 console.log(name,'body',await page.locator('body').innerText());
 await page.close();
}
await browser.close();
