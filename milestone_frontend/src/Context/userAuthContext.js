import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const swal = require('sweetalert2')

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")? JSON.parse(localStorage.getItem("authTokens")): null);
    

    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")? jwt_decode(localStorage.getItem("authTokens")): null);


    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    const Navigate = useNavigate();

    
    const loginUser = async (email, password) => {
        const response = await fetch( "http://127.0.0.1:8000/api/login/",{     
            // "http://127.0.0.1:8000/api/token/",
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);

        if(response.status === 200){
            console.log("Logged In");
            
            // Navigate("/dashboard")
            Navigate("/2factorauth")
            // setAuthTokens(data)
            // setUser(jwt_decode(data.access))
            // localStorage.setItem("authTokens", JSON.stringify(data))
            setUserId(data.user.replace(/-/g, ''))
            swal.fire({
                title: data.message,
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } 
       else if(response.status === 401){
            console.log("user deactivated")
            swal.fire({
                title: data.detail,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
       }

        else {    
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const validate2FA = async (otp)=>{
        const response = await fetch("http://127.0.0.1:8000/api/verity-otp/",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                otp,
                user_id: userId,
            })
        })
        const data = await response.json()
        console.log(data);
        if(response.status === 200){
            console.log("Logged In By MFA");
            Navigate("/dashboard")
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            swal.fire({
                title: "Successfully Authenticated User",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    
    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })
        if(response.status === 201 || response.status === 200 ){
            Navigate("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        Navigate("/login")
        swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        userId,
        setUserId,
        registerUser,
        loginUser,
        logoutUser,
        validate2FA,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )


}