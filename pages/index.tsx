import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import entityService from '../models/entityService'
import { IRiskObject, ICompleteRiskObject } from '../interfaces/riskObject.interface'
import { IRiskMapping } from '../interfaces/riskMapping.interface'
import { calculateOpenRisks, weaveSeverity, calculateSeverityByTime, calculateAverageRiskPerDay } from '../models/utils'
import KeyPerformanceIndicator from '../components/KeyPerformanceIndicator'
import ChartSunBurst from '../components/ChartSunBurst'
import ChartFrame from '../components/ChartFrame'
import ChartBarChart from '../components/ChartBarChart'
import ChartSwarm from '../components/ChartSwarm'

const Home: NextPage = () => {
  const [riskObjects, setRiskObjects] = useState([] as ICompleteRiskObject[])
  const [riskMapping, setRiskMapping] = useState([] as IRiskMapping[])
  
  // TODO use some sort of suspense / concurrency library for loading data
  useEffect(() => {
    async function fetchData() {
      const responseRiskObjects = await entityService("riskObjects").fetchEntities("")
      const responseRiskMapping = await entityService("riskMapping").fetchEntities("")

      const riskObjectsSeverity = weaveSeverity(
        responseRiskObjects.entities as IRiskObject[],
        responseRiskMapping.entities as IRiskMapping[]
      )
      setRiskObjects(riskObjectsSeverity);
      setRiskMapping(responseRiskMapping.entities as IRiskMapping[]);
    }
    fetchData();
  }, [])

  return (
    <div>
      <Head>
        <title>Censys Risk Report</title>
        <meta name="description" content="Risk Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='tw-h-8 tw-bg-black'/>
        <div className={[styles.container, "tw-grid tw-grid-rows-6 tw-grid-cols-6 tw-gap-4 tw-p-4"].join(' ')}>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateOpenRisks(riskObjects)} label="Open Risks"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateSeverityByTime(riskObjects)} label="Critical Risks Discovered Last Month"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateAverageRiskPerDay(riskObjects)} label="Average Risks Discovered Per Day"/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-black tw-col-span-3'>
            <ChartFrame chart={ChartSunBurst} data={riskMapping}/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-black tw-col-span-3'>
            {riskObjects.length > 1 && <ChartFrame chart={ChartSwarm} data={riskObjects} />}
          </div>
          <div className='tw-row-span-1 tw-border tw-border-black tw-col-span-6'>
            <ChartFrame chart={ChartBarChart} data={riskObjects}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
