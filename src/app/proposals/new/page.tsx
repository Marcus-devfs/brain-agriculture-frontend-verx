'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CultivoSelector from '@/app/components/organisms/Selector'
import { createProposal } from '@/app/services/proposalsService'
import { useRouter } from 'next/navigation'

const schema = z.object({
  nomeProdutor: z.string().min(1, 'Obrigatório'),
  cpf: z.string().length(11, 'Deve ter 11 dígitos'),
  nomeFazenda: z.string(),
  cidade: z.string(),
  estado: z.string().length(2),
  areaAgricultavel: z.coerce.number().positive(),
  areaVegetacao: z.coerce.number().nonnegative(),
  tipoCultivo: z.array(z.string()).min(1, 'Escolha pelo menos um tipo de cultivo'),
  valorProposta: z.coerce.number().positive(),
})

type FormData = z.infer<typeof schema>

export default function NewProposalPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createProposal(data)
      if(result.status === 201) {
        alert('Proposta criada com sucesso')
        return router.push('/proposals')
      }

      alert('Erro ao criar proposta')
    } catch (error) {
      console.log(error)
      alert('Erro ao criar proposta')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-serasa-pink mb-4">Nova Proposta</h2>
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
              <p className="text-red-500 text-sm mt-1">{errors[field as keyof FormData]?.message as string}</p>
            )}
          </div>
        ))}

        {/* Campo especial para tipoCultivo */}
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
          Enviar Proposta
        </button>
      </form>
    </div>
  )
}
