import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";


export async function GET(req: NextRequest) {
  try {
     const authToken =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    
    if (!authToken) {
      return NextResponse.json(
        { error: "Сессионный токен не найден" },
        { status: 401 }
      );
    }
    const session = await prisma.session.findUnique({
      where: { token: authToken },
    });
     if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }
    const account = await prisma.account.findFirst({
      where: { userId: session.userId, provider: "monobank" },
    });
      if (!account) {
      return NextResponse.json(
        { error: "Аккаунт Monobank не найден" },
        { status: 404 }
      );
    }
    const response = await fetch(
      "https://api.monobank.ua/personal/client-info",
      {
        headers: { "X-Token": account.bankAccountId },
      },
    );

    const data = await response.json();
   return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 MONO ERROR:", error);
      return NextResponse.json(
      { error: "Ошибка при получении данных Mono" },
      { status: 500 }
    );
  }
};
