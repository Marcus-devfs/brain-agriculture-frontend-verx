'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { getDashboardData } from './services/dashboardService'

const COLORS = ['#F2008A', '#FFC0CB', '#FF69B4', '#F2F2F2']

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

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

  console.log('data: ', data)

  if (loading) return <p>Carregando...</p>
  if (!data) return <p>Não foi possível carregar o dashboard</p>

  const estados = Object.entries(data.porEstado).map(([name, value]) => ({ name, value }))
  const culturas = Object.entries(data.porCultivo).map(([name, value]) => ({ name, value }))
  const solo = [
    { name: 'Agricultável', value: data.usoSolo.agriculturavel },
    { name: 'Vegetação', value: data.usoSolo.vegetacao },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-serasa-pink">Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Fazendas</h3>
          <p className="text-3xl font-bold text-serasa-pink">{data.totalFazendas}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Propostas</h3>
          <p className="text-3xl font-bold text-serasa-pink">{data.totalPropostas}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Hectares Totais</h3>
          <p className="text-3xl font-bold text-serasa-pink">{data.totalHectares} ha</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ title: 'Por Estado', data: estados }, { title: 'Por Cultura', data: culturas }, { title: 'Uso do Solo', data: solo }].map(({ title, data }, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow text-center">
            <h4 className="font-semibold mb-4">{title}</h4>
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
    </div>
  )
}
