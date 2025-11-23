"use client"

import { useState, useEffect } from "react"
import { Clock, FileText } from "lucide-react"
import PromptPanel from "./PromptPanel"

export default function ExerciseDetail({ exercise }) {
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="lg:col-span-2 flex gap-6 h-[100vh]">
      {/* Exercise Statement */}
      <div className="card overflow-y-scroll w-[20%]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{exercise.title}</h2>
            <p className="text-muted mt-1" dangerouslySetInnerHTML={{_html: exercise.description}}></p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
          <h3 className="font-bold mt-4">Énoncé</h3>
          <p>{exercise.statement}</p>

          {exercise.successCriteria && (
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
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <FileText size={16} />
                  <span className="text-sm">{attachment.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prompt Panel */}
      <PromptPanel exerciseId={exercise.id} maxTokens={exercise.maxTokens} />
    </div>
  )
}
