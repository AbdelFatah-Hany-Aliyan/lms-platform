'use client'

import axios from "axios"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from 'react-hot-toast'
import { Pencil } from "lucide-react"

interface TitleFormProps {
    initialData:{
        title: string | null
    },
    courseId: string
}

export const TitleForm = ({ initialData, courseId }: TitleFormProps ) => {
    const router = useRouter()
    const [isEditing, setIsEditing ] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title,setTitle] = useState(initialData.title || "")

    const toggle = () => setIsEditing((current) => !current)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            setIsSubmitting(true)

            await axios.patch(`/api/courses/${courseId}`, {title})
            toast.success("Course title updated!")
            toggle()
            router.refresh()
        }catch (error){
            toast.error("Somthing went wrong")
        }finally{
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between font-medium text-sm text-gray-400 mb-2">
                <span>Course Title</span>
                <button
                    onClick={toggle}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                >
                    {isEditing ? "Cancle" : (
                        <>
                            <Pencil className="w-3.5 h-3.5"/>
                            Edit
                        </>
                    )}
                </button>
            </div>

            {!isEditing ? (
                <p className="text-gray-800 font-semibold text-base mt-2">{title}</p>
            ) : (
                <form className="space-y-4 mt-4" onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="e.g. 'Advanced Next.js Development'"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                        required
                    />
                    <div className="flex items-center gap-x-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()} // تعطيل الزر إذا كان فارغاً أو جاري الحفظ
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}