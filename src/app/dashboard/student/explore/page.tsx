import Link from 'next/link'
import {BookOpen} from 'lucide-react'
import { getPublishedCourses } from '@/lib/services/queries/all-courses'
import { Key } from 'react'

export default async function ExplorePage() {
    const courses = await getPublishedCourses()

    return(
        <div className="p-6 max-w-6xl mx-auto font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Explore Courses</h1>
                <p className="text-gray-500">Find the perfect course to advance your career.</p>
            </div>


            {courses?.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No courses published yet!</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        courses?.map((course) => (
                            <Link
                                key={String(course.id)}
                                href={`/dashboard/student/explore/${(course.id)}`}
                            >
                                <div className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 bg-white flex flex-col h-full">
                                    <div className="aspect-video bg-gray-100 w-full overflow-hidden">
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <BookOpen size={40}/>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                {course.chapters.length} Chapters
                                            </span>
                                            <span className="font-black text-blue-600">
                                                {course.price === 0 ? "Free" : `$${course.price}`}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        ))
                    }
                </div>
            )}
        </div>
    )
}