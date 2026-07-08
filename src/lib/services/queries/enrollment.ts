import {db} from "@/lib/db";

export async function enrollInCourse(userId: string, courseId: string) {
    try{
        const existingEnrollment = await db.enrollment.findUnique({
            where:{
                studentId_courseId:{
                    studentId: userId,
                    courseId: courseId
                }
            }
        })

        if(existingEnrollment){
            return {success: false, message: "User is already enrolled in this course."};
        }

        const enrollment = await db.enrollment.create({
            data:{
                paymentId: "",
                studentId: userId,
                courseId: courseId,
                amountPaid: 0,
            }
        })
        return {success: true, message: "User enrolled in course successfully."};
    }catch(error){
        console.log('[ENROLL_IN_COURSE_ERROR]', error)
        return {success: false, message: "Failed to enroll user in course."};
    }
}

export async function enrolledCourses(userId:string) {
    try{
        return await db.enrollment.findMany({
            where:{
                studentId: userId
            },
            include:{
                course:{
                    include:{
                        chapters:{
                            where:{
                                isPublished: true
                            }
                        }
                    }
                }
            },
            orderBy:{
                enrolledAt: 'desc'
            }
        })
    }catch(error){
        console.log('[ENROLLED_IN_COURSE_ERROR]', error)
    }
}

export async function getEnrollmentStatus(userId: string, courseId: string) {
    try {
        if (!userId) return null;

        const enrollment = await db.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: userId,
                    courseId: courseId,
                }
            }
        });

        return enrollment;
    } catch (error) {
        console.log("[GET_ENROLLMENT_STATUS_ERROR]", error);
        return null;
    }
}