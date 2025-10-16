import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePhotoPairDto {
  @IsOptional() @IsInt() @Min(1)
  beforePhotoId?: number;

  @IsOptional() @IsInt() @Min(1)
  afterPhotoId?: number;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  notes?: string;
}
