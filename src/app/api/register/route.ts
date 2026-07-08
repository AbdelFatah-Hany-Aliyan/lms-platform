import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { name, email, password } = body;

        if(!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT"
            },
        })

        return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });

    }catch (error) {
        return NextResponse.json({ message: "An unexpected error occurred. Please try again." }, { status: 500 });
    }
}