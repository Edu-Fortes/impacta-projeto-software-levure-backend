import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StartersService } from './starters.service';
import { CreateStarterDto } from './dto/create-starter.dto';
import { UpdateStarterDto } from './dto/update-starter.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Starters (Fermentos)')
@Controller('starters')
export class StartersController {
  constructor(private readonly startersService: StartersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo fermento natural' })
  @ApiResponse({ status: 201, description: 'Fermento criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  create(@Body() createStarterDto: CreateStarterDto) {
    return this.startersService.create(createStarterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os fermentos cadastrados' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtro por nome, tipo de farinha ou local',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fermentos retornada com sucesso.',
  })
  findAll(@Query('search') search?: string) {
    return this.startersService.findAll(search);
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Obter métricas agregadas para o Painel/Dashboard' })
  @ApiResponse({ status: 200, description: 'Resumo estatístico do painel.' })
  getDashboardSummary() {
    return this.startersService.getDashboardSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um fermento pelo ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do fermento retornados.' })
  @ApiResponse({ status: 404, description: 'Fermento não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.startersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar informações de um fermento' })
  @ApiResponse({ status: 200, description: 'Fermento atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fermento não encontrado.' })
  update(@Param('id') id: string, @Body() updateStarterDto: UpdateStarterDto) {
    return this.startersService.update(id, updateStarterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir um fermento e suas alimentações associadas',
  })
  @ApiResponse({ status: 204, description: 'Fermento excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fermento não encontrado.' })
  remove(@Param('id') id: string) {
    return this.startersService.remove(id);
  }
}
