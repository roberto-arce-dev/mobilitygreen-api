import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RutaDocument = Ruta & Document;

@Schema({ timestamps: true })
export class Ruta {
  @Prop({ required: true })
  origen: string;

  @Prop({ required: true })
  destino: string;

  @Prop({ default: 0, min: 0 })
  distanciaKm?: number;

  @Prop({ default: 0, min: 0 })
  duracionMin?: number;

  @Prop({ type: [String], default: [] })
  puntosIntermedios?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const RutaSchema = SchemaFactory.createForClass(Ruta);

RutaSchema.index({ origen: 1, destino: 1 });
