import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { DashboardLayoutWrapper } from "./_components/dashboard-layout-wrapper";

export default async function DashboardLayout({
    children,
}: { children: React.ReactNode;}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <DashboardLayoutWrapper
            user={{
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as "ADMIN" | "STUDENT"
            }}
            >
            {children}
        </DashboardLayoutWrapper>
    );
}