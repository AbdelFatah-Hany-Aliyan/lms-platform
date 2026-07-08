'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast} from 'react-hot-toast'
import { Pencil } from "lucide-react"
import axios from "axios"

interface DescriptionFormProps {
initialData: {
    description: string | null
}
courseId: string
}

export const DescriptionForm = ({ initialData, courseId}: DescriptionFormProps) =>{
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [description, setDescription] = useState(initialData.description || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggle = () => setIsEditing((current) => !current)

    const onSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        try{
            setIsSubmitting(true)

            await axios.patch(`/api/courses/${courseId}` , { description })
            toast.success("Course description updated!!")
            toggle()
            router.refresh()

        }catch(error){
            toast.error("Somthing Went Wrong")
        }finally{
            setIsSubmitting(false)
        }
    }

    return(
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between font-medium text-sm text-gray-400 mb-2">
                <span> Course Description</span>
                <button
                    onClick={toggle}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                >
                    {isEditing ? "Cancel" : (
                        <>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                        </>
                    )}
                </button>
            </div>

            {!isEditing ? (
                <p className={`text-sm mt-2 ${!description ? "text-gray-400 italic" : "text-gray-800"}`}>
                    {description || "No description provided yet. Add a description to help students understand your course."}
                </p>
            ) : (
                <form onSubmit={onSubmit} className="space-y-4 mt-4">
                    <textarea
                        required
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        placeholder="e.g. 'This course will cover...'"
                        disabled={isSubmitting}
                        rows={4}
                        cols={50}

                    />
                    <div className="flex items-center gap-x-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !description}
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