import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from '@/lib/db'

export async function PATCH(
        req: Request,
        { params } : { params: Promise<{ courseId: string}>})
    {
        try{
            const session = await getServerSession(authOptions)
            const { courseId } = await params

            if(!session?.user?.id){
                return new NextResponse("Unauthorized", { status: 401})
            }

            const values = await req.json()

            const course = await db.course.update({
                where:{
                    id:courseId,
                    instructorId:session.user.id
                },
                data:{
                    ...values
                }
            })

            return NextResponse.json(course)
        }catch (error){
            return new NextResponse("Internal Server Error", { status: 500})
        }
}