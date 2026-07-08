import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        const existingEnrollment = await db.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: session.user.id,
                    courseId: courseId,
                }
            }
        });

        if (existingEnrollment) {
            await db.enrollment.delete({
                where: {
                    id: existingEnrollment.id
                }
            });
            return NextResponse.json({ enrolled: false });
        }

        const newEnrollment = await db.enrollment.create({
            data: {
                studentId: session.user.id,
                courseId: courseId,
                paymentId: "",
                amountPaid: 0,
            }
        });

        return NextResponse.json({ enrolled: true });
    } catch (error) {
        console.log("[COURSE_ENROLL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}