import { Module } from '@nestjs/common';
import { EvmModule } from './evm/evm.module';

@Module({
  imports: [EvmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
