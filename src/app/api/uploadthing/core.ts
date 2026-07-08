import {createUploadthing, type FileRouter} from 'uploadthing/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const f = createUploadthing()

const  handleAuth = async () =>{
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    return userId;
}

export const ourFileRouter = {
    courseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(async () => ({ userId: await handleAuth() }))
        .onUploadComplete(({metadata, file}) => {
        }),

    courseAttachment: f(['text','image','video','audio','pdf'])
        .middleware(async () => ({userId: await handleAuth()}))
        .onUploadComplete(() => {}),

    chapterVideo: f({video: {maxFileSize: '512GB'}})
        .middleware(async () => ({userId: await handleAuth()}))
        .onUploadComplete(() => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter