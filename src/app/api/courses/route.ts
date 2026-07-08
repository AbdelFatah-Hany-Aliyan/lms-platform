import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from '@/lib/db'

export async function POST(req:Request) {
    try{
        const session = await getServerSession(authOptions);
        if(!session?.user?.id){
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { title } = await req.json()

        if(!title){
            return new NextResponse('Title Required', { status: 400 })
        }

        const course = await db.course.create({
            data:{
                instructorId: session.user.id,
                title,
                description:'',
                price: 0.0
            }
        })

        return NextResponse.json(course);
    }catch (e){
        console.log('[COURSES_POST_ERROR]', e)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}