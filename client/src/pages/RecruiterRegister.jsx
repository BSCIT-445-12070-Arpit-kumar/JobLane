import React, { useState, useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { AiOutlineMail, AiOutlineUnlock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { MdPermIdentity, MdOutlineMoreTime } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { Link, useNavigate } from 'react-router-dom'
import { TbLoader2 } from 'react-icons/tb'
import { registerUser } from '../actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'
import { removeDigits } from '../utils/inputSanitizers'

export const RecruiterRegister = () => {

  const { loading, isLogin, me } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [eyeTog, setEyeTog] = useState(false)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const [avatar, setAvatar] = useState("")
  const [avatarName, setAvatarName] = useState("")

  const avatarChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setAvatarName(e.target.files[0].name)
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const registerHandler = (e) => {
    e.preventDefault()

    const data = {
      name,
      email,
      password,
      avatar,
      skills: [companyName, companyEmail],
      role: "recruiter"
    }

    dispatch(registerUser(data))

    setName("")
    setEmail("")
    setPassword("")
    setAvatar("")
    setAvatarName("")
    setCompanyName("")
    setCompanyEmail("")
  }

  useEffect(() => {
    if (!isLogin) return

    const role = me?.role || localStorage.getItem('role')

    if (role === 'recruiter') {
        navigate("/recruiter/dashboard", { replace: true })
        return
    }

    if (role === 'admin') {
      navigate("/admin/dashboard", { replace: true })
      return
    }

    if (role === 'applicant') {
      navigate("/", { replace: true })
    }
  }, [isLogin, me, navigate])

  return (
    <>
      <MetaData title="Recruiter Register" />
      <div className='bg-gray-950 min-h-screen pt-14 md:px-20 px-3  text-white'>
        <div className=' flex justify-center w-full items-start pt-6'>
          <form onSubmit={registerHandler} className='flex flex-col md:w-1/3 shadow-gray-700  w-full md:mx-0 mx-8'>

            <div className='md:px-10 px-2 pt-4 pb-20 w-full flex flex-col gap-4'>
              <div className='text-center'>
                <p className='text-4xl  font-medium'>Recruiter Register</p>
                <p className='text-gray-400 text-sm mt-2'>Create account to post jobs</p>
              </div>

              {/* Name */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <MdPermIdentity size={20} />
                </div>
                <input value={name} onChange={(e) => setName(removeDigits(e.target.value))} required placeholder='Your Full Name' type="text" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Mail */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineMail size={20} />
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Your Email' type="email" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Password */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineUnlock size={20} />
                </div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Password' type={eyeTog ? "text" : "password"} className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
                <div className='text-gray-600 px-2 cursor-pointer' >
                  {eyeTog ?
                    <AiOutlineEye size={20} onClick={() => setEyeTog(!eyeTog)} /> : <AiOutlineEyeInvisible size={20} onClick={() => setEyeTog(!eyeTog)} />
                  }
                </div>
              </div>

              {/* Company Name */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <MdOutlineMoreTime size={20} />
                </div>
                <input value={companyName} onChange={(e) => setCompanyName(removeDigits(e.target.value))} required placeholder='Company Name' type="text" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Company Email */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineMail size={20} />
                </div>
                <input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required placeholder='Company Email' type="email" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Profile Picture */}
              <div>
                <div className='bg-white flex justify-center items-center'>
                  <div className='text-gray-600 px-2'>
                    {avatar.length === 0 ? <CgProfile size={20} />
                      : <img src={avatar} className='w-[3em] h-[2.5em]' />
                    }
                  </div>
                  <label htmlFor='avatar' className='outline-none w-full cursor-pointer text-black px-1 pr-3 py-2 '>
                    {avatarName.length === 0 ? <span className='text-gray-500 font-medium'>Company Logo...</span>
                      : avatarName}
                  </label>
                  <input id='avatar' name='avatar' required
                    onChange={avatarChange}
                    placeholder='Profile' accept="image/*" type="file" className='outline-none  w-full hidden text-black px-1 pr-3 py-2' />
                </div>
                <p className='bg-gray-950 text-white text-xs'>Please select Image file</p>
              </div>

              <div>
                <button disabled={loading || !name || !email || !password || !companyName || !companyEmail || !avatar} className='blueCol flex justify-center items-center px-8 w-full py-2 font-semibold' >
                  {loading ? <TbLoader2 className='animate-spin' size={24} /> : "Register"}
                </button>
              </div>

              <div className='text-center text-sm pt-2'>
                <p>Already have an account? <Link to="/login/recruiter" className='text-yellow-400 underline'>Login</Link> here.</p>
              </div>

              <div className='text-center text-sm'>
                <p>Looking to apply for jobs? <Link to="/register" className='text-yellow-400 underline'>Register as Applicant</Link></p>
              </div>

            </div>

          </form>
        </div>

      </div>

    </>
  )
}
