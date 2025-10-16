import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePhotoPairDto {
  @IsInt() @Min(1)
  patientId: number;

  @IsInt() @Min(1)
  beforePhotoId: number;

  @IsInt() @Min(1)
  afterPhotoId: number;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  notes?: string;
}
