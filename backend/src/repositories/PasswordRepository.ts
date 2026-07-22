import { Password, IPassword } from '../models/Password';

export class PasswordRepository {
  async createOTP(email: string, otpHashed: string): Promise<IPassword> {
    const otp = new Password({ email, otp_hased: otpHashed, used: false });
    return await otp.save();
  }

  async findValidOTP(email: string): Promise<IPassword | null> {
    return await Password.findOne({ email, used: false }).sort({ _id: -1 });
  }

  async markOTPAsUsed(id: string): Promise<void> {
    await Password.findByIdAndUpdate(id, { used: true });
  }
}

export default new PasswordRepository();
