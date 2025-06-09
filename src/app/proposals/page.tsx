'use client'

import { useRouter } from 'next/navigation'
import { useProposals } from '../hooks/useProposal'
import { removeProposal } from '../services/proposalsService'

export default function ProposalsPage() {
  const router = useRouter()
  const { proposals, loading, refetch } = useProposals()

  if (loading) {
    return <p>Carregando propostas...</p>
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await removeProposal(id)

      if(result.status === 204){
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-serasa-pink mb-4">Propostas Cadastradas</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-serasa-gray text-left">
            <th className="p-3">Produtor</th>
            <th className="p-3">Fazenda</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Cultivo</th>
            <th className="p-3">Valor</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.nomeProdutor}</td>
              <td className="p-3">{p.nomeFazenda}</td>
              <td className="p-3">{p.estado}</td>
              <td className="p-3">{p.tipoCultivo}</td>
              <td className="p-3">R$ {p.valorProposta.toFixed(2)}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => router.push(`/proposals/${p.id}/edit`)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
