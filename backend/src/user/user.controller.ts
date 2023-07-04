import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodeDto } from './types';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // We do not use it now
  // @Post('/connect') 
  // @UseGuards(AuthGuard('magic'))
  // connectGoogleAccount(@Body() code: CodeDto, @Request() req) {
  //   const user = req.user;
  //   this.userService.connectGoogleAccount(user._doc._id, code.code);
  // }

  @Get()
  @UseGuards(AuthGuard('magic'))
  getUser(@Request() req) {
    return req.user;
  }
}
