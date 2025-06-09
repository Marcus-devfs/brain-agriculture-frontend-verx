'use client'

import { useRouter } from 'next/navigation'
import { useProposals } from '../hooks/useProposal'
import { removeProposal } from '../services/proposalsService'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState } from 'react'


export default function ProposalsPage() {
  const router = useRouter()
  const { proposals, loading, refetch } = useProposals()
  const [filter, setFilter] = useState('')

  if (loading) {
    return <p>Carregando propostas...</p>
  }

  function parseCultivos(cultivoString: string | string[]): string[] {
    if (typeof cultivoString !== 'string') return []

    return cultivoString
      .replace(/[{}"]/g, '')   // Remove { }, " 
      .split(',')
      .map(c => c.trim())      // Remove espaços em branco
      .filter(Boolean)         // Remove vazios
  }


  const handleDelete = async (id: number) => {
    try {
      const result = await removeProposal(id)

      if (result.status === 204) {
        alert('Proposta excluída com sucesso')
        return await refetch()
      }

      alert('Erro ao excluir proposta')
    } catch (error) {
      console.log(error)
      alert('Erro ao excluir proposta')
    }
  }

  if (proposals?.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-serasa-pink mb-4">Nenhuma proposta cadastrada</h2>
        <button onClick={() => router.push('/proposals/new')} className="bg-serasa-pink text-white font-bold py-2 px-4 rounded">
          Cadastrar Proposta
        </button>
      </div>
    )
  }

  const filteredProposals = proposals?.filter((p) =>
    p.nomeProdutor.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="py-24 px-16 ">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Propostas Cadastradas</h2>
        <button
          onClick={() => router.push('/proposals/new')}
          className="bg-serasa-pink text-white font-bold py-2 px-4 rounded"
        >
          Nova Proposta
        </button>
      </div>

      <input
        type="text"
        placeholder="Filtrar por nome do produtor"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 rounded bg-white"
      />

      <div className="grid gap-4">
        {filteredProposals?.length === 0 ? (
          <p>Nenhuma proposta encontrada.</p>
        ) : (proposals.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-serasa-pink">{p.nomeProdutor}</h3>
                <p className="text-sm text-gray-600">{p.nomeFazenda} - {p.estado}</p>
                <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-1">
                  {parseCultivos(p.tipoCultivo).map((cultivo, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                      {cultivo}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium mt-1">R$ {p.valorProposta.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/proposals/${p.id}/edit`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  <FaEdit size={25} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Excluir"
                >
                  <FaTrash size={25} />
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}
