import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as proposalsService from '@/app/services/proposalsService'
import NewProposalPage from '../new/page'
import * as nextNavigation from 'next/navigation'
import { AxiosHeaders } from 'axios'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

jest.mock('@/app/components/organisms/Selector', () => ({ value, onChange }: any) => (
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


const mockAxiosResponse = {
    status: 201,
    statusText: 'Created',
    headers: {},
    config: {
        headers: new AxiosHeaders(),
      },
    data: {},
}

const mockAxiosErrorResponse = {
    status: 500,
    statusText: 'Internal Server Error',
    headers: {},
    config: {
        headers: new AxiosHeaders(),
      },
    data: {},
}

describe('NewProposalPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('envia o formulário com dados válidos e navega para /proposals', async () => {
        jest.spyOn(proposalsService, 'createProposal').mockResolvedValue(mockAxiosResponse)
        render(<NewProposalPage />)

        await userEvent.type(screen.getByLabelText(/Nome do Produtor/i), 'Maria')
        await userEvent.type(screen.getByLabelText(/CPF/i), '12345678900')
        await userEvent.type(screen.getByLabelText(/Nome da Fazenda/i), 'Fazenda Nova')
        await userEvent.type(screen.getByLabelText(/Cidade/i), 'Campinas')
        await userEvent.type(screen.getByLabelText(/Estado/i), 'SP')
        await userEvent.type(screen.getByLabelText(/Área Agricultável/i), '120')
        await userEvent.type(screen.getByLabelText(/Área de Vegetação/i), '30')
        await userEvent.type(screen.getByLabelText(/Valor da Proposta/i), '20000')

        const cultivoSelector = screen.getByTestId('cultivo-selector') as HTMLSelectElement
        const options = cultivoSelector.options
        for (let i = 0; i < options.length; i++) {
            options[i].selected = ['Soja', 'Milho'].includes(options[i].value)
        }
        fireEvent.change(cultivoSelector)

        await userEvent.click(screen.getByRole('button', { name: /Enviar Proposta/i }))

        await waitFor(() => {
            expect(proposalsService.createProposal).toHaveBeenCalledWith({
                nomeProdutor: 'Maria',
                cpf: '12345678900',
                nomeFazenda: 'Fazenda Nova',
                cidade: 'Campinas',
                estado: 'SP',
                areaAgricultavel: 120,
                areaVegetacao: 30,
                tipoCultivo: ['Soja', 'Milho'],
                valorProposta: 20000,
            })
            expect(mockPush).toHaveBeenCalledWith('/proposals')
        })
    })

    it('exibe alerta se criação falhar', async () => {
        jest.spyOn(proposalsService, 'createProposal').mockResolvedValue(mockAxiosErrorResponse)

        window.alert = jest.fn()

        render(<NewProposalPage />)

        await userEvent.type(screen.getByLabelText(/Nome do Produtor/i), 'Maria')
        await userEvent.type(screen.getByLabelText(/CPF/i), '12345678900')
        await userEvent.type(screen.getByLabelText(/Nome da Fazenda/i), 'Fazenda Nova')
        await userEvent.type(screen.getByLabelText(/Cidade/i), 'Campinas')
        await userEvent.type(screen.getByLabelText(/Estado/i), 'SP')
        await userEvent.type(screen.getByLabelText(/Área Agricultável/i), '120')
        await userEvent.type(screen.getByLabelText(/Área de Vegetação/i), '30')
        await userEvent.type(screen.getByLabelText(/Valor da Proposta/i), '20000')

        const cultivoSelector = screen.getByTestId('cultivo-selector') as HTMLSelectElement
        const options = cultivoSelector.options
        for (let i = 0; i < options.length; i++) {
            options[i].selected = ['Soja', 'Milho'].includes(options[i].value)
        }
        fireEvent.change(cultivoSelector)

        await userEvent.click(screen.getByRole('button', { name: /Enviar Proposta/i }))

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Erro ao criar proposta')
        })
    })
})
