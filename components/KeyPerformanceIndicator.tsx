interface IProps {
  metric: number
  label: string
}

const KeyPerformanceIndicator = ({ metric = 0, label = 'Open Risks' }: IProps) => {
  return (
    <div className="tw-flex tw-flex-col tw-py-8">
      <h1 className="tw-text-4xl tw-font-bold tw-text-center">{metric}</h1>
      <h6 className="tw-text-center">{label}</h6>
    </div>
  )
}

export default KeyPerformanceIndicator
