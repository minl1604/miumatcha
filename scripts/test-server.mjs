// A separate port with HMR disabled keeps running browser tests independent of editor changes.
import {createServer} from 'vite';
process.env.MIU_TEST_SERVER='1';
const server=await createServer({server:{host:'127.0.0.1',port:5174,strictPort:true,hmr:false}});await server.listen();server.printUrls();
