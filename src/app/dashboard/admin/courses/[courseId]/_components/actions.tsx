'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-hot-toast";
import {Trash2,} from "lucide-react";
import {Course, Chapter} from "@prisma/client";

interface ChaptersFormProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const ActionsButtons = (
    {disabled, courseId, isPublished}: ChaptersFormProps) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);

        const onClick = async () => {
            try{
                setIsLoading(true);
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course updated successfully!");
                router.refresh();
            }catch (error){
                toast.error("Something went wrong");
            }finally{
                setIsLoading(false);
            }
        }

        return(
            <div className="flex items-center gap-x-3">
                <button
                    onClick={onClick}
                    disabled={disabled || isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                    {isPublished ? "Unpublish" : "Publish"}
                </button>
            </div>

        )
}