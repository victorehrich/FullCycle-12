import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';

import { ClientKafka, Payload } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices/decorators';
import { RoutesGateway } from './routes.gateway';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
@Controller('routes')
export class RoutesController implements OnModuleInit {
  private kafkaProducer: Producer;
  constructor(
    private readonly routesService: RoutesService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
    private routeGateway: RoutesGateway,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @Get(':id/start')
  startRoute(@Param('id') id: string) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId: id, clientId: '' }),
        },
      ],
    });
  }

  @MessagePattern('route.new-position')
  consumeNewPosition(
    @Payload()
    message: {
      routeId: string;
      clientId: string;
      position: [number, number];
      finished: boolean;
    },
  ) {
    // this.routeGateway.sendPosition({
    //   ...message,
    //   position: [message.position[1], message.position[0]],
    // });
    this.routeGateway.sendPosition(message);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }
}
