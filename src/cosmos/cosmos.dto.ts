import { Transform } from 'class-transformer';
import { IsPositive, IsString, Matches } from 'class-validator';

export class GetBlockDto {
  @Transform(({ value }) => parseInt(value as string))
  @IsPositive()
  height: number;
}

export class GetTransactionDto {
  @IsString()
  @Matches(/^[0-9A-F]{64}$/, {
    message: 'Hash must be a valid 32-byte hexadecimal string',
  })
  hash: string;
}
