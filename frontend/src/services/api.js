const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiService = {
  // Auth endpoints
  auth: {
    login: async (username, password) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) throw new Error("Login failed")
      return response.json()
    },
    logout: async () => {
      const token = localStorage.getItem("token")
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  },

  // Exercises endpoints
  exercises: {
    getAll: async () => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch exercises")
      return response.json()
    },
    getDemo: async () => {
      const response = await fetch(`${API_BASE}/exercises/demo`)
      if (!response.ok) throw new Error("Failed to fetch exercises")
      return response.json()
    },
    getActive: async () => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch active exercise")
      return response.json()
    },
    getById: async (id) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch exercise")
      return response.json()
    },
    create: async (data) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create exercise")
      return response.json()
    },
    update: async (id, data) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update exercise")
      return response.json()
    },
    delete: async (id) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to delete exercise")
      return response.json()
    },
    activate: async (id) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/exercises/activate/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to delete exercise")
      return response.json()
    }
  },

  // Tokens endpoints
  tokens: {
    getRemaining: async (exerciseId) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/tokens/remaining?exerciseId=${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch tokens")
      return response.json()
    },
    resetForGroup: async (groupId, exerciseId) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/admin/tokens/reset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId, exerciseId }),
      })
      if (!response.ok) throw new Error("Failed to reset tokens")
      return response.json()
    },
  },

  // Prompts endpoints
  prompts: {
    submit: async (exerciseId, prompt, attachments = []) => {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("exerciseId", exerciseId)
      formData.append("prompt", prompt)
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      const response = await fetch(`${API_BASE}/prompts/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to submit prompt")
      return response.json()
    },
    getHistory: async (exerciseId) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/prompts/history?exerciseId=${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch history")
      return response.json()
    },
    getCost: async (prompt, files) => {
      const token = localStorage.getItem("token");
      let body = new FormData();
      body.append('prompt', prompt);
      for (let file of files) {
        body.append('files', file);
      }
      const response = await fetch(`${API_BASE}/prompts/cost`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: body
      })
      if (!response.ok) throw new Error("Failed to fetch history")
      return response.json()
    },
    validate: async (exerciseId, prompt, attachments = []) => {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("exerciseId", exerciseId)
      formData.append("prompt", prompt)
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      const response = await fetch(`${API_BASE}/prompts/validate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to validate prompt")
      return response.json()
    }
  },

  // Admin endpoints
  admin: {
    getStats: async () => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch stats")
      return response.json()
    },
    getGroups: async (exerciseId) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/admin/groups/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch groups")
      return response.json()
    },
    getGroupProgress: async (groupId) => {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/admin/groups/${groupId}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch group progress")
      return response.json()
    },
  },
  loadExercice: async (id) => {
    const response = await fetch(`${API_BASE}/exercises/${id}`)
    if (!response.ok) throw new Error("Failed to fetch exercises")
    return response.json()
  }
}
