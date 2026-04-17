import {
    registerRequest, registerSuccess, registerFail, loginRequest, loginSuccess, loginFail
    , isLoginRequest, isLoginSuccess, isLoginFail, getMeRequest, getMeSuccess, getMeFail,
    changePasswordRequest, changePasswordSuccess, changePasswordFail,
    updateProfileRequest, updateProfileSuccess, updateProfileFail,
    deleteAccountRequest, deleteAccountSuccess, deleteAccountFail, logoutClearState
} from '../slices/UserSlice'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://joblane-backend.onrender.com"

const getErrorMessage = (err, fallbackMessage) =>
    err?.response?.data?.message || err?.message || fallbackMessage


export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        const { data } = await axios.post(`${API_BASE_URL}/api/v1/register`, userData);

        dispatch(registerSuccess())
        localStorage.setItem('userToken', data.token)
        if (data.role) {
            localStorage.setItem('role', data.role)
        }
        await dispatch(logOrNot())
        await dispatch(me())
        toast.success("Registration successful !")

    } catch (err) {
        const errorMessage = getErrorMessage(err, "Registration failed. Please try again.")
        localStorage.removeItem('userToken')
        localStorage.removeItem('role')
        dispatch(logoutClearState())
        dispatch(isLoginFail())
        dispatch(registerFail(errorMessage))
        if (errorMessage.toLowerCase().includes("duplicate")) {
            toast.error("User already exists.")
        } else {
            toast.error(errorMessage)
        }
    }
}


export const loginUser = (userData) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        localStorage.removeItem('userToken')
        localStorage.removeItem('role')
        dispatch(logoutClearState())

        const { data } = await axios.post(`${API_BASE_URL}/api/v1/login`, userData);

        dispatch(loginSuccess())
        localStorage.setItem('userToken', data.token)
        if (data.role) {
            localStorage.setItem('role', data.role)
        }
        await dispatch(logOrNot())
        await dispatch(me())
        toast.success("Login successful !")

    } catch (err) {
        const errorMessage = getErrorMessage(err, "Login failed. Please try again.")
        localStorage.removeItem('userToken')
        localStorage.removeItem('role')
        dispatch(logoutClearState())
        dispatch(isLoginFail())
        dispatch(loginFail(errorMessage))
        toast.error(errorMessage)
    }
}


export const logOrNot = () => async (dispatch) => {
    try {
        dispatch(isLoginRequest())
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/v1/isLogin`, config);

        dispatch(isLoginSuccess(data.isLogin))



    } catch (err) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('role')
        dispatch(logoutClearState())
        dispatch(isLoginFail())
    }
}


export const me = () => async (dispatch) => {
    try {
        dispatch(getMeRequest())
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/v1/me`, config);
        
        localStorage.setItem("role", data.user.role)

        dispatch(getMeSuccess(data.user))

    } catch (err) {
        localStorage.removeItem('role')
        dispatch(logoutClearState())
        dispatch(getMeFail())
    }
}


export const changePass = (userData) => async (dispatch) => {
    try {
        dispatch(changePasswordRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/api/v1/changePassword`, userData, config)

        dispatch(changePasswordSuccess())
        toast.success("Password Changed successfully !")

    } catch (err) {
        dispatch(changePasswordFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/api/v1/updateProfile`, userData, config)

        dispatch(updateProfileSuccess())
        toast.success("Profile Updated successfully !")
        dispatch(me())

    } catch (err) {
        dispatch(updateProfileFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}


export const deleteAccount = (userData) => async (dispatch) => {
    try {
        console.log(userData)


        dispatch(deleteAccountRequest())

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }

        const { data } = await axios.put(`${API_BASE_URL}/api/v1/deleteAccount`, userData, config)

        console.log(data)

        dispatch(deleteAccountSuccess())
        if (data.message === "Account Deleted") {
            toast.success("Account Deleted successfully !")
            localStorage.removeItem('userToken')
            dispatch(logOrNot())
            dispatch(logoutClearState())
        }else{
            toast.error("Wrong Password !")
        }


    }
    catch (err) {
        dispatch(deleteAccountFail(err.response.data.message))
        toast.error(err.response.data.message)
    }
}
