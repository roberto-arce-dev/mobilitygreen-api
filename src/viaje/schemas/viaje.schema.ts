import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ViajeDocument = Viaje & Document;

@Schema({ timestamps: true })
export class Viaje {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehiculo', required: true })
  vehiculo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ruta' })
  ruta: Types.ObjectId;

  @Prop({ default: Date.now })
  inicio?: Date;

  @Prop()
  fin?: Date;

  @Prop({ default: 0, min: 0 })
  distanciaKm?: number;

  @Prop({ default: 0, min: 0 })
  costo?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ViajeSchema = SchemaFactory.createForClass(Viaje);

ViajeSchema.index({ usuario: 1 });
ViajeSchema.index({ vehiculo: 1 });
ViajeSchema.index({ ruta: 1 });
ViajeSchema.index({ inicio: -1 });
