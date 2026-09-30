import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { randomBytes } from "crypto";



export async function POST(req: NextRequest) {
 

  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

   if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = randomBytes(32).toString('hex');

await prisma.session.deleteMany({
  where: {
    expiresAt: {
      lte: new Date(),
    },
  },
});
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
    },
  });


    return NextResponse.json(
      {
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } 
