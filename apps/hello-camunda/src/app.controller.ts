import { Controller, Get, Inject } from '@nestjs/common';
import { ZeebeJob, ZeebeWorker, ZEEBE_CONNECTION_PROVIDER } from 'nestjs-zeebe';
import { Payload } from '@nestjs/microservices';
import { ZBClient } from 'zeebe-node';
import { deployProcesses as _deployProcesses } from './deployProcessses';

@Controller()
export class AppController {
  constructor(
    @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient,
  ) {}

  @Get('deploy')
  deployProcesses() {
    return _deployProcesses(this.zbClient);
  }

  @Get('hello')
  sayHello() {
    return this.zbClient.createProcessInstanceWithResult('hello', {});
  }

  @Get('helloEveryone')
  sayHelloToEveryone() {
    return this.zbClient.createProcessInstanceWithResult('helloEveryone', {
      names: ['Bob', 'Alice', 'Ali'],
    });
  }

  @Get('isaidhello')
  iSaidHello() {
    return this.zbClient.publishStartMessage({
      name: 'iSaidHello',
      timeToLive: 0,
      variables: {},
    });
  }

  @ZeebeWorker('helloBob')
  sayHelloToBob(@Payload() job: ZeebeJob) {
    const variables = job.variables as { helloList: string[] };
    console.debug('Hello Bob');
    const { helloList = [] } = variables;
    job.complete({ helloList: [...helloList, 'Hello Bob'] });
  }

  @ZeebeWorker('helloAlice')
  sayHelloToAlice(@Payload() job: ZeebeJob) {
    const variables = job.variables as { helloList: string[] };
    const { helloList = [] } = variables;
    job.complete({ helloList: [...helloList, 'Hello Alice'] });
  }

  @ZeebeWorker('helloYou')
  async sayKira(@Payload() job: ZeebeJob) {
    const variables = job.variables as { name: string };
    console.debug(variables);
    const { name } = variables;
    const now = Date.now();
    const hello = `Hello ${name}`;
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 1000);
    // });
    job.complete({ hello: { hello, now } });
  }
}
