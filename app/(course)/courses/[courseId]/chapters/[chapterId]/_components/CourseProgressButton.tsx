"use client"
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps{
    chapterId:string;
    courseId:string;
    nextChapterId:string;
    isCompleted:boolean;
}

const CourseProgressButton = ({chapterId, courseId, nextChapterId, isCompleted}:CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle
    const router= useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading]=useState(false);
    const onClick = async ()=>{
        try{
           setIsLoading(true)
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                isCompleted:!isCompleted
            })
            if(!isCompleted && !nextChapterId){
                confetti.onOpen();
            }
            if(!isCompleted && nextChapterId){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
            toast.success("Progress Updated")
            router.refresh();
        }catch{
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }
    }
    return (
    <Button
        onClick={onClick}
        disabled={isLoading}
        type="button"
        variant={isCompleted ? "outline":"success"}
    >
        {isCompleted ? "Not Completed" : "Mark as complete"}
        <Icon className="h-4 w-4 ml-2"/>
    </Button>
  )
}

export default CourseProgressButton