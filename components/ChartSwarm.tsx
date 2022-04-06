import { useRef, useMemo } from 'react'
import { IChart, IMargin } from '../interfaces/chart.interface';
import { ICompleteRiskObject } from '../interfaces/riskObject.interface';
import { forceSimulation, forceX, forceY, forceManyBody, forceCollide } from 'd3';
import useChart from '../hooks/useChart';

interface INode {
  x: number;
  y: number;
  radius: number;
}

const ChartSwarm = ({ width, height, data }: IChart<ICompleteRiskObject>) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const RADIUS = 3

  const nodes = useMemo(() => data.filter(d => d.status === 'open').map(() => {
    return {
      x: 0,
      y: 0,
      radius: RADIUS
    }
  }) as INode[], [data])

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
        nodes.forEach((node: { x: number; y: number; radius: number; }) => {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius - 1, 0, 2 * Math.PI);
          ctx!.stroke();
          ctx!.fillStyle = 'black';
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