import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Courgette } from "next/font/google";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params: {courseId:string;}}
){
    try{
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        
        const ownCourse = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId:userId
            },
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                }
            }
        })
        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401})
        }

       const hasPublishedChapter = ownCourse.chapters.some((chapter)=>chapter.isPublished)
       if(!ownCourse.title || !ownCourse.description || !ownCourse.imageUrl || !ownCourse.categoryId || !hasPublishedChapter){
        return new NextResponse("Missing required fields", {status:401})
       }
       const publishedCourse = await db.course.update({
        where:{
            id:params.courseId,
            userId,
        },
        data:{
            isPublished:true
        }
       })
       return NextResponse.json(publishedCourse)
       
      
    }catch (error){
        console.log("[COURSE_ID_PUBLISH]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}