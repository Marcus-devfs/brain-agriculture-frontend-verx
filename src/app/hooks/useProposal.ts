// hooks/useProposals.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { listProposals } from '../services/proposalsService'
import { Proposal } from '../types'



export function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProposals = useCallback(async () => {
        try {
            setLoading(true)
            const response = await listProposals()
            if (response.status !== 200) {
                throw new Error('Erro ao buscar propostas')
            }
            setProposals(response.data)
        } catch (err) {
            console.error('Erro ao buscar propostas', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProposals()
    }, [fetchProposals])

    return { proposals, loading, refetch: fetchProposals }

}
