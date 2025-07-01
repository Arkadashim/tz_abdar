import { Controller, Get, Inject, Param, ValidationPipe } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { GetBlockDto, GetTransactionDto } from './cosmos.dto';
import { CosmosService } from './cosmos.service';

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

  @Get('transactions/:hash')
  @ApiParam({
    name: 'hash',
    description: 'Transaction hash (32-byte hexadecimal string)',
    type: String,
    example: 'D70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED',
  })
  async getTransaction(@Param(ValidationPipe) params: GetTransactionDto) {
    return await this.cosmosService.getTransaction(params.hash);
  }
}
