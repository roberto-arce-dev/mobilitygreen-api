import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { UploadModule } from '../upload/upload.module';
import { Vehiculo, VehiculoSchema } from './schemas/vehiculo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehiculo.name, schema: VehiculoSchema }]),
    UploadModule,
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [VehiculoService],
})
export class VehiculoModule {}
