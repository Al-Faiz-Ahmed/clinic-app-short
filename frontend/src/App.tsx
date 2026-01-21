import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Dashboard from "@/pages/Dashboard";
import { ToastProvider } from "@/components/toast/Toaster";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
