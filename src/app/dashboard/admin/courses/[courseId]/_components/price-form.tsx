"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil } from "lucide-react";

interface PriceFormProps {
initialData: {
    price: number | null;
};
courseId: string;
}

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState<string>(initialData.price !== null ? initialData.price.toString() : "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        setIsSubmitting(true);
        
        const parsedPrice = price === "" ? null : parseFloat(price);
        
        await axios.patch(`/api/courses/${courseId}`, { price: parsedPrice });
        
        toast.success("Course price updated!");
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
            <span>Course Price</span>
            <button 
            onClick={toggleEdit} 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
            {isEditing ? "Cancel" : (
                <>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                </>
            )}
            </button>
        </div>

        
        {!isEditing && (
            <p className={`text-base font-bold mt-2 ${!price || parseFloat(price) === 0 ? "text-green-600 font-semibold" : "text-gray-800"}`}>
            {!price || parseFloat(price) === 0 ? "Free" : `$${parseFloat(price).toLocaleString('en-US')}`}
            </p>
        )}

        {isEditing && (
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <input
                type="number"
                step="0.01"
                min="0" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSubmitting}
                placeholder="Set a price for your course (e.g. 49.99)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-semibold"
            />
            <div className="flex items-center gap-x-2">
                <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                Save Changes
                </button>
            </div>
            </form>
        )}
        </div>
    );
};