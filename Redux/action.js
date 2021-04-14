import {UPDATE_USER_INFO, UPDATE_ADMIN_STATUS} from './actionTypes'
export const updateUserInfo = (user) => {
    return (
        {
            type : UPDATE_USER_INFO,
            user : user
        }
    )
}

export const updateAdminStatus = (status) => {
    return (
        {
            type : UPDATE_ADMIN_STATUS,
            isAdmin : status
        }
    )
}