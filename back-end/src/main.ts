import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

    app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      /\.onrender\.com$/,
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`✅ Server is running on port ${port}`);
}
bootstrap();
