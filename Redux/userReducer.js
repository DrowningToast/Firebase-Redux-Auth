import {UPDATE_ADMIN_STATUS, UPDATE_USER_INFO} from './actionTypes'
import {auth} from '../Firebase/firebase'

let initialState = {
    fitness : 0,
    user : auth.currentUser,
    isLogin : false,
    admin : null
}

let newState = {
    fitness : 1,
    user : null,
    isLogin : null,
    admin : null
}

let userReducer = (state = initialState, action) => {

    // Force something to update
    newState.fitness = state.fitness + 1
    switch (action.type) {

        case UPDATE_USER_INFO:
            let status = false;
            // Check if the user is valid or not
            if (action.user != null) {
                status = true
            }else{
                status = false
            }
            // Check for admin privilege
            newState.user = action.user
            newState.isLogin = status
            return Object.assign(state, newState)

        case UPDATE_ADMIN_STATUS:
            newState.admin = action.isAdmin
            return Object.assign(state, newState)
        default:
            return state

    }
}

export default userReducer;