import React from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { AnalyticsCharts } from './_components/analytics-charts'
import { getDashboardAdmin, getRecentStudents } from '@/lib/services/queries/analytics'

export default async function AdminOverviewPage() {

    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        redirect('/login')
    }else if(session.user.role === "STUDENT"){
        redirect("/dashboard/student")
    }

    const [stats, recentStudents] = await Promise.all([
        getDashboardAdmin(session.user.id),
        getRecentStudents(session.user.id)
    ])

    return(
        <div className="p-6 text-left" dir="ltr">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900"> Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1"> Welcome back! Here's an overview of your LMS platform performance today.</p>
                </div>

                <Link
                    href="/dashboard/admin/courses"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-100"    
                >
                    Manage Current Courses📚
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-50/50 flex items-center justify-center text-3xl">
                        📑
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalCourses} Courses</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-50/50 flex items-center justify-center text-3xl">
                        🎓
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        <h3>+{stats.totalStudents} Students</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-3xl">
                        💰
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-xs font-medium text-gray-400 mb-0.5">Total Sales</span>
                        <h3 className="text-2xl font-bold text-gray-900">
                            ${stats.totalSales.toLocaleString('en-US')}
                        </h3>
                    </div>
                </div>

            </div>

            {/* <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-900">Recent Enrollments</h2>
                </div>

                {recentStudents.length === 0 ?(
                    <div className="p-8 text-center text-gray-500">
                        No recent enrollments yet.
                    </div>
                ):(
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentStudents.map((enrollment,index)=>(
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                {enrollment.student.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm text-gray-900">{enrollment.student.name}</div>
                                                <div className="text-xs text-gray-400">{enrollment.student.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {enrollment.course.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div> */}

            <AnalyticsCharts adminData={{
                    totalCourses: stats.totalCourses,
                    publishedCourses: stats.publishedCourses,
                    draftCourses: stats.draftCourses}
                } studentData={stats.topCoursesData} />
        </div>
    )
}