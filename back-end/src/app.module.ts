import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      // Không cần envFilePath — Nest tự đọc .env khi local
      // Và sẽ dùng process.env khi deploy
      envFilePath: ['.env'],
    }),

    // PostgreSQL connection (NeonDB)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dbUrl = cfg.get<string>('DATABASE_URL');

        if (!dbUrl) {
          throw new Error('❌ Missing DATABASE_URL in environment variables');
        }

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: cfg.get<string>('NODE_ENV') !== 'production', // prod = false
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
})
export class AppModule {}
