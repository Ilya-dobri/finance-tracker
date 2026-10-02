import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";



export async function PATCH(req: Request) {
 const token = req.headers.get("authorization")?.split(" ")[1];
       if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const session = await prisma.session.findUnique({
        where: { token },
    })
    if(!session)return
    const {password} = await req.json(); 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
        where:{
            id: session.userId
        },
        data:{
            hashedPassword
        }
    })
     return NextResponse.json({ user });
}