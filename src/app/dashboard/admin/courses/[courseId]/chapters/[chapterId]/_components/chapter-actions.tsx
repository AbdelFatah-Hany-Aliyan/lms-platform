'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

interface ChapterActionsProps {
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({ courseId, chapterId, isPublished }: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        setIsLoading(true);

        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
            toast.success(`Chapter ${isPublished ? "unpublished" : "published"} successfully!`);
            router.refresh();
        }catch (error){
            toast.error("Failed to update chapter status.");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <button
                onClick={onClick}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </button>
        </div>
    );
}