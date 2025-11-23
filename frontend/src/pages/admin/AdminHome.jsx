"use client"

import { useState, useEffect } from "react"
import { apiService } from "../../services/api"
import StatCard from "../../components/admin/StatCard"

export default function AdminHome() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.admin.getStats()
        setStats(data)
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Groupes actifs" value={stats?.activeGroups || 0} icon="👥" />
        <StatCard title="Exercices" value={stats?.totalExercises || 0} icon="📚" />
        <StatCard title="Prompts soumis" value={stats?.totalPrompts || 0} icon="💬" />
        <StatCard title="Tokens utilisés" value={stats?.tokensUsed || 0} icon="⚡" />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Activité par groupe</h2>
        <div className="space-y-3">
          {stats?.groupActivity?.map((group) => (
            <div key={group.id} className="flex justify-between items-center p-3 border border-gray-200  rounded">
              <span className="font-medium">{group.name}</span>
              <span className="text-sm text-muted">{group.promptCount} prompts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
