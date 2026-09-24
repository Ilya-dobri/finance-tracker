import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(req: NextRequest){
try {
    const accountId = req.nextUrl.searchParams.get("id");
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