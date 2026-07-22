import mongoose, { Document, Schema } from 'mongoose';

export interface IContest {
  total_question?: number;
  time_duration?: number;
  codeforces_question?: number;
  leetcode_question?: number;
  rating_codeforces?: number;
  rating_leetcode?: string;
  solved_codeforces_question?: number;
  solved_leetcode_question?: number;
  date?: string;
}

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  otp?: string;
  total_contest?: number;
  total_question?: number;
  contest_information?: IContest[];
}

const contestSchema = new Schema<IContest>({
  total_question: Number,
  time_duration: Number,
  codeforces_question: Number,
  leetcode_question: Number,
  rating_codeforces: Number,
  rating_leetcode: String,
  solved_codeforces_question: Number,
  solved_leetcode_question: Number,
  date: String
});

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  password: String,
  otp: String,
  total_contest: Number,
  total_question: Number,
  contest_information: [contestSchema],
});

export const User = mongoose.model<IUser>("User", userSchema);
