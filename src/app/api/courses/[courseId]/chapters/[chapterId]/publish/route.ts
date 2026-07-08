import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request, { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId, chapterId } = await params;

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
                course: {
                    instructorId: session.user.id,
                },
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedChapter);
    }catch(error) {
        console.log("[CHAPTERS_PUBLISH_PATCH_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}