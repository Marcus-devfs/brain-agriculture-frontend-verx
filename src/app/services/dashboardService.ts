import api from "./api"

export const getDashboardData = async () => {
    try {
        return await api.get('/dashboard')
    } catch (error: unknown) {
        console.log(error)
        throw error
    }
}