import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CultivoSelector from '../Selector'

describe('CultivoSelector', () => {
  it('renderiza com valores iniciais e permite adicionar novo cultivo', async () => {
    const onChange = jest.fn()
    const initialValues = ['Soja']

    render(<CultivoSelector value={initialValues} onChange={onChange} />)

    expect(screen.getByText('Soja')).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'Milho{Enter}')

    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['Soja', 'Milho']))
  })
})
