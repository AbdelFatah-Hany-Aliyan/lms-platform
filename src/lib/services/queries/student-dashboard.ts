import {db} from "@/lib/db";

export async function getStudentDashboard(userId: string){
    try{
        const enrolledCourses = await db.enrollment.findMany({
            where:{
                studentId: userId
            },
            select:{
                course:{
                    include:{
                        chapters:{
                            where:{
                                isPublished: true
                            },
                            orderBy:{
                                position: 'asc'
                            }
                        }
                    }
                }
            }
        })

        const coursesWithProgress = await Promise.all(
            enrolledCourses.map(async (enrollment) => {
                const course = enrollment.course;
                const completedChaptersCount = await db.studentProgress.count({
                    where:{
                        studentId: userId,
                        lessonId:{
                            in: course?.chapters.map(chapter => chapter.id)
                        },
                        isCompleted: true
                    }
                })

                const totalChaptersCount = course.chapters.length;
                const progressPercentage = totalChaptersCount === 0
                ? 0
                : (completedChaptersCount / totalChaptersCount) * 100;

                return {
                    ...course,
                    progress: progressPercentage,
                    completedChapters: completedChaptersCount,
                    totalChaptersCount
                }
            })
        )

        return coursesWithProgress;
    }catch (error){
        console.log('[GET_STUDENT_DASHBOARD_ERROR]', error)
    }
}