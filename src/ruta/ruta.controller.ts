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
import { RutaService } from './ruta.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Ruta')
@ApiBearerAuth('JWT-auth')
@Controller('ruta')
export class RutaController {
  constructor(
    private readonly rutaService: RutaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Ruta' })
  @ApiBody({ type: CreateRutaDto })
  @ApiResponse({ status: 201, description: 'Ruta creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createRutaDto: CreateRutaDto) {
    const data = await this.rutaService.create(createRutaDto);
    return {
      success: true,
      message: 'Ruta creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Ruta' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Ruta' })
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
  @ApiResponse({ status: 404, description: 'Ruta no encontrado' })
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
    const updated = await this.rutaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { ruta: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Rutas' })
  @ApiResponse({ status: 200, description: 'Lista de Rutas' })
  async findAll() {
    const data = await this.rutaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Ruta por ID' })
  @ApiParam({ name: 'id', description: 'ID del Ruta' })
  @ApiResponse({ status: 200, description: 'Ruta encontrado' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.rutaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Ruta' })
  @ApiParam({ name: 'id', description: 'ID del Ruta' })
  @ApiBody({ type: UpdateRutaDto })
  @ApiResponse({ status: 200, description: 'Ruta actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateRutaDto: UpdateRutaDto
  ) {
    const data = await this.rutaService.update(id, updateRutaDto);
    return {
      success: true,
      message: 'Ruta actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Ruta' })
  @ApiParam({ name: 'id', description: 'ID del Ruta' })
  @ApiResponse({ status: 200, description: 'Ruta eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrado' })
  async remove(@Param('id') id: string) {
    const ruta = await this.rutaService.findOne(id);
    if (ruta.imagen) {
      const filename = ruta.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.rutaService.remove(id);
    return { success: true, message: 'Ruta eliminado exitosamente' };
  }
}
