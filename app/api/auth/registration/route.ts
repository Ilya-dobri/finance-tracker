import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { login, email, password } = await req.json();

  const existingUser = await prisma.user.findFirst({
    where: {
       OR: [
        { email },
        { login },
      ],
    },
  });

   if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email or login already exists",
        },
        { status: 409 }
      );
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
  return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        redirect: '/auth/login'
      },
    });
}

