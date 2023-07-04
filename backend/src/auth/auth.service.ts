import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Magic } from '@magic-sdk/admin';
import { UserService } from 'src/user/user.service';
import { AuthBodyModel } from './auth.types';

@Injectable()
export class AuthService {
  magic: Magic;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {
    this.magic = new Magic(configService.get('MAGIC_SECRET_KEY'));
  }

  async login(magicIdToken: string, body: AuthBodyModel) {
    try {
      const didToken = this.magic.utils.parseAuthorizationHeader(magicIdToken);

      await this.magic.token.validate(didToken);
      const magicLinkUser = await this.magic.users.getMetadataByToken(didToken);

      let user = await this.userService.findByIssuer(magicLinkUser.issuer);
      if (!user) {
        console.log(body);
        user = await this.userService.createUser(
          magicLinkUser.issuer,
          body.oauth.userInfo.name,
          body.oauth.userInfo.picture,
          body.oauth.userInfo.email,
          body.oauth.accessToken,
        );
      } else {
        this.userService.updateUserToken(
          magicLinkUser.issuer,
          body.oauth.accessToken,
        );
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
