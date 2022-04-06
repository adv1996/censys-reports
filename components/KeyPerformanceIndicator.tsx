import React from 'react'

interface IProps {
  metric: number
  label: string
}

const KeyPerformanceIndicator = ({ metric = 0, label = 'Open Risks' }: IProps) => {
  return (
    <div>
      <h6>{`${metric} ${label}`}</h6>
    </div>
  )
}

export default KeyPerformanceIndicator
