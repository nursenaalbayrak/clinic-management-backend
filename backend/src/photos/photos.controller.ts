import {
  Controller,
  Post,
  Res,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';
 import { Delete } from '@nestjs/common';

@ApiTags('Photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // 📸 Fotoğraf yükleme
  @Post(':patientId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // dosyalar buraya kaydedilir
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        description: { type: 'string' },
      },
    },
  })
  async uploadPhoto(
    @Param('patientId') patientId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
  ) {
    if (!file) throw new Error('Dosya yüklenmedi!');
    return this.photosService.addPhoto(patientId, file.path, description);
  }

  // 📷 Hastaya ait fotoğrafları getir
  @Get(':patientId')
  async getPhotos(@Param('patientId') patientId: number) {
    return this.photosService.getPhotosByPatient(patientId);
  }

  // 🖼️ Fotoğraf dosyasını döndür (tarayıcıda göstermek için)
  @Get('file/:filename')
  async getPhotoFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    return res.sendFile(filePath);
  }

 

@Delete(':id')
async deletePhoto(@Param('id') id: number) {
  return this.photosService.deletePhoto(id);
}
}
