"use client"

 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { Combobox } from "@/components/ui/combobox"
interface CategoryFormProps{
    initialData:Course
    courseId:string;
    options:{label:string;value:string}[];
}
const formSchema = z.object({
    categoryId: z.string().min(1),
  })
const CategoryForm = ({initialData, courseId, options}:CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter()
    const selectedOption = options.find((option)=>option.value === initialData.categoryId)
    const toggleEdit = ()=>setIsEditing((current)=>!current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {categoryId: initialData?.categoryId || ""}
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
            Course Category
            <Button  onClick={toggleEdit} variant={"ghost"}>
                {isEditing ? (
                    <>Cancel</>
                ) : 
                 (
                <>  <Pencil className="h-4 w-4 mr-2" />
                    Edit Category
                </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
            <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                {selectedOption?.label|| "No category"}
            </p>
         )}
         {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox
                            options={...options}
                            {...field}
                          />
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

export default CategoryForm