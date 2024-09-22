import { db } from "@/lib/db";

export async function getCourses(userId:string){
    
const courses = await db.course.findMany({
    where:{
      userId
    },
    orderBy:{
      createdAt:"desc"
    }
  })
return courses
}
