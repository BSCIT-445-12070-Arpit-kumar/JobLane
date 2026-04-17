import React, { useEffect } from 'react'
import {MetaData} from '../components/MetaData'
import {useDispatch, useSelector} from 'react-redux'
import {getAppliedJob} from '../actions/ApplicationActions'
import {Loader} from '../components/Loader'
import { AppliedJobCard } from '../components/AppliedJobCard'
import { Link } from 'react-router-dom'


export const AppliedJobs = () => {

  const {loading, appliedJobs} = useSelector(state => state.application) ;
  const dispatch = useDispatch()


  useEffect(()=>{
    dispatch(getAppliedJob())
  },[])




  return (
    <>
      <MetaData title="Applied Jobs" />
      <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(180deg,_#030712_0%,_#0f172a_100%)] pt-14 md:px-20 px-3 text-white'>
        {loading? 
           <Loader/> :
           <>
             <div className='mx-auto max-w-6xl pb-24 pt-8'>
                <div className='rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
                  <div className='flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between'>
                    <div>
                      <p className='text-sm uppercase tracking-[0.3em] text-cyan-300/80'>Job Seeker Workspace</p>
                      <h1 className='mt-2 text-3xl font-semibold md:text-5xl'>Applied Jobs</h1>
                      <p className='mt-3 text-sm text-white/55 md:text-base'>
                        Track every application, review recruiter updates, and open full details anytime.
                      </p>
                    </div>
                    <div className='rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-white/70'>
                      Total applications: {appliedJobs.length}
                    </div>
                  </div>

                  <div className='mt-6'>
                    <div className='flex flex-col gap-4'>
                      {appliedJobs.slice().reverse().map((app,i)=>(
                        <AppliedJobCard
                          key={i}
                          id={app._id}
                          time={app.createdAt}
                          job={app.job}
                          status={app.status}
                          statusMessage={app.statusMessage}
                        />
                      ))}
                    </div>

                    {appliedJobs.length === 0 && 
                      <div className='pt-10 text-center flex flex-col justify-center items-center'>
                        <div className='rounded-full border border-white/10 bg-white/[0.03] p-6'>
                          <img src="/images/jobEmpty.svg" className='w-52 h-52' alt="" />
                        </div>
                        <p className='md:text-3xl pb-3 pt-6 text-xl '>You don&apos;t have any applied jobs yet.</p>
                        <p className='pb-5 text-white/55'>Start browsing roles and the applications you submit will appear here.</p>
                        <Link to="/jobs" className='blueCol rounded-2xl px-5 py-2'>Browse Jobs</Link>
                      </div>
                    }
                  </div>
                </div>
            </div>
           
           </>
       }
      </div>
    </>
  )
}
