import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/student/draw`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des groupes")
        }

        const data = await response.json()
        setGroups(Array.isArray(data) ? data : data.groups || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des groupes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card bg-red-50 border-red-200 max-w-md">
          <p className="text-red-700">{error}</p>
          <button onClick={() => navigate("/student")} className="btn-primary mt-4 w-full">
            Retour au tableau de bord
          </button>
          <button className="btn-primary mt-4 w-full" onClick={() => {
            fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/student/reinit`)
          }}>Réinitialiser les groupes</button>
        </div>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-muted mb-4">Aucun groupe disponible pour le moment</p>
          <button onClick={() => navigate("/student")} className="btn-primary w-full">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  const currentGroup = groups[currentGroupIndex]
  const hasNext = currentGroupIndex < groups.length - 1
  const hasPrev = currentGroupIndex > 0

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Groupes</h1>
          <p className="text-muted">
            Groupe {currentGroupIndex + 1} sur {groups.length}
          </p>
        </div>

        {/* Current Group Card */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">{currentGroup.name || `Groupe ${currentGroupIndex + 1}`}</h2>

          <div className="space-y-4">
            {/* Members */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Membres</h3>
              <div className="space-y-2">
                {currentGroup.students && currentGroup.students.length > 0 ? (
                  currentGroup.students.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-700 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold">
                        {member.firstname?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.firstname} {member.lastname}
                        </p>
                        <p className="text-sm text-muted">
                          {member.year} ème année
                        </p>
                        <p className="text-sm text-muted">{member.school} - {member.specialty}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Aucun membre dans ce groupe</p>
                )}
              </div>
            </div>


              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <input type="text" id="group-name" className="bg-[#202020] p-2"/>
                <button className="btn-primary mt-4 w-full" onClick={() => {
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/student/${currentGroup.groupId}`,{method: "PUT",headers: {"Content-Type": "application/json"}, body: JSON.stringify({username: document.querySelector('#group-name').value})})
                }}>Enregistrer</button>
              </div>

          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentGroupIndex((prev) => Math.max(prev - 1, 0))}
            disabled={!hasPrev}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <span className="text-sm font-medium">{currentGroupIndex + 1}</span>
            <span className="text-muted">/</span>
            <span className="text-sm text-muted">{groups.length}</span>
          </div>

          <button
            onClick={() => setCurrentGroupIndex((prev) => Math.min(prev + 1, groups.length - 1))}
            disabled={!hasNext}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button onClick={() => navigate("/student")} className="text-blue-500 hover:text-blue-600 font-medium">
            ← Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
