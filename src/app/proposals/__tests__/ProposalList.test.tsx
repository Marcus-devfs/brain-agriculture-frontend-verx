import { useProposals } from '../../hooks/useProposal'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProposalsPage from '../page'
import { removeProposal } from '../../services/proposalsService'

jest.mock('../../hooks/useProposal')
jest.mock('../../services/proposalsService')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
})

describe('ProposalsPage', () => {
  it('deve renderizar carregamento enquanto busca dados', () => {
    (useProposals as jest.Mock).mockReturnValue({
      loading: true,
      proposals: [],
      refetch: jest.fn(),
    })

    render(<ProposalsPage />)

    expect(screen.getByText(/carregando propostas/i)).toBeInTheDocument()
  })

  it('deve mostrar mensagem e botão quando não há propostas', () => {
    (useProposals as jest.Mock).mockReturnValue({
      loading: false,
      proposals: [],
      refetch: jest.fn(),
    })

    render(<ProposalsPage />)

    expect(screen.getByText(/nenhuma proposta cadastrada/i)).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /cadastrar proposta/i })
    fireEvent.click(button)

    expect(mockPush).toHaveBeenCalledWith('/proposals/new')
  })

  it('deve mostrar tabela de propostas e executar exclusão', async () => {
    const refetchMock = jest.fn()
    const mockProposals = [
      {
        id: 1,
        nomeProdutor: 'João Silva',
        nomeFazenda: 'Fazenda Boa Esperança',
        estado: 'SP',
        tipoCultivo: 'Soja',
        valorProposta: 50000,
      },
    ]

    ;(useProposals as jest.Mock).mockReturnValue({
      loading: false,
      proposals: mockProposals,
      refetch: refetchMock,
    })

    ;(removeProposal as jest.Mock).mockResolvedValue({ status: 204 })
    window.alert = jest.fn()

    render(<ProposalsPage />)

    expect(screen.getByText(/joão silva/i)).toBeInTheDocument()
    expect(screen.getByText(/fazenda boa esperança/i)).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: /excluir/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(removeProposal).toHaveBeenCalledWith(1)
      expect(window.alert).toHaveBeenCalledWith('Proposta excluída com sucesso')
      expect(refetchMock).toHaveBeenCalled()
    })
  })
})
