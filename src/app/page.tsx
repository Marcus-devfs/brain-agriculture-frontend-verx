'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { getDashboardData } from './services/dashboardService'
import { FaSeedling, FaMapMarkedAlt, FaTractor } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface DashboardData {
  totalPropostas: number;
  totalFazendas: number;
  totalHectares: number;
  porEstado: Record<string, number>;
  porCultivo: Record<string, number>;
  usoSolo: {
    agriculturavel: number;
    vegetacao: number;
  };
}

const COLORS = ['#F2008A', '#FFC0CB', '#FF69B4', '#F2F2F2']

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getDashboardData()
        setData(response.data)
      } catch (err) {
        console.error('Erro ao carregar dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <p>Carregando...</p>
  if (!data) return <p>Não foi possível carregar o dashboard</p>

  const estados = Object.entries(data.porEstado).map(([name, value]) => ({ name, value }))
  const culturas = Object.entries(data.porCultivo).map(([name, value]) => ({ name, value }))
  const solo = [
    { name: 'Agricultável', value: data.usoSolo.agriculturavel },
    { name: 'Vegetação', value: data.usoSolo.vegetacao },
  ]

  return (
    <div
      className="relative min-h-screen bg-cover bg-center py-24 px-16 "
      style={{ backgroundImage: `url('/background/agro-bg.png')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <main className="relative max-w-7xl mx-auto p-8 space-y-8 text-gray-900">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-6">
          Dashboard
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/proposals/new')}
            className="bg-serasa-pink text-white font-bold py-2 px-6 rounded shadow-lg hover:bg-pink-700 transition"
          >
            Nova Proposta
          </button>

          <button
            onClick={() => router.push('/proposals')}
            className="bg-white border border-serasa-pink text-serasa-pink font-bold py-2 px-6 rounded shadow-lg hover:bg-serasa-pink hover:text-white transition"
          >
            Propostas
          </button>
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <FaMapMarkedAlt className="text-5xl text-serasa-pink" />
            <div>
              <h3 className="text-sm uppercase text-gray-600">Fazendas</h3>
              <p className="text-3xl font-bold">{data.totalFazendas}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaTractor className="text-5xl text-serasa-pink" />
            <div>
              <h3 className="text-sm uppercase text-gray-600">Propostas</h3>
              <p className="text-3xl font-bold">{data.totalPropostas}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaSeedling className="text-5xl text-serasa-pink" />
            <div>
              <h3 className="text-sm uppercase text-gray-600">Hectares</h3>
              <p className="text-3xl font-bold">{data.totalHectares} ha</p>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Por Estado', data: estados },
            { title: 'Por Cultura', data: culturas },
            { title: 'Uso do Solo', data: solo }
          ].map(({ title, data }, idx) => (
            <div key={idx} className="text-center">
              <h4 className="font-semibold text-xl mb-6 text-gray-700">{title}</h4>
              <PieChart width={250} height={250}>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
