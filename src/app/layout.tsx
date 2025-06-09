import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-serasa-gray min-h-screen text-gray-800">
        <div className="flex">
          <aside className="w-64 bg-serasa-pink text-white min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Serasa Agro</h1>
            <nav className="space-y-4">
              <Link href="/" className="block hover:underline">🏠 Dashboard</Link>
              <Link href="/proposals/new" className="block hover:underline">➕ Nova Proposta</Link>
              <Link href="/proposals" className="block hover:underline">📄 Propostas</Link>
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
