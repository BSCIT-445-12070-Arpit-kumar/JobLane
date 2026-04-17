import React, { useState } from 'react'
import { MetaData } from '../components/MetaData'
import { Sidebar } from '../components/Sidebar'
import {
  MdOutlineLocationOn,
  MdOutlineFeaturedPlayList,
  MdOutlineWorkOutline,
  MdOutlineReceiptLong,
  MdAttachMoney,
  MdOutlineBusinessCenter
} from 'react-icons/md'
import { BiImageAlt, BiBuilding } from 'react-icons/bi'
import { TbLoader2 } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { createJobPost } from '../actions/JobActions'
import { RxCross1 } from 'react-icons/rx'
import { normalizeSalaryInput } from '../utils/salary'
import { useNavigate } from 'react-router-dom'
import { digitsOnly, removeDigits } from '../utils/inputSanitizers'

export const CreateJob = () => {
  const { loading } = useSelector(state => state.job)
  const [sideTog, setSideTog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [location, setLocation] = useState("")
  const [skillsRequired, setSkillsRequired] = useState("")
  const [experience, setExperience] = useState("")
  const [salary, setSalary] = useState("")
  const [category, setCategory] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [logo, setLogo] = useState("")
  const [logoName, setLogoName] = useState("")

  const inputBaseClass =
    'w-full rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-sm text-black outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30'
  const sectionClass =
    'rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur'
  const labelClass = 'mb-2 block text-sm font-medium text-white/80'
  const helperClass = 'mt-2 text-xs text-white/45'

  const logoChange = (e) => {
    if (e.target.name !== 'logo' || !e.target.files?.[0]) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogo(reader.result)
        setLogoName(e.target.files[0].name)
      }
    }

    reader.readAsDataURL(e.target.files[0])
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCompanyName("")
    setLocation("")
    setSalary("")
    setExperience("")
    setSkillsRequired("")
    setCategory("")
    setEmploymentType("")
    setLogo("")
    setLogoName("")
  }

  const postHandler = async (e) => {
    e.preventDefault()

    if (!logo) {
      alert('Please select a company logo')
      return
    }

    const skillsArr = skillsRequired
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '')

    if (skillsArr.length === 0) {
      alert('Please enter at least one skill')
      return
    }

    const normalizedSalary = normalizeSalaryInput(salary)

    if (!normalizedSalary) {
      alert('Please enter a valid salary')
      return
    }

    const data = {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired: skillsArr,
      experience,
      salary: normalizedSalary,
      category,
      employmentType
    }

    const result = await dispatch(createJobPost(data))

    if (result && result.success) {
      resetForm()
      navigate('/recruiter/dashboard', { replace: true })
    }
  }

  const previewSkills = skillsRequired
    ? skillsRequired.split(',').map((skill) => skill.trim()).filter(Boolean)
    : ['Add skills to preview them here']

  return (
    <>
      <MetaData title="Post Job" />
      <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(180deg,_#030712_0%,_#0f172a_100%)] pt-12 md:px-20 px-3 text-white'>
        <div className="fixed left-0 z-20 pt-4">
          <div onClick={() => setSideTog(!sideTog)} className='cursor-pointer blueCol px-3 py-2'>
            {!sideTog ? 'Menu' : <RxCross1 />}
          </div>
        </div>

        <Sidebar sideTog={sideTog} />

        <div className='flex justify-center w-full items-start pt-8 pb-16'>
          <form onSubmit={postHandler} className='w-full max-w-6xl'>
            <div className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
              <div className='space-y-6'>
                <div className='rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
                  <div className='flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between'>
                    <div>
                      <p className='text-sm uppercase tracking-[0.3em] text-cyan-300/80'>Recruiter Workspace</p>
                      <h1 className='mt-2 text-3xl font-semibold md:text-5xl'>Post a clean, compelling job</h1>
                    </div>
                    <div className='rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-white/70'>
                      Better structure helps candidates respond faster.
                    </div>
                  </div>

                  <div className='mt-6 grid gap-4 md:grid-cols-2'>
                    <div className={sectionClass}>
                      <div className='mb-4 flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                          <MdOutlineBusinessCenter size={24} />
                        </div>
                        <div>
                          <h2 className='text-lg font-semibold'>Role Snapshot</h2>
                          <p className='text-sm text-white/55'>The first things candidates notice.</p>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <label className={labelClass}>Job title</label>
                          <input
                            value={title}
                            onChange={(e) => setTitle(removeDigits(e.target.value))}
                            required
                            placeholder='Frontend Developer'
                            type="text"
                            className={inputBaseClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Company name</label>
                          <input
                            value={companyName}
                            onChange={(e) => setCompanyName(removeDigits(e.target.value))}
                            required
                            placeholder='Your company'
                            type="text"
                            className={inputBaseClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Experience</label>
                          <input
                            value={experience}
                            onChange={(e) => setExperience(digitsOnly(e.target.value))}
                            required
                            placeholder='2+ years'
                            type="text"
                            className={inputBaseClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={sectionClass}>
                      <div className='mb-4 flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300'>
                          <BiImageAlt size={24} />
                        </div>
                        <div>
                          <h2 className='text-lg font-semibold'>Brand & Details</h2>
                          <p className='text-sm text-white/55'>Make the listing feel real and trusted.</p>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <div>
                          <label className={labelClass}>Company logo</label>
                          <label htmlFor='logo' className='flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.08]'>
                            <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white'>
                              {logo ? (
                                <img src={logo} className='h-full w-full object-cover' alt="Company logo preview" />
                              ) : (
                                <BiImageAlt size={26} className='text-gray-500' />
                              )}
                            </div>
                            <div className='min-w-0'>
                              <p className='font-medium text-white'>{logoName || 'Upload company logo'}</p>
                              <p className='mt-1 text-sm text-white/50'>PNG or JPG recommended</p>
                            </div>
                          </label>
                          <input
                            id='logo'
                            name='logo'
                            required
                            onChange={logoChange}
                            accept="image/*"
                            type="file"
                            className='hidden'
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Location</label>
                          <input
                            value={location}
                            onChange={(e) => setLocation(removeDigits(e.target.value))}
                            required
                            placeholder='Bengaluru / Remote'
                            type="text"
                            className={inputBaseClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Salary</label>
                          <input
                            value={salary}
                            onChange={(e) => setSalary(digitsOnly(e.target.value))}
                            required
                            placeholder='12 for 12 LPA'
                            type="text"
                            className={inputBaseClass}
                          />
                          <p className={helperClass}>Use the same number format your backend expects.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300'>
                      <MdOutlineFeaturedPlayList size={24} />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold'>Describe the role</h2>
                      <p className='text-sm text-white/55'>Write clearly enough that candidates can imagine the work.</p>
                    </div>
                  </div>

                  <div className='space-y-5'>
                    <div>
                      <label className={labelClass}>Job description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(removeDigits(e.target.value))}
                        placeholder='Summarize responsibilities, team context, and what success looks like.'
                        rows={6}
                        className={`${inputBaseClass} resize-none`}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Required skills</label>
                      <textarea
                        value={skillsRequired}
                        onChange={(e) => setSkillsRequired(removeDigits(e.target.value))}
                        placeholder='React, Node.js, MongoDB, Communication'
                        rows={4}
                        className={`${inputBaseClass} resize-none`}
                      />
                      <p className={helperClass}>Separate each skill with a comma.</p>
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300'>
                      <MdOutlineReceiptLong size={24} />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold'>Classification</h2>
                      <p className='text-sm text-white/55'>Set the role type so candidates filter it correctly.</p>
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className={labelClass}>Category</label>
                      <select
                        required
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        className={inputBaseClass}
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Sales">Sales</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Employment type</label>
                      <select
                        required
                        onChange={(e) => setEmploymentType(e.target.value)}
                        value={employmentType}
                        className={inputBaseClass}
                      >
                        <option value="">Select employment type</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                  <p className='text-sm text-white/45'>Review your job once before publishing. Strong first impressions usually come from clarity, not length.</p>
                  <button disabled={loading} className='blueCol flex min-w-[14rem] items-center justify-center rounded-2xl px-8 py-3 font-semibold shadow-[0_18px_40px_rgba(8,145,178,0.28)]'>
                    {loading ? <TbLoader2 className='animate-spin' size={24} /> : 'Post Job'}
                  </button>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='sticky top-24 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur'>
                  <div className='mb-5 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white'>
                      <MdOutlineWorkOutline size={24} />
                    </div>
                    <div>
                      <h2 className='text-xl font-semibold'>Live Preview</h2>
                      <p className='text-sm text-white/50'>See the listing shape as you type.</p>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-black/30'>
                    <div className='flex items-start gap-4'>
                      <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white'>
                        {logo ? (
                          <img src={logo} className='h-full w-full object-cover' alt="Preview logo" />
                        ) : (
                          <BiBuilding size={28} className='text-gray-500' />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <h3 className='truncate text-xl font-semibold'>{title || 'Job title will appear here'}</h3>
                        <p className='mt-1 text-sm text-cyan-300/80'>{companyName || 'Company name'}</p>
                        <div className='mt-3 flex flex-wrap gap-2 text-xs text-white/60'>
                          <span className='rounded-full border border-white/10 px-3 py-1'>{employmentType || 'Employment type'}</span>
                          <span className='rounded-full border border-white/10 px-3 py-1'>{category || 'Category'}</span>
                        </div>
                      </div>
                    </div>

                    <div className='mt-5 space-y-3 text-sm text-white/70'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                          <MdOutlineLocationOn size={18} />
                        </div>
                        <span>{location || 'Location'}</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                          <MdAttachMoney size={18} />
                        </div>
                        <span>{salary || 'Salary'}</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300'>
                          <MdOutlineReceiptLong size={18} />
                        </div>
                        <span>{experience || 'Experience'}</span>
                      </div>
                    </div>

                    <div className='mt-5'>
                      <p className='text-xs uppercase tracking-[0.24em] text-white/35'>Description</p>
                      <p className='mt-2 text-sm leading-6 text-white/65'>
                        {description || 'Your role summary will show up here so you can review tone and clarity before posting.'}
                      </p>
                    </div>

                    <div className='mt-5'>
                      <p className='text-xs uppercase tracking-[0.24em] text-white/35'>Skills</p>
                      <div className='mt-3 flex flex-wrap gap-2'>
                        {previewSkills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className='rounded-full bg-white/8 px-3 py-1 text-xs text-white/70'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </>
  )
}
