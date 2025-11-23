"use client"

import { useState, useEffect } from "react"
import { Users, AlertCircle } from "lucide-react"
import { apiService } from "../../services/api"
import { useNavigate } from "react-router-dom"

export default function GroupMonitoring({ exerciseId, isActive,tokenMax }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    fetchGroups()

    const interval = isActive ? setInterval(fetchGroups, 10000) : null
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [exerciseId, isActive])

  const fetchGroups = async () => {
    try {
      const { data } = await apiService.admin.getGroups(exerciseId)
      setGroups(data.filter(g => g.students.length > 0) || [])
    } catch (err) {
      console.error("Error fetching groups:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:col-span-1">
      <div className="card sticky top-0">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users size={20} />
          Suivi des groupes
        </h3>

        <div className="space-y-3">
          {groups.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucun groupe disponible</p>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className="p-3 border border-neutral-500 rounded-lg  transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/prompts/${exerciseId}/${group.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{group.username}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded" title={group.students.map(student => student.firstname + " " + student.lastname).join("\n")}>
                    {group.students.length|| 0} élèves
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-200">
                  <p>📤 Prompts: {group.Prompts.length || 0}</p>
                  <p>
                    ⚡ Tokens: {group.Prompts.reduce((total,prompt) => total + prompt.cost,0) || 0} / {tokenMax|| "∞"}
                  </p>
                  <p>✅ Complété: {group.Prompts.find(prompt => prompt.validate) ? "Oui" : "Non"}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {isActive && <p className="text-xs text-gray-500 text-center mt-4">Mis à jour en temps réel</p>}
      </div>
    </div>
  )
}
