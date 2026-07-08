"use client";

import { BarChart3, Users, BookOpen, CheckCircle } from "lucide-react";

interface AdminChartProps {
    adminData: {
        totalCourses: number;
        publishedCourses: number;
        draftCourses: number;
    };
    studentData: {
        courseTitle: string;
        studentCount: number;
    }[];
}

export const AnalyticsCharts = ({ adminData, studentData }: AdminChartProps) => {

    const maxAdminValue = Math.max(adminData.totalCourses, 1);

    const maxStudentValue = studentData.length > 0
        ? Math.max(...studentData.map(d => d.studentCount), 1)
        : 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-x-2 mb-6">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-950 text-lg">Admin Actions Analytics</h3>
                    <p className="text-xs text-gray-500">Overview of created and managed courses</p>
                </div>
            </div>

            <div className="flex items-end justify-around h-48 pt-4 border-b border-gray-100 gap-x-4">
                <div className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div
                        style={{ height: `${(adminData.totalCourses / maxAdminValue) * 100}%` }}
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600 relative flex items-end justify-center min-h-[8px]"
                    >
                        
                    </div>
                    <span className="text-xs text-gray-600 mt-2 font-medium truncate w-full text-center">Total Courses</span>
                </div>

                <div className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div 
                        style={{ height: `${(adminData.publishedCourses / maxAdminValue) * 100}%` }}
                        className="w-full bg-green-500 rounded-t-lg transition-all duration-500 group-hover:bg-green-600 relative flex items-end justify-center min-h-[8px]"
                    >
                       
                    </div>
                    <span className="text-xs text-gray-600 mt-2 font-medium truncate w-full text-center">Published</span>
                </div>

                <div className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div
                        style={{ height: `${(adminData.draftCourses / maxAdminValue) * 100}%` }}
                        className="w-full bg-amber-500 rounded-t-lg transition-all duration-500 group-hover:bg-amber-600 relative flex items-end justify-center min-h-[8px]"
                    >
                        
                    </div>
                    <span className="text-xs text-gray-600 mt-2 font-medium truncate w-full text-center">Drafts</span>
                </div>
            </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-4 text-center border-t border-gray-50 pt-4">
                <div>
                    <p className="text-xs text-gray-400 font-medium">Total</p>
                    <p className="text-lg font-bold text-gray-800">{adminData.totalCourses}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">Active</p>
                    <p className="text-lg font-bold text-green-600">{adminData.publishedCourses}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-medium">Pending</p>
                    <p className="text-lg font-bold text-amber-600">{adminData.draftCourses}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
            <div className="flex items-center gap-x-2 mb-6">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Users className="w-5 h-5" />
                </div>
                <div>
                <h3 className="font-bold text-gray-900 text-lg">Student Enrollments</h3>
                <p className="text-xs text-gray-500">Top courses by student joining rates</p>
                </div>
            </div>

            {studentData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-gray-400 italic">
                No enrollment data available yet.
                </div>
            ) : (
                <div className="space-y-4 h-48 overflow-y-auto pr-2 custom-scrollbar">
                {studentData.map((item, index) => (
                    <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span className="truncate max-w-[70%]">{item.courseTitle}</span>
                        <span className="text-purple-600">{item.studentCount} Student(s)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div
                        style={{ width: `${(item.studentCount / maxStudentValue) * 100}%` }}
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        />
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
            <div className="text-xs text-gray-400 font-medium border-t border-gray-50 pt-4 mt-4">
            * Data is updated dynamically based on real-time database transactions.
            </div>
        </div>

        </div>
    );
};