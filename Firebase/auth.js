import { auth } from './firebase'
import { Redirect } from 'react-router-dom'
import {updateAdminStatus, updateUserInfo} from '../Redux/action'
import store  from '../Redux/store'
import { checkAdmin } from './firestore'
import firebase from 'firebase/app'

// Update Redux state when user state change
auth.onAuthStateChanged(
    (user) => {
        // Load account data from firebase auth to redux state
        if (user) {
            // Sign in
            console.log(`user state has changed : ${user}`)
            store.dispatch(updateUserInfo(user))
        }else{
            // Not sign in
            console.log(`user state has changed : ${user}`)
            store.dispatch(updateAdminStatus(false))
            store.dispatch(updateUserInfo(user))
        }

        checkAdmin(user?.uid).then(
                res => {
                    store.dispatch(updateAdminStatus(true))
                }
            ).catch(
                reject => {
                    store.dispatch(updateAdminStatus(false))
                }
            )

    }
)

// An async function which returns a promimse | If the current user is logined, resolve user object from redux state if not reject null
export const getCurrentUser = async () => {
    return new Promise(
        (resolve, reject) => {
            if (store.getState('user')) {
                resolve(store.getState('user').user)
            }else{
                reject(null)
            }
        }
    )
}

// * An async function which takes email and password and completely handle the login process
export const handleLoginWithEmail = async (email, password) => {
    try {
        if (email == '' || password == '') throw('Empty email or password')
        await sanitizeInput(email)
        const validPass = await sanitizeInput(password)
        const validEmail = await validateEmail(email)
        let response = await signinEmail(validEmail, validPass)
        let adminStatus = await checkAdmin(response.user.uid).then(res=>{return true}).catch(err=>{return false})
        store.dispatch(updateAdminStatus(adminStatus)) 
    }catch (err) {
        store.dispatch(updateAdminStatus(false))
        alert(err)
    }
}

// Async function which returns a promise | takes email and password to login the user in
export const signinEmail = async (email, password) => {
    return new Promise(
        (resolve, reject) => {
            try {
                let response = auth.signInWithEmailAndPassword(email, password)
                resolve(response)   // let authOnStateChange handle updating redux state
            }catch(reject){
                reject("An error has occured while trying to sign you in : " + reject)
            }
        }
    )
}



// Async function which returns promise | takes email and password to sign up the user
export const signupEmail = async (email, password) => {
     return new Promise(
         (resolve, reject) => {
            try {
                let response = auth.createUserWithEmailAndPassword(email, password)
                resolve(response)
            }catch(reject) {
                reject("An error has occurred while trying to creating a new user : " + reject)
            }
         }
     )
 }

 // Async function which returns a promise | Which resolve the current user object if signed in and reject null when not signed in
export const asyncHasSignedin = async () => {
    return await new Promise(
        (resolve, reject) => {
            console.log(auth.currentUser)
            if (auth.currentUser === null) {
                reject(null)
            }else{
                resolve(auth.currentUser)
            }
        }
    )
}

// A function which returns an object | Returns currentUser object of signed in user
export const hasSignedin = () => {
    return auth.currentUser
}

// A function which returns a string | Returns string of the signed in user
export const getCurrentEmail = () => {
    return auth.currentUser?.email
}

// An async function which returns a Promise | Resolve upon successfully sign out
export const signout = async () => {
    return new Promise(
        (resolve, reject) => {
            try {
                auth.signOut();
                resolve("Successfully Signout")
            }catch(err){
                reject("An error has been occured while trying to signout : " + err)
            }
        }
    )
}

// Redirect on signed in as an Admin
export function RedirectOnAdmin (url) {
    if (store.getState().admin) {
        return <Redirect to={url}/>
    }
}

export function RedirectOnNotAdmin (url) {
    if (!store.getState().admin){
        return <Redirect to={url}/>
    }
}

// A function which takes url path and returns JSX element | Returns <Redirect/> element which will redirect to the input url path if the usesr is currently signed in
export function RedirectOnSignin (path) {
    if (auth.currentUser && store.getState().fitness > 1) {
        return <Redirect to={path}></Redirect>
    }
}

// A function which takes url path and returns JSX element | Returns <Redirect/> element which will redirect to the input url path if the user is currently signed in
export function RedirectOnSignout (path) {
    if (!auth.currentUser && store.getState().fitness > 1) {
        console.log("The user is signed out, I'm redirecting")
        return <Redirect to={path}></Redirect>
    }
}

// A function which takes 2 url paths and will returns a given url path | Returns data depends on user currentSignedin status
export function variablePathOnSignin(onSignin, onSignout) {
    try {
        if (typeof store.getState().user === 'undefined' || store.getState().user == null) {
            console.log("Path has been alter to false")
            return onSignout
        }else{
            console.log("Path has been alter to true")
            return onSignin
        }
    }catch(err){
        return onSignout
    }
}

// A function which takes a string and return a promise | Resolve the given string if the string doesn't contain any forbidden char and reject if does
export const sanitizeInput = (unknown, type = typeof 'a') => {
    return new Promise(
        (resolve, reject) => {
            if (typeof unknown === typeof 'a') {
                if (unknown.includes('>') || unknown.includes('<') || unknown.includes("'") || unknown.includes('""') || unknown.includes('/') || unknown.includes("\\")) {
                    reject("Invalid Char")
                    return
                }
                resolve(unknown)
            }
        }
    )
}

// A function which takes a email string and return a promise | Resolve if the given string is in valid email format and reject if not
export const validateEmail = (unknown) => {
    return new Promise(
        (resolve, reject) => {  
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let result = re.test(String(unknown).toLowerCase());
            if (result) {
                resolve(unknown)
            }else{
                reject("Invalid Email")
            }
        }
    )
}

// Google Signin Method
const provider = new firebase.auth.GoogleAuthProvider()

export const signinWithGooglePopup = async () => {

    auth.signInWithPopup(provider).then(
        (res) => {
            console.log(res)
        }
    ).catch(
        (err)=>{
            console.log(err)
        }
    )

}