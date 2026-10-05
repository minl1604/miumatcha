import { createFeedbackServer } from './feedback.mjs';
const port = Math.max(1, Math.min(65535, Number(process.env.PORT) || 8787));
const server = createFeedbackServer({ apiKey: process.env.OPENAI_API_KEY || '', model: process.env.OPENAI_MODEL || 'gpt-4o-mini' });
server.listen(port, '127.0.0.1', () => console.log(`Miu Matcha nhận xét: http://127.0.0.1:${port} (${process.env.OPENAI_API_KEY ? 'AI được cấu hình' : 'cục bộ'})`));
for (const event of ['SIGINT', 'SIGTERM']) process.on(event, () => server.close(() => process.exit(0)));
