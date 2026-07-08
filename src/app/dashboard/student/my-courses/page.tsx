import {redirect} from 'next/navigation'
import Link from 'next/link'
import {BookOpen, PlayCircle} from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { enrolledCourses } from '@/lib/services/queries/enrollment'
import { getStudentDashboard } from '@/lib/services/queries/student-dashboard'

export default async function MyCoursesPage() {

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id;

    if(!userId){
        return redirect('/login')
    }

    const enrollments = await enrolledCourses(userId)
    const courses = await getStudentDashboard(userId)

    return(
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning Journey</h1>
            {enrollments?.length === 0 ?(
                <div className="text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h2>
                    <p className="text-gray-500 mb-6">You haven't enrolled in any courses. Start exploring now!</p>
                    <Link
                        href="/dashboard/student/explore"
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                    >
                        Explore courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.map((course) => {
                        return(
                            <Link
                                key={course.id} href={`explore/${course.id}`}
                            >

                                <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full cursor-pointer">
                                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl} 
                                                alt={course.title} 
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <BookOpen size={40}/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                                            {course.title}

                                        </h3>
                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2 font-medium">
                                                <span>
                                                    {Math.round(course.progress)}% Complete
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {course.completedChapters} / {course.totalChaptersCount} Chapters
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                        )
                    })}
                </div>
            )}
        </div>
    )
}