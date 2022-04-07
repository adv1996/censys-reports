import useChart from "../hooks/useChart"
import { IChart, IMargin } from "../interfaces/chart.interface"
import { ICompleteRiskObject } from "../interfaces/riskObject.interface"
import { getMaxDate, getMinDate } from "../models/utils"
import { timeDay, scaleBand, range, scaleLog } from 'd3'
import { groupBy, mapValues } from 'lodash'
import { IFilter } from "../interfaces/filter.interface"
import { useMemo } from 'react'

interface IBar {
  day: string,
  dateStr: string,
  count: number
}

const ChartBarChart = ({ width, height, data, addFilter, filters }: IChart<ICompleteRiskObject>) => {
  const riskObjects = (data as ICompleteRiskObject[]).filter(d => d.status === 'open')
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
    .domain([Math.max(...dailyData.map(d => d.count)), 1])
    .range([plotHeight, 0])
  
  const xScale = scaleBand()
    .domain(dailyData.map(r => r.day))
    .range([0, plotWidth])
  
  const highlightFilter = useMemo(() => {
    return filters.find((filter) => filter.key === 'first_date')
  }, [filters])

  const calculateFill = (bar: IBar) => {
    if (highlightFilter && highlightFilter.value.includes(bar.dateStr)) {
      return 'white'
    }
    return 'orange'
  }

  const bars = dailyData.map(r => {
    return {
      properties: {
        width: xScale.bandwidth(),
        height: yScale(r.count),
        x: xScale(r.day),
        y: plotHeight - yScale(r.count),
        fill: calculateFill(r),
        stroke: 'black'
      },
      key: r.day,
      date: r.dateStr
    }
  })

  const yAxisLabels = useMemo(() => [1, 30, 300, 3000].map(pos => {
    return {
      y: yScale(pos) || 0,
      label: pos
    }
  }), [yScale])

  const xAxisLabels = range(0, dailyData.length, Math.floor(dailyData.length / 10))

  const selectBar = (date: string) => {
    const filter: IFilter<ICompleteRiskObject> = {
      key: 'first_date',
      value: [date]
    }
    addFilter(filter)
  }

  return (
    <svg height={height} width={width}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {bars.map(bar =>
          <rect
            {...bar.properties}
            key={bar.key}
            className="hover:tw-fill-blue-100 tw-cursor-pointer"
            onClick={() => selectBar(bar.date)}
          />
        )}
        {yAxisLabels.map(pos =>
          <text
            key={pos.label.toString()}
            x={-margin.left + 20}
            y={plotHeight - pos.y}
            textAnchor="right"
            fontSize="10px"
            fill="white"
          >
            {pos.label}
          </text>)}
        {xAxisLabels.map(r => {
          return <text
            key={`t-${r}`}
            x={xScale(dailyData[r].day)}
            y={plotHeight + 10}
            fontSize="8px"
            textAnchor="middle"
            fill="white"
          >
            { dailyData[r].dateStr }
          </text>
        })}
      </g>
    </svg>
  )
}

export default ChartBarChart
