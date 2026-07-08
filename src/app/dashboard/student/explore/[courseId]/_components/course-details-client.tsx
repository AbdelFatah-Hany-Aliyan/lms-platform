'use client'

import { useState } from "react";
import { CheckCircle, PlayCircle, BookOpen, ChevronDown, Lock } from "lucide-react";
import { EnrollButton } from "../../../_components/enroll-button";

interface CourseDetailsClientProps {
    course: any; 
    enrollment: any;
}

export default function CourseDetailsClient({ course, enrollment }: CourseDetailsClientProps) {
    const firstLesson = course?.chapters?.[0]?.lessons?.[0];
    
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(firstLesson?.videoUrl || null);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(firstLesson?.id || null);
    
    const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
        [course?.chapters?.[0]?.id]: true
    });

    const toggleChapter = (chapterId: string) => {
        setOpenChapters((prev) => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                        {course.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {course.description || "No description provided for this course yet."}
                    </p>
                    <div className="flex items-center gap-4">
                        {enrollment ? (
                            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition w-full md:w-auto">
                                Continue Learning
                            </button>
                        ) : (
                            <div className="shrink-0">
                                <EnrollButton 
                                    courseId={course.id}
                                    isEnrolled={!!enrollment}
                                    price={course.price || 0}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                    {enrollment && currentVideoUrl ? (
                        <video 
                            key={currentVideoUrl} 
                            src={currentVideoUrl}
                            controls
                            className="w-full h-full object-cover"
                            controlsList="nodownload"
                        />
                    ) : course.imageUrl ? (
                        <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BookOpen size={64} className="mb-2 opacity-50"/>
                            <span className="font-medium">No Image / Video</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-16 max-w-3xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="text-blue-600"/>
                    Course Content
                </h2>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {!course.chapters || course.chapters.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Chapters are currently being updated.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {course.chapters.map((chapter: any, index: number) => {
                                const isOpen = !!openChapters[chapter.id];
                                
                                return (
                                    <div key={chapter.id} className="w-full">
                                        <button 
                                            type="button"
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full p-5 flex items-center gap-4 hover:bg-gray-50/80 transition text-left focus:outline-none"
                                        >
                                            <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 font-bold text-gray-800">
                                                {chapter.title}
                                            </div>
                                            <ChevronDown 
                                                size={20} 
                                                className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className="bg-gray-50/50 divide-y divide-gray-100/70 border-t border-gray-100">
                                                {chapter.lessons && chapter.lessons.length > 0 ? (
                                                    chapter.lessons.map((lesson: any) => {
                                                        const isCurrentActive = activeLessonId === lesson.id;
                                                        return (
                                                            <button
                                                                key={lesson.id}
                                                                type="button"
                                                                disabled={!enrollment}
                                                                onClick={() => {
                                                                    if(lesson.videoUrl) {
                                                                        setCurrentVideoUrl(lesson.videoUrl);
                                                                        setActiveLessonId(lesson.id);
                                                                    }
                                                                }}
                                                                className={`w-full py-3.5 pl-16 pr-6 flex items-center justify-between text-left transition ${
                                                                    isCurrentActive 
                                                                        ? "bg-blue-50/60 text-blue-700 font-semibold" 
                                                                        : "text-gray-600 hover:bg-gray-100/50"
                                                                } ${!enrollment && "cursor-not-allowed opacity-75"}`}
                                                            >
                                                                <div className="flex items-center gap-2.5 truncate">
                                                                    <PlayCircle 
                                                                        size={16} 
                                                                        className={isCurrentActive ? "text-blue-600" : "text-gray-400"} 
                                                                    />
                                                                    <span className="text-sm truncate">{lesson.title}</span>
                                                                </div>
                                                                {!enrollment && (
                                                                    <Lock size={14} className="text-gray-400 shrink-0" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-4 pl-16 text-sm text-gray-400">No lessons inside this chapter yet.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}