





import bcrypt from "bcryptjs";

import { Router, Request, type Response as ExpressResponse } from 'express';
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { redirect } from "next/dist/server/api-utils";


const router = Router();

router.post('/registration', async (req: Request, res: ExpressResponse) => {
    const { login, email, password } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
       OR: [
        { email },
        { login },
      ],
    },
  });

 if (existingUser) {
      return res.status(409).json({
        error: 'User with this email or login already exists',
      });
    }

 const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
  data: {
    name: login,
    type: "user",
    login,
    email,
    password: hashedPassword,
    
  },
});
  res.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        redirect: '/auth/login'
      },
    });
}),



router.post('/login', async (req: Request, res: ExpressResponse) => {
 

  const { email, password } =req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json(
      { error: "Invalid email or password" },
    
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = randomBytes(32).toString('hex');


  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
    },
  });


    res.json({
      message: 'Login successful',
      token, // мобильное приложение сохранит это в SecureStore
    });
  } ),







router.get('/me', async (req: Request, res: ExpressResponse) => {
   const token = req.headers.authorization?.split(' ')[1];

   if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // если сессия просрочена — можно сразу удалить её из базы
    if (session) {
      await prisma.session.delete({ where: { token } });
    }
    return res.status(409).json({ error: "Session expired" }, );
  }

  // не отдаём хэш пароля на клиент
  const { password, ...userWithoutPassword } = session.user;

  return res.json({ user: userWithoutPassword });
})
export default router