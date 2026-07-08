"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PlusCircle, Loader2, LayoutGrid, Pencil } from "lucide-react";
import { Course, Chapter } from "@prisma/client";

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleCreating = () => setIsCreating((current) => !current);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await axios.post(`/api/courses/${courseId}/chapters`, { title });
            toast.success("Chapter created successfully!");
            setTitle("");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
        {isSubmitting && (
            <div className="absolute inset-0 bg-gray-500/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
        )}

        <div className="flex items-center justify-between font-medium text-sm text-gray-400 mb-4">
            <span>Course Chapters</span>
            <button
                onClick={toggleCreating}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition text-xs font-semibold"
            >
            {isCreating ? "Cancel" : (
                <>
                    <PlusCircle className="w-3.5 h-3.5" /> Add Chapter
                </>
            )}
            </button>
        </div>

        {isCreating && (
            <form onSubmit={onSubmit} className="space-y-4 mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 'Introduction to the course'"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    required
                />
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                    Create
                </button>
            </form>
        )}

        {!isCreating && (
            <div className={`mt-2 text-sm ${!initialData.chapters.length ? "text-gray-400 italic text-center py-6 bg-gray-50 rounded-xl border border-dashed" : ""}`}>
            {!initialData.chapters.length && "No chapters added yet."}

            {initialData.chapters.length > 0 && (
                <div className="space-y-2">
                {initialData.chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className="flex items-center gap-x-2 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl p-3 text-sm font-medium hover:bg-gray-100/70 transition"
                    >
                    <LayoutGrid className="w-4 h-4 text-gray-400 cursor-grab" />
                    <span className="truncate">{chapter.title}</span>

                    <div className="ml-auto flex items-center gap-x-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${chapter.isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                            {chapter.isPublished ? "Published" : "Draft"}
                        </span>
                        <button
                                onClick={() => router.push(`/dashboard/admin/courses/${courseId}/chapters/${chapter.id}`)}
                                className="text-gray-500 hover:text-blue-600 transition"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
        </div>
    );
};