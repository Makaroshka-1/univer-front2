# University Portal API Guide

This document outlines the API endpoints that need to be implemented for the University Portal backend running on `http://127.0.0.1:8000`.

## Base URL
\`\`\`
http://127.0.0.1:8000/api
\`\`\`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Login a user with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  },
  "token": "jwt-token-here",
  "message": "Login successful"
}
\`\`\`

#### POST /auth/register
Register a new user.

**Request Body:**
\`\`\`json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "createdAt": "2024-01-20T10:00:00Z"
  },
  "token": "jwt-token-here",
  "message": "Registration successful"
}
\`\`\`

#### POST /auth/logout
Logout the current user (requires authentication).

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

### Course Endpoints

#### GET /courses
Get all courses with optional filtering.

**Query Parameters:**
- `level` (optional): Filter by difficulty level (Beginner, Intermediate, Advanced)
- `search` (optional): Search in course title and description

**Response:**
\`\`\`json
{
  "success": true,
  "courses": [
    {
      "id": "1",
      "title": "Introduction to Computer Science",
      "description": "Learn the fundamentals of programming...",
      "instructor": "Dr. Sarah Johnson",
      "duration": "12 weeks",
      "students": 245,
      "level": "Beginner",
      "modules": 8,
      "price": 299,
      "rating": 4.8,
      "thumbnail": "/images/course1.jpg"
    }
  ],
  "total": 1
}
\`\`\`

#### GET /courses/{courseId}
Get detailed information about a specific course.

**Response:**
\`\`\`json
{
  "success": true,
  "course": {
    "id": "1",
    "title": "Introduction to Computer Science",
    "description": "Comprehensive course description...",
    "instructor": "Dr. Sarah Johnson",
    "duration": "12 weeks",
    "students": 245,
    "level": "Beginner",
    "price": 299,
    "rating": 4.8,
    "thumbnail": "/images/course1.jpg",
    "modules": [
      {
        "id": "1",
        "title": "Programming Fundamentals",
        "description": "Basic concepts of programming",
        "duration": "2 hours",
        "order": 1,
        "isLocked": false
      }
    ]
  }
}
\`\`\`

#### GET /courses/{courseId}/modules
Get all modules for a specific course.

**Response:**
\`\`\`json
{
  "success": true,
  "modules": [
    {
      "id": "1",
      "title": "Programming Fundamentals",
      "description": "Basic concepts of programming",
      "duration": "2 hours",
      "order": 1,
      "isLocked": false,
      "content": "Module content here...",
      "objectives": ["Learn programming basics", "Understand syntax"],
      "prerequisites": "None",
      "difficulty": "Beginner"
    }
  ]
}
\`\`\`

### Module Endpoints

#### GET /courses/{courseId}/modules/{moduleId}
Get detailed information about a specific module.

**Response:**
\`\`\`json
{
  "success": true,
  "module": {
    "id": "1",
    "courseId": "1",
    "title": "Programming Fundamentals",
    "description": "Basic concepts of programming",
    "duration": "2 hours",
    "content": "Detailed module content...",
    "objectives": [
      "Understand what programming is",
      "Learn basic syntax",
      "Write your first program"
    ],
    "prerequisites": "None",
    "difficulty": "Beginner",
    "resources": [
      {
        "type": "video",
        "title": "Introduction Video",
        "url": "/videos/intro.mp4"
      },
      {
        "type": "document",
        "title": "Course Notes",
        "url": "/documents/notes.pdf"
      }
    ]
  }
}
\`\`\`

#### POST /modules/{moduleId}/enroll
Enroll in a specific module (requires authentication).

**Request Body:**
\`\`\`json
{
  "courseId": "1"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "enrollment": {
    "id": "1-1",
    "courseId": "1",
    "moduleId": "1",
    "enrolledDate": "2024-01-20T10:00:00Z",
    "status": "enrolled",
    "progress": 0
  },
  "message": "Successfully enrolled in module"
}
\`\`\`

#### DELETE /modules/{moduleId}/enroll
Drop from a specific module (requires authentication).

**Query Parameters:**
- `courseId`: The course ID

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Successfully dropped from module"
}
\`\`\`

### User Endpoints

#### GET /user/enrolled-modules
Get all modules the user is enrolled in (requires authentication).

**Response:**
\`\`\`json
{
  "success": true,
  "modules": [
    {
      "id": "1-1",
      "courseId": "1",
      "moduleId": "1",
      "courseTitle": "Introduction to Computer Science",
      "moduleTitle": "Programming Fundamentals",
      "progress": 75,
      "enrolledDate": "2024-01-15T10:00:00Z",
      "dueDate": "2024-02-15T23:59:59Z",
      "status": "in-progress",
      "instructor": "Dr. Sarah Johnson",
      "duration": "2 hours",
      "lastAccessed": "2024-01-20T14:30:00Z"
    }
  ],
  "total": 1
}
\`\`\`

#### PUT /user/progress
Update progress for a specific module (requires authentication).

**Request Body:**
\`\`\`json
{
  "courseId": "1",
  "moduleId": "1",
  "progress": 85
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "moduleId": "1",
    "courseId": "1",
    "progress": 85,
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
\`\`\`

#### GET /user/progress
Get progress for a specific module (requires authentication).

**Query Parameters:**
- `courseId`: The course ID
- `moduleId`: The module ID

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "moduleId": "1",
    "courseId": "1",
    "progress": 75,
    "timeSpent": 120,
    "lastAccessed": "2024-01-20T14:30:00Z",
    "completedLessons": 3,
    "totalLessons": 4
  }
}
\`\`\`

## Error Responses

All endpoints may return error responses in the following format:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
\`\`\`

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Courses Table
\`\`\`sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    duration VARCHAR(100),
    level VARCHAR(50),
    price DECIMAL(10,2),
    rating DECIMAL(3,2),
    thumbnail VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Modules Table
\`\`\`sql
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    duration VARCHAR(100),
    order_index INTEGER,
    prerequisites TEXT,
    difficulty VARCHAR(50),
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Enrollments Table
\`\`\`sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    module_id INTEGER REFERENCES modules(id),
    enrolled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    completed_at TIMESTAMP
);
\`\`\`

## Implementation Notes

1. **Authentication**: Use JWT tokens for session management
2. **Authorization**: Implement role-based access control
3. **Validation**: Validate all input data on the server side
4. **Error Handling**: Implement comprehensive error handling
5. **Logging**: Log all API requests and errors
6. **Rate Limiting**: Implement rate limiting to prevent abuse
7. **CORS**: Configure CORS for frontend integration
8. **Database**: Use connection pooling for database connections
9. **Caching**: Implement caching for frequently accessed data
10. **Testing**: Write unit and integration tests for all endpoints
\`\`\`

```typescriptreact file="app/courses/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, LogOut } from 'lucide-react'

const courses = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of programming and computer science concepts.",
    instructor: "Dr. Sarah Johnson",
    duration: "12 weeks",
    students: 245,
    level: "Beginner",
    modules: 8,
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    description: "Explore calculus, linear algebra, and advanced mathematical concepts.",
    instructor: "Prof. Michael Chen",
    duration: "16 weeks",
    students: 189,
    level: "Advanced",
    modules: 12,
  },
  {
    id: "3",
    title: "Digital Marketing Fundamentals",
    description: "Master the basics of digital marketing and online advertising.",
    instructor: "Ms. Emily Rodriguez",
    duration: "8 weeks",
    students: 312,
    level: "Intermediate",
    modules: 6,
  },
  {
    id: "4",
    title: "Data Science with Python",
    description: "Learn data analysis, visualization, and machine learning with Python.",
    instructor: "Dr. Alex Kumar",
    duration: "14 weeks",
    students: 156,
    level: "Intermediate",
    modules: 10,
  },
]

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
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
      </main>
    </div>
  )
}
