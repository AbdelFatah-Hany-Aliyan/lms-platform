import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const currentPath = req.nextUrl.pathname;

        if(currentPath.startsWith("/api") || currentPath == "/login" || currentPath == "/register"){
            return NextResponse.next();
        }

        if(currentPath.startsWith("/dashboard/admin") && token?.role !== "ADMIN"){
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks:{
            authorized: ({ token }) => !!token,
        }
    }
)

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
    ],
}