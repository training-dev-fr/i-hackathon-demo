"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, FileText, Play, Square } from "lucide-react"
import { apiService } from "../../services/api"
import GroupMonitoring from "../../components/admin/GroupMonitoring"

export default function ExerciseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    fetchExercise()
  }, [id])

  useEffect(() => {
    if (!exercise) return

    setTimeLeft(exercise.duration * 60)
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [exercise])

  const fetchExercise = async () => {
    try {
      const { data } = await apiService.exercises.getById(id)
      setExercise(data)
    } catch (err) {
      console.error("Error fetching exercise:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (currentStatus) => {
    try {
      if (currentStatus) {
        await apiService.exercises.deactivate(id)
      } else {
        await apiService.exercises.activate(id)
      }
      fetchExercise()
    } catch (err) {
      alert("Erreur: " + err.message)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>
  if (!exercise) return <div className="flex items-center justify-center h-screen">Exercice non trouvé</div>

  return (
    <div>
      <button
        onClick={() => navigate("/admin/exercises")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card flex-1 overflow-y-auto max-h-[calc(100vh-200px)] text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{exercise.title}</h2>
                <p className="text-gray-200 mt-1" dangerouslySetInnerHTML={{ __html: exercise.description}}></p>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeLeft > 300 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                <Clock size={18} />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
              <h3 className="font-bold mt-4">Énoncé</h3>
              <p>{exercise.statement}</p>

              {exercise.successCriteria && exercise.successCriteria.length > 0 && (
                <>
                  <h3 className="font-bold mt-4">Critères de succès</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {exercise.successCriteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {exercise.attachments && exercise.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Pièces jointes
                </h3>
                <div className="space-y-2">
                  {exercise.attachments.map((attachment, idx) => (
                    <a
                      key={idx}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2  border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      <FileText size={16} />
                      <span className="text-sm">{attachment.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleToggleActive(exercise.isActive)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                exercise.isActive
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {exercise.isActive ? (
                <>
                  <Square size={20} />
                  Arrêter l'exercice
                </>
              ) : (
                <>
                  <Play size={20} />
                  Démarrer l'exercice
                </>
              )}
            </button>
          </div>
        </div>

        <GroupMonitoring exerciseId={id} isActive={exercise.is_active} tokenMax={exercise.max_tokens} />
      </div>
    </div>
  )
}
