import UserRepository from '../repositories/UserRepository';
import { IContest } from '../models/User';

export class UserService {
  async addContestInformation(data: any) {
    const {
      name, email, time_duration, codeforces_question, rating_codeforces,
      leetcode_question, solved_leetcode_question, rating_leetcode,
      solved_codeforces_question, total_question, date 
    } = data;

    const user = await UserRepository.findByEmail(email);
    if (!user || user.name !== name) {
      throw new Error("No such user is found");
    }

    const newContest: IContest = {
      total_question, time_duration, codeforces_question, leetcode_question,
      rating_codeforces, rating_leetcode, solved_codeforces_question,
      solved_leetcode_question, date
    };

    const updatedUser = await UserRepository.addContestInfo(email, newContest);
    
    if (updatedUser) {
      const newTotalQuestion = (updatedUser.total_question || 0) + solved_codeforces_question + solved_leetcode_question;
      const newTotalContest = (updatedUser.total_contest || 0) + 1;
      
      await UserRepository.updateContestStats(email, { 
        total_question: newTotalQuestion,
        total_contest: newTotalContest
      });
    }

    return await UserRepository.findByEmail(email);
  }

  async getUserDetails(name: string, email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || user.name !== name) {
      throw new Error("No Such Type of the User is Not present");
    }
    return user.contest_information;
  }

  async findUserByEmail(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found.`);
    }
    return user;
  }
}

export default new UserService();
