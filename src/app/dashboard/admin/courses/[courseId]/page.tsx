import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getCourseDetails } from "@/lib/services/queries/courses";
import Link from 'next/link'
import { DescriptionForm } from "./_components/description-form";
import { TitleForm } from "./_components/title-form";
import { PriceForm } from "./_components/price-form";
import { ImageForm } from "./_components/image-form";
import { ChaptersForm } from "./_components/chapters-form";
import { ActionsButtons } from "./_components/actions";
import { ArrowLeft, LayoutDashboard, ListChecks, CircleDollarSign} from 'lucide-react'

interface CourseIdPageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function CourseIdPage({params}: CourseIdPageProps) {

    const { courseId } = await params

    const session = await getServerSession(authOptions)

    if(session?.user?.role === "STUDENT"){
        redirect("/dashboard/student")
    }else if(!session?.user?.id || session?.user?.role !== "ADMIN"){
        redirect("/login")
    }


    const course = await getCourseDetails(courseId, session.user.id)

    if(!course){
        redirect('/dashboard/admin/courses')
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price !== null && course.price !== undefined,
        course?.chapters?.some(chapter => chapter.isPublished || (chapter as any).isPublished)
    ]

    const totalFields = requiredFields.length;
    const filledFields = requiredFields.filter(Boolean);
    const completedFields = requiredFields.filter(Boolean).length;
    const completinText = `(${completedFields}/${totalFields})`;
    const isComplete = completedFields === totalFields;

    return(
        <div className="m-6 " dir="ltr">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-y-2">
                    <Link
                        href="/dashboard/admin/courses"
                        className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900 transition mb-2"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        Back To Courses Management
                    </Link>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-gray-900">Course setup</h1>
                        <span className="text-sm text-gray-500 font-medium">
                            Complete all fields to publish this course {completinText}
                        </span>
                    </div>
                </div>

                <ActionsButtons disabled={!isComplete} courseId={courseId} isPublished={course.published}/>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-8 max-w-xl">
                <div
                    className={`h-full transition-all duration-500 ${isComplete ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ width: `${(completedFields / totalFields) * 100}%` }}
                >

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/**Left Side Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-x-2">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <LayoutDashboard/>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Customize your course</h2>
                    </div>

                    <TitleForm initialData = {course} courseId= {courseId}/>

                    <DescriptionForm initialData={course} courseId={courseId} />

                    <ImageForm initialData={course} courseId={courseId}/>
                </div>

                {/**Right Side Column */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <ListChecks className="w-5 h-5"/>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Course Chapters</h2>
                        </div>
                    </div>

                    {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-400">Chapters List</span>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                                + Add Chapter
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 italic text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No chapters added yet. Create a chapter to start building course structure.
                        </div>
                    </div> */}

                    <ChaptersForm initialData={course} courseId={courseId} />

                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <CircleDollarSign className="w-5 h-5"/>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Sell your course</h2>
                        </div>
                    </div>

                    <PriceForm initialData={course} courseId={courseId}/>
                </div>
            </div>
        </div>
    )
}