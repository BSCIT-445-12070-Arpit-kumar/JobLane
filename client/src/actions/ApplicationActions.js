import axios from 'axios'
import {createApplicationRequest , createApplicationSuccess, createApplicationFail,
    allAppliedJobsRequest, allAppliedJobsSuccess, allAppliedJobsFail,
    applicationDetailsRequest, applicationDetailsSuccess, applicationDetailsFail,
    deleteApplicationRequest, deleteApplicationSuccess, deleteApplicationFail} from '../slices/ApplicationSlice'
    
import {me} from '../actions/UserActions'
import {toast} from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://joblane-backend.onrender.com"

export const createApplication = (id) => async (dispatch) =>{
    try{
        dispatch(createApplicationRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const { data } = await axios.post(`${API_BASE_URL}/api/v1/createApplication/${id}`, {}, config) ;
        
        if(data.success) {
            dispatch(createApplicationSuccess())
            dispatch(me())
            toast.success("Applied Successfully")
            return { success: true, data }
        } else {
            throw new Error(data.message || "Failed to apply")
        }

    }catch(err){
        const errorMsg = err.response?.data?.message || err.message || "Failed to apply"
        dispatch(createApplicationFail(errorMsg))
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
    }
}


export const getAppliedJob = () => async (dispatch) => {
    try{

        dispatch(allAppliedJobsRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/getAllApplication`,config) ;

        dispatch(allAppliedJobsSuccess(data.allApplications))

    }catch(err){
        dispatch(allAppliedJobsFail())
    }
}


export const getSingleApplication = (id) => async (dispatch) => {
    try{

        dispatch(applicationDetailsRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.get(`${API_BASE_URL}/api/v1/singleApplication/${id}`,config) ;

        dispatch(applicationDetailsSuccess(data.application))

    }catch(err){
        dispatch(applicationDetailsFail())
    }
}

export const deleteApplication = (id) => async (dispatch) => {
    try{

        dispatch(deleteApplicationRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            } 
        }

        const {data} = await axios.delete(`${API_BASE_URL}/api/v1/deleteApplication/${id}`,config)

        dispatch(deleteApplicationSuccess())
        dispatch(getAppliedJob())
        dispatch(me())
        
        toast.success("Application Deleted Successfully !") 

    }catch(err){
        dispatch(deleteApplicationFail(err.response.data.message))
    }
}