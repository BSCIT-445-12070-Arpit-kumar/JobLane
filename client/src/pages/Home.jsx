import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MetaData } from '../components/MetaData'
import { useSelector, useDispatch } from 'react-redux';
import { JobCard } from '../components/JobCard';
import { getAllJobs } from '../actions/JobActions';
import Testimonials from '../components/Testimonials/Testimonials.jsx';



export const Home = () => {

    const dispatch = useDispatch()
    const { loading, allJobs } = useSelector(state => state.job)


    const data = [
        {
            link: "/images/JobData/1.jpg"
        },
        {
            link: "/images/JobData/2.jpg"
        },
        {
            link: "/images/JobData/3.jpg"
        },
        {
            link: "/images/JobData/4.jpg"
        },
        {
            link: "/images/JobData/5.jpg"
        },
        {
            link: "/images/JobData/6.jpg"
        },
        {
            link: "/images/JobData/7.jpg"
        },
        {
            link: "/images/JobData/8.jpg"
        },
        {
            link: "/images/JobData/9.jpg"
        },
        {
            link: "/images/JobData/10.jpg"
        },
        {
            link: "/images/JobData/11.jpg"
        },
        {
            link: "/images/JobData/12.jpg"
        },
        {
            link: "/images/JobData/13.jpg"
        },
        {
            link: "/images/JobData/14.jpg"
        },
        {
            link: "/images/JobData/15.jpg"
        },
        {
            link: "/images/JobData/16.jpg"
        },
        {
            link: "/images/JobData/17.jpg"
        },
        {
            link: "/images/JobData/18.jpg"
        },
        {
            link: "/images/JobData/19.jpg"
        },
        {
            link: "/images/JobData/20.jpg"
        }
    ]

    const marqueeLogos = [...data, ...data]


    useEffect(() => {
        dispatch(getAllJobs())

    }, [])

    return (


        <>
            <MetaData title="JobLane" />
            <style>{`
                @keyframes companyMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <div className='min-h-screen md:px-20 px-3  pt-14 flex   text-white bg-gray-950'>
                <div className='  w-full  flex  pt-28 flex-col justify-start  items-center gap-4'>

                    <div className='flex md:flex-row flex-col items-center justify-center md:gap-10 gap-1'>
                        <div className='md:text-8xl text-6xl titleT'>JOBLANE</div>
                        <div className=' flex justify-center items-center pt-1'>
                            <Link to="/jobs" className='font-semibold md:text-2xl text-lg blueCol  md:py-3 py-2 px-6 md:px-10 '>Browse Jobs</Link>
                        </div>
                    </div>
                    <div>
                        <p className='md:text-xl text-sm'>Your <span className='text-yellow-500'>gateway</span> to job opportunities.</p>
                        
                    </div>


                    <div className='pt-[8rem] md:px-[1rem] px-[0rem] w-full'>
                        <div className='titleT pb-6 text-2xl'>
                            <p className='titleT'>Featured Jobs</p>
                        </div>
                        <div>
                            {
                                loading ? 
                                <div className='w-full  flex justify-center items-center'>
                                    
                                    <span class="loader1"></span> 

                                </div> :
                                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
                                        {allJobs && allJobs.length > 0 ? (
                                            allJobs.map((job) => (
                                                <JobCard key={job._id} job={job} />
                                            ))
                                        ) : (
                                            <div className='rounded-xl border border-gray-800 px-4 py-6 text-gray-400'>
                                                No jobs have been posted yet.
                                            </div>
                                        )}
                                    </div>
                            }
                        </div>

                    </div>


                    <div className='pt-20 flex flex-col gap-4 md:px-[1rem] px-[1rem] w-full'>
                        <div className='text-2xl titleT '>
                            Companies on our site
                        </div>
                        <div className='mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-800 bg-black/20 py-5 md:px-2'>
                            <div
                                className='flex w-max items-center gap-8'
                                style={{ animation: 'companyMarquee 24s linear infinite' }}
                            >
                                {marqueeLogos.map((e, i) => (
                                    <div
                                        key={`${e.link}-${i}`}
                                        className='flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/90 p-3 shadow-lg shadow-black/20'
                                    >
                                        <img src={e.link} className='max-h-full w-full object-contain' alt="Company logo" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    

                    <Testimonials />
                    
                    <div className="pt-[7rem] pb-[10rem] md:px-[14rem] px-[1rem]   text-center">
                        <p>Discover the Power of Possibility with JobLane: Where Your Professional Journey Takes Flight, Guided by a Network of Diverse Opportunities!</p>
                    </div>


                </div>

            </div>


        </>
    )
}
