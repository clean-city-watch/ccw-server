import {
    Controller,
    Get,
    Param,
    Post,
    Body,
   // Put,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, OrganizationResponseDto } from './dto/organization.dto';


@ApiTags('organization')
@Controller('organization')
export class OrganizationController {

    constructor(private readonly organizationService: OrganizationService) {}

    
    @ApiOperation({ summary: 'Get all the users for leadboard' })
    @ApiResponse({ status: 200, description: 'Success', type:[OrganizationResponseDto]})    
    @Get()
    async getOrganizations(){
        return this.organizationService.getOrganizations();
    }


    @ApiOperation({ summary: 'Get organization by id' })
    @ApiResponse({ status: 200, description: 'Success', type: OrganizationResponseDto })    
    @Get(':id')
    async getUsers(@Param('id') id: string): Promise<OrganizationResponseDto>{
        return this.organizationService.getProfile(+id);
    }

    @ApiOperation({ summary: 'Create organization' })
    @ApiBody({ type: CreateOrganizationDto })
    @ApiResponse({
      status: 201,
      description: 'Organization created successfully',
      type: OrganizationResponseDto, // Replace with your response DTO
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    async create(
      @Body() createOrganizationDto: CreateOrganizationDto,
    ): Promise<OrganizationResponseDto> {
      const organization = await this.organizationService.create(
        createOrganizationDto,
      );
      return organization;
    }


}
