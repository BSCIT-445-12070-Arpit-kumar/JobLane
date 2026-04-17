import React from 'react'
import { Link } from 'react-router-dom'
import { saveJob } from '../actions/JobActions'
import { useDispatch } from 'react-redux'
import useIsMobile from '../hooks/useIsMobile'
import { FiArrowUpRight, FiBookmark, FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi'


export const SaveJobCard = ({ job }) => {

    const dispatch = useDispatch()

    const convertDateFormat = (inputDate) => {
        const parts = inputDate.split('-');
        if (parts.length !== 3) {
            return "Invalid date format";
        }

        const day = parts[2];
        const month = parts[1];
        const year = parts[0];

        return `${day}-${month}-${year}`;
    }

    const isMobile = useIsMobile()
    const experience = job?.experience || job?.exp || "Not specified"
    const descriptionPreview = isMobile ? 80 : 180

    const unSaveJobHandler = () => {
        dispatch(saveJob(job._id))
    }


    return (
        <article className='saved-job-card'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                <div className='flex flex-1 gap-4 md:gap-5'>
                    <div className='saved-job-logo-wrap'>
                        <img src={job.companyLogo.url} className='h-14 w-14 object-contain md:h-16 md:w-16' alt={job.companyName} />
                    </div>

                    <div className='flex-1'>
                        <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                            <div>
                                <span className='saved-job-badge'>
                                    <FiBookmark />
                                    Saved role
                                </span>
                                <h2 className='mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl'>{job.title}</h2>
                                <p className='mt-1 text-sm text-slate-300 md:text-base'>{job.companyName}</p>
                            </div>
                        </div>

                        <div className='saved-job-meta-grid'>
                            <span className='saved-job-meta-pill'>
                                <FiBriefcase />
                                {job.employmentType}
                            </span>
                            <span className='saved-job-meta-pill'>
                                <FiClock />
                                {experience}
                            </span>
                            <span className='saved-job-meta-pill'>
                                <FiMapPin />
                                {job.location}
                            </span>
                        </div>

                        <p className='mt-4 text-sm leading-7 text-slate-300 md:text-[15px]'>
                            {job.description.slice(0, descriptionPreview)}...
                        </p>
                    </div>
                </div>

                <div className='flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:min-w-[180px]'>
                    <Link to={`/details/${job._id}`} className='saved-jobs-primary-cta inline-flex items-center justify-center gap-2 text-sm font-semibold'>
                        View details
                        <FiArrowUpRight />
                    </Link>
                    <button onClick={unSaveJobHandler} className='saved-jobs-secondary-cta w-full justify-center text-sm font-semibold'>
                        Remove save
                    </button>
                </div>
            </div>

            <div className='mt-6 flex flex-wrap gap-3 text-xs text-slate-300 md:text-sm'>
                <span className='saved-job-footer-pill'>Saved on {convertDateFormat(job.createdAt.substr(0, 10))}</span>
                <span className='saved-job-footer-pill'>{job.companyName} hiring</span>
                <span className='saved-job-footer-pill'>1-click return to apply</span>
            </div>
        </article>
    )
}
