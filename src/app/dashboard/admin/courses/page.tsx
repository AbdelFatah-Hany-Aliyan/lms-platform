import { getServerSession } from "next-auth"
import { AuthOptions } from "next-auth";
import { redirect } from 'next/navigation'
import React from "react";
import Link from "next/link";
import { getAdminCourses } from "@/lib/services/queries/courses";
import { authOptions } from "@/lib/auth-options";

export default async function AdminCoursesPage() {


    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        redirect("/login")
    }else if(session.user.role === "STUDENT"){
            redirect("/dashboard/student")
    }

    const courses = await getAdminCourses(session.user.id)

    return(
        <div className="p-6 relative min-h-[calc(100vh-4rem)] text-left" dir="ltr">
            <div className="border-b border-gray-200 pb-5 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Create, edit and monitor your educational courses and tracking status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {courses.map((course)=>(
                    <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    course.published
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}
                                >
                                    {course.published ? "🟢 Published" : "🟡 Draft"}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    {course.price === 0 ? "Free" : `$${course.price}`}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">{course.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-xs text-gray-400 space-x-2">
                                <span>{course._count.chapters} Chapters</span>
                                <span>.</span>
                                <span>{course._count.lessons} Lessons</span>
                            </div>

                            <Link
                                href={`/dashboard/admin/courses/${course.id}`}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
                            >
                                Edit Content →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <Link
                    href="/dashboard/admin/courses/create"
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-4 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition-all duration-200 group"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
                        Create New Course
                    </span>
                </Link>
            </div>
        </div>
    )
}