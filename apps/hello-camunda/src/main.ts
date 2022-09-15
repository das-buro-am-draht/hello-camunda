import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZEEBE_CONNECTION_PROVIDER, ZeebeServer } from 'nestjs-zeebe';
import { ZBClient } from 'zeebe-node';
import { deployProcesses } from './deployProcessses';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const zbClient: ZBClient = app.get(ZEEBE_CONNECTION_PROVIDER);
  await deployProcesses(zbClient);

  app.connectMicroservice({
    strategy: app.get(ZeebeServer),
  });

  await app.startAllMicroservices();

  await app.listen(3000);
}

bootstrap();
