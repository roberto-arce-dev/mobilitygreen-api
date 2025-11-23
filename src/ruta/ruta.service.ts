import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { Ruta, RutaDocument } from './schemas/ruta.schema';

@Injectable()
export class RutaService {
  constructor(
    @InjectModel(Ruta.name) private rutaModel: Model<RutaDocument>,
  ) {}

  async create(createRutaDto: CreateRutaDto): Promise<Ruta> {
    const nuevoRuta = await this.rutaModel.create(createRutaDto);
    return nuevoRuta;
  }

  async findAll(): Promise<Ruta[]> {
    const rutas = await this.rutaModel.find();
    return rutas;
  }

  async findOne(id: string | number): Promise<Ruta> {
    const ruta = await this.rutaModel.findById(id);
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrado`);
    }
    return ruta;
  }

  async update(id: string | number, updateRutaDto: UpdateRutaDto): Promise<Ruta> {
    const ruta = await this.rutaModel.findByIdAndUpdate(id, updateRutaDto, { new: true });
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrado`);
    }
    return ruta;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.rutaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrado`);
    }
  }
}
