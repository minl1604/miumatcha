import { describe, expect, it } from 'vitest';
import { scoreWhisk, scoreTiming, scoreLayers, scoreTaste, scoreSchedule, deliveryNeedsReview, W_PATH } from '../src/Minigame';
describe('Kỹ thuật minigame xác định và có giới hạn',()=>{
  it('đánh trà thưởng độ phủ, đường đúng và nhịp đều',()=>{
    const points=[];let t=0;
    for(let s=0;s<4;s++)for(let i=0;i<=10;i++){const f=i/10;points.push({x:W_PATH[s].x+(W_PATH[s+1].x-W_PATH[s].x)*f,y:W_PATH[s].y+(W_PATH[s+1].y-W_PATH[s].y)*f,t:t+=80});}
    expect(scoreWhisk(points)).toBeGreaterThan(95);expect(scoreWhisk([])).toBe(0);expect(scoreWhisk([{x:5,y:5,t:0},{x:15,y:10,t:100}])).toBeLessThan(30);
  });
  it('lắc đúng tám nhịp; bấm thừa không vượt 100',()=>{expect(scoreTiming(Array(8).fill(0))).toBe(100);expect(scoreTiming([0])).toBe(13);expect(scoreTiming(Array(100).fill(0))).toBe(100);expect(scoreTiming(Array(8).fill(.3))).toBe(0);});
  it('rót tốt nhưng thiếu thể tích khác rót hoàn chỉnh',()=>{expect(scoreLayers(10,10,100)).toBe(100);expect(scoreLayers(10,10,50)).toBe(85);expect(scoreLayers(0,10,100)).toBe(30);expect(scoreLayers(0,0,0)).toBe(0);});
  it('thử vị đánh giá theo sai lệch thực',()=>{expect(scoreTaste(65,30)).toBe(100);expect(scoreTaste(40,50)).toBe(55);expect(scoreTaste(0,100)).toBe(0);});
  it('xếp ca dùng người khác nhau và trừ vượt ngân sách',()=>{const people=[{role:'barista',skill:90,salary:120000},{role:'baker',skill:90,salary:110000},{role:'manager',skill:90,salary:160000},{role:'cashier',skill:90,salary:100000}];expect(scoreSchedule([0,1,3],people)).toBe(90);expect(scoreSchedule([0,0,0],people)).toBe(30);expect(scoreSchedule([-1,-1,-1],people)).toBe(0);expect(scoreSchedule([0,1,2],people)).toBeLessThan(90);});
  it('kiểm lô theo chất lượng nhà cung cấp đã hứa, không phạt nhầm nhà tiết kiệm',()=>{const lot={id:'delivery-budget',ingredient:'matcha',quantity:100,expectedQuantity:100,receivedQuantity:100,quality:70,expectedQuality:70,status:'quarantined'};expect(deliveryNeedsReview(lot)).toBe(false);expect(deliveryNeedsReview({...lot,expectedQuality:98})).toBe(true);expect(deliveryNeedsReview({...lot,quality:98,expectedQuality:85})).toBe(false);});
  it('kiểm lượng thực nhận và giữ tương thích với phiếu cũ',()=>{const lot={id:'delivery',ingredient:'milk',quantity:500,status:'arrived',quality:85,expectedQuality:85};expect(deliveryNeedsReview({...lot,receivedQuantity:450})).toBe(true);expect(deliveryNeedsReview({...lot,expectedQuantity:600})).toBe(true);expect(deliveryNeedsReview({...lot,discrepancy:50})).toBe(true);expect(deliveryNeedsReview({...lot,expectedQuality:undefined,quality:60})).toBe(true);expect(deliveryNeedsReview(lot)).toBe(false);});
});
