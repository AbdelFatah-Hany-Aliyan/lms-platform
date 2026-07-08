import { db } from "@/lib/db"

export async function getAdminCourses(userId: string){
    return await db.course.findMany({
        where:{
            instructorId: userId
        },
        include:{
            _count:{
                select:{
                    chapters: true,
                    lessons: true,
                },
            },
            chapters: true
        },
        orderBy:{
            createdAt:'desc'
        }
    }
    )
}


export async function getCourseDetails(courseId: string, userId: string) {
    return await db.course.findUnique({
        where:{
            id: courseId,
            instructorId: userId
        },
        include:{
            chapters:{
                orderBy:{
                    position: 'asc'
                }
            },
        }
    })
}