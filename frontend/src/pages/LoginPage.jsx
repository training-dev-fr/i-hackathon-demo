"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../services/api"

export default function LoginPage({ setUser }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const {data} = await apiService.auth.login(username, password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      navigate(data.user.role === "admin" ? "/admin" : "/student")
    } catch (err) {
      setError(err.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">I-Hackaton</h1>
        <p className="text-center text-muted mb-8">Connectez-vous pour commencer</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Identifiant</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Votre identifiant"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  )
}
