import { Controller, Get, Inject, Param, ValidationPipe } from '@nestjs/common';
import { GetBlockDto } from './cosmos.dto';
import { CosmosService } from './cosmos.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('cosmos')
export class CosmosController {
  @Inject() private readonly cosmosService: CosmosService;

  @Get('block/:height')
  @ApiParam({
    name: 'height',
    description: 'Block height (numeric)',
    type: Number,
    example: 155137056,
  })
  async getBlock(@Param(ValidationPipe) params: GetBlockDto) {
    return await this.cosmosService.getBlockInfo(params.height);
  }
}
