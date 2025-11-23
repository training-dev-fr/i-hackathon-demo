"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../../services/api"

export default function ExercisesManagement() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statement: "",
    duration: 30,
    maxTokens: 5000,
    successCriteria: [],
  })

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const { data } = await apiService.exercises.getAll()
      setExercises(data)
    } catch (err) {
      console.error("Error fetching exercises:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiService.exercises.create(formData)
      setFormData({
        title: "",
        description: "",
        statement: "",
        duration: 30,
        maxTokens: 5000,
        successCriteria: [],
      })
      setShowForm(false)
      fetchExercises()
    } catch (err) {
      alert("Erreur: " + err.message)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (confirm("Êtes-vous sûr de vouloir supprimer cet exercice?")) {
      try {
        await apiService.exercises.delete(id)
        fetchExercises()
      } catch (err) {
        alert("Erreur: " + err.message)
      }
    }
  }

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des exercices</h1>
          <p className="text-muted-foreground mt-1">Un seul exercice peut être actif à la fois</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouvel exercice
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Créer un exercice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Énoncé</label>
              <textarea
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                className="input-field resize-none h-24"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée (min)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max tokens</label>
                <input
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: Number.parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Créer
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => navigate(`/admin/exercises/${exercise.id}`)}
            className="card cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-[260px] justify-between"
          >
            <div className="flex justify-between items-start mb-3 ">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors flex-1 text-white">
                {exercise.title}
              </h3>
              {exercise.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full ml-2 ">
                  Actif
                </span>
              )}
            </div>

            <p className="text-sm  mb-3 line-clamp-2 min-h-10 text-grey-200">
              {exercise.description || "Pas de description"}
            </p>

            <div className="text-xs space-y-1 mb-4 text-grey-200">
              <p>⚡ Tokens max: {exercise.max_tokens}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/admin/exercises/${exercise.id}`)
                }}
                className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
              >
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucun exercice créé pour le moment</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Créer le premier exercice
          </button>
        </div>
      )}
    </div>
  )
}
