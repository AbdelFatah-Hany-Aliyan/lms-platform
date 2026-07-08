import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
providers: [
    CredentialsProvider({
    name: "Credentials",
    credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
        throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
        }

        const user = await db.user.findUnique({
        where: { email: credentials.email }
        });

        if (!user || !user.password) {
        throw new Error("الحساب غير موجود أو البيانات غير صحيحة");
        }

        const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
        );

        if (!isPasswordValid) {
        throw new Error("كلمة المرور التي أدخلتها غير صحيحة");
        }

        return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        };
    }
    })
],
callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
    // الـ user بيكون متاح فقط أول ما يسجل دخول (قادم من دالة authorize فوق)
    if (user) {
        token.id = user.id;
        token.role = user.role; // حقن الـ role داخل التوكن المشفرة (JWT)
    }
    return token;
    },
    async session({ session, token }: { session: any; token: any }) {
    // هنا بننقل البيانات من التوكن المشفرة ونعرضها في الـ Session بالـ Client-side
    if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // الحين الكود في الفورم هيشوف الـ role بنجاح!
    }
    return session;
    }
},

session: {
    strategy: "jwt"
},
secret: process.env.NEXTAUTH_SECRET,
};