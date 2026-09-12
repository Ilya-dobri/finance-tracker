import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: NextRequest) {
   const token = req.headers.get("authorization")?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
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
     return NextResponse.json(
        { error: "Session expired" },
        { status: 409 }
      );
  }

  // не отдаём хэш пароля на клиент
  const { password, ...userWithoutPassword } = session.user;

  return NextResponse.json({
      user: userWithoutPassword,
    });

}