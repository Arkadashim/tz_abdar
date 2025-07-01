import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EvmService implements OnModuleInit {
  private readonly logger = new Logger(EvmService.name);
  private rpcEndpoint: string;

  @Inject() private readonly httpService: HttpService;
  @Inject() private readonly configService: ConfigService;

  async onModuleInit() {
    try {
      const host = this.configService.get('evmRpcUrl');
      if (!host) {
        throw new Error('EVM RPC endpoint not found');
      }

      this.rpcEndpoint = host;
      this.logger.log('Connected to EVM node ' + this.rpcEndpoint);

      await firstValueFrom(
        this.httpService.post(this.rpcEndpoint, {
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
      );
    } catch (error) {
      this.logger.error('Failed to connect to EVM node:', error.message);
      throw new Error('Could not initialize EVM client');
    }
  }

  async getBlock(number: number) {
    const response = await firstValueFrom(
      this.httpService.post(this.rpcEndpoint, {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['0x' + number.toString(16), false],
        id: 1,
      }),
    );

    if (response.data.error) {
      throw new Error(response.data.error['message']);
    }

    if (!response.data.result) {
      throw new NotFoundException('Не найдена информация о блоке');
    }

    const block = response.data.result;
    return {
      height: parseInt(block.number, 16),
      hash: block.hash,
      parentHash: block.parentHash,
      gasLimit: parseInt(block.gasLimit, 16),
      gasUsed: parseInt(block.gasUsed, 16),
      size: parseInt(block.size, 16),
    };
  }

  async getTransaction(hash: string) {
    const cleanHash = hash.startsWith('0x') ? hash : `0x${hash}`;

    console.log(cleanHash);
    const response = await firstValueFrom(
      this.httpService.post(this.rpcEndpoint, {
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [cleanHash],
        id: 1,
      }),
    );

    if (response.data.error) {
      throw new Error(response.data.error['message']);
    }

    if (!response.data.result) {
      throw new NotFoundException('Не найдена информация о транзакции');
    }

    const tx = response.data.result;
    return {
      hash: tx.blockHash,
      to: tx.to || '',
      from: tx.from || '',
      value: tx.value,
      input: tx.input,
      maxFeePerGas: parseInt(tx.maxFeePerGas || '0x0', 16),
      maxPriorityFeePerGas: parseInt(tx.maxPriorityFeePerGas || '0x0', 16),
      gasPrice: parseInt(tx.gasPrice || '0x0', 16),
    };
  }
}
