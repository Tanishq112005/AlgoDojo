import { User, IUser, IContest } from '../models/User';

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async addContestInfo(email: string, contestInfo: IContest): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      { $push: { contest_information: contestInfo } },
      { new: true }
    );
  }

  async updateContestStats(email: string, stats: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      { $set: stats },
      { new: true }
    );
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }
}

export default new UserRepository();
