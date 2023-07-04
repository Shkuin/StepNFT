import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { DoneFunc, MagicUser, Strategy } from 'passport-magic';

import { Magic } from '@magic-sdk/admin';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PassportMagicStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {
    super(
      async (magicUser: MagicUser, done: DoneFunc) => {
        if (!magicUser) {
          return done(new UnauthorizedException());
        }

        const user = await this.userService.findByIssuer(magicUser.issuer);

        if (!user) {
          return done(
            new NotFoundException('Magic Link User is not found in DB'),
          );
        }

        return done(null, user);
      },
      {
        magicInstance: new Magic(configService.get('MAGIC_SECRET_KEY')),
      },
    );
  }
}
