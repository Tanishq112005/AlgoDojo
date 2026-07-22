import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './lib/Database';
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import judgeRoutes from './routes/judgeRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.Port_number || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

Database.connect();

app.use('/', problemRoutes);
app.use('/', judgeRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.get("/health", (req: any, res: any) => {
    res.status(200).json({
      msg: "server is running properly"
    });
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});