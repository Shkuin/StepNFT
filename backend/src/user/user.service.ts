import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { google, type Auth } from 'googleapis';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    const clientId = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_SECRET_KEY');
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'postmessage',
    );
  }

  // We do not use it now
  // async connectGoogleAccount(userId: string, code: string) {
  //   const user = await this.userModel.findOne({ _id: userId });
  //   console.log('Injected connectGoogleAccount! code: ', code);
  //   user.googleCode = code;
  //   await user.save();
  // }

  async getUserAccessKey(userId: string) {
    const { googleAccessToken } = await this.userModel.findOne({ _id: userId });
    return googleAccessToken;
  }

  async createUser(
    issuer: string,
    name: string,
    picture: string,
    email: string,
    googleAccessToken: string,
  ) {
    const createUser = new this.userModel({
      name,
      picture,
      email,
      googleAccessToken,
      googleCode: null,
      issuer,
    });
    return this.mapToDto(await createUser.save());
  }

  async updateUserToken(issuer: string, accessToken: string) {
    const user = await this.userModel.findOne({ issuer });
    if (!user) return null;
    user.googleAccessToken = accessToken;
    await user.save();
    return this.mapToDto(user);
  }

  async findById(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) return null;
    return this.mapToDto(user);
  }

  async findByIssuer(issuer: string) {
    const user = await this.userModel.findOne({ issuer });
    if (!user) return null;
    return this.mapToDto(user);
  }

  mapToDto(user: User) {
    const { googleAccessToken } = user;
    return {
      synced: Boolean(googleAccessToken),
      ...user,
    };
  }
}
