import { IFilter } from "./filter.interface";

export interface IChart<T> {
  width: number
  height: number
  addFilter(filter: IFilter<T>): void
  data: T[]
  filters: IFilter<T>[]
}

export interface IMargin {
  top: number
  bottom: number
  left: number
  right: number
}

export interface IPlot {
  plotWidth: number
  plotHeight: number
}
