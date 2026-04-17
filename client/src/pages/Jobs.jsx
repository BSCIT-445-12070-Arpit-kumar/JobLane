import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { FiSearch } from 'react-icons/fi'
import { Loader } from '../components/Loader'
import { JobCard } from '../components/JobCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllJobs, getSingleJob } from '../actions/JobActions'
import { Slider } from '@mantine/core';
import { RxCross2 } from 'react-icons/rx'
import { Pagination } from '@mantine/core';
import useIsMobile from '../hooks/useIsMobile'
import { normalizeSalaryInput } from '../utils/salary';
import { FiBriefcase, FiFilter, FiLayers } from 'react-icons/fi';


export const Jobs = () => {

  const dispatch = useDispatch()
  const { allJobs, loading } = useSelector(state => state.job)

  const [baseJobs, setBaseJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [category, setCategory] = useState("");
  const [salary, setSalary] = useState(0);
  const [company, setCompany] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);


  const isMobile = useIsMobile()


  const data = ["Technology", "Marketing", "Finance", "Sales", "Legal"]

  const companyData = [
    "Google",
    "Apple",
    "Paypal",
    "Samsung",
    "Amazon",
    "Oracle"
  ]

  useEffect(() => {
    dispatch(getAllJobs());
  }, [])

  useEffect(() => {
    setJobs(allJobs);
    setBaseJobs(allJobs);
  }, [allJobs])

  useEffect(() => {
    const searchArr = baseJobs.filter((e) => (
      e.title.toLowerCase().includes(search.toLowerCase().trim())
    ))

    if (search === "") {

      setJobs(baseJobs)
    } else {

      setJobs(searchArr)
    }

  }, [search, baseJobs])






  const searchHandler = () => {
    const searchArr = baseJobs.filter((e) => (
      e.title.toLowerCase().includes(search.toLowerCase())
    ))



    if (search !== "") {
      setJobs(searchArr)
    }
    else if (searchArr.length === 0) {
      setJobs(baseJobs)
    }

  }

  const leftFilter = (jobsList) => {
    if (category == "" && salary == 0) {
      setJobs(allJobs)
      return
    }
    const normalizedFilterSalary = Number(normalizeSalaryInput(salary) || 0)
    const leftFilArr = jobsList.filter((item) => (
      item.category.toLowerCase() === category.toLowerCase() && Number(item.salary) >= normalizedFilterSalary
    ))
    setJobs(leftFilArr)
  }


  const removeLeftFilter = () => {
    setCategory("")
    setSalary(0)
    rightFilter(allJobs)
    setCurrentPage(1)
  }

  const rightFilter = (jobsList) => {
    if (company == "") {
      setJobs(allJobs)
      return
    }
    const rightFilArr = jobsList.filter((item) => (
      item.companyName.toLowerCase() === company.toLowerCase()
    ))
    setJobs(rightFilArr)

  }
  const removeRightFilter = () => {
    setCompany("")
    leftFilter(allJobs)
    setCurrentPage(1)
  }






  const itemsPerPage = 5;

  const totalPageCount = Math.ceil(jobs.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPageCount));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = jobs.slice(startIndex, endIndex);

  const pageButtons = [];
  const maxButtonsToShow = 3;

  let startButton = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endButton = Math.min(totalPageCount, startButton + maxButtonsToShow - 1);

  for (let i = startButton; i <= endButton; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`mx-1 px-3 py-1 border border-gray-700 rounded ${currentPage === i ? 'bg-gray-800  text-white' : 'bg-gray-900  text-white hover:bg-gray-800 hover:text-white'}`}
      >
        {i}
      </button>
    );
  }

  const categoryPanel = (
    <div className='jobs-filter-panel'>
      <div className='jobs-filter-panel-header'>
        <span className='jobs-filter-icon'><FiLayers /></span>
        <div>
          <p className='jobs-filter-title'>Categories</p>
          <p className='jobs-filter-subtitle'>Choose the role type you want.</p>
        </div>
      </div>

      <ul className='mt-5 flex flex-col gap-3'>
        {data.map((e, i) => (
          <li
            key={i}
            onClick={() => setCategory(e)}
            className={`jobs-filter-option ${category === e ? "jobs-filter-option-active" : ""}`}
          >
            {e}
          </li>
        ))}
      </ul>

      <div className='mt-6'>
        <div className='flex items-center justify-between gap-3'>
          <p className='jobs-filter-title'>Salary</p>
          <span className='text-xs text-cyan-200/75'>{salary || 0}</span>
        </div>

        <Slider
          color="indigo"
          className='jobs-filter-slider mt-4'
          onChange={setSalary}
          value={salary}
          min={0}
          max={2000000}
        />
      </div>

      <div className='mt-6 flex flex-col gap-3'>
        <button onClick={() => leftFilter(jobs)} className='jobs-filter-btn jobs-filter-btn-primary'>Apply Filter</button>
        <button onClick={() => removeLeftFilter()} className='jobs-filter-btn jobs-filter-btn-secondary'>Reset</button>
      </div>
    </div>
  )

  const companyPanel = (
    <div className='jobs-filter-panel'>
      <div className='jobs-filter-panel-header'>
        <span className='jobs-filter-icon'><FiBriefcase /></span>
        <div>
          <p className='jobs-filter-title'>Companies</p>
          <p className='jobs-filter-subtitle'>Browse by brand preference.</p>
        </div>
      </div>

      <div className='mt-5 flex flex-col gap-3'>
        {companyData.map((e, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCompany(e)}
            className={`jobs-filter-option text-left ${company === e ? "jobs-filter-option-active" : ""}`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className='mt-6 flex flex-col gap-3'>
        <button onClick={() => rightFilter(jobs)} className='jobs-filter-btn jobs-filter-btn-primary'>Apply Search</button>
        <button onClick={() => removeRightFilter()} className='jobs-filter-btn jobs-filter-btn-secondary'>Reset</button>
      </div>
    </div>
  )

  return (
    <>
      <MetaData title="Jobs" />
      <div className='bg-gray-950 min-h-screen pt-14 sm:px-20 px-3  text-white'>


        {loading ? <Loader /> :
          <>
            <div className='flex-col flex justify-center items-center w-full '>
              <div className='text-center pt-8 sm:text-3xl text-2xl font-medium'>
                <p>Find your dream job now</p>
              </div>
              <div className='py-3 pt-4 w-full flex justify-center items-center'>

                <div className='flex  justify-center w-full  items-center  '>
                  <div className='bg-white flex sm:w-2/5 w-4/5'>
                    <div className='flex justify-center items-center pl-2 text-black'> <FiSearch size={19} /> </div>
                    <input value={search} placeholder='Search Jobs ' onChange={(e) => setSearch(e.target.value)} type="text" className='outline-none bold-placeholder   text-black px-2 pl-3 sm:h-10 w-full h-8 py-1 text-sm' />
                    <div className='text-black items-center flex justify-center px-2 '><RxCross2 onClick={() => setSearch("")} size={19} className={`cursor-pointer
                    ${search.length !== 0 ? "flex" : "hidden"}
                     `} /></div>
                    <button onClick={() => searchHandler()} className='blueCol sm:text-sm text-xs px-4 sm:h-10 h-8 py-1'>Search</button>
                  </div>
                </div>


              </div>


              <div className=' flex flex-col pt-1 justify-between sm:flex-row w-full '>

              {!isMobile &&  <div className='filter1 flex flex-col'>{categoryPanel}</div>}



                <div className='sm:w-2/4 pb-20 pt-2'>

                  <div className='flex  flex-col sm:overflow-y-auto  sm:max-h-[30em] gap-4'>

                    {
                      jobs && displayedData
                        .filter(job => job._id)
                        .sort((a, b) => {
                          const dateA = new Date(a.createdAt);
                          const dateB = new Date(b.createdAt);
                          return dateB - dateA;
                        }).map((job, i) => (
                          <JobCard onClick={() => {
                            dispatch(getSingleJob(job._id))
                          }}
                            key={i}
                            job={job} />

                        ))

                    }



                    <div className={`${jobs.length == 0 ? "flex" : "hidden"}  w-full  justify-center items-center  text-center pt-16 pb-12 sm:text-xl text-lg    `}>
                      No Jobs available according to your preferences
                    </div>

                  </div>



                  <div className={` justify-center pt-20 items-center`}>
                    <div className='flex  flex-col'>


                      {/* Pagination */}
                      <div className="flex justify-center mt-1">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 mr-2"
                        >
                          Previous
                        </button>


                        {pageButtons}


                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPageCount}
                          className="bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 ml-2"
                        >
                          Next
                        </button>
                      </div>


                      {/* Mobile Filters */}
                      <div className='grid gap-4 pt-10 sm:hidden'>
                        {categoryPanel}
                        {companyPanel}
                      </div>





                    </div>
                  </div>

                </div>



            {!isMobile &&  <div className='filter2 flex flex-col ml-16'>{companyPanel}</div>}










              </div>

            </div>
          </>
        }


      </div>

    </>
  )
}
