import { Routes, Route } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import AdminHome from "./admin/AdminHome"
import ExercisesManagement from "./admin/ExercisesManagement"
import ExerciseDetailPage from "./admin/ExerciseDetailPage"
import GroupsManagement from "./admin/GroupsManagement"
import GroupsPage from "./GroupsPage"
import StudentPromptsPage from "./admin/StudentPromptPage"

export default function AdminDashboard({ user }) {
  return (
    <AdminLayout user={user}>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/exercises" element={<ExercisesManagement />} />
        <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
        <Route path="/groups" element={<GroupsManagement />} />
        <Route path="/groups/generate" element={<GroupsPage />} />
        <Route path="/prompts/:exerciseId/:groupId" element={<StudentPromptsPage />} />
      </Routes>
    </AdminLayout>
  )
}
