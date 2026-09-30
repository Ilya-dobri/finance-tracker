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
    
    if (session) {
      await prisma.session.delete({ where: { token } });
    }
     return NextResponse.json(
        { error: "Session expired" },
        { status: 409 }
      );
  }

 
  const { password, ...userWithoutPassword } = session.user;

  return NextResponse.json({
      user: userWithoutPassword,
    });

}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(' ')[1];
    if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
    await prisma.session.deleteMany({
      where:{
        token
      }
    })
  
   const response = NextResponse.json({
    message: "Logged out successfully",
  });

  response.cookies.delete("session_token");
  return response;

}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(' ')[1];
  
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  const session = await prisma.session.findUnique({
    where: { token },
   
  });
  if(!session) return

  const formData = await req.formData()
     const avatar = formData.get("avatar");
      if (!(avatar instanceof File)) {
      return NextResponse.json(
        { error: "Фотография не передана" },
        { status: 400 }
      );
    }
      const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(avatar.type)) {
      return NextResponse.json(
        { error: "Неподдерживаемый формат изображения" },
        { status: 400 }
      );
    }

    if (avatar.size === 0 || avatar.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Фото должно быть не больше 5 МБ" },
        { status: 400 }
      );
    }
  const bytes = await avatar.arrayBuffer();

const avatar_url = `data:${avatar.type};base64,${Buffer.from(bytes).toString("base64")}`;
  const user = await prisma.user.update({
    where: {
      id: session.userId,
      
    },
    data:{
      avatar_url
    }
  });

  return NextResponse.json({ user });
}