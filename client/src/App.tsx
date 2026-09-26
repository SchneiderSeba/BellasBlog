import { Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { ArticlePage } from './pages/ArticlePage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/articulos/:slug" element={<ArticlePage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes>
}
