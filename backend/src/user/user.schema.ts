import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop()
  email: string;

  @Prop()
  googleAccessToken: string;

  @Prop()
  googleCode: string;

  @Prop()
  issuer: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
