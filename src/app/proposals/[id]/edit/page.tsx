'use client'

import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { getProposal, updateProposal } from '@/app/services/proposalsService'
import CultivoSelector from '@/app/components/organisms/Selector'

const schema = z.object({
  nomeProdutor: z.string(),
  cpf: z.string(),
  nomeFazenda: z.string(),
  cidade: z.string(),
  estado: z.string(),
  areaAgricultavel: z.coerce.number(),
  areaVegetacao: z.coerce.number(),
  tipoCultivo: z.array(z.string()).min(1, 'Selecione pelo menos um tipo de cultivo'),
  valorProposta: z.coerce.number(),
})

type FormData = z.infer<typeof schema>

export default function EditProposalPage() {
  const { id } = useParams()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const fetchProposal = async () => {
      const result = await getProposal(Number(id))
      const data = result.data
  
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tipoCultivo') {
          if (typeof value === 'string') {
            // Converte '{Soja,Milho}' para ['Soja','Milho']
            const arr = value
              .replace(/^{|}$/g, '')
              .split(',')
              .map((v) => v.trim().replace(/^"|"$/g, ''))
            setValue('tipoCultivo', arr)
          } else if (Array.isArray(value)) {
            setValue('tipoCultivo', value)
          }
        } else {
          setValue(key as keyof FormData, value as string)
        }
      })
    }
    fetchProposal()
  }, [id, setValue])

  const onSubmit = async (data: FormData) => {
    const response = await updateProposal(Number(id), data)
    if (response.status !== 200) {
      alert('Erro ao atualizar proposta')
      return
    }

    alert('Proposta atualizada com sucesso')
    router.push('/proposals')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-serasa-pink mb-4">Editar Proposta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
        {[
          ['nomeProdutor', 'Nome do Produtor'],
          ['cpf', 'CPF'],
          ['nomeFazenda', 'Nome da Fazenda'],
          ['cidade', 'Cidade'],
          ['estado', 'Estado'],
          ['areaAgricultavel', 'Área Agricultável (ha)'],
          ['areaVegetacao', 'Área de Vegetação (ha)'],
          ['valorProposta', 'Valor da Proposta (R$)'],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium mb-1" htmlFor={field}>{label}</label>
            <input
              {...register(field as keyof FormData)}
              id={field}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors[field as keyof FormData] && (
              <p className="text-red-500 text-sm mt-1">
                {(errors[field as keyof FormData]?.message as string) || ''}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1" htmlFor="tipoCultivo">
            Tipo de Cultivo
          </label>
          <Controller
            name="tipoCultivo"
            control={control}
            render={({ field }) => (
              <CultivoSelector value={field.value || []} onChange={field.onChange} />
            )}
          />
          {errors.tipoCultivo && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoCultivo.message}</p>
          )}
        </div>

        <button type="submit" className="bg-serasa-pink text-white px-4 py-2 rounded hover:opacity-90">
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}
