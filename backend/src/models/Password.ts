import mongoose, { Document, Schema } from 'mongoose';

export interface IPassword extends Document {
  email?: string;
  otp_hased?: string;
  used?: boolean;
}

const passwordSchema = new Schema<IPassword>({
  email: String,
  otp_hased: String,
  used: Boolean
});

export const Password = mongoose.model<IPassword>("Password", passwordSchema);
