import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  // Put,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, OrganizationResponseDto, UserOrgRelationDto } from './dto/organization.dto';
import { UserResponseDto } from '../user/dto/user.dto';
import { Public } from '../core/auth/public.decorator';


@ApiTags('organization')
@Controller('organization')
export class OrganizationController {

  constructor(private readonly organizationService: OrganizationService) { }


  @ApiOperation({ summary: 'get users for organization' })
  @ApiParam({name: 'organizationId', required: true})
  @ApiQuery({ name: 'inroledUser', required: false })
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Get(':organizationId/users')
  async getUsersForOrganization(
    @Query('inroledUser') inroledUser: string,
    @Param('organizationId') organizationId: number
    ) {
    return this.organizationService.getUsersForOrganization(+organizationId,inroledUser);
  }

  @ApiOperation({ summary: 'create users relation for organization' })
  @ApiParam({name: 'organizationId', required: true})
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Post(':organizationId/users')
  async createUsersRelationForOrganization(
    @Body() userOrgRelationDto: UserOrgRelationDto,
    @Param('organizationId') organizationId: number
    ) {
    return this.organizationService.createUsersRelationForOrganization(+organizationId,userOrgRelationDto);
  }


  @ApiOperation({ summary: 'Get all the users for leadboard' })
  @ApiResponse({ status: 200, description: 'Success', type: [OrganizationResponseDto] })
  @Get()
  async getOrganizations() {
    return this.organizationService.getOrganizations();
  }


  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Success', type: OrganizationResponseDto })
  @Get(':id')
  async getUsers(@Param('id') id: string,@Request() req): Promise<OrganizationResponseDto> {
    return this.organizationService.getProfile(+id,req['user'].sub);
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
