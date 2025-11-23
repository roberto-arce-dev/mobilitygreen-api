import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Vehiculo')
@ApiBearerAuth('JWT-auth')
@Controller('vehiculo')
export class VehiculoController {
  constructor(
    private readonly vehiculoService: VehiculoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Vehiculo' })
  @ApiBody({ type: CreateVehiculoDto })
  @ApiResponse({ status: 201, description: 'Vehiculo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createVehiculoDto: CreateVehiculoDto) {
    const data = await this.vehiculoService.create(createVehiculoDto);
    return {
      success: true,
      message: 'Vehiculo creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Vehiculo' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Vehiculo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Vehiculo no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.vehiculoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { vehiculo: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Vehiculos' })
  @ApiResponse({ status: 200, description: 'Lista de Vehiculos' })
  async findAll() {
    const data = await this.vehiculoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Vehiculo por ID' })
  @ApiParam({ name: 'id', description: 'ID del Vehiculo' })
  @ApiResponse({ status: 200, description: 'Vehiculo encontrado' })
  @ApiResponse({ status: 404, description: 'Vehiculo no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.vehiculoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Vehiculo' })
  @ApiParam({ name: 'id', description: 'ID del Vehiculo' })
  @ApiBody({ type: UpdateVehiculoDto })
  @ApiResponse({ status: 200, description: 'Vehiculo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Vehiculo no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateVehiculoDto: UpdateVehiculoDto
  ) {
    const data = await this.vehiculoService.update(id, updateVehiculoDto);
    return {
      success: true,
      message: 'Vehiculo actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Vehiculo' })
  @ApiParam({ name: 'id', description: 'ID del Vehiculo' })
  @ApiResponse({ status: 200, description: 'Vehiculo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Vehiculo no encontrado' })
  async remove(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.findOne(id);
    if (vehiculo.imagen) {
      const filename = vehiculo.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.vehiculoService.remove(id);
    return { success: true, message: 'Vehiculo eliminado exitosamente' };
  }
}
