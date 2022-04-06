export interface IChart<T> {
  width: number
  height: number
  data: T[]
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
