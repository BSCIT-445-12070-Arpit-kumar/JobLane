import {
    getAllJobsRequest,getAllJobsSuccess,getAllJobsFail,
    getAllUsersRequest,getAllUsersSuccess,getAllUsersFail,
    getAllAppRequest,getAllAppSuccess,getAllAppFail,
    getAppRequest, getAppSuccess, getAppFail,
    updateAppRequest, updateAppSuccess, updateAppFail,
    deleteAppRequest, deleteAppSuccess, deleteAppFail,
    getUserRequest,getUserSuccess,getUserFail,
    updateUserRequest,updateUserSuccess,updateUserFail,
    deleteUserRequest,deleteUserSuccess,deleteUserFail,
    getJobRequest, getJobSuccess, getJobFail,
    updateJobRequest, updateJobSuccess, updateJobFail,
    deleteJobRequest, deleteJobSuccess, deleteJobFail
} from '../slices/AdminSlice'
import axios from 'axios'
import {toast} from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://joblane-backend.onrender.com"
const getErrorMessage = (err, fallbackMessage) =>
    err?.response?.data?.message || err?.message || fallbackMessage

export const getAllJobsAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllJobsRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/allJobs`,config) ;

        dispatch(getAllJobsSuccess(data.jobs))

    }catch(err){
        dispatch(getAllJobsFail(getErrorMessage(err, "Failed to load jobs"))) ;
    }
}

export const getAllUsersAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllUsersRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/allUsers`,config) ;

        dispatch(getAllUsersSuccess(data.users))

    }catch(err){
        dispatch(getAllUsersFail(getErrorMessage(err, "Failed to load users"))) ;
    }
}


export const getAllAppAdmin = () => async (dispatch) => {
    try{
        dispatch(getAllAppRequest()) ;
            
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/allApp`,config) ;

        dispatch(getAllAppSuccess(data.applications))

    }catch(err){
        dispatch(getAllAppFail(getErrorMessage(err, "Failed to load applications"))) ;
    }
}


export const getAppData = (id) => async (dispatch) => {
    try{
        dispatch(getAppRequest())    
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/getApplication/${id}`,config)
        
        dispatch(getAppSuccess(data.application))

    }catch(err){
        dispatch(getAppFail(getErrorMessage(err, "Failed to load application")))
    }
}


export const updateApplication = (id,dataBody) => async (dispatch) => {
    try{    
        console.log(dataBody.status)
        if(dataBody.status === "not"){
            toast.info("Please Select Status !")
        }else{
         dispatch(updateAppRequest())    


         const config = {
             headers: {
                 Authorization: `Bearer ${localStorage.getItem('userToken')}`
             } 
         } 

         const {data} = await axios.put(`${API_BASE_URL}/api/v1/admin/updateApplication/${id}`,dataBody,config)
        
         dispatch(updateAppSuccess(data.application))
         if (data.emailSent) {
             toast.success(data.message || "Application accepted and email sent.")
         } else if (data.emailError) {
             toast.warning(data.message || "Application accepted but email failed.")
         } else {
             toast.success(data.message || "Status Updated !")
         }

         return {
             success: true,
             application: data.application,
             emailSent: data.emailSent,
             emailError: data.emailError
         }
        }
        
    }catch(err){
        const errorMessage = getErrorMessage(err, "Failed to update status")
        dispatch(updateAppFail(errorMessage))
        toast.error(errorMessage)
        return { success: false }
    }
}  


export const deleteApp = (id) => async (dispatch) => {
    try{

        dispatch(deleteAppRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/api/v1/admin/deleteApplication/${id}`,config)

        
        dispatch(getAllAppAdmin()) 
        dispatch(deleteAppSuccess())
        toast.success("Application Deleted !")

    }catch(err){
        dispatch(deleteAppFail(getErrorMessage(err, "Failed to delete application")))
    }
}



export const getUserData = (id) => async (dispatch) => {
    try{

        dispatch(getUserRequest())
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/getUser/${id}`,config)

        dispatch(getUserSuccess(data.user))

    }catch(err){
        dispatch(getUserFail(getErrorMessage(err, "Failed to load user"))) ;
    }
} 


export const updateUser = (id,userData) => async (dispatch) => {
    try{
        dispatch(updateUserRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.put(`${API_BASE_URL}/api/v1/admin/updateUser/${id}`,userData,config)

        dispatch(getUserData(id)) ;
        toast.success("Role Updated Successfully !")
        dispatch(updateUserSuccess())

    }catch(err){
        dispatch(updateUserFail(getErrorMessage(err, "Failed to update user")))
    }
}


export const deleteUser = (id) => async (dispatch) => {
    try{
        dispatch(deleteUserRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/api/v1/admin/deleteUser/${id}`,config)

        dispatch(getAllUsersAdmin()) ;
        toast.success("User Deleted Successfully !")
        dispatch(deleteUserSuccess())

    }catch(err){
        dispatch(deleteUserFail(getErrorMessage(err, "Failed to delete user")))
    }
}


export const getJobData = (id) => async (dispatch) => {
    try{
        dispatch(getJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/admin/getJob/${id}`,config) ;

        dispatch(getJobSuccess(data.job))

    }catch(err){    
        dispatch(getJobFail(getErrorMessage(err, "Failed to load job"))) ;
    }
}

export const updateJobData = (id,jobData) => async (dispatch) => {
    try{
        dispatch(updateJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.put(`${API_BASE_URL}/api/v1/admin/updateJob/${id}`,jobData,config) ;

        dispatch(updateJobSuccess())
        dispatch(getAllJobsAdmin())
        dispatch(getJobData(id)) 
        toast.success("Job Updated Successfully !")
        return { success: true }

    }catch(err){    
        const errorMessage = getErrorMessage(err, "Failed to update job")
        dispatch(updateJobFail(errorMessage)) ;
        toast.error(errorMessage)
        return { success: false }
    }
}


export const deleteJobData = (id) => async (dispatch) => {
    try{
        dispatch(deleteJobRequest()) ;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/api/v1/admin/deleteJob/${id}`,config) ;

        dispatch(deleteJobSuccess())
        dispatch(getAllJobsAdmin())
        toast.success("Job Deleted Successfully !")

    }catch(err){    
        dispatch(deleteJobFail(getErrorMessage(err, "Failed to delete job"))) ;
    }
}
