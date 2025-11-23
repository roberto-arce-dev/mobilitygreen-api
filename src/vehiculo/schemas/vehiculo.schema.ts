import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehiculoDocument = Vehiculo & Document;

@Schema({ timestamps: true })
export class Vehiculo {
  @Prop({ enum: ['bicicleta', 'scooter', 'auto'], default: 'bicicleta' })
  tipo?: string;

  @Prop({ unique: true })
  matricula: string;

  @Prop()
  modelo?: string;

  @Prop({ default: 100, min: 0, max: 100 })
  bateria?: number;

  @Prop()
  ubicacion?: string;

  @Prop({ default: true })
  disponible?: boolean;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const VehiculoSchema = SchemaFactory.createForClass(Vehiculo);

VehiculoSchema.index({ matricula: 1 });
VehiculoSchema.index({ tipo: 1 });
VehiculoSchema.index({ disponible: 1 });
