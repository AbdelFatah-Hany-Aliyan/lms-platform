'use client'

import { useState } from "react";
import { ChevronDown, ChevronRight, PlayCircle, Lock, Video, BookOpen } from "lucide-react";

interface Lesson {
    id: string;
    title: string;
    videoUrl?: string | null;
    isPublished: boolean;
}

interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseInteractiveSectionProps {
    course: {
        id: string;
        title: string;
        imageUrl?: string | null;
        chapters: Chapter[];
    };
    isEnrolled: boolean;
}

export const CourseInteractiveSection = ({ course, isEnrolled }: CourseInteractiveSectionProps) => {
    const firstLesson = course.chapters[0]?.lessons[0];
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(firstLesson?.videoUrl || null);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(firstLesson?.id || null);

    const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
        [course.chapters[0]?.id]: true
    });

    const toggleChapter = (chapterId: string) => {
        setOpenChapters((current) => ({
            ...current,
            [chapterId]: !current[chapterId]
        }));
    };

    const handleLessonClick = (lesson: Lesson) => {
        if (!isEnrolled) return; 
        if (lesson.videoUrl) {
            setActiveVideoUrl(lesson.videoUrl);
            setActiveLessonId(lesson.id);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-950 shadow-lg border border-gray-800">
                    {isEnrolled && activeVideoUrl ? (
                        <video 
                            key={activeVideoUrl} 
                            src={activeVideoUrl} 
                            controls 
                            className="w-full h-full object-contain"
                            controlsList="nodownload" 
                        />
                    ) : isEnrolled && !activeVideoUrl ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
                            <Video size={48} className="mb-2 opacity-40 animate-pulse" />
                            <p className="font-medium text-sm">This lesson doesn't have a video uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            {course.imageUrl ? (
                                <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full opacity-40 blur-[2px]" />
                            ) : (
                                <div className="absolute inset-0 bg-gray-900" />
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center bg-black/40">
                                <Lock size={40} className="mb-3 text-amber-400 bg-amber-400/10 p-2 rounded-full" />
                                <h3 className="font-bold text-lg">Course Content Locked</h3>
                                <p className="text-xs text-gray-300 mt-1 max-w-xs">Please enroll in this course to unlock and access all video tutorials and resources.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-x-2">
                    <BookOpen className="text-blue-600 w-5 h-5" />
                    Course Content
                </h3>
                
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm max-h-[450px] overflow-y-auto">
                    {course.chapters.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">
                            No chapters available yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {course.chapters.map((chapter) => {
                                const isOpen = !!openChapters[chapter.id];
                                return (
                                    <div key={chapter.id} className="bg-gray-50/50">
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100/70 transition"
                                        >
                                            <div className="flex items-center gap-x-2.5 flex-1 pr-2">
                                                {isOpen ? (
                                                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                                                )}
                                                <span className="font-bold text-sm text-gray-800 line-clamp-1">
                                                    {chapter.title}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold bg-gray-200/60 text-gray-600 px-2.5 py-1 rounded-md shrink-0">
                                                {chapter.lessons?.length || 0} Lessons
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div className="bg-white divide-y divide-gray-50 border-t border-gray-100">
                                                {chapter.lessons?.length === 0 ? (
                                                    <div className="p-3 text-xs text-center text-gray-400">No lessons inside this chapter.</div>
                                                ) : (
                                                    chapter.lessons.map((lesson) => {
                                                        const isActive = activeLessonId === lesson.id;
                                                        return (
                                                            <button
                                                                key={lesson.id}
                                                                disabled={!isEnrolled}
                                                                onClick={() => handleLessonClick(lesson)}
                                                                className={`w-full p-3.5 pl-8 flex items-center justify-between text-left transition text-xs font-medium border-l-2 ${
                                                                    isActive 
                                                                        ? "bg-blue-50/70 border-blue-600 text-blue-700" 
                                                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                } ${!isEnrolled && "cursor-not-allowed opacity-75"}`}
                                                            >
                                                                <div className="flex items-center gap-x-2 overflow-hidden mr-2">
                                                                    <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                                                                    <span className="truncate pr-1">{lesson.title}</span>
                                                                </div>
                                                                
                                                                {!isEnrolled && (
                                                                    <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
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
};