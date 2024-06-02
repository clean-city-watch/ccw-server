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
  UseInterceptors,
  UploadedFile,
  Patch,
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
import { AddIssueDto, CreateOrganizationDto, OrganizationResponseDto, PatchIssueDto, UserOrgRelationDto } from './dto/organization.dto';
import { UserResponseDto } from '../user/dto/user.dto';
import { Public } from '../core/auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('organization')
@Controller('organization')
export class OrganizationController {

  constructor(private readonly organizationService: OrganizationService) { }


  @ApiOperation({ summary: 'get users for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiQuery({ name: 'inroledUser', required: false })
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Get(':organizationId/users')
  async getUsersForOrganization(
    @Query('inroledUser') inroledUser: string,
    @Param('organizationId') organizationId: number
  ) {
    return this.organizationService.getUsersForOrganization(+organizationId, inroledUser);
  }

  @ApiOperation({ summary: 'create users relation for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Post(':organizationId/users')
  async createUsersRelationForOrganization(
    @Body() userOrgRelationDto: UserOrgRelationDto,
    @Param('organizationId') organizationId: number
  ) {
    return this.organizationService.createUsersRelationForOrganization(+organizationId, userOrgRelationDto);
  }



  @ApiOperation({ summary: 'get issues for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Get(':organizationId/issues')
  async getissuesForOrganization(
    @Param('organizationId') organizationId: number
  ) {
    return this.organizationService.getissuesForOrganization(+organizationId);
  }


  @ApiOperation({ summary: 'Add issues for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post(':organizationId/issue')
  async addIssueForOrganization(
    @Param('organizationId') organizationId: number,
    @Body() addIssueDto: AddIssueDto,
  ) {
    return this.organizationService.addIssueForOrganization(+organizationId, addIssueDto);
  }


  @ApiOperation({ summary: 'patch issues for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })
  @Patch(':organizationId/issues')
  async patchIssueForOrganization(
    @Param('organizationId') organizationId: number,
    @Body() patchIssueDto: PatchIssueDto,
  ) {
    return this.organizationService.patchIssuesForOrganization(+organizationId, patchIssueDto);
  }
  @ApiOperation({ summary: 'get user permission for organization' })
  @ApiParam({ name: 'organizationId', required: true })
  @ApiParam({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get(':organizationId/users/:userId/permission')
  async getPermissionforUser(
    @Param('organizationId') organizationId: number,
    @Param('userId') userId: number

  ) {
    return this.organizationService.getPermissionforUser(+organizationId, +userId);
  }




  @ApiOperation({ summary: 'Get all the users for organization' })
  @ApiQuery({ name: 'myOrganization', required: false })
  @ApiResponse({ status: 200, description: 'Success', type: [OrganizationResponseDto] })
  @Get()
  async getOrganizations(@Query('myOrganization') myOrganization: string, @Request() req) {
    return this.organizationService.getOrganizations(myOrganization, req['user'].sub);
  }


  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Success', type: OrganizationResponseDto })
  @Get(':id')
  async getUsers(@Param('id') id: string, @Request() req): Promise<OrganizationResponseDto> {
    return this.organizationService.getProfile(+id, req['user'].sub);
  }

  @ApiOperation({ summary: 'Create organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto, // Replace with your response DTO
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.organizationService.create(
      createOrganizationDto,
      file
    );
    return organization;
  }


}
