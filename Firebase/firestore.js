import {auth, firestore} from './firebase'
import { Redirect } from 'react-router'

export const checkAdmin = (uid) => {
    return new Promise(
        async (resolve, reject) => {
            if (await auth.currentUser == null) {
                console.log(`FAILED TO CHECK ADMIN | NOT LOGINED`)
                reject(null)
            }
            try {
                firestore.collection('admin').get().then(
                    (querySnapshot) => {
                        querySnapshot.forEach(
                            (user) => {
                                if (user.id == uid) {
                                    console.log(`FOUND ADMIN USER WITH UID ${uid}`)
                                    resolve(uid)
                                }
                            }
                        )
                        console.log(`NO ADMIN USER FOUND ON | ${uid}`)
                        reject(uid)
                    }
                ).catch(
                    (err) => {
                        reject(err)
                    }
                )
            }catch(err){
                console.log(err)
                reject(err)
            }

        }
    )
} 

export const RedirectOnNotAdmin = (url) => {
    let isAdmin
    checkAdmin().then(
        () => {
            isAdmin = true
        }
    ).catch(
        () => {
            isAdmin = false
        }
    )
    console.log(isAdmin)
}

export const RedirectOnAdmin = (url) => {

    checkAdmin().then(
        (resolve) => {
            return (
                <Redirect to={url}/>
            )   
        }
    ).catch(
        () => {
            alert("No admin detected")
        }
    )
}

export const BasicUploadDocumentWithID = async (collection, doc, id) => {
    return new Promise(
        (resolve, reject) => {
            firestore.collection(collection).doc(id).set(doc).then(
                res => {
                    resolve(res)
                }
            ).catch(
                (err)=>{
                    reject(err)
                }
            )
        }
    )
}

export const BasicUploadDocument = async (collection, doc) => {
    return new Promise(
        (resolve, reject) => {
            firestore.collection(collection).add(doc).then(
                (res) => {
                    resolve(res)
                }
            ).catch(
                (err) => {
                    reject(err)
                }
            )
        }
    )
}


export const DoesPatientExist = async (cnum) => {
    return new Promise (
        (resolve, reject) => {
            firestore.collection("patient")
            .where("cnum", "==", cnum).get().then(
                (res) => {
                    if (res.docs.length > 0) {
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                }
            ).catch(
                (err) => {reject("Network connection error")}
            )
        }
    )
}

export const GetDocWithID = async (col, doc) => {
    return new Promise(
        (resolve, reject) => {
            firestore.collection(col).doc(doc).get().then(
                (res) => {
                    resolve(res)
                }
            ).catch(
                (err) => {
                    reject(err)
                }
            )
        }
    )
}