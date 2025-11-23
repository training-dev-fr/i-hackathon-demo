import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import { useEffect, useState } from "react"
import HomePage from "./pages/HomePage"
import Demo from "./pages/Demo"

function App() {

  return (
    <div className="main">
      <BrowserRouter>
        <Routes>
          <Route path="/exercises/:id" element={<Demo />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
