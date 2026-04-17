import React, { useState, useEffect } from 'react'
import { TbLoader2 } from 'react-icons/tb'
import { useParams } from 'react-router'
import { MetaData } from '../components/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSingleJob } from '../actions/JobActions'
import { createApplication } from '../actions/ApplicationActions'
import { updateProfile } from '../actions/UserActions'
import { Modal, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { formatSalaryDisplay } from '../utils/salary'
import { toast } from 'react-toastify'
import {
  MdAttachMoney,
  MdOutlineLocationOn,
  MdOutlineReceiptLong,
  MdOutlineWorkOutline,
  MdOutlineVerifiedUser,
  MdOutlineDescription
} from 'react-icons/md'
import { BiBuilding, BiFile } from 'react-icons/bi'

export const Application = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { jobDetails } = useSelector(state => state.job)
  const { me, loading: userLoading } = useSelector(state => state.user)
  const { loading } = useSelector(state => state.application)
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const [resume, setResume] = useState('')
  const [resumeName, setResumeName] = useState('')
  const isJobClosed = jobDetails.status === 'closed'

  useEffect(() => {
    dispatch(getSingleJob(id))
  }, [dispatch, id])

  useEffect(() => {
    if (isJobClosed) {
      toast.info('This job is closed and no longer accepting applications.')
      navigate(`/details/${id}`)
    }
  }, [id, isJobClosed, navigate])

  const makeApplication = async (e) => {
    e.preventDefault()

    if (isJobClosed) {
      toast.info('This job is closed and no longer accepting applications.')
      navigate(`/details/${id}`)
      return
    }

    const result = await dispatch(createApplication(id))

    if (result && result.success) {
      open()

      setTimeout(() => {
        close()
        navigate('/applied')
      }, 3000)
    }
  }

  const resumeChange = (e) => {
    if (e.target.name !== 'resume' || !e.target.files?.[0]) {
      return
    }

    const selectedFile = e.target.files[0]

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Resume ke liye sirf PDF upload karo.')
      e.target.value = ''
      return
    }

    const selectedFileName = selectedFile.name
    const reader = new FileReader()
    reader.onload = async () => {
      if (reader.readyState === 2) {
        setResume(reader.result)
        setResumeName(selectedFileName)

        await dispatch(updateProfile({
          newName: me?.name,
          newEmail: me?.email,
          newSkills: me?.skills || [],
          newResume: reader.result
        }))

        setResume('')
        setResumeName('')
      }
    }

    reader.readAsDataURL(selectedFile)
  }

  const sectionClass =
    'rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur'
  const infoRowClass = 'flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3'
  const iconClass = 'mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'

  return (
    <>
      <MetaData title="Apply for Job" />
      <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(180deg,_#030712_0%,_#0f172a_100%)] pt-14 md:px-20 px-3 text-white'>
        <div className='mx-auto w-full max-w-6xl pb-16 pt-8'>
          <div className='rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
            <div className='flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between'>
              <div>
                <p className='text-sm uppercase tracking-[0.3em] text-cyan-300/80'>Application Workspace</p>
                <h1 className='mt-2 text-3xl font-semibold md:text-5xl'>Apply with confidence</h1>
                <p className='mt-3 max-w-2xl text-sm text-white/55 md:text-base'>
                  Review the job details and your profile before sending the application.
                </p>
              </div>
              <div className='rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-white/70'>
                Application ID: {id}
              </div>
            </div>

            <div className='mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
              <div className='space-y-6'>
                <div className={sectionClass}>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                      <BiBuilding size={24} />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold'>Job Snapshot</h2>
                      <p className='text-sm text-white/55'>Everything you are applying for at a glance.</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-5'>
                    <div className='flex items-start gap-4'>
                      <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white'>
                        {jobDetails?.companyLogo?.url ? (
                          <img
                            src={jobDetails.companyLogo.url}
                            alt={jobDetails.companyName || 'Company logo'}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <BiBuilding size={28} className='text-gray-500' />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <h3 className='truncate text-2xl font-semibold'>{jobDetails.title || 'Loading role...'}</h3>
                        <p className='mt-1 text-sm text-cyan-300/80'>{jobDetails.companyName || 'Company name'}</p>
                      </div>
                    </div>

                    <div className='mt-5 grid gap-3 md:grid-cols-2'>
                      <div className={infoRowClass}>
                        <div className={iconClass}>
                          <MdOutlineWorkOutline size={18} />
                        </div>
                        <div>
                          <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Role</p>
                          <p className='mt-1 text-sm text-white/75'>{jobDetails.title || 'Not available'}</p>
                        </div>
                      </div>

                      <div className={infoRowClass}>
                        <div className={iconClass}>
                          <MdOutlineLocationOn size={18} />
                        </div>
                        <div>
                          <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Location</p>
                          <p className='mt-1 text-sm text-white/75'>{jobDetails.location || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className={infoRowClass}>
                        <div className={iconClass}>
                          <MdAttachMoney size={18} />
                        </div>
                        <div>
                          <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Salary</p>
                          <p className='mt-1 text-sm text-white/75'>{formatSalaryDisplay(jobDetails.salary)}</p>
                        </div>
                      </div>

                      <div className={infoRowClass}>
                        <div className={iconClass}>
                          <MdOutlineReceiptLong size={18} />
                        </div>
                        <div>
                          <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Experience</p>
                          <p className='mt-1 text-sm text-white/75'>{jobDetails.experience || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300'>
                      <MdOutlineDescription size={24} />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold'>Your Application Details</h2>
                      <p className='text-sm text-white/55'>Confirm what the recruiter will see from your profile.</p>
                    </div>
                  </div>

                  <div className='grid gap-3'>
                    <div className={infoRowClass}>
                      <div className={iconClass}>
                        <MdOutlineVerifiedUser size={18} />
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Name</p>
                        <p className='mt-1 text-sm text-white/75'>{me?.name || 'Applicant name'}</p>
                      </div>
                    </div>

                    <div className={infoRowClass}>
                      <div className={iconClass}>
                        <MdOutlineVerifiedUser size={18} />
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Email</p>
                        <p className='mt-1 text-sm text-white/75 break-all'>{me?.email || 'Applicant email'}</p>
                      </div>
                    </div>

                    <div className={infoRowClass}>
                      <div className={iconClass}>
                        <BiFile size={18} />
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Resume</p>
                        <div className='mt-1 flex flex-wrap items-center gap-3'>
                          {me?.resume?.url ? (
                            <a
                              href={me.resume.url}
                              target="_blank"
                              rel="noreferrer"
                              className='inline-block text-sm text-cyan-300 underline'
                            >
                              View {me.name || 'your'} resume
                            </a>
                          ) : (
                            <p className='text-sm text-red-300'>Resume not available</p>
                          )}
                          <label htmlFor='resume' className='cursor-pointer rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-cyan-400/40 hover:text-cyan-300'>
                            {resumeName || 'Change Resume'}
                          </label>
                          <input
                            id='resume'
                            name='resume'
                            accept='.pdf,application/pdf'
                            type='file'
                            onChange={resumeChange}
                            className='hidden'
                          />
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
                      <h2 className='text-xl font-semibold'>Final Review</h2>
                      <p className='text-sm text-white/50'>One last check before you submit.</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-black/30'>
                    <div className='rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm text-white/75'>
                      You are applying to <span className='font-semibold text-white'>{jobDetails.companyName || 'this company'}</span> for the role of <span className='font-semibold text-white'>{jobDetails.title || 'this position'}</span>.
                    </div>

                    <label className='mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-4 cursor-pointer'>
                      <input
                        type="checkbox"
                        className='mt-1 h-4 w-4 cursor-pointer'
                        checked={confirm}
                        onChange={(e) => setConfirm(e.target.checked)}
                      />
                      <span className='text-sm leading-6 text-white/65'>
                        I confirm that all the information provided in this application is accurate and complete to the best of my knowledge. I understand that false statements or omissions may result in disqualification.
                      </span>
                    </label>

                    <div className='mt-6 flex flex-col gap-3'>
                      <button
                        onClick={makeApplication}
                        disabled={loading || !confirm || isJobClosed}
                        className={`${confirm && !isJobClosed ? 'blueCol' : 'blueCol2'} flex min-h-[3.2rem] items-center justify-center rounded-2xl px-8 py-3 font-semibold shadow-[0_18px_40px_rgba(8,145,178,0.28)]`}
                      >
                        {loading ? (
                          <TbLoader2 className='animate-spin' size={24} />
                        ) : isJobClosed ? (
                          'Job Closed'
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                      <p className='text-center text-xs text-white/40'>
                        You will be redirected to your applied jobs list after a successful submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal opened={opened} onClose={close} centered size="md" withCloseButton={false}>
          <div className="text-center py-6">
            <p className="mb-4 text-6xl text-green-600">OK</p>
            <p className="text-2xl font-bold">Applied Successfully!</p>
            <p className="mt-3 text-gray-500">Your application has been submitted. We&apos;ll be in touch soon!</p>
          </div>
        </Modal>
      </div>
    </>
  )
}
