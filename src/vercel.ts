// src/vercel.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  // EXEMPLOS úteis:
  // app.setGlobalPrefix('api'); // se quiser prefixo
  // app.enableCors();           // se precisar CORS

  await app.init();
  return server;
}

export async function getServer() {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer;
}
