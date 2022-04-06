import { useRef, useMemo } from 'react'
import { IChart, IMargin } from '../interfaces/chart.interface';
import { ICompleteRiskObject } from '../interfaces/riskObject.interface';
import { forceSimulation, forceX, forceY, forceManyBody, forceCollide } from 'd3';
import useChart from '../hooks/useChart';

interface ISimNode {
  x: number;
  y: number;
}

interface ISeverity {
  radius: number
  fill: string
}

type ISeverityNode = ISimNode & ISeverity

const ChartSwarm = ({ width, height, data }: IChart<ICompleteRiskObject>) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const RADIUS = 8

  const severityRadiusMap: Record<string, ISeverity> = {
    'critical': {
      radius: 8,
      fill: 'red'
    },
    'high': {
      radius: 6,
      fill: 'orange'
    },
    'medium': {
      radius: 4,
      fill: 'yellow'
    },
    'low': {
      radius: 2,
      fill: 'blue'
    }
  }
  const nodes = useMemo(() => data.filter(d => d.status === 'open').map((d) => {
    const severityInfo = severityRadiusMap[d.severity]
    return {
      x: 0,
      y: 0,
      radius: severityInfo.radius,
      fill: severityInfo.fill
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }) as ISeverityNode[], [data])

  const margin: IMargin = {
    top: 0,
    bottom: 75,
    left: 25,
    right: 25
  }
  
  const { plotWidth, plotHeight } = useChart(width, height, margin)
  
  const startSimulation = () => {
    if (canvasRef) {
      canvasCtxRef.current = canvasRef && canvasRef.current && canvasRef.current.getContext('2d');
      const ctx = canvasCtxRef.current;

      const ticked = () => {
        ctx!.clearRect(0, 0, plotWidth, plotHeight);
        nodes.forEach((node: ISeverityNode) => {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius - 1, 0, 2 * Math.PI);
          ctx!.stroke();
          ctx!.fillStyle = node.fill;
          ctx!.fill();
        })
      }

      const simulation = forceSimulation(nodes)
        .force('x', forceX().x(() => {
          return plotWidth / 2
        }))
        .force('y', forceY().y(function(d) {
          return plotHeight / 2
        }))
        .force('charge', forceManyBody().strength(2))
        .force('collision', forceCollide().radius((d) => {
          return RADIUS;
        }))
        .on('tick', ticked);
    }
  }
    
  return (
    <div className="tw-flex tw-flex-col tw-justify-center">
      <canvas ref={canvasRef} width={plotWidth} height={plotHeight}/>
      <button onClick={startSimulation}className="tw-bg-slate-200 tw-h-[40px] tw-p-2 tw-border tw-border-black tw-mx-2">Start Simulation</button>
    </div>
  )
}

export default ChartSwarm