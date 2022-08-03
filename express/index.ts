import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Mailer } from './src/mailer';
import serverless from 'serverless-http';

dotenv.config();

const app: Express = express();
app.use(cors())

app.use(express.json());
const port = process.env.PORT;
const mailer: Mailer = new Mailer();

app.get('/', (req: Request, res: Response) => {
  res.send('César Calle Wayru Api <br/> Express + TypeScript Server');
});

app.post('/contact', (req: Request, res: Response) => {
  const {email, reason, description} = req.body;
  if (!email || !reason || !description) {
    res.status(401);
    const errors: string[] = [];
    if (!email) errors.push('email required');
    if (!reason) errors.push('reason required');
    if (!description) errors.push('description required');
    res.send({message: 'Invalid data', errors});
  }

  mailer.sendMail(email, reason, description).then(() => {
    res.status(201);
    res.send({message: 'Mail sended'});
  }).catch(e=>{
    res.status(500);
    res.end({message: 'Internal error', errors: [e.toString()]})
  });
});

module.exports.handler = serverless(app);