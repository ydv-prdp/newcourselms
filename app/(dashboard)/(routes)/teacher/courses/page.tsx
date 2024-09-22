"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { useAuth } from '@clerk/nextjs'
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

const CoursePage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const { userId} = useAuth()
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>
  
  if(!userId){
    return redirect("/")
  }


  return (
    <div className="p-2">
       <DataTable columns={columns} data={data} />   
    </div>
  )
}

export default CoursePage