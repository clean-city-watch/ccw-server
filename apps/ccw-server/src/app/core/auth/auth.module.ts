import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [AuthService, ConfigService, AuthGuard],
  exports: [],
})
export class AuthModule {}