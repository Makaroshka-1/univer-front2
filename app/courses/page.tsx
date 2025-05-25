"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, LogOut } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  students: number
  level: string
  modules: number
  price?: number
  rating?: number
  thumbnail?: string
}

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchCourses()
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.message || "Failed to fetch courses")
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      router.push("/")
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">UniPortal</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="ghost" className="bg-blue-50 text-blue-600">
                  Courses
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="mt-2 text-gray-600">Explore our comprehensive course catalog</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchCourses}>Retry</Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No courses available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge
                      variant={
                        course.level === "Beginner"
                          ? "secondary"
                          : course.level === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Instructor: {course.instructor}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {course.modules} modules
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {course.students} students enrolled
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full mt-4">View Course Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
