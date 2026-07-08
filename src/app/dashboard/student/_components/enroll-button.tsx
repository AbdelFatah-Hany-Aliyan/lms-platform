'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2, CreditCard, CheckCircle, Sparkles } from "lucide-react";

interface EnrollButtonProps {
    courseId: string;
    isEnrolled: boolean;
    price: number;
}

export const EnrollButton = ({ courseId, isEnrolled, price }: EnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const isFreeCourse = price === 0 || !price;

    const onAction = async () => {
        try {
            setIsLoading(true);
            
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            
            if (response.data.isFree) {
                toast.success("Enrolled in free course successfully! 🚀");
            } else {
                toast.success("Redirecting to secure payment page...");
            }

            router.push(response.data.url);
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={!isEnrolled ? onAction : undefined}
            disabled={isLoading || isEnrolled}
            className={`flex items-center gap-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition shadow-sm ${
                isEnrolled 
                    ? "bg-green-100 text-green-800 border border-green-200 cursor-not-allowed" 
                    : isFreeCourse
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEnrolled ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
            ) : isFreeCourse ? (
                <Sparkles className="w-4 h-4" />
            ) : (
                <CreditCard className="w-4 h-4" />
            )}
            
            {isEnrolled 
                ? "You Own This Course" 
                : isFreeCourse 
                    ? "Enroll for Free" 
                    : `Buy Course ($${price})`
            }
        </button>
    );
};