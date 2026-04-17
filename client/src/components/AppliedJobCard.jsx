import React from 'react'
import { Link } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile'

export const AppliedJobCard = ({ id, job, time, status, statusMessage }) => {
    const jobTitle = job?.title || "Job not available"
    const companyName = job?.companyName || "Unknown company"
    const companyLogo = job?.companyLogo?.url || "https://via.placeholder.com/80?text=Job"
    const description = job?.description || "Job description is not available."
    const experience = job?.experience || job?.exp || "Not specified"

    const convertDateFormat = (inputDate) => {
        if (!inputDate) {
            return "Date unavailable"
        }

        const parts = inputDate.split('-')
        if (parts.length !== 3) {
            return "Invalid date format"
        }

        const day = parts[2]
        const month = parts[1]
        const year = parts[0]

        return `${day}-${month}-${year}`
    }

    const isMobile = useIsMobile()
    const normalizedStatus = status === 'accepted' ? 'selected' : (status || 'pending')
    const statusClassName =
        normalizedStatus === 'selected'
            ? 'border-green-400/30 bg-green-500/10 text-green-300'
            : normalizedStatus === 'rejected'
                ? 'border-red-400/30 bg-red-500/10 text-red-300'
                : 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300'

    return (
        <div className='rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-cyan-400/20 hover:bg-white/[0.06]'>
            <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div className='flex min-w-0 gap-4'>
                    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white md:h-20 md:w-20'>
                        <img src={companyLogo} className='h-full w-full object-cover' alt={jobTitle} />
                    </div>
                    <div className='min-w-0'>
                        <p className='text-xl font-semibold md:text-2xl'>{jobTitle}</p>
                        <p className='mt-1 text-sm text-cyan-300/80'>{companyName}</p>
                        <p className='mt-2 text-sm text-white/60'>{experience}</p>
                        {!isMobile && <p className='mt-3 max-w-2xl text-sm leading-6 text-white/55'>{description.slice(0, 120)}...</p>}
                        <p className='mt-2 text-sm leading-6 text-white/55 md:hidden'>{description.slice(0, 55)}...</p>
                    </div>
                </div>

                <div className='flex flex-col gap-3 md:items-end'>
                    <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClassName}`}>
                        {normalizedStatus}
                    </span>
                    <Link
                        to={`/Application/Details/${id}`}
                        className='blueCol rounded-2xl px-4 py-2 text-center text-sm font-semibold shadow-[0_18px_40px_rgba(8,145,178,0.28)]'
                    >
                        View Application
                    </Link>
                </div>
            </div>

            <div className='mt-4 flex flex-wrap gap-3 text-xs md:text-sm'>
                <span className='rounded-full border border-white/10 px-3 py-1 text-white/60'>
                    Applied on {convertDateFormat(time?.substr?.(0, 10))}
                </span>
                <span className='rounded-full border border-white/10 px-3 py-1 text-white/60'>
                    {companyName}
                </span>
            </div>

            {statusMessage && (
                <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    normalizedStatus === 'selected'
                        ? 'border-green-400/20 bg-green-500/10 text-green-300'
                        : normalizedStatus === 'rejected'
                            ? 'border-red-400/20 bg-red-500/10 text-red-300'
                            : 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300'
                }`}>
                    {statusMessage}
                </div>
            )}
        </div>
    )
}
