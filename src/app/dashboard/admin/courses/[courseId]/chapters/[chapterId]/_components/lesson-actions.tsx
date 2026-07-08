'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from "react-hot-toast";
import {PlusCircle, Loader2, LayoutGrid, Pencil, X, Trash, Video} from "lucide-react";
import { FileUpload } from "@/app/_components/file-upload";

interface LessonsActionProps {
    initialData: {
        id: string;
        lessons: {
            id: string;
            title: string;
            isPublished: boolean;
            position: number;
            videoUrl: string | null
        }[]
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
})


export const LessonsForm = ({ initialData, courseId, chapterId }: LessonsActionProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
    const [titleValue,setTitleValue] = useState('')
    const router = useRouter();

    const toggleCreating = () => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
        await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/lessons`, values);
        toast.success("Lesson created successfully! 🎬");
        toggleCreating();
        form.reset();
        router.refresh();
        } catch {
        toast.error("Something went wrong");
        }
    }

    const onUpdateTitle = async(lessonId: string) =>{
        try{
            setIsUpdating(true)
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, {
                title: titleValue
            })
            toast.success('Lesson title updated')
            setEditingId(null)
            router.refresh()
        }
        catch(error){
            toast.error('Something went wrong')
        }finally{
            setIsUpdating(false)
        }
    }

    const onDelete = async (lessonId: string) => {
        try {
            setIsUpdating(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
            toast.success("Lesson deleted!");
            setEditingId(null);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onVideoUpload = async (lessonId: string, url: string) => {
        try{
            setIsUpdating(true)
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, {
                videoUrl: url
            })
            toast.success("Lesson Uploaded Successfully!")
            setEditingVideoId(null)
            router.refresh()

        }catch(error){
            toast.error("Internal server error")
        }finally{
            setIsUpdating(false);
        }
    }

    return (
        <div className="relative mt-6 border border-gray-100 bg-white p-6 rounded-2xl shadow-sm">
        {isUpdating && (
            <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            </div>
        )}

        <div className="flex items-center justify-between font-semibold text-gray-900 mb-4">
            <span>Chapter Lessons</span>
            <button
            onClick={toggleCreating}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-x-1"
            >
            {isCreating ? (
                "Cancel"
            ) : (
                <>
                <PlusCircle className="w-4 h-4" />
                Add a lesson
                </>
            )}
            </button>
        </div>

        {isCreating && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <input
                {...form.register("title")}
                disabled={isSubmitting}
                placeholder="e.g. 'Introduction to OOP Principles'"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:bg-gray-50 text-gray-800"
            />
            <button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
                Create Lesson
            </button>
            </form>
        )}

        {!isCreating && (
            <div className={`text-sm mt-2 ${!initialData.lessons.length ? "text-gray-500 italic" : ""}`}>
                {!initialData.lessons.length && "No lessons added yet. Create a lesson to start building chapter content."}

                <div className="space-y-3">
                    {initialData.lessons.map((lesson) => (
                        <div key={lesson.id} className="space-y-2">
                                <div className="flex items-center gap-x-2 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl p-3 text-sm font-medium hover:bg-gray-100/70 transition">
                                    <LayoutGrid className="w-4 h-4 text-gray-400 shrink-0" />

                                    {editingId === lesson.id ? (
                                        <div className="flex items-center gap-x-2 flex-1">
                                            <input
                                                value={titleValue}
                                                onChange={(e) => setTitleValue(e.target.value)}
                                                className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none"
                                            />
                                            <button
                                                onClick={() => onUpdateTitle(lesson.id)}
                                                disabled={!titleValue.trim()}
                                                className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-md hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => onDelete(lesson.id)}
                                                className="text-gray-500 hover:text-red-600 p-1 transition"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="truncate flex-1">{lesson.title}</span>
                                    )}

                                    <div className="ml-auto flex items-center gap-x-2 shrink-0">
                                        {/* <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${lesson.isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                            {lesson.isPublished ? "Published" : "Draft"}
                                        </span> */}

                                        <button
                                            onClick={() => {
                                                setEditingVideoId(editingVideoId === lesson.id ? null : lesson.id);
                                                setEditingId(null);
                                            }}
                                            className={`text-[11px] px-2.5 py-1 border rounded-lg transition flex items-center gap-x-1 font-semibold ${lesson.videoUrl ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-blue-600 border-gray-200 hover:bg-gray-50"}`}
                                        >
                                            <Video className="w-3.5 h-3.5" />
                                            {lesson.videoUrl ? "Edit Video" : "Add Video"}
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (editingId === lesson.id) {
                                                    setEditingId(null);
                                                } else {
                                                    setEditingId(lesson.id);
                                                    setTitleValue(lesson.title);
                                                    setEditingVideoId(null);
                                                }
                                            }}
                                            className="text-gray-500 hover:text-blue-600 transition"
                                        >
                                            {editingId === lesson.id ? (
                                                <X className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <Pencil className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {editingVideoId === lesson.id && (
                                    <div className="p-4 bg-white border border-gray-200 rounded-xl mt-1">
                                        <FileUpload
                                            endpoint="chapterVideo"
                                            onChange={(url) => {
                                                if (url) {
                                                    onVideoUpload(lesson.id, url);
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        )}
        </div>
    );
};