import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { chapterId, lessonId } = await params;
        const values = await req.json();

        const lesson = await db.lesson.update({
            where: {
                id: lessonId,
                chapterId: chapterId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSON_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { chapterId, lessonId } = await params;

        const deletedLesson = await db.lesson.delete({
            where: {
                id: lessonId,
                chapterId: chapterId,
            }
        });

        return NextResponse.json(deletedLesson);
    } catch (error) {
        console.log("[LESSON_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}