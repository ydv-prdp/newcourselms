
import { db } from "@/lib/db"
import CategoriesPage from "./_components/CategoriesPage"
import SearchInput from "@/components/SearchInput"
import { getCourses } from "@/actions/get-courses"
import { auth } from "@clerk/nextjs/server"
import CoursesList from "@/components/course-list"

interface SearchPageProps{
  searchParams:{
    title:string;
    categoryId:string;
  }
}
const SearchPage = async({
  searchParams
}:SearchPageProps) => {
  const {userId} = auth();
  const categories = await db.category.findMany({
    orderBy:{
      name:"asc"
    }
  })
  const courses = await getCourses({userId, ...searchParams})
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput/>
      </div>
      <div className="p-6 space-y-4">
        <CategoriesPage
          items={categories}
        />
        <CoursesList 
          items={courses}
        />
      </div>
    </>
  )
}

export default SearchPage