import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CosmosModule } from './cosmos/cosmos.module';
import { EvmModule } from './evm/evm.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    EvmModule,
    CosmosModule,
  ],
})
export class AppModule {}
