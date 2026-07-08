"use client";

import React from "react";
import Link from "next/link";

interface AnimatedLandingProps {
  isAuthenticated: boolean;
}

export const AnimatedLanding = ({ isAuthenticated }: AnimatedLandingProps) => {
  const features = [
    { title: "Full-Stack Web", desc: "Build modern apps with Next.js, React, and Node." },
    { title: "Mobile Development", desc: "Master Flutter for native iOS & Android performance." },
    { title: "AI & Deep Learning", desc: "Professional models using PyTorch and TensorFlow." },
    { title: "Core CS", desc: "Solidify your CS foundation with Java and Data Structures." },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div className="text-xl font-black tracking-tighter">LMSPRO</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-black">Sign In</Link>
          <Link href={isAuthenticated ? "/dashboard" : "/register"} className="px-5 py-2 text-sm font-bold text-white transition bg-black rounded-full hover:bg-gray-800">
            {isAuthenticated ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-20 text-center">
        <h1 className="mb-6 text-5xl font-black tracking-tight md:text-7xl">Master Future Technologies</h1>
        <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-500">
          Professional, structured, and project-based learning paths for ambitious developers.
        </p>
      </header>

      {/* Features Grid */}
      <section className="px-8 pb-20">
        <div className="grid max-w-5xl gap-6 mx-auto md:grid-cols-2">
          {features.map((feature, i) => (
            <div key={i} className="p-8 transition duration-300 border border-gray-100 rounded-3xl hover:shadow-lg bg-gray-50">
              <h3 className="mb-3 text-2xl font-black">{feature.title}</h3>
              <p className="leading-relaxed text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};