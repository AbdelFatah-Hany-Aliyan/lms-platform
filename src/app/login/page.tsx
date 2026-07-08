"use client"

import React, { useState } from "react";
import { signIn,getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if(result?.error) {
                setError("Email Or Password is incorrect");
            }else{

                const session = await getSession()
                const role = session?.user?.role


                if(role === "ADMIN"){
                    router.push("/dashboard/admin");
                }else if(role === "STUDENT"){
                    router.push("/dashboard/student/my-courses");
                }else{
                    router.push("/dashboard");
                }
                router.refresh();
            }
        }catch (error) {
            setError("An unexpected error occurred. Please try again.");
        }finally {
            setLoading(false);
        }
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                    <p className="mt-2 text-sm text-gray-600"></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center font-medium">
                        {error}
                    </div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-bold text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}