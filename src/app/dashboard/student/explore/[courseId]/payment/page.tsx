import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PaymentForm } from "./_components/payment-form";
import { Lock, ShieldCheck } from "lucide-react";

interface PaymentPageProps {
    params: Promise<{
        courseId: string;
    }>;
}

const PaymentPage = async ({ params }: PaymentPageProps) => {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return redirect("/");
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        return redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">

                <div className="bg-gray-900 p-8 text-white flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Checkout Summary</span>
                        <h1 className="text-2xl font-extrabold mt-2 text-white">{course.title}</h1>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-3">{course.description || "No description provided."}</p>
                    </div>

                    <div className="mt-8 border-t border-gray-800 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Course Price:</span>
                            <span className="text-3xl font-black text-white">${(course.price || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-x-2 text-xs text-gray-400 mt-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                            <span>Lifetime access to all lectures, videos, and upcoming updates.</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-x-1.5">
                            Secure Payment
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-x-1">
                            <Lock className="w-3 h-3 text-green-600" /> All transactions are encrypted and secured.
                        </p>
                    </div>

                    <PaymentForm courseId={course.id} price={course.price || 0} />
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;