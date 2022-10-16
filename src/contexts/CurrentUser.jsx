import { createContext, useState, useEffect} from "react";
import httpClient from "../httpClient";

export const CurrentUser = createContext()

function CurrentUserProvider({ children }){

    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {

        setCurrentUser(JSON.parse(sessionStorage.getItem('user')))
        console.log(currentUser)

    //     const getLoggedInUser = async () => {
    //         try {
    //             const response = await httpClient.get(`http://iarchiveapp-env.eba-ezit6mbr.us-east-1.elasticbeanstalk.com/@me`)
    //             console.log(response.data)
    //             if (response.status === 200){
    //                 setCurrentUser(response.data.user[0])
    //             } else {
    //                 throw "error"
    //             }
    //         } catch(error){
                
    //         }
    //     }
    //     getLoggedInUser()
    }, [])

    return (
            <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
                    {children}
            </CurrentUser.Provider>
        
    )
}

export default CurrentUserProvider