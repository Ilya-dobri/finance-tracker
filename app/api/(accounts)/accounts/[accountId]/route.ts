import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { error } from "console";
type BankType = {
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



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;

     const authToken =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];
      if(!authToken){
        return NextResponse.json({ error: "Не авторизован" },
        { status: 401 })
      }
      const session = await prisma.session.findUnique({
            where: { token: authToken },
          });
          if(!session){
            return NextResponse.json(
              {error: 'Не авторизован'},
              {status: 401}
            )
          }
          const account = await prisma.account.findMany({
            where: { userId: session.userId, id: accountId },
            
          })
          if (!account) {
      return NextResponse.json(
        { error: "Карта не найдена" },
        { status: 404 }
      );
    }
  
            
          
           return NextResponse.json(account)
  } catch (error) {
    console.error("GET ACCOUNTS ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

}