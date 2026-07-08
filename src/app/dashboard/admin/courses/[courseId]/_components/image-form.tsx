"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { FileUpload } from '@/app/_components/file-upload'

interface ImageFormProps {
initialData: {
    imageUrl: string | null;
};
courseId: string;
}

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (url: string) => {
        try {
        setIsSubmitting(true);

        await axios.patch(`/api/courses/${courseId}`, { imageUrl: url });

        toast.success("Course image updated!");
        toggleEdit();
        router.refresh();
        } catch {
        toast.error("Something went wrong");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between font-medium text-sm text-gray-400 mb-2">
            <span>Course Image</span>
            <button
            onClick={toggleEdit}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
            {isEditing && "Cancel"}
            {!isEditing && initialData.imageUrl && (
                <>
                <Pencil className="w-3.5 h-3.5" /> Edit Image
                </>
            )}
            {!isEditing && !initialData.imageUrl && (
                <>
                <PlusCircle className="w-3.5 h-3.5" /> Add Image
                </>
            )}
            </button>
        </div>

        {!isEditing && !initialData.imageUrl && (
            <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 mt-2">
            <ImageIcon className="h-10 w-10 mb-2 stroke-[1.5]" />
            <span className="text-xs">No image uploaded yet</span>
            </div>
        )}

        {!isEditing && initialData.imageUrl && (
            <div className="relative aspect-video mt-2 rounded-xl overflow-hidden group border border-gray-100">
            <img
                alt="Course cover"
                src={initialData.imageUrl}
                className="object-cover w-full h-60"
            />
            </div>
        )}
        {isEditing && (
                <div className="mt-4">
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit(url);
                            }
                        }}
                    />
                    <div className="text-xs text-center text-gray-500 mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
};