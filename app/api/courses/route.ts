import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const {userId} = auth();
        const {title} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.create({
            data:{
                userId,
                title
            }
        })
        return NextResponse.json(course)
    }catch(error){
        console.log("[COURSES]",error);
        return new NextResponse("Internal Error",{status:500})
    }
} 

export async function GET(req:Request){
    try{
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.findMany({
            where:{
                userId
            }
        })
        return NextResponse.json(course)
    }catch(error){
        console.log("[GET_COURSES]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}  
