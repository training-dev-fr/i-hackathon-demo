const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { useState } from "react"
import { FileText, FileImage, FileJson, FileCode2, FileArchive, File, Clock } from "lucide-react"
import PromptPanel from "../../components/student/PromptPanel"
import { Link } from "react-router-dom";


const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <FileImage className="text-blue-500" size={32} />;
    case 'pdf':
      return <FileText className="text-red-500" size={32} />;
    case 'zip':
    case 'rar':
      return <FileArchive className="text-yellow-500" size={32} />;
    case 'js':
    case 'jsx':
      return <FileCode2 className="text-yellow-400" size={32} />;
    case 'json':
      return <FileJson className="text-green-500" size={32} />;
    case 'dockerfile':
    case 'yml':
    case 'yaml':
      return <FileCode2 className="text-sky-500" size={32} />;
    default:
      return <File className="text-gray-400" size={32} />;
  }
};

export default function ExercisesPage({exercise}) {

  if (!exercise) return <div className="text-center py-8">Aucun exercice actif pour le moment</div>

  return (
    <div className="flex h-[calc(100vh-52px)] ">
      {/* Left side: Exercise statement and attachments */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="card flex-1 overflow-y-scroll [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full border-r-[1px] border-r-neutral-700">
          <div><Link to={"/"}> {`< `} Retour</Link></div>
          <div className="flex justify-between items-start mb-4">
            
            <div>
              <h2 className="text-2xl font-bold">{exercise.title}</h2>

            </div>
          </div>

          <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
            <h3 className="font-bold mt-4">Énoncé</h3>
            <p className="whitespace-pre-wrap">{exercise.statement}</p>
            <p className="text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: exercise.description }}></p>
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
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FileText size={18} />
                Pièces jointes
              </h3>
              <div className="space-y-2 flex flex-wrap">
                {exercise.attachments.map((attachment, idx) => (
                  <a
                    href={`${API_BASE}/attachments/download/${attachment.id}`}
                    className="flex flex-col items-center w-auto gap-3 p-3 m-3 rounded-lg hover:bg-accent hover:shadow transition-all cursor-pointer group"

                  >
                    <div className="transition-transform group-hover:scale-110">
                      {getFileIcon(attachment.filename || attachment.name)}
                    </div>
                    <span className="text-sm font-medium truncate">
                      {attachment.filename || attachment.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: AI Chat */}
      <div className="w-[70%] flex flex-col overflow-hidden" >
        <PromptPanel exerciseId={exercise.id} maxTokens={exercise.max_tokens} />
      </div>
    </div>
  )
}
