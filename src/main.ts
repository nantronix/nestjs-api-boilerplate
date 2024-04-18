import { NestFactory } from '@nestjs/core';
import { VersioningType,VERSION_NEUTRAL} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService} from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import {
	HttpExceptionFilter
} from './common'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
      cors: true
  });
  app.useGlobalFilters(new HttpExceptionFilter());//全局返回报错格式
  const configService = app.get(ConfigService);
  // or "app.enableVersioning()"
 app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1','2']
});
  
  app.use(helmet())
  app.useStaticAssets(join(__dirname, '..', 'public'));
 const config = new DocumentBuilder()
    .setTitle('NEST 基于API的基础代码')
    .setDescription('The cats AI description')
    .setVersion('1.0')
    .addTag('developer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document)
  await app.listen(configService.get<number>('port'));
}
bootstrap();
