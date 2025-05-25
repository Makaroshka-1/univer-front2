"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, ArrowLeft, CheckCircle, XCircle, PlayCircle } from "lucide-react"

interface Module {
  id: string
  courseId: string
  title: string
  description: string
  duration: string
  content: string
  objectives: string[]
  prerequisites: string
  difficulty: string
  resources?: Array<{
    type: string
    title: string
    url: string
  }>
}

export default function ModuleDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const moduleId = params.moduleId as string

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchModule()
      checkEnrollment()
    } else {
      router.push("/login")
    }
  }, [router, courseId, moduleId])

  const fetchModule = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/modules/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setModule(data.module)
      } else {
        setError(data.message || "Failed to fetch module")
      }
    } catch (error) {
      console.error("Failed to fetch module:", error)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/enrolled-modules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        const enrollmentKey = `${courseId}-${moduleId}`
        const isEnrolledInModule = data.modules.some((m: any) => m.id === enrollmentKey)
        setIsEnrolled(isEnrolledInModule)
      }
    } catch (error) {
      console.error("Failed to check enrollment:", error)
    }
  }

  const handleEnrollment = async () => {
    setEnrolling(true)
    try {
      if (isEnrolled) {
        // Drop the module
        const response = await fetch(`http://127.0.0.1:8000/api/modules/${moduleId}/enroll?courseId=${courseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const data = await response.json()

        if (data.success) {
          setIsEnrolled(false)
          alert("Successfully dropped from module")
        } else {
          alert(data.message || "Failed to drop module")
        }
      } else {
        // Register for the module
        const response = await fetch(`http://127.0.0.1:8000/api/modules/${moduleId}/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ courseId }),
        })

        const data = await response.json()

        if (data.success) {
          setIsEnrolled(true)
          alert("Successfully enrolled in module")
        } else {
          alert(data.message || "Failed to enroll in module")
        }
      }
    } catch (error) {
      console.error("Enrollment error:", error)
      alert("Failed to connect to server")
    } finally {
      setEnrolling(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading module...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchModule}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Module not found</p>
          <Link href={`/courses/${courseId}`}>
            <Button>Back to Course</Button>
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
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Link href={`/courses/${courseId}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{module.difficulty}</Badge>
              {isEnrolled && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6">{module.description}</p>

          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Duration: {module.duration}</span>
            </div>
            <div className="flex items-center">
              <PlayCircle className="h-4 w-4 mr-2" />
              <span>Prerequisites: {module.prerequisites}</span>
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="flex space-x-4">
            <Button
              onClick={handleEnrollment}
              variant={isEnrolled ? "destructive" : "default"}
              className="flex items-center"
              disabled={enrolling}
            >
              {enrolling ? (
                "Processing..."
              ) : isEnrolled ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Drop Module
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Register for Module
                </>
              )}
            </Button>
            {isEnrolled && (
              <Button variant="outline">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            )}
          </div>
        </div>

        {/* Module Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{module.content}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {module.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Duration</h4>
                  <p className="text-gray-600">{module.duration}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Difficulty</h4>
                  <p className="text-gray-600">{module.difficulty}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Prerequisites</h4>
                  <p className="text-gray-600">{module.prerequisites}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
