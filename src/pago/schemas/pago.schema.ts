import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PagoDocument = Pago & Document;

@Schema({ timestamps: true })
export class Pago {
  @Prop({ type: Types.ObjectId, ref: 'Viaje', required: true,  unique: true  })
  viaje: Types.ObjectId;

  @Prop({ min: 0 })
  monto: number;

  @Prop({ enum: ['efectivo', 'tarjeta', 'transferencia', 'app'], default: 'app' })
  metodoPago: string;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop({ enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PagoSchema = SchemaFactory.createForClass(Pago);

PagoSchema.index({ viaje: 1 });
PagoSchema.index({ estado: 1 });
