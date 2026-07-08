import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {

    try{

        const session = await getServerSession(authOptions);
        const { courseId } = await params;

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id:courseId,
                instructorId: session.user.id
            },
            include:{
                chapters:true
            }
        })

        if(!course?.chapters){
            return new NextResponse("Course not found", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished || (chapter as any).isPublished);
        if(!course.title || !course.description || !hasPublishedChapter){
            return new NextResponse("Course is not ready to be published", { status: 400 });
        }

        const publishedCourse = await db.course.update({
            where:{
                id: courseId,
                instructorId: session.user.id
            },
            data:{
                published:true
            }
        })

        return NextResponse.json(publishedCourse)
    }catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}