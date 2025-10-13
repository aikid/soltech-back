// api/index.ts
import { getServer } from '../dist/vercel'; // usa o build compilado
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getServer();
  // como estamos com Express, apenas delegamos:
  server(req, res);
}
