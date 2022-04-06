import ApiService, {ApiResponse} from './apiService'

interface IServiceConfig<T> {
  fetchEntities(params: string): Promise<{entities: T[]; responseCode: string | undefined;}>
}

export default function IService<T>(slug: string): IServiceConfig<T> {
  const service = new ApiService<T>(slug)

  const fetchEntities = async (params = '') => {
    const response = await service.getList(params)

    const entities: T[] = (response as ApiResponse<T[]>).data as T[]

    return {
      entities,
      responseCode: response.responseCode
    }
  }

  return {
    fetchEntities
  }
}