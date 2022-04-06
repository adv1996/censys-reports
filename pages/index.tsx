import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import entityService from '../models/entityService'
import { IRiskObject, ICompleteRiskObject } from '../interfaces/riskObject.interface'
import { IRiskMapping } from '../interfaces/riskMapping.interface'
import { calculateOpenRisks, weaveSeverity, calculateSeverityByTime, calculateAverageRiskPerDay, evaluateFilters } from '../models/utils'
import KeyPerformanceIndicator from '../components/KeyPerformanceIndicator'
import ChartSunBurst from '../components/ChartSunBurst'
import ChartFrame from '../components/ChartFrame'
import ChartBarChart from '../components/ChartBarChart'
import ChartSwarm from '../components/ChartSwarm'
import FilterEngine from '../models/filterEngine'

const Home: NextPage = () => {
  const [riskObjects, setRiskObjects] = useState([] as ICompleteRiskObject[])
  const [riskMapping, setRiskMapping] = useState([] as IRiskMapping[])
  const [filteredRiskObjects, setFilteredRiskObjects] = useState([] as ICompleteRiskObject[])
  
  // TODO move this somewhere else
  const filterEngine = useRef(new FilterEngine<ICompleteRiskObject>())

  const clearFilters = () => {
    filterEngine.current.clear()
    setFilteredRiskObjects(riskObjects)
  }

  const addFilter = () => {
    
    filterEngine.current.add({ key: 'severity', value: ['critical'] })
    setFilteredRiskObjects(evaluateFilters(riskObjects, filterEngine.current.get()))
  }
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
      setFilteredRiskObjects(riskObjectsSeverity)
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
        <div className='tw-h-8 tw-bg-black tw-flex tw-flex-row tw-justify-between tw-px-8 tw-space-x-8'>
          <div className='tw-flex tw-flex-row'>
            <h3 className="tw-text-white tw-self-center">Censys Risk Report</h3>
          </div>          
          <button onClick={ clearFilters } className="tw-text-white">Clear</button>
        </div>
        <div className={[styles.container, "tw-grid tw-grid-rows-6 tw-grid-cols-6 tw-gap-4 tw-p-4"].join(' ')}>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateOpenRisks(filteredRiskObjects)} label="Open Risks"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateSeverityByTime(filteredRiskObjects)} label="Critical Risks Discovered Last Month"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-black'>
            <KeyPerformanceIndicator metric={calculateAverageRiskPerDay(filteredRiskObjects)} label="Average Risks Discovered Per Day"/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-black tw-col-span-3'>
            <ChartFrame chart={ChartSunBurst} data={riskMapping}/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-black tw-col-span-3'>
            {filteredRiskObjects.length > 1 && <ChartFrame chart={ChartSwarm} data={filteredRiskObjects} />}
          </div>
          <div className='tw-row-span-1 tw-border tw-border-black tw-col-span-6'>
            <ChartFrame chart={ChartBarChart} data={filteredRiskObjects}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
