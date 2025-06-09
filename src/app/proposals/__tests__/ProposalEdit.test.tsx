import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as proposalsService from '../../services/proposalsService'
import EditProposalPage from '../[id]/edit/page'
import { AxiosHeaders, AxiosResponse } from 'axios'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '123' })), 
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}))

jest.mock('../../components/organisms/Selector', () => ({ value, onChange }: any) => (
  <select
    data-testid="cultivo-selector"
    multiple
    value={value}
    onChange={e =>
      onChange(Array.from(e.target.selectedOptions, option => option.value))
    }
  >
    <option value="Soja">Soja</option>
    <option value="Milho">Milho</option>
  </select>
))

const fakeProposal = {
  nomeProdutor: 'João',
  cpf: '12345678900',
  nomeFazenda: 'Fazenda Boa',
  cidade: 'São Paulo',
  estado: 'SP',
  areaAgricultavel: 100,
  areaVegetacao: 50,
  tipoCultivo: ['Soja', 'Milho'],
  valorProposta: 15000,
}

const fakeProposalResponse: AxiosResponse<typeof fakeProposal> = {
  data: fakeProposal,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
  },
}

const fakeUpdateResponse: AxiosResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: new AxiosHeaders(),
  },
}

describe('EditProposalPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(proposalsService, 'getProposal').mockResolvedValue(fakeProposalResponse)
    jest.spyOn(proposalsService, 'updateProposal').mockResolvedValue(fakeUpdateResponse)
    mockPush.mockClear()
  })

  it('carrega os dados da proposta e preenche o formulário', async () => {
    render(<EditProposalPage />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Produtor/i)).toHaveValue(fakeProposal.nomeProdutor)
      expect(screen.getByLabelText(/CPF/i)).toHaveValue(fakeProposal.cpf)
      expect(screen.getByLabelText(/Nome da Fazenda/i)).toHaveValue(fakeProposal.nomeFazenda)
      expect(screen.getByLabelText(/Cidade/i)).toHaveValue(fakeProposal.cidade)
      expect(screen.getByLabelText(/Estado/i)).toHaveValue(fakeProposal.estado)
      expect(screen.getByLabelText(/Área Agricultável/i)).toHaveValue(fakeProposal.areaAgricultavel.toString())
      expect(screen.getByLabelText(/Área de Vegetação/i)).toHaveValue(fakeProposal.areaVegetacao.toString())
      expect(screen.getByLabelText(/Valor da Proposta/i)).toHaveValue(fakeProposal.valorProposta.toString())
    })

    const cultivoSelector = screen.getByTestId('cultivo-selector') as HTMLSelectElement
    expect(Array.from(cultivoSelector.selectedOptions).map(o => o.value)).toEqual(fakeProposal.tipoCultivo)
  })

  it('envia o formulário atualizado e navega para /proposals', async () => {
    render(<EditProposalPage />)

    await waitFor(() => screen.getByLabelText(/Nome do Produtor/i))

    const nomeProdutorInput = screen.getByLabelText(/Nome do Produtor/i)
  
    await userEvent.clear(nomeProdutorInput)
    await userEvent.type(nomeProdutorInput, 'Maria')

    const cultivoSelector = screen.getByTestId('cultivo-selector') as HTMLSelectElement

    const options = cultivoSelector.options
    for (let i = 0; i < options.length; i++) {
      options[i].selected = ['Soja', 'Milho'].includes(options[i].value)
    }
    fireEvent.change(cultivoSelector)

    userEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }))

    await waitFor(() => {
        expect(proposalsService.updateProposal).toHaveBeenCalledWith(123, expect.objectContaining({
          nomeProdutor: 'Maria',
        }))
        expect(mockPush).toHaveBeenCalledWith('/proposals')
      })
  })

  it('exibe alerta se update falhar', async () => {
    jest.spyOn(proposalsService, 'updateProposal').mockResolvedValueOnce({
      data: {},
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    })

    window.alert = jest.fn()

    render(<EditProposalPage />)

    await waitFor(() => screen.getByLabelText(/Nome do Produtor/i))

    userEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao atualizar proposta')
    })
  })
})
