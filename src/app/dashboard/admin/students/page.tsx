import { getStudentsForAdmin } from "@/lib/services/queries/students";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import {Users, Mail, BookOpen, Calendar} from "lucide-react"

export default async function AdminStudentPage(){

    const session = await getServerSession(authOptions)


    if(!session?.user?.id){
            redirect('/login')
        }else if(session.user.role === "STUDENT"){
            redirect("/dashboard/student")
        }

    const students = await getStudentsForAdmin(session.user.id)

    return(
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-950">Student Managment</h1>
                <p className="text-sm text-gray-500">View and monitor all students registered on the platform and their academic activity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total students</p>
                        <h3 className="text-2xl font-bold text-gray-950">{students.length} student</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left" dir="ltr">
                {students.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                        <p className="font-medium">No Students on Platform yet!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Courses</th>
                                    <th className="p-4">Joined At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {students.map((student)=> (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-950 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            {student.name}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="w-4 h-4 text-gray-400"/>
                                                {student.email}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <BookOpen className="w-3.5 h-3.5"/>
                                                {student._count.enrollments}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-gray-400"/>
                                                {new Date(student.createdAt).toLocaleDateString('en-US', {
                                                    year:'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}