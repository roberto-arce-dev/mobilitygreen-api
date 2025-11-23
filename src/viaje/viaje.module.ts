import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViajeService } from './viaje.service';
import { ViajeController } from './viaje.controller';
import { UploadModule } from '../upload/upload.module';
import { Viaje, ViajeSchema } from './schemas/viaje.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Viaje.name, schema: ViajeSchema }]),
    UploadModule,
  ],
  controllers: [ViajeController],
  providers: [ViajeService],
  exports: [ViajeService],
})
export class ViajeModule {}
