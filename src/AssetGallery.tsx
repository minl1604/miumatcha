import { useEffect, useRef, useState } from 'react';
import manifestSource from './assetsManifest.json';
const manifest = manifestSource as { assets: Record<string, { path: string; group: string; width: number; height: number; frames: number; frameWidth: number; frameHeight: number }>; humanStates: string[]; catStates: string[] };
function AnimatedSheet({ name, paused }: { name: string; paused: boolean }) {
 const asset = manifest.assets[name], canvas = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const image = new Image(); let timer = 0, frame = 0, stopped = false;
  image.src = asset.path;
  image.onload = () => {
   const draw = () => {
    if (stopped) return;
    const context = canvas.current?.getContext('2d');
    if (context) { context.clearRect(0, 0, asset.frameWidth, asset.frameHeight); context.drawImage(image, frame * asset.frameWidth, 0, asset.frameWidth, asset.frameHeight, 0, 0, asset.frameWidth, asset.frameHeight); }
    if (!paused) frame = (frame + 1) % asset.frames;
    timer = window.setTimeout(draw, 240);
   }; draw();
  };
  return () => { stopped = true; window.clearTimeout(timer); };
 }, [asset, paused]);
 return <canvas ref={canvas} width={asset.frameWidth} height={asset.frameHeight} aria-label={`Hoạt ảnh ${name}, ${asset.frames} khung`} />;
}
export function Icon({ name, size = 24 }: { name: string; size?: number }) { return <img src={`/assets/ui/${name}.svg`} width={size} height={size} alt="" />; }
export default function AssetGallery() {
 const [group, setGroup] = useState('characters'), [paused, setPaused] = useState(false);
 const assets = Object.entries(manifest.assets).filter(([name, item]) => item.group === group && !name.startsWith('portrait-'));
 return <main style={{ minHeight: '100vh', background: '#f5edda', color: '#604c3b', padding: 'clamp(20px,4vw,50px)', fontFamily: 'system-ui,sans-serif' }}>
  <div style={{ maxWidth: 1180, margin: 'auto' }}>
   <p style={{ letterSpacing: 3, fontSize: 12 }}>MIU MATCHA · XƯỞNG VẼ</p>
   <h1>Từng nét nhỏ của tiệm.</h1>
   <p>{Object.keys(manifest.assets).length} tài nguyên nguyên bản, tạo bằng mã SVG. Không có ảnh tải ngoài, emoji hay thư viện icon.</p>
   <p>Nhân vật: 21 khung gồm bốn hướng đi, ngồi, giao món, làm việc và biểu cảm. Mèo: 19 khung gồm đi, chạy, ngủ, ngáp, liếm chân, rình, vồ và chui hộp.</p>
   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '28px 0' }}>
    {['characters', 'cats', 'items', 'furniture', 'environment', 'ui', 'effects'].map(value => <button key={value} onClick={() => setGroup(value)} style={{ border: '1px solid #c4b28e', borderRadius: 20, padding: '9px 18px', background: group === value ? '#839c6b' : '#fff9ea', color: group === value ? '#fff9ea' : '#604c3b', cursor: 'pointer' }}>{({ characters: 'Người', cats: 'Mèo', items: 'Món & nguyên liệu', furniture: 'Nội thất', environment: 'Môi trường', ui: 'Giao diện', effects: 'Hiệu ứng' } as Record<string,string>)[value]}</button>)}
    <button onClick={() => setPaused(value => !value)} style={{ borderRadius: 20, padding: '9px 18px', border: '1px solid #c4b28e', background: '#fff9ea' }}>{paused ? 'Chạy hoạt ảnh' : 'Tạm dừng hoạt ảnh'}</button>
    <a href="/" style={{ padding: 9, color: '#60774f' }}>Về tiệm</a>
   </div>
   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(145px,1fr))', gap: 14 }}>
    {assets.map(([name, asset]) => <article key={name} style={{ background: '#fff8e8', border: '1px solid #dfd1b8', borderRadius: 15, minHeight: 175, textAlign: 'center', padding: 16, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
      {asset.frames > 1 ? <AnimatedSheet name={name} paused={paused} /> : <img src={asset.path} alt={name} style={{ width: '100%', height: 108, objectFit: 'contain' }} />}
      <div><strong style={{ fontSize: 12, overflowWrap: 'anywhere' }}>{name.replace('icon-', '')}</strong><div style={{ fontSize: 10, marginTop: 5, color: '#8b775d' }}>{asset.frameWidth} × {asset.frameHeight} · {asset.frames} khung</div></div>
    </article>)}
   </div>
   <p style={{ marginTop: 32, fontSize: 12 }}>Mã nguồn: scripts/generate-assets.mjs · Danh mục: public/assets/manifest.json · Mỹ thuật gốc CC0-1.0</p>
  </div>
 </main>;
}
