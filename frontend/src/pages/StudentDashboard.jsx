import { Routes, Route } from "react-router-dom"
import StudentLayout from "../components/StudentLayout"
import ExercisesPage from "./student/ExercisesPage"

export default function StudentDashboard({ user }) {
  return (
    <StudentLayout user={user}>
      <Routes>
        <Route path="/" element={<ExercisesPage />} />
      </Routes>
    </StudentLayout>
  )
}
