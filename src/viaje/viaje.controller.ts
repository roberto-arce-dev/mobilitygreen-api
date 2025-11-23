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
import { ViajeService } from './viaje.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Viaje')
@ApiBearerAuth('JWT-auth')
@Controller('viaje')
export class ViajeController {
  constructor(
    private readonly viajeService: ViajeService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Viaje' })
  @ApiBody({ type: CreateViajeDto })
  @ApiResponse({ status: 201, description: 'Viaje creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createViajeDto: CreateViajeDto) {
    const data = await this.viajeService.create(createViajeDto);
    return {
      success: true,
      message: 'Viaje creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Viaje' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Viaje' })
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
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
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
    const updated = await this.viajeService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { viaje: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Viajes' })
  @ApiResponse({ status: 200, description: 'Lista de Viajes' })
  async findAll() {
    const data = await this.viajeService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Viaje por ID' })
  @ApiParam({ name: 'id', description: 'ID del Viaje' })
  @ApiResponse({ status: 200, description: 'Viaje encontrado' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.viajeService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Viaje' })
  @ApiParam({ name: 'id', description: 'ID del Viaje' })
  @ApiBody({ type: UpdateViajeDto })
  @ApiResponse({ status: 200, description: 'Viaje actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateViajeDto: UpdateViajeDto
  ) {
    const data = await this.viajeService.update(id, updateViajeDto);
    return {
      success: true,
      message: 'Viaje actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Viaje' })
  @ApiParam({ name: 'id', description: 'ID del Viaje' })
  @ApiResponse({ status: 200, description: 'Viaje eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  async remove(@Param('id') id: string) {
    const viaje = await this.viajeService.findOne(id);
    if (viaje.imagen) {
      const filename = viaje.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.viajeService.remove(id);
    return { success: true, message: 'Viaje eliminado exitosamente' };
  }
}
