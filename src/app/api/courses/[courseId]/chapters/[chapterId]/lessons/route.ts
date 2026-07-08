import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST (
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId, chapterId } = await params;
        const { title } = await req.json();

        if(!session?.user?.id || session?.user?.role !== "ADMIN"){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            },
        })

        if(!chapter){
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        const lastLesson = await db.lesson.findFirst({
            where: {
                chapterId: chapterId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        const lesson = await db.lesson.create({
            data: {
                title,
                chapterId: chapterId,
                courseId: courseId,
                position: newPosition
            }
        })

        return NextResponse.json(lesson, { status: 201 });
    }catch(error){
        return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
    }
}