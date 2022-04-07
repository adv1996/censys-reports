import useChart from "../hooks/useChart"
import { IChart, IMargin } from "../interfaces/chart.interface"
import { arc, scaleBand, scaleLinear, range, ScaleBand } from 'd3'
import { useMemo, useState } from 'react'
import { INode, IRiskMapping } from "../interfaces/riskMapping.interface"
import { riskTypeRelations } from "../models/utils"

interface IArc {
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
  id: string
}

const buildTreeMap = (relationshipData: INode[]) => {
  let tree: INode[] = []
  let lookupMap: Record<string, INode> = {}
  relationshipData.forEach((node) => {
    lookupMap[node.id] = node
    lookupMap[node.id].nodes = []
  })

  relationshipData.forEach((node) => {
    if (node.parent !== null && node.parent !== '') {
      lookupMap[node.parent].nodes.push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}

const traverseTree = (tree: INode[], yScale: ScaleBand<string>, level = 0, startAngle=-Math.PI, endAngle=Math.PI): IArc[] => {
  if (tree.length == 0) return []
  const xScale = scaleLinear().domain([0, tree.length]).range([startAngle, endAngle])
  return tree.map((node, nodeIndex) => {
    return [{
      startAngle: xScale(nodeIndex),
      endAngle: xScale(nodeIndex + 1),
      innerRadius: yScale(level.toString()) || 0,
      outerRadius: (yScale(level.toString()) || 0) + yScale.bandwidth(),
      id: node.id
    }, ...traverseTree(node.nodes, yScale, level + 1, xScale(nodeIndex), xScale(nodeIndex + 1))].flat()
  }).flat()
}

const ChartSunBurst = ({ width, height, data, addFilter }: IChart<IRiskMapping>) => {
  const [label, setLabel] = useState('Hierarchy Map')
  const LEVELS = 4
  const PAD_ANGLE = 0

  const margin: IMargin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  }

  const { plotWidth, plotHeight } = useChart(width, height, margin)

  // chart utilities
  const pathGenerator = arc().padAngle(PAD_ANGLE)
  const centerX = useMemo(() => plotWidth / 2, [plotWidth])
  const centerY = useMemo(() => plotHeight / 2, [plotHeight])

  const radius = useMemo(() => {
    return Math.min(centerX, centerY)
  }, [centerX, centerY])

  const yScale = scaleBand()
    .domain(range(LEVELS).map(col => col.toString()))
    .rangeRound([radius * .25, radius]) // 50 is the minimum inner radius
    .paddingInner(0.1)

  const relationData = riskTypeRelations(data)
  const tree = buildTreeMap(relationData)
  const slices = traverseTree(tree, yScale)

  const centerArc = useMemo(() => {
    const params = {
      startAngle: -Math.PI,
      endAngle: Math.PI,
      innerRadius: 0,
      outerRadius: radius * .25 - 5
    }
    return pathGenerator(params)?.toString()
  }, [pathGenerator, radius])

  const selectSlice = (slice: IArc) => {
    // map id to tree map and find names to add filter
    addFilter({key: 'recommended_severity', value: ['high']})
  }

  return (
    <div className="tw-relative">
      <svg height={height} width={width}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g transform={`translate(${centerX}, ${centerY})`}>
            {slices.map(slice =>
              <path
                key={slice.id}
                d={pathGenerator(slice)?.toString()}
                fill="white"
                stroke="black"
                onMouseOver={() => setLabel(slice.id)}
                onMouseOut={() => setLabel('Hierarchy')}
                onClick={() => selectSlice(slice)}
              />)}
            {
              <g>
                <path d={centerArc} fill="black" />
              </g>
            }
          </g>
        </g>
      </svg>
      {/* // TODO CENTER THIS */}
      <div className="tw-absolute" style={{ top: `${centerY - margin.top / 2}px`, left: `${centerX - margin.left / 2}px` }}>
        <div className="tw-flex tw-flex-row tw-w-6">
          <p className="tw-text-white tw-text-sm">{ label }</p>
        </div>
      </div>
    </div>
  )
}

export default ChartSunBurst