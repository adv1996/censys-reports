import { IFilter } from "../interfaces/filter.interface"

class FilterEngine<T> {
  private filters: IFilter<T>[]
  
  constructor() {
    this.filters = [] as IFilter<T>[]
  }

  add = (filter: IFilter<T>) => {
    this.filters.push(filter)
  }

  clear = () => {
    this.filters = []
  }

  get = () => {
    return this.filters
  }
}

export default FilterEngine