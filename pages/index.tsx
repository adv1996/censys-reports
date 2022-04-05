import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Censys Risk Report</title>
        <meta name="description" content="Risk Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='tw-h-8 tw-bg-black'/>
        <div className={[styles.container, "tw-grid tw-grid-rows-6 tw-grid-cols-3 tw-gap-4 tw-p-4"].join(' ')}>
          <div className='tw-row-span-1 tw-col-span-1 tw-border tw-border-black'>
            KPI 1
          </div>
          <div className='tw-row-span-1 tw-col-span-1 tw-border tw-border-black'>
            KPI 2
          </div>
          <div className='tw-row-span-1 tw-col-span-1 tw-border tw-border-black'>
            KPI
          </div>
          <div className='tw-row-span-4 tw-border tw-border-black tw-col-span-3'>
            Hierarchical Granular
          </div>
          <div className='tw-row-span-1 tw-border tw-border-black tw-col-span-3'>
            Timeline Histogram
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
