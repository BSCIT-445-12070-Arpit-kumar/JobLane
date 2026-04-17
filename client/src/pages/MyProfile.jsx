import React from 'react'
import { MetaData } from '../components/MetaData'
import { useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Link } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { FiBookmark, FiBriefcase, FiFileText, FiLock, FiTrash2 } from 'react-icons/fi'



export const MyProfile = () => {

  const { loading, me } = useSelector(state => state.user)
  const [opened, { open, close }] = useDisclosure(false);

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


  


  const isRecruiter = me?.role === "recruiter"
  const joinedOn = me?.createdAt ? convertDateFormat(me.createdAt.substr(0, 10)) : "Not available"
  const profileThemeClass = isRecruiter ? 'profile-shell recruiter-profile-shell' : 'profile-shell seeker-profile-shell'
  const profileBadgeLabel = isRecruiter ? 'Recruiter Profile' : 'Job Seeker Profile'
  const profileTitle = isRecruiter ? 'Manage your hiring identity.' : 'Keep your profile ready for the next opportunity.'
  const profileSubtitle = isRecruiter
    ? 'A cleaner workspace for your company details, hiring actions, and account settings.'
    : 'Your personal details, saved progress, and application shortcuts are all in one place.'

  return (
    <>

      <MetaData title="My Profile" />
      <div className={profileThemeClass}>
        {
          loading ? <Loader /> :
            <>
              <div className='mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col gap-8 px-3 pb-20 pt-20 md:px-8'>
                <section className='profile-hero'>
                  <div className='max-w-2xl'>
                    <span className='profile-role-badge'>{profileBadgeLabel}</span>
                    <h1 className='profile-title'>{profileTitle}</h1>
                    <p className='profile-subtitle'>{profileSubtitle}</p>
                  </div>
                </section>

                <div className='grid items-start gap-8 lg:grid-cols-[360px_minmax(0,1fr)]'>
                <div className='profile-avatar-panel'>
                  <div className='profile-avatar-frame'>
                    <img 
                      src={me?.avatar?.url || "https://via.placeholder.com/400"} 
                      className='h-full w-full rounded-[28px] object-cover' 
                      alt="Profile" 
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400"
                      }}
                    />
                  </div>
                  <div className='text-center'>
                    <h2 className='text-2xl font-semibold text-white'>{me?.name}</h2>
                    <p className='mt-2 text-sm text-slate-300'>{isRecruiter ? 'Hiring workspace owner' : 'Candidate profile ready to share'}</p>
                  </div>
                </div>



                <div className='flex flex-col gap-6'>
                  <section className='profile-details-card'>
                    <div className='profile-details-grid'>
                      <div className='profile-detail-item'>
                        <p className='profile-detail-label'>Full Name</p>
                        <p className='profile-detail-value'>{me?.name}</p>
                      </div>
                      <div className='profile-detail-item'>
                        <p className='profile-detail-label'>Email</p>
                        <p className='profile-detail-value'>{me?.email}</p>
                      </div>
                      <div className='profile-detail-item'>
                        <p className='profile-detail-label'>Joined On</p>
                        <p className='profile-detail-value'>{joinedOn}</p>
                      </div>
                      <div className='profile-detail-item'>
                        <p className='profile-detail-label'>Account Type</p>
                        <p className='profile-detail-value capitalize'>{me?.role}</p>
                      </div>
                    </div>
                  </section>

                  <section className='profile-details-card'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-xl font-semibold text-white'>{isRecruiter ? 'Workspace Actions' : 'Career Actions'}</p>
                        <p className='mt-1 text-sm text-slate-300'>{isRecruiter ? 'Quick shortcuts for hiring tasks and account updates.' : 'Everything you need to continue applications quickly.'}</p>
                      </div>
                    </div>

                    <div className='mt-6 grid gap-3 md:grid-cols-2'>
                        {me.role !== "recruiter" && <button onClick={open} className='profile-action-btn'><FiFileText />My Resume</button>}
                        {me.role !== "recruiter" && <Link to="/applied" className='profile-action-btn'><FiBriefcase />My Applications</Link>}
                        {me.role !== "recruiter" && <Link to="/saved" className='profile-action-btn'><FiBookmark />Saved Jobs</Link>}
                        {me.role === "recruiter" && <Link to="/recruiter/dashboard" className='profile-action-btn'><FiBriefcase />My Dashboard</Link>}
                        {me.role === "recruiter" && <Link to="/admin/postJob" className='profile-action-btn'><FiBriefcase />Post New Job</Link>}
                        <Link to="/changePassword" className='profile-action-btn'><FiLock />Change Password</Link>
                        <Link to="/deleteAccount" className='profile-action-btn danger-profile-action'><FiTrash2 />Delete Account</Link>
                    </div>
                  </section>

                  {!isRecruiter && (
                    <section className='profile-details-card'>
                      <div className='flex items-center justify-between gap-3'>
                        <div>
                          <p className='text-xl font-semibold text-white'>Skills Snapshot</p>
                          <p className='mt-1 text-sm text-slate-300'>A quick view of the skills recruiters can notice first.</p>
                        </div>
                      </div>
                      <div className='mt-5 flex flex-wrap gap-3'>
                        {me?.skills?.length ? me.skills.map((skill, i) => (
                          <span key={i} className='profile-skill-chip'>{skill}</span>
                        )) : (
                          <p className='text-sm text-slate-300'>No skills added yet.</p>
                        )}
                      </div>
                    </section>
                  )}
                </div>
                </div>
                {me.role !== "recruiter" && <Modal opened={opened} onClose={close} title="Resume">
                  <div>
                    <img src={me.resume?.url} className='w-full h-full rounded-xl' alt="" />
                  </div>
                 
                </Modal>}
               

              </div>

            </>





        }


      </div>

    </>
  )
}
