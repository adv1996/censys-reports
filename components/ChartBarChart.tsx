import useChart from "../hooks/useChart"
import { IChart, IMargin } from "../interfaces/chart.interface"
import { ICompleteRiskObject } from "../interfaces/riskObject.interface"
import { getMaxDate, getMinDate } from "../models/utils"
import { timeDay, scaleBand, range, scaleLog } from 'd3'
import { groupBy, mapValues } from 'lodash'

interface IBar {
  day: string,
  dateStr: string,
  count: number
}

const ChartBarChart = ({ width, height, data }: IChart<ICompleteRiskObject>) => {
  const riskObjects = data as ICompleteRiskObject[]
  const timeHorizon = [getMinDate(riskObjects), getMaxDate(riskObjects)]

  const margin: IMargin = {
    top: 25,
    bottom: 25,
    left: 75,
    right: 25
  }
  
  const { plotWidth, plotHeight } = useChart(width, height, margin)
  const dateGroups = mapValues(groupBy(riskObjects, 'first_date'), (d: any) => d.length)
  
  const dailyData: IBar[] = range(timeDay.count(timeHorizon[0], timeHorizon[1])).map(r => {
    const currentDate = new Date(timeHorizon[0])
    currentDate.setDate(currentDate.getDate() + r)
    const dateStr = currentDate.toISOString().split('T')[0]
    return {
      day: r.toString(),
      dateStr,
      count: dateStr in dateGroups ? dateGroups[dateStr] : 1
    }
  })
  
  const yScale = scaleLog()
    .domain([Math.max(...dailyData.map(d => d.count)), Math.min(...dailyData.map(d => d.count))])
    .range([plotHeight, 0])
  
  const xScale = scaleBand()
    .domain(dailyData.map(r => r.day))
    .range([0, plotWidth])
  
  const bars = dailyData.map(r => {
    return {
      width: xScale.bandwidth(),
      height: yScale(r.count),
      x: xScale(r.day),
      y: plotHeight - yScale(r.count),
      key: r.day,
      stroke: 'white'
    }
  })

  const yAxisLabels = [1, 10, 100, 1000, 10000]

  const xAxisLabels = range(0, dailyData.length, Math.floor(dailyData.length / 10))

  return (
    <svg height={height} width={width}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {bars.map(bar => <rect {...bar} key={bar.key} />)}
        {yScale(1) && yAxisLabels.map(label =>
          <text
            key={label.toString()}
            x={-margin.left + 20}
            y={plotHeight - yScale(label)}
            textAnchor="right"
            fontSize="10px"
          >
            {label}
          </text>)}
        {xAxisLabels.map(r => {
          return <text
            key={`t-${r}`}
            x={xScale(dailyData[r].day)}
            y={plotHeight + 10}
            fontSize="8px"
            textAnchor="middle"
          >
            { dailyData[r].dateStr }
          </text>
        })}
      </g>
    </svg>
  )
}

export default ChartBarChart
