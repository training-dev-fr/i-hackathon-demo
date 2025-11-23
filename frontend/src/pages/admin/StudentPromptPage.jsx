"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft, MessageSquare, User, Users } from 'lucide-react'
import { apiService } from "../../services/api"
import PromptPanel from "../../components/student/PromptPanel"

export default function StudentPromptsPage({}) {
  const navigate = useNavigate()
  const {exerciseId,groupId} = useParams();
  const [prompts, setPrompts] = useState([])
  const [groupInfo, setGroupInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchGroupPrompt()
  }, [])

  const fetchGroupPrompt = async () => {
    try {
      setLoading(true)
      const data = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/groups/${exerciseId}/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(r => r.json())
      setGroupInfo(data.data)
    } catch (err) {
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }

  

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/exercises/${exerciseId}`)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
        >
          <ChevronLeft size={20} />
          Retour
        </button>
      </div>

      {/* Main content */}
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left side - Group info and student details */}
        <div className="w-1/3 overflow-y-auto space-y-4">
          {groupInfo && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                <h2 className="text-lg font-bold">Groupe</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nom du groupe</p>
                  <p className="font-medium">{groupInfo.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membres: {groupInfo.students?.length || 0}</p>

                  <p className="whitespace-pre font-medium">{groupInfo.students.map(student => student.firstname + " " + student.lastname).join('\n')}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right side - Prompts with attachments */}
        <div className="flex-1 overflow-y-auto">
          {detailLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Chargement des prompts...</p>
            </div>
          ) : groupInfo.Prompts.length === 0 ? (
            <div className="card">
              <p className="text-center text-muted-foreground py-8">
                Aucun prompt soumis par cet étudiant
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupInfo.Prompts.map((prompt, idx) => (
                <div key={idx} className="card">
                  <div className="mb-3 pb-3 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(prompt.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Student prompt */}
                    <div className={`${prompt.validate?"bg-[#08b534]":"bg-[#2a70ff]"} p-3 rounded-lg`}>
                      <p className="text-xs font-bold text-primary mb-2">ÉTUDIANT</p>
                      <p className="text-sm">{prompt.prompt_text}</p>
                    </div>

                    {/* AI response */}
                    {prompt.iaPrompt && (
                      <div className="bg-secondary p-3 rounded-lg">
                        <p className="text-xs font-bold mb-2">IA</p>
                        <p className="text-sm whitespace-pre-wrap">{prompt.iaPrompt}</p>
                      </div>
                    )}

                    {/* Attachments */}
                    {prompt.attachments && prompt.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-bold mb-2">Fichiers joints</p>
                        <div className="space-y-2">
                          {prompt.attachments.map((attachment, attIdx) => (
                            <a
                              key={attIdx}
                              href={attachment.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                            >
                              <span className="text-sm truncate">{attachment.originalName}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Token usage */}
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Tokens utilisés: <span className="font-mono font-bold">{prompt.cost || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
