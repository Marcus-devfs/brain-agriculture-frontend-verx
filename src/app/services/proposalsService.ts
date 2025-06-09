import { NewProposal, Proposal } from "../types"
import api from "./api"

export const createProposal = async (data: NewProposal) => {
    try {
        return await api.post('/proposal/create', data)
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}

export const listProposals = async () => {
    try {
        return await api.get('/proposals')
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}

export const updateProposal = async (id: number, data: Proposal) => {
    try {
        return await api.put(`/proposal/update/${id}`, data)
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}

export const removeProposal = async (id: number) => {
    try {
        return await api.delete(`/proposal/delete/${id}`)
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}

export const getProposal = async (id: number) => {
    try {
        return await api.get(`/proposal/${id}`)
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}