import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";


export async function GET(req: NextRequest) {
  const token =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];
   const session = await prisma.session.findUnique({
        where:{
            token
        }
    })
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where:{
            id: session.userId
        }
    })
    
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" });
    }
    const categories = await prisma.category.findMany({
        where:{
            userId: session.userId
        }
    })
    return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
   const token =
      req.cookies.get("session_token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const session = await prisma.session.findUnique({
        where:{
            token
        }
    })
if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where:{
            id: session.userId
        }
    })
    
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" });
    }
const categories = await req.json();
if (!Array.isArray(categories)) {
  return NextResponse.json(
    { error: "Ожидается массив категорий" },
    { status: 400 },
  );
}
const result = await prisma.category.createMany({
  data: categories.map(
    (category: { name: string; type: "expense" | "income" }) => ({
      name: category.name,
      type: category.type,
      userId: session.userId,
    }),
  ),
});

    return NextResponse.json(result, {
      status: 201,
    });
}