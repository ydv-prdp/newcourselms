"use client"

 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
interface TitleFormProps{
    initialData:{
        title:string
    };
    courseId:string;
}
const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required.",
    }),
  })
const TitleForm = ({initialData, courseId}:TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter()
    const toggleEdit = ()=>setIsEditing((current)=>!current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
      })
const {isSubmitting, isValid} = form.formState;
async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        await axios.patch(`/api/courses/${courseId}`,values);
        toast.success("Course updated")  
        toggleEdit()
        router.refresh()
    }
    catch{
        toast.error("Something went wrong")
    }
    console.log(values)
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course Title
            <Button  onClick={toggleEdit} variant={"ghost"}>
                {isEditing ? (
                    <>Cancel</>
                ) : 
                 (
                <>  <Pencil className="h-4 w-4 mr-2" />
                    Edit Title
                </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
            <p className="text-sm mt-2">
                {initialData.title}
            </p>
         )}
         {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            disabled={isSubmitting}
                            placeholder="e.g., Update the course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-x-2"> 
                    <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                    >   
                        Save
                    </Button>
                  </div>
                </form>
              </Form>
         )}
    </div>
  )
}

export default TitleForm