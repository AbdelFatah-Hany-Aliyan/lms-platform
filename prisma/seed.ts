import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import "dotenv/config";
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('⏳ Cleaning database...');

    // 1. ترتيب الحذف الصحيح لتجنب أخطاء العلاقات (Cascading/Foreign Keys)
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log('✨ Database cleaned. Starting seeding...');

    const hashedPassword = await bcrypt.hash('password', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Abo Hany',
            email: 'admin@lms.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    const student = await prisma.user.create({
        data: {
            name: 'Abod',
            email: 'student@lms.com',
            password: hashedPassword,
            role: 'STUDENT'
        }
    });

    console.log('👥 Users seeded (Admin & Student)');

    const pythonCourse = await prisma.course.create({
        data: {
            title: 'Introduction to Python Programming',
            description: 'Learn the basics of programming using Python from scratch.',
            instructorId: admin.id,
            price: 49.99,
            published: true
        }
    });

    const ch1Python = await prisma.chapter.create({
        data: {
            title: 'Chapter 1: Getting Started',
            position: 1,
            courseId: pythonCourse.id
        }
    });

    const ch2Python = await prisma.chapter.create({
        data: {
            title: 'Chapter 2: Variables & Data Types',
            position: 2,
            courseId: pythonCourse.id
        }
    });

    await prisma.lesson.createMany({
        data: [
            {
                title: 'Lesson 1: Installing Python & VS Code',
                videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                content: 'In this lesson, we will set up our development environment.',
                position: 1,
                courseId: pythonCourse.id,
                chapterId: ch1Python.id
            },
            {
                title: 'Lesson 2: Hello World & Syntax',
                videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                content: 'Writing our first Python program and understanding basic syntax.',
                position: 2,
                courseId: pythonCourse.id,
                chapterId: ch1Python.id
            },
            {
                title: 'Lesson 1: Understanding Variables',
                videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                content: 'What are variables and how to declare them in Python.',
                position: 1,
                courseId: pythonCourse.id,
                chapterId: ch2Python.id
            }
        ]
    });

    console.log('📚 First Course, Chapters, and Lessons seeded');

    const flutterCourse = await prisma.course.create({
        data: {
            title: 'Advanced Flutter Architecture',
            description: 'Master clean architecture and state management in Flutter.',
            instructorId: admin.id,
            price: 89.99,
            published: false // مسودة
        }
    });

    const ch1Flutter = await prisma.chapter.create({
        data: {
            title: 'Chapter 1: Clean Architecture Overview',
            position: 1,
            courseId: flutterCourse.id
        }
    });

    await prisma.lesson.create({
        data: {
            title: 'Lesson 1: Introduction to BLoC Pattern',
            videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            content: 'Deep dive into state management using BLoC.',
            position: 1,
            courseId: flutterCourse.id,
            chapterId: ch1Flutter.id
        }
    });

    console.log('📙 Second Course (Draft) seeded');

    await prisma.enrollment.create({
        data: {
            studentId: student.id,
            courseId: pythonCourse.id,
            paymentId: 'ch_mock_payment_12345',
            amountPaid: 49.99
        }
    });

    console.log('💳 Mock Enrollment seeded');
    console.log('🚀 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });