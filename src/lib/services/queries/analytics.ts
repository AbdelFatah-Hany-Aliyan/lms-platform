import { db } from "@/lib/db"

export async function getDashboardAdmin(userId: string) {
    const totalCourses = await db.course.count({
        where:{
            instructorId: userId
        }
    })

    const publishedCourses = await db.course.count({
        where:{
            instructorId: userId,
            published: true
        }
    })

    const draftCourses = totalCourses - publishedCourses;

    const enrollments = await db.enrollment.findMany({
        where:{
            course:{
                instructorId: userId,
            }
        },
        include:{
            course:{
                select:{
                    title: true,
                    price: true
                }
            }
        }
    })

    const uniqueStudents = new Set(enrollments.map((e) => e.studentId ))
    const totalStudents = uniqueStudents.size

    const totalSales = enrollments.reduce((total,enrollment) => {
        return total + (enrollment.course.price || 0)
    }, 0)

    const courseCountMap : {[key: string]: number} = {}
    enrollments.forEach((enrollment) => {
        const title = enrollment.course.title
        courseCountMap[title] = (courseCountMap[title] || 0) + 1
    })

    const topCoursesData = Object.entries(courseCountMap)
        .map(([courseTitle, studentCount]) => ({
            courseTitle,
            studentCount
        }))
        .sort((a,b) => b.studentCount - a.studentCount)
        .slice(0,5)

    return{
        totalCourses,
        publishedCourses,
        draftCourses,
        totalStudents,
        totalSales,
        courseCountMap,
        topCoursesData
    }
}

export async function getRecentStudents(userId:string) {
    return await db.enrollment.findMany({
        where:{
            course:{
                instructorId: userId
            }
        },
        take:5,
        orderBy:{
            enrolledAt: 'desc'
        },
        include:{
            student:{
                select:{
                    name: true,
                    email: true,
                }
            },
            course:{
                select:{
                    title: true,
                }
            }
        }
    })
}