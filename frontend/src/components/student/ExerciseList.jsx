"use client"

import { Clock } from "lucide-react"

export default function ExerciseList({ exercises, selectedExercise, onSelectExercise }) {
  return (
    <div className="card overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Exercices</h2>
      <div className="space-y-2">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelectExercise(exercise)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedExercise?.id === exercise.id ? "bg-blue-50 border-primary" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <h3 className="font-medium">{exercise.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted mt-1">
              <Clock size={16} />
              {exercise.duration} min
            </div>
            <div className="text-xs text-muted mt-1">Tokens: {exercise.maxTokens}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
