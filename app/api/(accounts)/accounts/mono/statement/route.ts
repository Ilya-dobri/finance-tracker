import { MonoStatement } from './../../../../../../mobile/src/types/type';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export type BankType = {
  id: string;
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment?: string;
  receiptId?: string;
};




export async function GET(req: NextRequest) {
  try {
const authToken =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];
    if (!authToken) {
      return NextResponse.json(
        { error: "Не авторизован" },
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

  
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get("accountId") || "0";

    // диапазон дат в секундах, по умолчанию — последние 30 дней
  const now = Math.floor(Date.now() / 1000);
    const to = searchParams.has("to")
      ? Number(searchParams.get("to"))
      : now;

    const from = searchParams.has("from")
      ? Number(searchParams.get("from"))
      : to - 30 * 24 * 60 * 60;

  if (!Number.isFinite(from) || !Number.isFinite(to)) {
      return NextResponse.json(
        { error: "Некорректные параметры from или to" },
        { status: 400 }
      );
    }

    if (from >= to) {
      return NextResponse.json(
        { error: "Параметр from должен быть меньше to" },
        { status: 400 }
      );
    }
    const MAX_RANGE = 31 * 24 * 60 * 60 + 60 * 60; // 31 день + 1 час
    if (to - from > MAX_RANGE) {
      return NextResponse.json(
        {
          error:
            "Максимальный диапазон — 31 день + 1 час за один запрос",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.monobank.ua/personal/statement/${accountId}/${from}/${to}`,
      { headers: { "X-Token": account.bankAccountId } },
    );

      if (response.status === 429) {
      return NextResponse.json(
        {
          error:
            "Слишком много запросов. Monobank разрешает ограниченное количество запросов к выписке.",
        },
        { status: 429 }
      );
    }

      if (!response.ok) {
      const text = await response.text();

      console.error(
        "Mono statement error:",
        response.status,
        text
      );

        return NextResponse.json(
          { error: "Ошибка при получении выписки Mono" },
          { status: response.status }
        );
      }

    const data = (await response.json()) as BankType[];
   return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 MONO STATEMENT ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка при получении выписки Mono" },
      { status: 500 }
    );
  }
};