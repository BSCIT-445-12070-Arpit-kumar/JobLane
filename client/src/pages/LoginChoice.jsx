import React from 'react'
import { Link } from 'react-router-dom'
import { MetaData } from '../components/MetaData'
import { MdPerson, MdBusiness } from 'react-icons/md'

export const LoginChoice = () => {
  return (
    <>
      <MetaData title="Choose Login Type" />
      <div className='bg-gray-950 min-h-screen pt-14 text-white'>
        <div className='flex justify-center items-center pt-20 px-3'>
          <div className='w-full max-w-4xl'>
            <div className='text-center mb-16'>
              <h1 className='text-5xl font-bold mb-4'>Login to JobLane</h1>
              <p className='text-gray-400 text-lg'>Select your login type</p>
            </div>

            <div className='grid md:grid-cols-2 gap-8 pb-20 max-w-3xl mx-auto'>
              
              {/* Applicant Login */}
              <Link to='/login/applicant' className='transform hover:scale-105 transition duration-300'>
                <div className='bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 shadow-lg h-80 flex flex-col justify-between cursor-pointer'>
                  <div className='text-center'>
                    <MdPerson size={80} className='mx-auto mb-4 text-blue-200' />
                    <h2 className='text-2xl font-bold mb-3'>Job Seeker</h2>
                    <p className='text-blue-100 text-sm'>
                      Login as a job seeker to find and apply for jobs
                    </p>
                  </div>
                  <button className='blueCol w-full py-2 font-semibold rounded hover:bg-blue-600 transition'>
                    Continue
                  </button>
                </div>
              </Link>

              {/* Recruiter/Employer Login */}
              <Link to='/login/recruiter' className='transform hover:scale-105 transition duration-300'>
                <div className='bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-8 shadow-lg h-80 flex flex-col justify-between cursor-pointer'>
                  <div className='text-center'>
                    <MdBusiness size={80} className='mx-auto mb-4 text-green-200' />
                    <h2 className='text-2xl font-bold mb-3'>Recruiter</h2>
                    <p className='text-green-100 text-sm'>
                      Login as a recruiter to post jobs and manage applications
                    </p>
                  </div>
                  <button className='bg-green-600 w-full py-2 font-semibold rounded hover:bg-green-700 transition'>
                    Continue
                  </button>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
