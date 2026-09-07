import 'dotenv/config';
console.log('DB URL:', process.env.DATABASE_URL);
import express from 'express';
import cors from 'cors';
import authRouter from './auth';
import accountsRouter from './accounts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountsRouter);

app.listen(3000, () => console.log('Server running on 3000'));