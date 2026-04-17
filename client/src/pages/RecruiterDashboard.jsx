import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { getMyJobs } from '../actions/JobActions'
import { deleteJobData, getAllAppAdmin, updateApplication } from '../actions/AdminActions'
import { Loader } from '../components/Loader'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { MdOutlineAddBox } from 'react-icons/md'
import { Modal } from '@mantine/core'
import { FiBriefcase, FiCalendar, FiMapPin, FiTag } from 'react-icons/fi'
import { formatSalaryDisplay } from '../utils/salary'

export const RecruiterDashboard = () => {
  const dispatch = useDispatch()
  const { loading: jobLoading, allJobs } = useSelector((state) => state.job)
  const { loading: adminLoading, allApplications } = useSelector((state) => state.admin)
  const { me } = useSelector((state) => state.user)
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    dispatch(getMyJobs())
    dispatch(getAllAppAdmin())
  }, [dispatch])

  const convertDateFormat = (inputDate) => {
    if (!inputDate) {
      return 'Date unavailable'
    }

    const parts = inputDate.split('-')
    if (parts.length !== 3) {
      return 'Invalid date format'
    }

    const day = parts[2]
    const month = parts[1]
    const year = parts[0]

    return `${day}-${month}-${year}`
  }

  const myJobs = Array.isArray(allJobs) ? allJobs.filter(Boolean) : []
  const myApplications = Array.isArray(allApplications) ? allApplications.filter(Boolean) : []

  const activeJobs = myJobs.filter((job) => job.status === 'active').length
  const closedJobs = myJobs.filter((job) => job.status === 'closed').length
  const totalApplications = myApplications.length
  const sortedJobs = [...myJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const deleteJobHandler = (id) => {
    dispatch(deleteJobData(id))
  }

  const updateApplicationStatus = async (id, status) => {
    const result = await dispatch(updateApplication(id, { status }))

    if (!result?.success) {
      return
    }

    setSelectedApplication((current) => {
      if (!current || current._id !== id) {
        return current
      }

      return result.application
    })
  }

  const openPrintWindow = (title, bodyContent) => {
    const printWindow = window.open('', '_blank', 'width=1100,height=800')

    if (!printWindow) {
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
            }
            h1, h2, h3, p {
              margin: 0 0 12px;
            }
            .meta {
              color: #4b5563;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            th, td {
              border: 1px solid #d1d5db;
              padding: 10px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background: #f3f4f6;
            }
            .card {
              border: 1px solid #d1d5db;
              border-radius: 12px;
              padding: 16px;
              margin-top: 16px;
            }
            .row {
              margin-bottom: 8px;
            }
            .label {
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const printAllApplications = () => {
    const printedAt = new Date().toLocaleString()
    const rows = myApplications
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((app, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${app.applicant?.name || 'N/A'}</td>
          <td>${app.applicant?.email || 'N/A'}</td>
          <td>${app.job?.title || 'N/A'}</td>
          <td>${app.job?.companyName || 'N/A'}</td>
          <td>${app.status === 'accepted' ? 'selected' : (app.status || 'pending')}</td>
          <td>${convertDateFormat(app.createdAt?.substr?.(0, 10))}</td>
          <td>${app.applicant?.skills?.length ? app.applicant.skills.join(', ') : 'No skills added'}</td>
        </tr>
      `)
      .join('')

    openPrintWindow(
      'Applicants Report',
      `
        <h1>Recruiter Applicants Report</h1>
        <p class="meta">Generated on: ${printedAt}</p>
        <p class="meta">Total applicants: ${myApplications.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Applicant</th>
              <th>Email</th>
              <th>Job</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
    )
  }

  const printSingleApplication = (application) => {
    if (!application) {
      return
    }

    openPrintWindow(
      `Applicant - ${application.applicant?.name || 'Profile'}`,
      `
        <h1>Applicant Details</h1>
        <p class="meta">Generated on: ${new Date().toLocaleString()}</p>
        <div class="card">
          <div class="row"><span class="label">Applicant:</span> ${application.applicant?.name || 'N/A'}</div>
          <div class="row"><span class="label">Email:</span> ${application.applicant?.email || 'N/A'}</div>
          <div class="row"><span class="label">Applied For:</span> ${application.job?.title || 'N/A'}</div>
          <div class="row"><span class="label">Company:</span> ${application.job?.companyName || 'N/A'}</div>
          <div class="row"><span class="label">Status:</span> ${application.status === 'accepted' ? 'selected' : (application.status || 'pending')}</div>
          <div class="row"><span class="label">Applied On:</span> ${convertDateFormat(application.createdAt?.substr?.(0, 10))}</div>
          <div class="row"><span class="label">Skills:</span> ${application.applicant?.skills?.length ? application.applicant.skills.join(', ') : 'No skills added'}</div>
          <div class="row"><span class="label">Resume:</span> ${application.applicantResume?.url || 'Resume unavailable'}</div>
        </div>
      `
    )
  }

  return (
    <>
      <MetaData title="Recruiter Dashboard" />
      <div className='bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white'>
        {(jobLoading || adminLoading) ? <Loader /> : (
          <div>
            <div className='pt-8 flex justify-center items-center text-4xl'>
              <p className='pb-3 border-b border-gray-600 text-center font-medium'>Recruiter Dashboard</p>
            </div>

            <div className='grid md:grid-cols-4 grid-cols-1 md:gap-0 gap-16 md:pt-28 pt-16 pb-16'>
              <div className='flex flex-col gap-3 justify-center items-center'>
                <div className='text-8xl'>
                  <CountUp start={0} end={myJobs.length} />
                </div>
                <p className='text-2xl'>Total Jobs</p>
              </div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                <div className='text-8xl text-green-500'>
                  <CountUp start={0} end={activeJobs} />
                </div>
                <p className='text-2xl'>Active</p>
              </div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                <div className='text-8xl text-red-500'>
                  <CountUp start={0} end={closedJobs} />
                </div>
                <p className='text-2xl'>Closed</p>
              </div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                <div className='text-8xl text-yellow-400'>
                  <CountUp start={0} end={totalApplications} />
                </div>
                <p className='text-2xl'>Applications</p>
              </div>
            </div>

            <div className='flex justify-center mb-16'>
              <Link to="/admin/postJob" className='flex items-center gap-2 blueCol hover:bg-blue-700 px-8 py-3 font-semibold rounded'>
                <MdOutlineAddBox size={24} />
                Post New Job
              </Link>
            </div>

            <div className='pb-28'>
              <p className='text-center pt-3 pb-8 text-3xl font-medium'>Your Jobs</p>

              {myJobs.length === 0 ? (
                <div className='rounded-[2rem] border border-white/10 bg-white/[0.04] py-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.3)]'>
                  <p className='text-xl text-gray-400'>No jobs posted yet. Start by posting your first job!</p>
                  <Link to="/admin/postJob" className='blueCol hover:bg-blue-700 mt-6 px-6 py-2 inline-block font-semibold rounded'>
                    Post Job Now
                  </Link>
                </div>
              ) : (
                <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                  {sortedJobs.map((job) => (
                    <article
                      key={job._id}
                      className='rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(30,41,59,0.78))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-cyan-400/30'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300/80'>
                            Posted Job
                          </div>
                          <h3 className='truncate text-xl font-semibold text-white'>{job.title}</h3>
                          <p className='mt-1 text-sm text-white/60'>{job.companyName || me?.name || 'Your company'}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            job.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className='mt-5 flex flex-wrap gap-2'>
                        <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70'>
                          {job.employmentType}
                        </span>
                        {job.category && (
                          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70'>
                            {job.category}
                          </span>
                        )}
                        {job.salary && (
                          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70'>
                            {formatSalaryDisplay(job.salary)}
                          </span>
                        )}
                      </div>

                      <div className='mt-5 space-y-3 text-sm text-white/70'>
                        <div className='flex items-center gap-3'>
                          <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                            <FiMapPin size={16} />
                          </span>
                          <span>{job.location || 'Location not added'}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300'>
                            <FiCalendar size={16} />
                          </span>
                          <span>Posted on {convertDateFormat(job.createdAt?.substr?.(0, 10))}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300'>
                            <FiBriefcase size={16} />
                          </span>
                          <span>{job.experience || 'Experience not specified'}</span>
                        </div>
                      </div>

                      <p className='mt-5 text-sm leading-6 text-white/55'>
                        {job.description || 'No description added for this role yet.'}
                      </p>

                      <div className='mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4'>
                        <div className='flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35'>
                          <FiTag size={14} />
                          Manage Listing
                        </div>
                        <div className='flex items-center gap-3'>
                          <Link
                            to={`/admin/job/details/${job._id}`}
                            className='inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20'
                          >
                            <MdOutlineModeEditOutline size={18} />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteJobHandler(job._id)}
                            className='inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20'
                          >
                            <AiOutlineDelete size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className='pb-28'>
              <div className='flex flex-col gap-4 pb-8 pt-3 md:flex-row md:items-center md:justify-between'>
                <p className='text-center text-3xl font-medium md:text-left'>Applications Received</p>
                {myApplications.length > 0 && (
                  <button
                    type="button"
                    onClick={printAllApplications}
                    className='rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20'
                  >
                    Print All Applicants
                  </button>
                )}
              </div>
              {myApplications.length === 0 ? (
                <div className='text-center py-16'>
                  <p className='text-xl text-gray-400'>No applications received yet.</p>
                  <p className='text-gray-400'>Your posted jobs will show applicants here once someone applies.</p>
                </div>
              ) : (
                <div className="relative overflow-x-auto shadow-md">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-200 uppercase blueCol dark:text-gray-200">
                      <tr>
                        <th className="px-6 py-3">Applicant</th>
                        <th className="px-6 py-3">Profile</th>
                        <th className="px-6 py-3">Job</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Applied On</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myApplications
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((app) => (
                          <tr key={app._id} className="border-b hover:bg-gray-900 bg-gray-950 border-gray-700 text-white">
                            <td className="px-6 py-4">{app.applicant?.name || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedApplication(app)}
                                className='rounded border border-blue-500 px-3 py-1 text-blue-400 transition hover:bg-blue-500 hover:text-white'
                              >
                                View Profile
                              </button>
                            </td>
                            <td className="px-6 py-4">{app.job?.title || 'N/A'}</td>
                            <td className={`px-6 py-4 ${
                              app.status === 'pending' ? 'text-blue-500' :
                              app.status === 'selected' || app.status === 'accepted' ? 'text-green-500' :
                              'text-red-500'
                            }`}>
                              {app.status === 'accepted' ? 'selected' : (app.status || 'pending')}
                            </td>
                            <td className="px-6 py-4">{convertDateFormat(app.createdAt?.substr?.(0, 10))}</td>
                            <td className="px-6 py-4">
                              <div className='flex flex-wrap gap-2'>
                                <button
                                  onClick={() => printSingleApplication(app)}
                                  className='rounded bg-slate-700 px-3 py-1 text-white transition hover:bg-slate-600'
                                >
                                  Print
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                  disabled={app.status === 'selected' || app.status === 'accepted'}
                                  className='rounded bg-green-600 px-3 py-1 text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                  disabled={app.status === 'rejected'}
                                  className='rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        opened={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        centered
        title="Applicant Profile"
      >
        {selectedApplication && (
          <div className='space-y-4 text-sm text-gray-800'>
            {(() => {
              const resumeLink = selectedApplication.applicantResume?.downloadUrl || selectedApplication.applicantResume?.url

              return (
                <>
            <div>
              <p className='text-lg font-semibold'>{selectedApplication.applicant?.name || 'Unknown Applicant'}</p>
              <p>{selectedApplication.applicant?.email || 'No email available'}</p>
            </div>
            <div>
              <p className='font-semibold'>Applied For</p>
              <p>{selectedApplication.job?.title || 'Unknown Job'}</p>
              <p className='text-gray-600'>{selectedApplication.job?.companyName || ''}</p>
            </div>
            <div>
              <p className='font-semibold'>Skills</p>
              <p>
                {selectedApplication.applicant?.skills?.length
                  ? selectedApplication.applicant.skills.join(', ')
                  : 'No skills added'}
              </p>
            </div>
            <div>
              <p className='font-semibold'>Current Status</p>
              <p className='capitalize'>{selectedApplication.status === 'accepted' ? 'accepted' : selectedApplication.status === 'selected' ? 'accepted' : (selectedApplication.status || 'pending')}</p>
            </div>
            <div className='flex flex-wrap gap-2 pt-2'>
              {resumeLink ? (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className='rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500'
                >
                  Open Resume
                </a>
              ) : (
                <span className='rounded bg-gray-500 px-4 py-2 text-white'>Resume unavailable</span>
              )}
              <button
                onClick={() => printSingleApplication(selectedApplication)}
                className='rounded bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600'
              >
                Print
              </button>
              <button
                onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                className='rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-500'
              >
                Accept
              </button>
              <button
                onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                className='rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-500'
              >
                Reject
              </button>
            </div>
                </>
              )
            })()}
          </div>
        )}
      </Modal>
    </>
  )
}
