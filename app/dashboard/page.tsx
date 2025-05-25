"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, LogOut, PlayCircle, Calendar, TrendingUp } from "lucide-react"

interface EnrolledModule {
  id: string
  courseId: string
  courseTitle: string
  moduleTitle: string
  progress: number
  enrolledDate: string
  dueDate: string
  status: "in-progress" | "completed" | "overdue"
  instructor: string
  duration: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [enrolledModules, setEnrolledModules] = useState<EnrolledModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchEnrolledModules()
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchEnrolledModules = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/enrolled-modules", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setEnrolledModules(data.modules)
      } else {
        setError(data.message || "Failed to fetch enrolled modules")
      }
    } catch (error) {
      console.error("Failed to fetch enrolled modules:", error)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-blue-500"
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
                <Button variant="ghost">Courses</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="bg-blue-50 text-blue-600">
                  Dashboard
                </Button>
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
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your progress and manage your enrolled modules</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledModules.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled modules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledModules.filter((m) => m.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground">Modules completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledModules.filter((m) => m.status === "in-progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Active modules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledModules.length > 0
                  ? Math.round(enrolledModules.reduce((acc, m) => acc + m.progress, 0) / enrolledModules.length)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Enrolled Modules</h2>

          {loading ? (
            <div className="text-center py-8">Loading your modules...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchEnrolledModules}>Retry</Button>
            </div>
          ) : enrolledModules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules enrolled yet</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in some modules</p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrolledModules.map((module) => (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{module.moduleTitle}</CardTitle>
                          <Badge className={getStatusColor(module.status)}>{module.status.replace("-", " ")}</Badge>
                        </div>
                        <CardDescription className="text-base font-medium text-gray-700">
                          {module.courseTitle}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {module.instructor}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {module.duration}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(module.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Link href={`/courses/${module.courseId}/modules/${module.id.split("-")[1]}`}>
                          <Button variant="default">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        </Link>
                        <Link href={`/courses/${module.courseId}`}>
                          <Button variant="outline">View Course</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
