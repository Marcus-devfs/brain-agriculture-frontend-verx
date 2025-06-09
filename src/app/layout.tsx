'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaHome, FaFileAlt, FaPlus } from 'react-icons/fa'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="pt-br">
      <body className="bg-serasa-gray min-h-screen text-gray-800">

        <header className="bg-serasa-pink text-white flex items-center justify-between px-6 py-4 shadow-md fixed top-0 left-0 right-0 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-bold">Serasa Agro</h1>
        </header>

        {sidebarOpen && (
          <aside className="fixed top-16 left-0 w-64 h-full bg-white shadow-lg text-black p-6 z-40 transition-transform duration-300">
            <nav className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-serasa-pink"
                onClick={() => setSidebarOpen(false)}
              >
                <FaHome /> Dashboard
              </Link>
              <Link
                href="/proposals/new"
                className="flex items-center gap-2 hover:text-serasa-pink"
                onClick={() => setSidebarOpen(false)}
              >
                <FaPlus /> Nova Proposta
              </Link>
              <Link
                href="/proposals"
                className="flex items-center gap-2 hover:text-serasa-pink"
                onClick={() => setSidebarOpen(false)}
              >
                <FaFileAlt /> Propostas
              </Link>
            </nav>
          </aside>
        )}

        <main className="transition-all duration-300">{children}</main>
      </body>
    </html>
  )
}
