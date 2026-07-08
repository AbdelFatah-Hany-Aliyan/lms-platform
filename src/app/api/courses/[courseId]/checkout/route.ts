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

        const course = await db.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const existingEnrollment = await db.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: session.user.id,
                    courseId: courseId,
                }
            }
        });

        if (existingEnrollment) {
            return new NextResponse("Already Enrolled", { status: 400 });
        }

        if (!course.price || course.price === 0) {
            await db.enrollment.create({
                data: {
                    studentId: session.user.id,
                    courseId: courseId,
                    paymentId: "FREE_ACCESS",
                    amountPaid: 0,
                }
            });

            return NextResponse.json({ url: `/explore/${courseId}`, isFree: true });
        }

        const paymentUrl = `/dashboard/student/explore/${courseId}/payment`;
        return NextResponse.json({ url: paymentUrl, isFree: false });

    } catch (error) {
        console.log("[COURSE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}