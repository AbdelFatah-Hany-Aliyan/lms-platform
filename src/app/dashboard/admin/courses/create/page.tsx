'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Link from "next/link"

export default function CreateCoursePage(){
    const router = useRouter();
    const [title, setTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        try{
            setIsSubmitting(true)

            const res = await axios.post('/api/courses' , {title})

            toast.success("Created Successfully!")

            router.push(`/dashboard/admin/courses/${res.data.id}`)
        }catch(e){
            toast.error("Something went wrong. Please try again.")
        }finally{
            setIsSubmitting(false)
        }
    }

    return(
        <div className="max-w-3xl mx-auto p-6 md:p-12 h-full flex flex-col justify-center" dir="ltr">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Name your course</h1>
            <p className="text-gray-500 mb-8">
                What would you like to name your course? Don't worry, you can change this later.
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="e.g. 'Advanced Next.js Development'"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                        required
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        What Course Cover.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        href = "/dashboard/admin/courses"
                    >
                        Cancle
                    </Link>
                    <button
                        type="submit"
                        disabled={!title || isSubmitting}
                        className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? "Creating..." : "Continue"}
                    </button>
                </div>
            </form>
        </div>
    )
}