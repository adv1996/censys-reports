import { useState } from "react"
import { IFilter } from "../interfaces/filter.interface"
import { uniq } from 'lodash'

const useFilterEngine = <T>() => {
  const [filters, setFilters]  = useState([] as IFilter<T>[])
  
  const addFilterValue = (filter: IFilter<T>) => {
    const filterIndex = filters.findIndex((existingFilter) => existingFilter.key === filter.key)
    if (filterIndex >= 0) {
      // might need to deep clone this....
      const filtersCopy = [...filters]
      filtersCopy[filterIndex].value = uniq([...filtersCopy[filterIndex].value, ...filter.value])
      setFilters(filtersCopy)
      return filtersCopy
    }
    return []
  }

  const addFilter = (filter: IFilter<T>) => {
    if (filters.map(filter => filter.key).includes(filter.key)) {
      return addFilterValue(filter)
    }
    const updatedFilters = [...filters, filter]
    setFilters(updatedFilters)

    return updatedFilters
  }

  const clearFilters = () => {
    setFilters([])
  }

  return {
    addFilter,
    clearFilters,
    filters
  }
}

export default useFilterEngine