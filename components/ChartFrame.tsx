import React, { useEffect, useRef, useState } from "react";
import { IChart } from "../interfaces/chart.interface";
interface IProps<T> {
  data: T[]
  chart: (props: IChart<T>) => JSX.Element
}

const ChartFrame = <T extends object>({chart, data}: IProps<T>) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const chartRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize);
      setHeight(event[0].contentBoxSize[0].blockSize);
    });

    // TODO debounce for less lag on resize
    if (chartRef && chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }
  }, [chartRef]);

  const Chart = chart

  return (
    <div className="tw-h-full tw-w-full" ref={chartRef}>
      <Chart width={width} height={height} data={data}/>
    </div>
  )
}

export default ChartFrame