import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../services/api"

export default function SignupPage({ setUser }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    school: "",
    year: "",
    specialty: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const specialties = {
    EFFICOM: ["DW", "DA", "SR", "DATA", "CS"],
    ESGI: ["IW", "AL", "SRC", "SI"],
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Reset specialty when school changes
    if (name === "school") {
      setFormData((prev) => ({
        ...prev,
        specialty: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'inscription")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      navigate("/student")
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">I-Hackaton</h1>
        <p className="text-center text-muted mb-8">Créez votre compte étudiant</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="input-field"
                placeholder="Votre prénom"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="input-field"
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="votre.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Établissement</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Sélectionner un établissement</option>
              <option value="EFFICOM">EFFICOM</option>
              <option value="ESGI">ESGI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Année</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Sélectionner une année</option>
              <option value="3">3ème année</option>
              <option value="5">5ème année</option>
            </select>
          </div>

          {formData.school && (
            <div>
              <label className="block text-sm font-medium mb-2">Spécialité</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Sélectionner une spécialité</option>
                {specialties[formData.school]?.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Inscription..." : "S'inscrire"}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted">Déjà inscrit ?</span>{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
