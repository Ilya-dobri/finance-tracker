import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const { accountId } = await params;

  const token =
    req.cookies.get("session_token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: session.userId,
    },
  });
  if (!account) {
    return NextResponse.json({ error: "Карта не найдена" }, { status: 404 });
  }
  const transactions = await prisma.transaction.findMany({
    where: {
      accountId: account.id,
    },
    orderBy: {
      date: "desc",
    },
  });
  return NextResponse.json(transactions);
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const { accountId } = await params;
  const token =
    req.cookies.get("session_token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const account = await prisma.account.findFirst({
    where: {
      userId: session.userId,
      id: accountId,
    },
  });
  if (!account) {
    return NextResponse.json({ error: "Карта не найдена" }, { status: 404 });
  }
  const body = await req.json();

  const { amount, type, description, date, categoryId, createdAt } = body;
  const rawDate = date ?? createdAt;

  if (amount === undefined || !type || !description || !date || !rawDate) {
    return NextResponse.json(
      { error: "Не хватает данных транзакции" },
      { status: 400 },
    );
  }
  const transactionDate = new Date(date);

  if (isNaN(transactionDate.getTime())) {
    return NextResponse.json({ error: "Некорректная дата" }, { status: 400 });
  }

  const dedupeHash = crypto
    .createHash("sha256")
    .update(
      `${session.userId}-${accountId}-${amount}-${type}-${description}-${transactionDate.toISOString()}`,
    )
    .digest("hex");

  const existingTransaction = await prisma.transaction.findUnique({
    where: {
      dedupeHash,
    },
  });

  if (existingTransaction) {
    return NextResponse.json(existingTransaction, { status: 200 });
  }
  const [transaction, updatedAccount] = await prisma.$transaction([
   prisma.transaction.create({
 data: {
      amount,
      type,
      description,

      date: transactionDate,

      userId: session.userId,
      accountId: account.id,

      categoryId,

      dedupeHash,
    },
   }),
   
    prisma.account.update({
    where:{
      id: account.id
    },
    data: {
       balance: {
      increment: amount,
    },
    }
  })
  ]);
 
 return NextResponse.json(
  {
    transaction,
    balance: updatedAccount.balance,
  },
  { status: 201 },
);
}

