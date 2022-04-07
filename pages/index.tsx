import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useMemo } from 'react'
import entityService from '../models/entityService'
import { IRiskObject, ICompleteRiskObject } from '../interfaces/riskObject.interface'
import { IRiskMapping } from '../interfaces/riskMapping.interface'
import { calculateOpenRisks, weaveSeverity, calculateSeverityByTime, calculateAverageRiskPerDay, evaluateFilters } from '../models/utils'
import KeyPerformanceIndicator from '../components/KeyPerformanceIndicator'
import ChartSunBurst from '../components/ChartSunBurst'
import ChartFrame from '../components/ChartFrame'
import ChartBarChart from '../components/ChartBarChart'
import ChartSwarm from '../components/ChartSwarm'
import { IFilter } from '../interfaces/filter.interface'
import useFilterEngine from '../hooks/useFilterEngine'
import { keyBy, mapValues } from 'lodash'

const Home: NextPage = () => {
  const [riskObjects, setRiskObjects] = useState([] as ICompleteRiskObject[])
  const [riskMapping, setRiskMapping] = useState([] as IRiskMapping[])
  const [filteredRiskObjects, setFilteredRiskObjects] = useState([] as ICompleteRiskObject[])
  
  // TODO move this somewhere else
  const { addFilter, clearFilters, filters} = useFilterEngine<ICompleteRiskObject>()

  const clearFiltersRisk = () => {
    clearFilters()
    setFilteredRiskObjects(riskObjects)
  }

  const addFilterRisk = (filter: IFilter<ICompleteRiskObject>) => {
    const newFilters = addFilter(filter)
    console.log(newFilters)
    setFilteredRiskObjects(evaluateFilters(riskObjects, newFilters))
  }

  const severityMap = useMemo(() => {
    return mapValues(keyBy(riskMapping, 'name'), risk => risk.index.toString())
  }, [riskMapping])

  const severityIndexMap = useMemo(() => {
    return mapValues(keyBy(riskMapping, 'index'), risk => risk.name)
  }, [riskMapping])

  const addFilterMap = (filter: IFilter<IRiskMapping>) => {
    const newFilter = {key: 'type_id', value: filter.value.map(value => severityMap[value])} as IFilter<ICompleteRiskObject>
    addFilterRisk(newFilter)
  }

  const riskMapFilters: IFilter<IRiskMapping>[] = useMemo(() => {
    return filters.filter(filter => filter.key === 'type_id').map(filter => {
      return {
        key: 'name',
        value: filter.value.map(value => severityIndexMap[parseInt(value)])
      }
    })
  }, [filters, severityIndexMap])
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
      <main className="tw-bg-black tw-text-white">
        <div className='tw-h-8 tw-bg-[#ffa558] tw-flex tw-flex-row tw-justify-between tw-px-8 tw-space-x-8'>
          <div className='tw-flex tw-flex-row'>
            <h3 className="tw-text-black tw-self-center">Censys Risk Report</h3>
          </div>          
          <button onClick={ clearFiltersRisk } className="tw-text-black">
            Clear Filters <span className="tw-p-1 tw-rounded tw-bg-black tw-text-white tw-text-xs tw-h-1 tw-w-1">{filters.length}</span>
          </button>
        </div>
        <div className={[styles.container, "tw-grid tw-grid-rows-6 tw-grid-cols-6 tw-gap-4 tw-p-4"].join(' ')}>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-white tw-rounded'>
            <KeyPerformanceIndicator metric={calculateOpenRisks(filteredRiskObjects)} label="Open Risks"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-white tw-rounded'>
            <KeyPerformanceIndicator metric={calculateSeverityByTime(filteredRiskObjects)} label="Critical Risks Discovered Last Month"/>
          </div>
          <div className='tw-row-span-1 tw-col-span-2 tw-border tw-border-white tw-rounded'>
            <KeyPerformanceIndicator metric={calculateAverageRiskPerDay(filteredRiskObjects)} label="Risks Discovered Per Day"/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-white tw-col-span-3 tw-flex tw-flex-col tw-rounded'>
            <h3 className="tw-px-2 tw-text-sm tw-py-1" >Hierarchical Risk Mapping</h3>
            <ChartFrame chart={ChartSunBurst} data={riskMapping} addFilter={addFilterMap} filters={riskMapFilters}/>
          </div>
          <div className='tw-row-span-4 tw-border tw-border-white tw-col-span-3 tw-flex tw-flex-col tw-rounded'>
            <h3 className="tw-px-2 tw-text-sm tw-py-1" >Granular Risk Swarm</h3>
            {filteredRiskObjects.length > 1 && <ChartFrame chart={ChartSwarm} data={filteredRiskObjects} addFilter={addFilterRisk}  filters={filters}/>}
          </div>
          <div className='tw-row-span-1 tw-border tw-border-white tw-col-span-6 tw-flex tw-flex-col tw-rounded'>
            <h3 className="tw-px-2 tw-text-sm" >Open Risks Over Time (Log Scale)</h3>
            <ChartFrame chart={ChartBarChart} data={riskObjects} addFilter={addFilterRisk} filters={filters}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
