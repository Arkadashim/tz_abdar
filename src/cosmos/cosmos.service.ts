import { toBech32, toHex, fromHex } from '@cosmjs/encoding';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { StargateClient } from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CosmosService implements OnModuleInit, OnModuleDestroy {
  @Inject() appConfig: ConfigService;

  private readonly logger = new Logger(CosmosService.name);
  private rpcEndpoint?: string;
  private stargateClient: StargateClient;
  private tendermintClient: Tendermint37Client;

  async onModuleInit() {
    try {
      this.rpcEndpoint = this.appConfig.get('cosmosRpcUrl');
      if (!this.rpcEndpoint) {
        throw new Error(`Rpc endpoint not found`);
      }

      [this.stargateClient, this.tendermintClient] = await Promise.all([
        StargateClient.connect(this.rpcEndpoint),
        Tendermint37Client.connect(this.rpcEndpoint),
      ]);

      this.logger.log('Connected to Cosmos node ' + this.rpcEndpoint);
    } catch (error) {
      this.logger.error('Failed to connect to Cosmos node:', error.message);
      throw new Error('Could not initialize Cosmos client');
    }
  }

  onModuleDestroy() {
    if (this.stargateClient) {
      this.stargateClient.disconnect();
    }

    if (this.tendermintClient) {
      this.tendermintClient.disconnect();
    }

    console.log('Disconnected from Cosmos node');
  }

  async getBlockInfo(blockHeight: number) {
    const tendermintBlock = await this.tendermintClient
      .block(blockHeight)
      .catch((exception) => {
        const message = this.tendermintExceptionToString(exception);
        throw new Error(message);
      });

    if (!tendermintBlock?.block) {
      throw new NotFoundException('Не найдена информация о блоке');
    }

    const blockHeader = tendermintBlock.block.header;
    return {
      height: blockHeader.height,
      time: blockHeader.time.toString(),
      hash: toHex(tendermintBlock.blockId.hash),
      proposedAddress: toBech32('cosmos', blockHeader.proposerAddress),
    };
  }

  async getTransaction(hash: string) {
    const response = await this.tendermintClient
      .tx({
        hash: fromHex(hash),
        prove: true,
      })
      .catch((exception) => {
        const message = this.tendermintExceptionToString(exception);
        throw new Error(message);
      });

    if (!response) {
      throw new NotFoundException('Не найдена информация о транзакции');
    }

    const txDecoded = decodeTxRaw(response.tx);
    const senderAddress =
      txDecoded.authInfo?.signerInfos?.[0]?.publicKey?.['address'];

    return {
      hash: toHex(response.hash),
      height: response.height,
      gasUsed: response.result.gasUsed,
      gasWanted: response.result.gasWanted,
      fee: txDecoded.authInfo.fee?.amount || [],
      sender: senderAddress ? toBech32('cosmos', senderAddress) : '',
    };
  }

  tendermintExceptionToString(exception): string {
    try {
      const message = JSON.parse(exception['message'] as string)['data'];
      if (!message) throw Error();

      return message as string;
    } catch {
      return exception as string;
    }
  }
}
