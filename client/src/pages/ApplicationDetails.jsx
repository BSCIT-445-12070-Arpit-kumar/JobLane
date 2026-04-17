import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { MetaData } from '../components/MetaData'
import { getSingleApplication, deleteApplication } from '../actions/ApplicationActions'
import { TbLoader2 } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { formatSalaryDisplay } from '../utils/salary'
import {
    MdAttachMoney,
    MdOutlineDescription,
    MdOutlineLocationOn,
    MdOutlineReceiptLong,
    MdOutlineVerifiedUser,
    MdOutlineWorkOutline
} from 'react-icons/md'
import { BiBuilding, BiFile } from 'react-icons/bi'

export const ApplicationDetails = () => {
    const { applicationDetails, loading } = useSelector(state => state.application)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id } = useParams()
    const job = applicationDetails?.job || {}
    const applicant = applicationDetails?.applicant || {}
    const applicantResume = applicationDetails?.applicantResume || {}
    const applicantResumeUrl = applicantResume.downloadUrl || applicantResume.url || applicant.resume?.downloadUrl || applicant.resume?.url || ""
    const normalizedStatus = applicationDetails.status === "accepted" ? "selected" : applicationDetails.status
    const statusClassName =
        normalizedStatus === "rejected"
            ? "border-red-400/30 bg-red-500/10 text-red-300"
            : normalizedStatus === "selected"
                ? "border-green-400/30 bg-green-500/10 text-green-300"
                : "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"

    const deleteApplicationHandler = () => {
        dispatch(deleteApplication(id))
        navigate("/applied")
    }

    useEffect(() => {
        dispatch(getSingleApplication(id))
    }, [dispatch, id])

    const toUpperFirst = (str = "") => {
        return str.substring(0, 1).toUpperCase() + str.substring(1)
    }

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

    const extractTime = (inputString) => {
        if (!inputString) {
            return "Time unavailable"
        }

        const dateTimeObj = new Date(inputString)
        const hours = dateTimeObj.getHours()
        const minutes = dateTimeObj.getMinutes()
        const seconds = dateTimeObj.getSeconds()
        const period = hours >= 12 ? 'PM' : 'AM'
        const hours12 = hours % 12 || 12

        return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`
    }

    return (
        <>
            <MetaData title="Application Details" />
            <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(180deg,_#030712_0%,_#0f172a_100%)] pt-14 md:px-20 px-3 text-white'>
                {loading ? (
                    <Loader />
                ) : (
                    <div className='mx-auto w-full max-w-6xl pb-24 pt-8'>
                        <div className='rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
                            <div className='flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between'>
                                <div>
                                    <p className='text-sm uppercase tracking-[0.3em] text-cyan-300/80'>Application Workspace</p>
                                    <h1 className='mt-2 text-3xl font-semibold md:text-5xl'>Application Details</h1>
                                    <p className='mt-3 text-sm text-white/55 md:text-base'>
                                        Review the job snapshot, your submitted profile, and the latest recruiter response.
                                    </p>
                                </div>
                                <div className='rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-white/70'>
                                    Application #{id}
                                </div>
                            </div>

                            <div className='mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
                                <div className='space-y-6'>
                                    <div className='rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur'>
                                        <div className='mb-4 flex items-center gap-3'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                                                <BiBuilding size={24} />
                                            </div>
                                            <div>
                                                <h2 className='text-lg font-semibold'>Job Snapshot</h2>
                                                <p className='text-sm text-white/55'>The role you applied for.</p>
                                            </div>
                                        </div>

                                        <div className='grid gap-3 md:grid-cols-2'>
                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <MdOutlineWorkOutline className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Role</p>
                                                        <p className='mt-1 text-sm text-white/75'>{job.title || "Job not available"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <BiBuilding className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Company</p>
                                                        <p className='mt-1 text-sm text-white/75'>{job.companyName || "Unknown company"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <MdOutlineLocationOn className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Location</p>
                                                        <p className='mt-1 text-sm text-white/75'>{job.location || "Not specified"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <MdAttachMoney className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Salary</p>
                                                        <p className='mt-1 text-sm text-white/75'>{formatSalaryDisplay(job.salary)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3 md:col-span-2'>
                                                <div className='flex items-center gap-3'>
                                                    <MdOutlineReceiptLong className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Experience</p>
                                                        <p className='mt-1 text-sm text-white/75'>{job.experience || "Not specified"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur'>
                                        <div className='mb-4 flex items-center gap-3'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300'>
                                                <MdOutlineDescription size={24} />
                                            </div>
                                            <div>
                                                <h2 className='text-lg font-semibold'>Applicant Snapshot</h2>
                                                <p className='text-sm text-white/55'>The profile details included with your submission.</p>
                                            </div>
                                        </div>

                                        <div className='grid gap-3'>
                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <MdOutlineVerifiedUser className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Name</p>
                                                        <p className='mt-1 text-sm text-white/75'>{applicant.name || "Unknown applicant"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <MdOutlineVerifiedUser className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Email</p>
                                                        <p className='mt-1 break-all text-sm text-white/75'>{applicant.email || "No email available"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='rounded-2xl border border-white/8 bg-black/20 px-4 py-3'>
                                                <div className='flex items-center gap-3'>
                                                    <BiFile className='text-cyan-300' size={18} />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Resume</p>
                                                        {applicantResumeUrl ? (
                                                            <a
                                                                href={applicantResumeUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className='mt-1 inline-block text-sm text-cyan-300 underline'
                                                            >
                                                                View {applicant.name || "Applicant"} resume
                                                            </a>
                                                        ) : (
                                                            <p className='mt-1 text-sm text-white/75'>No resume available</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-6'>
                                    <div className='sticky top-24 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
                                        <div className='mb-5 flex items-center gap-3'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white'>
                                                <MdOutlineVerifiedUser size={24} />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold'>Application Status</h2>
                                                <p className='text-sm text-white/50'>Your latest application outcome and actions.</p>
                                            </div>
                                        </div>

                                        <div className='rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-black/30'>
                                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClassName}`}>
                                                {toUpperFirst(normalizedStatus)}
                                            </span>

                                            {applicationDetails.statusMessage && (
                                                <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                                                    normalizedStatus === "selected"
                                                        ? "border-green-400/20 bg-green-500/10 text-green-300"
                                                        : normalizedStatus === "rejected"
                                                            ? "border-red-400/20 bg-red-500/10 text-red-300"
                                                            : "border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                                                }`}>
                                                    {applicationDetails.statusMessage}
                                                </div>
                                            )}

                                            <div className='mt-5 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/65'>
                                                Submitted on {convertDateFormat(applicationDetails.createdAt?.substr?.(0, 10))} at {extractTime(applicationDetails.createdAt)}
                                            </div>

                                            <div className='mt-6'>
                                                {!loading ? (
                                                    <button
                                                        onClick={() => {
                                                            deleteApplicationHandler()
                                                        }}
                                                        className='w-full rounded-2xl bg-red-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700'
                                                    >
                                                        Delete Application
                                                    </button>
                                                ) : (
                                                    <button className='flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 font-bold text-white'>
                                                        <TbLoader2 className='animate-spin' size={23} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
