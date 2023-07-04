export class AuthBodyModel {
  oauth: OAuthModel;
}

export class OAuthModel {
  accessToken: string;
  provider: string;
  scope: string[];
  userInfo: UserInfoModel;
}

export class UserInfoModel {
  email: string;
  name: string;
  picture: string;
  sub: string;
}
