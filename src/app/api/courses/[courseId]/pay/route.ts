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
        const { cardNumber, expiry, cvv, cardName } = await req.json();

        if (!cardNumber || !expiry || !cvv || !cardName) {
            return new NextResponse("Missing payment details", { status: 400 });
        }

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

        const mockPaymentId = "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();

        const enrollment = await db.enrollment.create({
            data: {
                studentId: session.user.id,
                courseId: courseId,
                paymentId: mockPaymentId,
                amountPaid: course.price || 0,
            }
        });

        return NextResponse.json({ success: true, enrollment });
    } catch (error) {
        console.log("[COURSE_PAY_API_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}