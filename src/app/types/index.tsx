export type Proposal = {
    id: number
    nomeProdutor: string
    cpf: string
    nomeFazenda: string
    cidade: string
    estado: string
    areaAgricultavel: number
    areaVegetacao: number
    tipoCultivo: string[]
    valorProposta: number
}

export type NewProposal = {
    nomeProdutor: string
    cpf: string
    nomeFazenda: string
    cidade: string
    estado: string
    areaAgricultavel: number
    areaVegetacao: number
    tipoCultivo: string[]
    valorProposta: number
}