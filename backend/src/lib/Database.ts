import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_DB || process.env.Mongo_db || '';
  }

  public async connect(): Promise<void> {
    try {
      if (!this.uri) {
        throw new Error('Mongo_db environment variable is not defined.');
      }
      await mongoose.connect(this.uri);
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('Error in MongoDB connection:', err);
    }
  }
}

export default new Database();
