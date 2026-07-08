import { getCourseDetails } from "@/lib/services/queries/all-courses";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getEnrollmentStatus } from "@/lib/services/queries/enrollment";
import { authOptions } from "@/lib/auth-options";
import CourseDetailsClient from "./_components/course-details-client";

interface CourseIdPageProps {
    params: Promise<{
        courseId: string
    }>
}

export default async function CourseDetails({ params }: CourseIdPageProps) {
    const session = await getServerSession(authOptions);

    const resolvedParams = await params;
    const courseId = resolvedParams.courseId;

    const course = await getCourseDetails(courseId);
    if (!course) {
        return notFound();
    }

    const enrollment = await getEnrollmentStatus(session?.user?.id || "", course.id);

    return (
        <CourseDetailsClient 
            course={course} 
            enrollment={enrollment} 
        />
    );
}