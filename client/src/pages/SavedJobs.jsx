import React, { useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import {getSavedJobs} from '../actions/JobActions'
import {useDispatch, useSelector} from 'react-redux'
import {Loader} from '../components/Loader'
import { SaveJobCard } from '../components/SaveJobCard'
import {Link} from 'react-router-dom'
import { FiBookmark, FiBriefcase, FiCompass } from 'react-icons/fi'

export const SavedJobs = () => {

  const dispatch = useDispatch(0)

  const {savedJobs, saveJobLoading, loading} = useSelector(state => state.job)

  useEffect(()=>{
    dispatch(getSavedJobs())
  },[saveJobLoading])

  const totalSavedJobs = savedJobs.length
  const latestSavedJob = totalSavedJobs > 0 ? savedJobs[savedJobs.length - 1] : null
  
  return (
    <>

<MetaData title="Saved Jobs" />
      <div className='saved-jobs-shell min-h-screen pt-14 text-white'>

            {loading ? <Loader/> :
              
              <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-3 pb-24 pt-8 md:px-8'>
                  <section className='saved-jobs-hero'>
                    <div className='saved-jobs-hero-copy'>
                      <span className='saved-jobs-kicker'>
                        <FiBookmark />
                        Curated for later
                      </span>
                      <h1 className='saved-jobs-title'>Saved jobs, redesigned for quick action.</h1>
                      <p className='saved-jobs-subtitle'>
                        Shortlist opportunities, review the latest role details, and jump back into applications without losing your place.
                      </p>
                    </div>

                    <div className='saved-jobs-stats'>
                      <div className='saved-jobs-stat-card'>
                        <span className='saved-jobs-stat-icon'><FiBookmark /></span>
                        <div>
                          <p className='saved-jobs-stat-value'>{totalSavedJobs}</p>
                          <p className='saved-jobs-stat-label'>Jobs saved</p>
                        </div>
                      </div>
                      <div className='saved-jobs-stat-card'>
                        <span className='saved-jobs-stat-icon'><FiBriefcase /></span>
                        <div>
                          <p className='saved-jobs-stat-value'>{latestSavedJob?.employmentType || 'Ready'}</p>
                          <p className='saved-jobs-stat-label'>Latest category</p>
                        </div>
                      </div>
                      <div className='saved-jobs-stat-card'>
                        <span className='saved-jobs-stat-icon'><FiCompass /></span>
                        <div>
                          <p className='saved-jobs-stat-value'>{latestSavedJob?.location || 'Explore'}</p>
                          <p className='saved-jobs-stat-label'>Recent location</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {savedJobs.length !== 0 && (
                    <section className='flex items-center justify-between gap-3 border-b border-white/10 pb-4'>
                      <div>
                        <p className='text-2xl font-semibold md:text-3xl'>Your shortlist</p>
                        <p className='text-sm text-slate-300 md:text-base'>Newest saves stay at the top so you can continue from where you left off.</p>
                      </div>
                      <Link to="/jobs" className='saved-jobs-secondary-cta hidden md:inline-flex'>Find more jobs</Link>
                    </section>
                  )}

                  <div className='flex flex-col gap-5'>
                    {savedJobs.slice().reverse().map((job,i)=>(
                      <SaveJobCard key={i} job={job}/>
                    ))}
                  </div>

                  {savedJobs.length === 0 && 
                    <div className='saved-jobs-empty-state'>
                      <div className='saved-jobs-empty-visual'>
                        <img src="/images/jobEmpty.svg" className='h-48 w-48 md:h-56 md:w-56' alt="No saved jobs" />
                      </div>
                      <div className='max-w-xl text-center'>
                        <p className='text-2xl font-semibold md:text-4xl'>You have not saved any jobs yet.</p>
                        <p className='mt-3 text-sm leading-7 text-slate-300 md:text-base'>
                          Build your shortlist as you browse. Saved roles stay here so you can compare openings and apply when the timing feels right.
                        </p>
                      </div>
                      <Link to="/jobs" className='saved-jobs-primary-cta'>Browse jobs</Link>
                    </div>
                  }

            </div>
            
            }


        </div>
    
    
    </>
  )
}
