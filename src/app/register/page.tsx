"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })

            const data = await (await res).json();

            if(!res.ok){
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess(data.message);
            setTimeout(()=>{
                router.push("/login");
            }, 2000)



        }catch(err: any){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="flex h-screen items-center justify-center bg-gray-50">

            {success && 
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <div className="mx-4 w-full max-w-sm scale-100 rounded-2xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                            ✅
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Success Process</h3>
                        <p className="mt-2 text-sm text-gray-600 font-medium">{success}</p>

                        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full bg-green-500 w-full animate-shrink" style={{ animation: 'shrink 2s linear forwards' }}></div>
                        </div>
                    </div>
                </div>
            }

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-6 text-3xl font-extrabold text-gray-800 text-center">Create Account</h1>

                {error &&
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                }

                <form onSubmit={handleChange} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already Have An Account?{" "}
                    <Link href="/login" className="font-bold text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}