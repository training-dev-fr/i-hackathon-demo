"use client"

import { useNavigate, Link, useLocation } from "react-router-dom"
import { LogOut, BarChart3, BookOpen, Users } from "lucide-react"

export default function AdminLayout({ user, children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray">
          <h1 className="text-2xl font-bold text-primary">I-Hackaton</h1>
          <p className="text-sm text-muted mt-1">Admin</p>
          <div className="">
          <button onClick={handleLogout} className="flex items-center gap-2 btn-outline w-full justify-center">
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
        </div>

        <nav className="">
          <Link
            to="/admin"
            className={`flex items-center gap-3 rounded-lg transition-colors p-4 ${isActive("/admin") && !isActive("/exercises") && !isActive("/groups")
                ? "bg-neutral-700"
                : "text-foreground hover:bg-gray-600 hover:"
              }`}
          >
            <BarChart3 size={20} />
            Tableau de bord
          </Link>
          <Link
            to="/admin/exercises"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${isActive("/admin/exercises") ? "bg-neutral-700 " : "text-foreground hover:bg-gray-600"
              }`}
          >
            <BookOpen size={20} />
            Exercices
          </Link>
          <Link
            to="/admin/groups"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${isActive("/admin/groups") ? "bg-neutral-700" : "text-foreground hover:bg-gray-600"
              }`}
          >
            <Users size={20} />
            Groupes
          </Link>
          <Link
            to="/admin/groups/generate"
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${isActive("/admin/groups/generate") ? "bg-neutral-700" : "text-foreground hover:bg-gray-600"
              }`}
          >
            <Users size={20} />
            Génération Groupes
          </Link>
        </nav>

        
      </aside>

      <main className="flex-1 bg-[#242424]">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
