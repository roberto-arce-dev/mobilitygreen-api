import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje, ViajeDocument } from './schemas/viaje.schema';

@Injectable()
export class ViajeService {
  constructor(
    @InjectModel(Viaje.name) private viajeModel: Model<ViajeDocument>,
  ) {}

  async create(createViajeDto: CreateViajeDto): Promise<Viaje> {
    const nuevoViaje = await this.viajeModel.create(createViajeDto);
    return nuevoViaje;
  }

  async findAll(): Promise<Viaje[]> {
    const viajes = await this.viajeModel.find();
    return viajes;
  }

  async findOne(id: string | number): Promise<Viaje> {
    const viaje = await this.viajeModel.findById(id)
    .populate('usuario', 'nombre email telefono')
    .populate('vehiculo', 'tipo modelo matricula')
    .populate('ruta', 'origen destino distanciaKm');
    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }
    return viaje;
  }

  async update(id: string | number, updateViajeDto: UpdateViajeDto): Promise<Viaje> {
    const viaje = await this.viajeModel.findByIdAndUpdate(id, updateViajeDto, { new: true })
    .populate('usuario', 'nombre email telefono')
    .populate('vehiculo', 'tipo modelo matricula')
    .populate('ruta', 'origen destino distanciaKm');
    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }
    return viaje;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.viajeModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }
  }
}
