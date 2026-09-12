import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
    const { accountId } = await params;

 const token =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];
      
    if (!token) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }
        const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }
    const account = await prisma.account.findFirst({
        where: {
            id: accountId,
            userId: session.userId
        }
        
    })
    if (!account) {
      return NextResponse.json(
        { error: "Карта не найдена" },
        { status: 404 }
      );
    }
    const transactions = await prisma.transaction.findMany({
        where:{
            accountId: account.id
        },
         orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(transactions);
}