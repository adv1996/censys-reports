import { IMargin, IPlot } from "../interfaces/chart.interface";
import { useMemo } from 'react'

const useChart = (width: number, height: number, margin: IMargin): IPlot => {
  const plotWidth = useMemo(() => {
    return width - margin.left - margin.right
  }, [width, margin.left, margin.right])

  const plotHeight = useMemo(() => {
    return height - margin.top - margin.bottom
  }, [height, margin.bottom, margin.top])
  
  return {
    plotWidth,
    plotHeight
  }
}

export default useChart