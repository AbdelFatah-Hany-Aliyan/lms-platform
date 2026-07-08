'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2, CreditCard, Lock, Calendar, User } from "lucide-react";

const paymentSchema = z.object({
    cardNumber: z.string().min(16, { message: "Card number must be 16 digits" }).max(16),
    expiry: z.string().min(5, { message: "Expiry date required (MM/YY)" }).max(5),
    cvv: z.string().min(3, { message: "CVV must be 3 or 4 digits" }).max(4),
    cardName: z.string().min(3, { message: "Cardholder name is required" }),
});

interface PaymentFormProps {
    courseId: string;
    price: number;
}

export const PaymentForm = ({ courseId, price }: PaymentFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: { cardNumber: "", expiry: "", cvv: "", cardName: "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
        try {
            setIsLoading(true);
            await axios.post(`/api/courses/${courseId}/pay`, values);
            
            toast.success("Payment Successful! Welcome to the course 🚀");
            router.push(`/dashboard/student/explore/${courseId}`);
            router.refresh();
        } catch {
            toast.error("Payment failed. Please check your card details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-x-1">
                    <User className="w-3.5 h-3.5 text-gray-400" /> Cardholder Name
                </label>
                <input
                    {...form.register("cardName")}
                    disabled={isLoading}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-800"
                />
                {form.formState.errors.cardName && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.cardName.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" /> Card Number
                </label>
                <input
                    {...form.register("cardNumber")}
                    disabled={isLoading}
                    type="text"
                    maxLength={16}
                    placeholder="1234567812345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-800"
                />
                {form.formState.errors.cardNumber && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.cardNumber.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-x-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Expiry Date
                    </label>
                    <input
                        {...form.register("expiry")}
                        disabled={isLoading}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-800"
                    />
                    {form.formState.errors.expiry && (
                        <p className="text-xs text-red-500 font-medium">{form.formState.errors.expiry.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-x-1">
                        <Lock className="w-3.5 h-3.5 text-gray-400" /> CVV
                    </label>
                    <input
                        {...form.register("cvv")}
                        disabled={isLoading}
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-800"
                    />
                    {form.formState.errors.cvv && (
                        <p className="text-xs text-red-500 font-medium">{form.formState.errors.cvv.message}</p>
                    )}
                </div>
            </div>

            <button
                disabled={!isValid || isLoading}
                type="submit"
                className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-x-2"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Lock className="w-4 h-4" /> Pay ${price.toFixed(2)} & Enroll
                    </>
                )}
            </button>
        </form>
    );
};