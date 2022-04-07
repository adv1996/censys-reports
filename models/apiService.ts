import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/' : 'https://censys-reports.vercel.app/api'

export interface ApiResponse<T> {
  errorMessage?: string
  responseCode?: string
  data?: T
}

class ApiService<T> {
  private entitySlug: string

  constructor(entitySlug: string) {
    this.entitySlug = entitySlug
  }

  getList = async (params = ''): Promise<ApiResponse<T[]>> => {
    try {
      const response = await axios.get(`${BASE_URL}${this.entitySlug}${params}`)
      return response
    } catch (err) {
      return {
        errorMessage: err as string,
        responseCode: '500',
        data: []
      }
    }
  }
}

export default ApiService
