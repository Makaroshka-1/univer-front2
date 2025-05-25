import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">UniPortal</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-blue-600">UniPortal</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your gateway to academic excellence. Explore courses, manage your learning journey, and achieve your
            educational goals.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
                <CardTitle>Rich Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Access comprehensive courses with detailed modules and learning materials.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto" />
                <CardTitle>Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Learn from industry professionals and experienced educators.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-purple-600 mx-auto" />
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Earn recognized certificates upon successful course completion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-orange-600 mx-auto" />
                <CardTitle>Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Study at your own pace with flexible scheduling options.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
