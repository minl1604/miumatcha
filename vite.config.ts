import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { port: process.env.MIU_TEST_SERVER?5174:5173, hmr:process.env.MIU_TEST_SERVER?false:undefined, proxy: { '/api': 'http://127.0.0.1:8787' } }, build:{rollupOptions:{output:{manualChunks:{phaser:['phaser']}}}}, test: { include: ['tests/**/*.test.ts'], environment: 'node' } } as any);
