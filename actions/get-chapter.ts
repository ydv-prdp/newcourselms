import { db } from "@/lib/db";
import { getUserProgress } from "./get-progress";
import { Attachment, Chapter } from "@prisma/client";
interface GetChapterProps{
    userId:string;
    courseId:string;
    chapterId:string
}
export async function getChapter({courseId, userId, chapterId}:GetChapterProps){
    try{
        const purcahse = await db.purchase.findUnique({
            where:{
                userId_courseId:{
                    userId,
                    courseId:courseId,
                }
            }
        })
        const course = await db.course.findUnique({
            where:{
                isPublished:true,
                id:courseId
            },
            select:{
                price:true
            }
        })
        const chapter = await db.chapter.findUnique({
            where:{
                id:chapterId,
                isPublished:true
            }
        })
        if(!chapter || !course){
            throw new Error("Chapter or course not found")
        }
        let muxData = null;
        let attachments:Attachment[] = [];
        let nextChapter:Chapter | null = null;
        if(purcahse){
            attachments = await db.attachment.findMany({
                where:{
                    courseId:courseId
                }
            })
        }
        if(chapter.isFree || purcahse){
            muxData = await db.muxData.findUnique({
                where:{
                    chapterId
                }
            })
        }
        nextChapter = await db.chapter.findFirst({
            where:{
                courseId:courseId,
                isPublished:true,
                position:{
                    gt:chapter?.position
                }
            },
            orderBy:{
                position:"asc"
            }
        })
        const userProgress = await db.userProgress.findUnique({
            where:{
                userId_chapterId:{
                    userId,
                    chapterId
                }
            }
        })
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purcahse
        }
    }catch(error){
        console.log("[GET_CHAPTER]",error)
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:[],
            nextChapter:null,
            userProgress:null,
            purchase:null,
        }
    }
    
}