import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ZeebeModule, ZeebeServer } from 'nestjs-zeebe';

@Module({
  imports: [ZeebeModule.forRoot({ gatewayAddress: 'localhost:26500' })],
  controllers: [AppController],
  providers: [ZeebeServer],
})
export class AppModule {}
