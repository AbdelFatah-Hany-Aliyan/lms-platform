import {db} from "@/lib/db"

export async function getStudentsForAdmin(useId:string) {
    return await db.user.findMany({
        where:{
            role: "STUDENT",
            enrollments:{
                some:{
                    course:{
                        instructorId: useId
                    }
                }
            }
        },
        include:{
            _count:{
                select:{
                    enrollments : true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}