import { Module,OnModuleInit } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule,ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import{ CacheService } from './services';
import { WechatModule } from './modules/wechat/wechat.module';
import { OssModule} from "./modules/oss/oss.module";
import { ScheduleModule } from '@nestjs/schedule';
import { join,resolve } from 'path';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
  HeaderResolver
} from 'nestjs-i18n';
import { OcrModule } from './modules/ocr/ocr.module';
import { GptModule } from './modules/gpt/gpt.module';
import { MicroModule } from './modules/micro/micro.module';
import { UploadModule } from './actions/upload/upload.module';
import { TaskModule } from './modules/task/task.module';
import { ApplicationModule } from './modules/application/application.module';
import { ExcelModule } from './modules/excel/excel.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { VirtualEmployeeModule } from './modules/virtual_employee/virtual_employee.module';


@Module({
    imports: [
     I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-aishow-lang'] },
        AcceptLanguageResolver,
      ],
    }),
        ScheduleModule.forRoot(),
        CacheModule.register(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('database.host'),
                port: +configService.get<number>('database.port'),
                username: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_DATABASE'),
                //entities: [],
                autoLoadEntities: true,
                synchronize: configService.get<boolean>('database.sync'),
                timezone: "+08:00" // 添
            }),
        }),
        CacheModule.registerAsync({
			useClass: CacheService
		}),
        UsersModule,
        AuthModule,
        WechatModule,
        OssModule,
        OcrModule,
        GptModule,
        MicroModule,
        UploadModule,
        TaskModule,
        ApplicationModule,
        ExcelModule,
        WorkflowModule,
        VirtualEmployeeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {
        console.log('The module has been initialized.')
    }
}
