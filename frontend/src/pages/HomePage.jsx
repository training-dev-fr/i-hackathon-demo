"use client"

import { Plus, Zap, Sparkles, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "../services/api"

export default function HomePage() {
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
      const { data } = await apiService.exercises.getDemo()
      setExercises(data)
    } catch (err) {
      console.error("Error fetching exercises:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Chargement...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <span className="text-sm font-medium text-cyan-400">🚀 I-Hackathon 2025</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Démo I-Hackathon</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Découvrez l'aventure I-Hackathon et perfectionnez vous dans l'utilisation de l'IA. Relevez des défis
            innovants et transformez vos compétences.
          </p>
        </div>
      </section>

      {/* Exercises Grid */}
      <section className="px-6 py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Exercices disponibles</h2>
                <p className="text-gray-400 text-center">Sélectionnez un exercice pour commencer votre apprentissage</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    onClick={() => navigate(`/exercises/${exercise.id}`)}
                    className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full"
                  >
                    {/* Card Header */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {exercise.title}
                          </h3>
                          {exercise.isActive && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full whitespace-nowrap">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 min-h-10">
                          {exercise.description || "Pas de description"}
                        </p>
                      </div>

                      {/* Exercise Info */}
                      <div className="space-y-2 mb-6 py-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Zap className="w-4 h-4 text-cyan-500" />
                          <span>
                            Tokens max: <strong>{exercise.max_tokens}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 pb-6 border-t border-gray-800 pt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/exercises/${exercise.id}`)
                        }}
                        className="w-full px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                      >
                        Voir détails
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
            
        </div>
      </section>
      <section className="pt-20 pb-16 px-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight text-center">Contactez-moi</h1>
          <a href="https://www.linkedin.com/in/aurelien-vaast/" target="_blank" className="mt-4 p-8 profile flex justify-between bg-slate-950 cursor-pointer">
                <img src="/profil.jpg" className='rounded-full w-[150px]' />
                <div className="content flex justify-start w-[60%] flex-col gap-4">
                    <p className="font-bold text-xl">Aurélien VAAST</p>
                    <p>Formateur et responsable pédagogique, passionné par la transmission et le développement web. Je collabore avec les écoles pour proposer des cours, projets et séminaires engageants.</p>
                    <p>Discutons sur LinkedIn !</p>
                </div>
                <img src="/linkedin.png" className='rounded-full w-[150px]' />
            </a>
        </div>
      </section>
    </div>
  )
}
