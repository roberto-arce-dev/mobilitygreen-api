import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RutaService } from './ruta.service';
import { RutaController } from './ruta.controller';
import { UploadModule } from '../upload/upload.module';
import { Ruta, RutaSchema } from './schemas/ruta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ruta.name, schema: RutaSchema }]),
    UploadModule,
  ],
  controllers: [RutaController],
  providers: [RutaService],
  exports: [RutaService],
})
export class RutaModule {}
