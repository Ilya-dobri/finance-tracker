import { prisma } from "../../lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: {
        token,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
        
        
      },
      include: {
        accounts: {
          where:{
            provider: {
              not: 'monobank'
            }
          }
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" });
    }

    return NextResponse.json(user.accounts);
  } catch (error) {
    console.error("🔥 ACCOUNTS ERROR:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({
          where: { token },
        });
      }

      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    const {
      name,
      provider,
      currency,
      bankAccountId,
      displayNumber,
      displayExpiry,
    } = await req.json();

    console.log("BODY:", {
      name,
      provider,
      currency,
      bankAccountId,
      displayNumber,
      displayExpiry,
    });

    const account = await prisma.account.create({
      data: {
        name,
        provider,
        currency,
        bankAccountId,
        userId: session.userId,
        displayNumber,
        displayExpiry,
      },
    });

    return NextResponse.json(account, {
      status: 201,
    });

  } catch (error) {
    console.error("🔥 CREATE ACCOUNT ERROR:", error);

    return NextResponse.json(
      {
        error: "Ошибка создания аккаунта",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}