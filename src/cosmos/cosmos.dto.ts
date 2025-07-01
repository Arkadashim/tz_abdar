import { Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class GetBlockDto {
  @Transform(({ value }) => parseInt(value as string))
  @IsPositive()
  height: number;
}
