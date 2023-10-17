// organization.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
    @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  stateCode?: string;

  @ApiProperty()
  @IsString()
  logo: string;
}




export class OrganizationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  stateCode: string;

  @ApiProperty()
  logo: string;

}
