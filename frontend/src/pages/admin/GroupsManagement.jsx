"use client"

import { useState, useEffect } from "react"
import { apiService } from "../../services/api"

export default function GroupsManagement() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const data = await apiService.admin.getGroups()
      setGroups(data.data)
    } catch (err) {
      console.error("Error fetching groups:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des groupes</h1>

      <div className="flex gap-4 align-middle">
        {groups.filter(g => g.students.length > 0).map((group) => (
          <div key={group.id} className="card w-[25%]  mt-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{group.name}</h3>
                <p className="text-sm text-muted">{group.students?.length || 0} membres</p>
              </div>
              <span className="text-sm font-mono bg-blue-50 px-3 py-1 rounded text-blue-800">{group.progress || 0}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${group.progress || 0}%` }} />
            </div>

            {group.students && <div className="text-sm text-muted whitespace-pre-line">{"\n" + group.students.map(student => student.firstname + " " + student.lastname).join("\n")}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
