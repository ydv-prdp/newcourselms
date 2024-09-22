"use client"

 
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Chapter, MuxData } from "@prisma/client"
import { FileUpload } from "@/components/FileUpload"
import MuxPlayer from "@mux/mux-player-react";
interface ChapterVideoFormProps{
    initialData:Chapter & {muxData? :MuxData | null}
    courseId:string;
    chapterId:string
}
const formSchema = z.object({
    videoUrl: z.string().min(1)
  })
const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter()
    const toggleEdit = ()=>setIsEditing((current)=>!current)
async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
        toast.success("Chapter updated")  
        toggleEdit()
        router.refresh()
    }
    catch{
        toast.error("Something went wrong")
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Chapter Video
            <Button  onClick={toggleEdit} variant={"ghost"}>
                {isEditing && (
                    <>Cancel</>
                )} 
                 {!isEditing && !initialData.videoUrl &&(
                <>  <PlusCircle className="h-4 w-4 mr-2" />
                    Add an video
                </>
                )}
                
                 {!isEditing && initialData.videoUrl && (
                <>  <Pencil className="h-4 w-4 mr-2" />
                    Edit video
                </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className="h-10 w-10 text-slate-500"/>
                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                  <MuxPlayer
                    playbackId={initialData?.muxData?.playbackId || ""}
                  />
                </div>
            )
         )}
         {isEditing && (
             <div>
                <FileUpload
                    endpoint="chapterVideo"
                    onChange={(url)=>{
                        if(url){
                            onSubmit({videoUrl:url})
                        }
                    }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Upload this chapter&apos;s video
                </div>
             </div>   
         )}
          {initialData.videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
                Videoas can take a few minutes to process. Refresh the page if video does not appear.
            </div>
         )}
    </div>
  )
}

export default ChapterVideoForm