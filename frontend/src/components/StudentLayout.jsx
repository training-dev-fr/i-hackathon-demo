"use client"

import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

export default function StudentLayout({ user, children }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen">
      <header className="shadow-sm">
        <div className="w-[100%] mx-auto flex justify-between pl-2 pr-2 items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">I-Hackaton</h1>
            <p className="text-sm text-muted">Groupe: {user?.group}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 btn-outline">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </header>
      <main className="w-7xl mx-auto">{children}</main>
    </div>
  )
}
