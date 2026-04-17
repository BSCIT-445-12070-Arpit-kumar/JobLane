import React from 'react'
import { Link } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile';
import { FiArrowUpRight, FiBriefcase, FiCalendar, FiMapPin, FiTag } from 'react-icons/fi'
import { formatSalaryDisplay } from '../utils/salary'


export const JobCard = ({ job }) => {
    const experience = job?.experience || job?.exp || "Not specified"

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
    const descriptionPreview = isMobile ? 90 : 150



    return (
        <>

            <Link to={`/details/${job._id}`} className='job-post-card'>

                <div className='flex items-start gap-4'>
                    <div className='job-post-logo-wrap'>
                        <img src={job.companyLogo.url} className='h-14 w-14 object-contain md:h-16 md:w-16' alt={job.companyName} />
                    </div>
                    <div className='min-w-0 flex-1'>

                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div className='min-w-0'>
                                <span className='job-post-badge'>Fresh opening</span>
                                <p className='mt-3 truncate text-xl font-semibold md:text-2xl'>{job.title}</p>
                                <p className='mt-1 text-sm text-cyan-200/80 md:text-base'>{job.companyName}</p>
                            </div>
                            <span className='job-post-cta'>
                                Apply
                                <FiArrowUpRight />
                            </span>
                        </div>

                        <div className='mt-4 flex flex-wrap gap-2'>
                            <span className='job-post-pill'>
                                <FiBriefcase />
                                {job.employmentType}
                            </span>
                            <span className='job-post-pill'>
                                <FiTag />
                                {experience}
                            </span>
                            {job.category && (
                                <span className='job-post-pill'>
                                    <FiTag />
                                    {job.category}
                                </span>
                            )}
                            {job.salary && (
                                <span className='job-post-pill'>
                                    <FiTag />
                                    {formatSalaryDisplay(job.salary)}
                                </span>
                            )}
                        </div>

                        <p className='mt-4 text-sm leading-7 text-slate-300 md:text-[15px]'>
                            {job.description.slice(0, descriptionPreview)}...
                        </p>
                    </div>
                </div>

                <div className='mt-6 flex flex-wrap gap-3 text-xs md:text-sm'>
                    <span className='job-post-footer-pill'>
                        <FiCalendar />
                        {convertDateFormat(job.createdAt.substr(0, 10))}
                    </span>
                    <span className='job-post-footer-pill'>
                        <FiMapPin />
                        {job.location}
                    </span>
                </div>

            </Link>


        </>
    )
}
