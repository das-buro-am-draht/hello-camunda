import { Controller, Get, Inject } from '@nestjs/common';
import { ZeebeJob, ZeebeWorker, ZEEBE_CONNECTION_PROVIDER } from 'nestjs-zeebe';
import { Payload } from '@nestjs/microservices';
import { ZBClient } from 'zeebe-node';

@Controller()
export class AppController {
  constructor(
    @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient,
  ) {}
  @Get('hello')
  sayHello() {
    return this.zbClient.createProcessInstanceWithResult('hello', {});
  }

  @ZeebeWorker('helloBob')
  sayHelloToBob(@Payload() job: ZeebeJob) {
    const variables = job.variables as { helloList: string[] };
    const { helloList = [] } = variables;
    console.debug('Hello other Bob');
    job.complete({ helloList: [...helloList, 'Hello other Bob'] });
  }
}
