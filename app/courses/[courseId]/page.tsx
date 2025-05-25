"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, ArrowLeft, PlayCircle } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string
  duration: string
  order: number
  isLocked: boolean
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  students: number
  level: string
  price?: number
  rating?: number
  thumbnail?: string
  modules: Module[]
}

export default function CourseDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchCourse()
    } else {
      router.push("/login")
    }
  }, [router, courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setCourse(data.course)
      } else {
        setError(data.message || "Failed to fetch course")
      }
    } catch (error) {
      console.error("Failed to fetch course:", error)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading course...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCourse}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
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
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="ghost">Courses</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Link href="/courses">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <Badge
              variant={
                course.level === "Beginner" ? "secondary" : course.level === "Intermediate" ? "default" : "destructive"
              }
            >
              {course.level}
            </Badge>
          </div>
          <p className="text-gray-600 mb-6">{course.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>Instructor: {course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Duration: {course.duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
              <span>{course.modules.length} modules</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>{course.students} students</span>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{module.duration}</span>
                      <PlayCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/courses/${courseId}/modules/${module.id}`}>
                    <Button className="w-full" disabled={module.isLocked}>
                      {module.isLocked ? "Locked" : "View Module Details"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
