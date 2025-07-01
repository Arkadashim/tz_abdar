import { Controller, Get, Inject, Param, ValidationPipe } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { GetBlockDto, GetTransactionDto } from './evm.dto';
import { EvmService } from './evm.service';

@Controller('evm')
export class EvmController {
  @Inject() evmService: EvmService;

  @Get('block/:number')
  @ApiParam({
    name: 'number',
    description: 'Block number (string)',
    type: Number,
    example: 155137056,
  })
  async getBlock(@Param(ValidationPipe) params: GetBlockDto) {
    return await this.evmService.getBlock(params.number);
  }

  @Get('transactions/:hash')
  @ApiParam({
    name: 'hash',
    description: 'Transaction hash (32-byte hexadecimal string)',
    type: String,
    example:
      '0xb1fac2cb5074a4eda8296faebe3b5a3c10b48947dd9a738b2fdf859be0e1fbaf',
  })
  async getTransaction(@Param(ValidationPipe) params: GetTransactionDto) {
    return await this.evmService.getTransaction(params.hash);
  }
}
