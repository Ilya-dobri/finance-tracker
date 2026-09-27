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




export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
try {
       const { accountId } = await params;
if (!accountId) {
  return NextResponse.json(
    { error: "Account id is required" },
    { status: 400 }
  );
}
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
      where:{
        
        token
      }
    })
    if(!session){
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }
    const account = await prisma.account.findUnique({
      where:{
        id: accountId,
        userId: session.userId,
      }
    })
    if (!account){
       return NextResponse.json({ error: "Пользователь не найден" });
    }
    await prisma.account.delete({
      where: {
        id: account.id,
      },
    });

    return NextResponse.json({ message: "Аккаунт удалён" });
    }
      
     catch (error) {
  console.error("🔥 DELETE ACCOUNT ERROR:", error);

  return NextResponse.json(
    { error: "Ошибка удаления аккаунта" },
    { status: 500 }
  );
}
}