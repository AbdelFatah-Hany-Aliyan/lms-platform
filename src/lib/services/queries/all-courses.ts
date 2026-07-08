import {db} from "@/lib/db";

export async function getPublishedCourses() {
    try{
        return await db.course.findMany({
            where:{
                published: true
            },
            include:{
                chapters:{
                    where:{
                        isPublished: true
                    },
                    select:{id:true}
                }
            },
            orderBy: { createdAt: 'desc'}
        })
        
    }catch(error){
        console.log('[GET_PUBLISHED_COURSES_ERROR]', error)
    }
}

export async function getCourseDetails(courseId: string) {
    try{
        const course = await db.course.findUnique({
            where:{
                id: courseId,
                published: true
            },
            include:{
                chapters:{
                    where:{
                        isPublished: true,
                    },
                    orderBy:{
                        position: 'asc'
                    },
                    include:{
                        lessons:{
                            orderBy:{
                                position:'asc'
                            }
                        }
                    }
                }
            }
        })
        return course;
    }catch (error){
        console.log('[GET_COURSE_DETAILS_ERROR]', error)
        return null;
    }
}