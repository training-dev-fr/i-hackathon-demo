"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip, Zap, X } from "lucide-react"
import { apiService } from "../../services/api"
import TypeWriter from "../ia/TypeWriter"
import "./hack.css";

export default function PromptPanel({ exerciseId, maxTokens }) {
  const [prompt, setPrompt] = useState("")
  const [attachments, setAttachments] = useState([])
  const [tokensRemaining, setTokensRemaining] = useState(maxTokens)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [estimatedTokens, setEstimatedTokens] = useState(0)
  const filesRef = useRef(null);
  const promptPanelRef = useRef(null);
  let isTokenCalculating = useRef(false);
  const [hack, setHack] = useState("");

  useEffect(() => {
    fetchTokensAndHistory()
  }, [exerciseId])

  const fetchTokensAndHistory = async () => {
    try {
      const token = await apiService.tokens.getRemaining(exerciseId)
      setTokensRemaining(token.data.remaining)
      const { data } = await apiService.prompts.getHistory(exerciseId)
      data.forEach(prompt => prompt.old = true);
      setHistory(data)
      setTimeout(() => {
        promptPanelRef.current.scrollTo({
          top: promptPanelRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 500)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  const handlePromptChange = async (e) => {
    if (e.target) {
      const text = e.target.value;
      setPrompt(text)
    }
    if (isTokenCalculating.current) return;
    isTokenCalculating.current = true;


    try {
      const result = await apiService.prompts.getCost(prompt, attachments);
      setEstimatedTokens(result.data.total);
    } finally {
      isTokenCalculating.current = false;
    }

  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setAttachments([...attachments, ...files])
    handlePromptChange({ e: { target: {} } })
  }

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    if (estimatedTokens > tokensRemaining) {
      alert("Pas assez de tokens disponibles")
      return
    }

    setLoading(true)
    try {
      const response = await apiService.prompts.submit(exerciseId, prompt, attachments)
      if (response?.hack === true) {
        setTimeout(() => {
          setHack("hackover");
        }, 13000);
        setTimeout(() => {
          setHack("hack hack2");
          setTimeout(() => {
            setHack("hack hack2 hack3");
            setTimeout(() => {
              setHack("hack4");
            }, 2000);
          }, 2000);
        }, 5000);
        return setHack("hack");

      } else {
        setHistory([...history, response.data])
        setPrompt("")
        setAttachments([])
        setEstimatedTokens(0)
        setTokensRemaining(tokensRemaining - estimatedTokens)
      }
    } catch (err) {
      alert("Erreur lors de la soumission: " + err.message)
    } finally {
      setLoading(false)
    }
  }
  const getEstimationWarning = () => {
    if (estimatedTokens < tokensRemaining / 3) {
      return "high";
    } else if (estimatedTokens < tokensRemaining / 1.5) {
      return "medium";
    } else {
      return "low";
    }
  }

  const validate = async () => {
    const response = await apiService.prompts.validate(exerciseId, prompt, attachments)
    setHistory((prev) => [...prev,response.data])
  }

  const tokenPercentage = (tokensRemaining / maxTokens) * 100

  return (

    <div className={`card flex flex-col h-full bg-[#242424] text-gray-200 ${hack} w-full`}>
      {hack === "hackover" && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-green-400 font-mono text-xl"
        >
          <div className="text-center space-y-4 animate-terminal">
            <p>⚠️ SYSTEM BREACH DETECTED ⚠️</p>
            <p> INITIATING COUNTERMEASURES...</p>
            <p> CONNECTION LOST</p>
            <p className="rp-hack"> YOU HAVE BEEN HACKED BY YOUR RP 😛</p>
            <p className="text-red-500 animate-blink">_</p>
          </div>

          <style jsx>{`
      @keyframes blink {
        50% { opacity: 0; }
      }
      .animate-blink { animation: blink 0.8s infinite; }

      @keyframes flicker {
    0% {
        opacity: 0.95;
        filter: brightness(1);
    }

    10% {
        opacity: 0.6;
        filter: brightness(.6)
    }

    20% {
        opacity: 0.95;
        filter: brightness(1)
    }

    30% {
        opacity: 0.55;
        filter: brightness(.5)
    }

    100% {
        opacity: 0.95;
        filter: brightness(1)
    }
}


.rp-hack{
    animation: flicker 1s infinite;
}
.animate-terminal p{
  opacity: 0;
}

      @keyframes terminalScroll {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-terminal p:(not(.rp-hack)) {
        animation: terminalScroll 0.4s ease-out forwards;
      }
      .animate-terminal p:nth-child(1) { animation-delay: 0.2s; }
      .animate-terminal p:nth-child(2) { animation-delay: 1s; }
      .animate-terminal p:nth-child(3) { animation-delay: 2s; }
      .animate-terminal p:nth-child(4) { animation-delay: 3s; }
    `}</style>
        </div>
      )}
      {/* Token counter */}
      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            Tokens restants
          </h3>
          <span className="text-sm font-mono font-medium">
            {tokensRemaining} / {maxTokens}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${tokenPercentage > 20 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${tokenPercentage}%` }}
          />
        </div>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3" ref={promptPanelRef}>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Posez votre première question à l'IA pour commencer
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4" >
            {history.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {/* Message utilisateur */}
                <div className="flex justify-end">
                  <div className={`w-[70%]  ${item.validate?"bg-[#08b534]":"bg-[#2a70ff]"} text-white p-3 rounded-2xl rounded-br-none shadow-sm whitespace-pre-wrap`}>
                    <p className="text-sm">{item.prompt_text}</p>
                  </div>
                </div>

                {/* Message IA */}
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-2xl rounded-bl-none shadow-sm w-full bg-[#2a2b31] text-gray-100">
                    {item.old &&
                      <div>{item.iaPrompt}</div>
                    }
                    {!item.old &&
                      <TypeWriter text={item.iaPrompt} className="text-sm whitespace-pre-wrap " fluidContainerRef={promptPanelRef} />
                    }

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-4 relative">
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg border border-border"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  className="text-destructive hover:text-destructive/80 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            onKeyUp={(e) => {
              if(e.key === "Enter"){
                handleSubmit(e);
              }
            }}
            placeholder="Posez votre question à l'IA..."
            className="input-field resize-none h-24 w-full"
          />
          <div className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold mt-1
    whitespace-nowrap transition-colors duration-200
    ${getEstimationWarning() === "high"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : getEstimationWarning() === "medium"
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>Tokens estimés: {estimatedTokens}</div>
        </div>

        <div className="flex gap-2 absolute right-4 top-1 mt-4">
          <label className="flex items-center gap-2 py-4 cursor-pointer hover:bg-accent transition-colors">
            <Paperclip size={18} />
            <input type="file" multiple onChange={handleFileSelect} className="hidden" ref={filesRef} />
          </label>
          <button
            type="submit"
            disabled={loading || !prompt.trim() || estimatedTokens > tokensRemaining || history.filter(prompt=> prompt.validate === true).length > 0}
            className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
