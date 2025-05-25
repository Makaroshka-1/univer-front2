const API_BASE_URL = "http://127.0.0.1:8000/api"

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.json()
  },
}

// Courses API calls
export const coursesAPI = {
  getAll: async (filters?: { level?: string; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.level) params.append("level", filters.level)
    if (filters?.search) params.append("search", filters.search)

    const response = await fetch(`${API_BASE_URL}/courses?${params}`)
    return response.json()
  },

  getById: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`)
    return response.json()
  },

  getModules: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules`)
    return response.json()
  },
}

// Modules API calls
export const modulesAPI = {
  getById: async (courseId: string, moduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}`)
    return response.json()
  },

  enroll: async (courseId: string, moduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ courseId }),
    })
    return response.json()
  },

  drop: async (courseId: string, moduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/enroll?courseId=${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.json()
  },
}

// User API calls
export const userAPI = {
  getEnrolledModules: async () => {
    const response = await fetch(`${API_BASE_URL}/user/enrolled-modules`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.json()
  },

  updateProgress: async (courseId: string, moduleId: string, progress: number) => {
    const response = await fetch(`${API_BASE_URL}/user/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ courseId, moduleId, progress }),
    })
    return response.json()
  },

  getProgress: async (courseId: string, moduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/progress?courseId=${courseId}&moduleId=${moduleId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.json()
  },
}
