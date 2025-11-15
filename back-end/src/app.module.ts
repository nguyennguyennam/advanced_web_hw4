import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user.module';
import * as path from 'path';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // --- Load environment variables globally ---
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, '..', '.env'), '.env'],
    }),

    // --- PostgreSQL (Neon) ---
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dbUrl = cfg.get<string>('DATABASE_URL');
        if (!dbUrl) {
          throw new Error('DATABASE_URL is not defined in environment variables');
        }

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true, // cân nhắc false khi prod
          ssl:
            cfg.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
          logging: cfg.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),

    UserModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [],
})
export class AppModule {}
