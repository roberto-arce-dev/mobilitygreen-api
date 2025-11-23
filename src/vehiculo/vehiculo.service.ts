import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo, VehiculoDocument } from './schemas/vehiculo.schema';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectModel(Vehiculo.name) private vehiculoModel: Model<VehiculoDocument>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const nuevoVehiculo = await this.vehiculoModel.create(createVehiculoDto);
    return nuevoVehiculo;
  }

  async findAll(): Promise<Vehiculo[]> {
    const vehiculos = await this.vehiculoModel.find().populate('estacion', 'nombre ubicacion');
    return vehiculos;
  }

  async findOne(id: string | number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoModel.findById(id).populate('estacion', 'nombre ubicacion');
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo con ID ${id} no encontrado`);
    }
    return vehiculo;
  }

  async update(id: string | number, updateVehiculoDto: UpdateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoModel.findByIdAndUpdate(id, updateVehiculoDto, { new: true }).populate('estacion', 'nombre ubicacion');
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo con ID ${id} no encontrado`);
    }
    return vehiculo;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.vehiculoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Vehiculo con ID ${id} no encontrado`);
    }
  }
}
