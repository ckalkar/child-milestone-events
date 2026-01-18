import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { MilestonesModule } from './milestones/milestones.module';
import { MediaModule } from './media/media.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DB_DATABASE') || './data/milestone.db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production, use migrations instead
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Serve static files (uploaded media)
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(process.cwd(), configService.get('UPLOAD_DIR') || './uploads'),
          serveRoot: '/uploads',
        },
      ],
      inject: [ConfigService],
    }),

    // Feature modules
    CategoriesModule,
    MilestonesModule,
    MediaModule,
    BatchModule,
  ],
})
export class AppModule {}

