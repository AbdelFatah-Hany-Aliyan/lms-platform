import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import {db} from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import { ChapterActions } from "./_components/chapter-actions";
import { LessonsForm } from "./_components/lesson-actions";


interface ChapterIdPageProps {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>;
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
    const { courseId, chapterId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session?.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const chapter = await db.chapter.findUnique({
        where: { 
            id: chapterId, 
            courseId: courseId 
        },
        include:{
            lessons: {
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!chapter) {
        redirect(`/dashboard/admin/courses/${courseId}`);
    }

    return (
        <div className="m-6" dir="ltr">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-y-2">
                    <Link
                        href={`/dashboard/admin/courses/${courseId}`}
                        className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900 transition mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to course setup
                    </Link>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-gray-900">Chapter Introduction</h1>
                        <span className="text-sm text-gray-500 font-medium">
                        Status: <span className={chapter.isPublished ? "text-green-600 font-bold" : "text-gray-500 font-bold"}>
                            {chapter.isPublished ? "Published" : "Draft"}
                        </span>
                        </span>
                    </div>
                </div>

                <ChapterActions
                    courseId={courseId}
                    chapterId={chapterId}
                    isPublished={chapter.isPublished}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-x-2 mb-4">
                        <LayoutDashboard className="text-blue-600 w-5 h-5" />
                        <h2 className="text-xl font-semibold text-gray-900">Chapter Title</h2>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border text-sm font-medium text-gray-800">
                        {chapter.title}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2 mb-2">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <ListChecks className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Customize lessons</h2>
                        </div>
                        
                        {/* استدعاء وتمرير البيانات المحدثة */}
                        <LessonsForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}