import { IsNotEmpty } from 'class-validator';

export class AdAccountDto {
  @IsNotEmpty()
  readonly accountId: string;

  readonly source: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly timeZone: string;

  readonly status: string;
}
