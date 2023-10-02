import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URI } from "../../utils/constants";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, TextField, Typography } from "@mui/material";

export const ConfirmPasswordReset = () => {
    const Navigate = useNavigate();
    const { uidb64, token } = useParams();
    const [ isValid, setIsValid] = useState(false);
    
    const confirmPasswordReset = async () => {
        console.log('> Confirm Password Reset', uidb64, token);
        // const response = await 
        axios.get(`${API_URI}/api/password-reset/${uidb64}/${token}/`)
        .then((response)=>{
            const data = response.data;
            console.log('> Reset confirm', data);
            if (response.status === 200){
                setIsValid(true);
            } else {
                setIsValid(false);
            }
        })
        .catch((e)=>{
            console.error('Error while validating data: ', e);
            setIsValid(false);
        });
        // const data = response.data;
        // console.log('> Reset confirm', data);
        // if (response.status === 200){
        //     setIsValid(true);
        // } else {
        //     setIsValid(false);
        // }
    };

    const completeResetPassword = async(e) => {
        e.preventDefault();
        console.log('> Confirm Password Reset', uidb64, token);
        const payload = {
            password:  e.target.password.value,
            uidb64,
            token,
        }
        const response = await axios.patch(`${API_URI}/api/password-reset-complete`, payload);
        if (response.status === 200){
            const data = response.data;
            Navigate('/login');
            Swal.fire({
                title: data.message,
                icon:  "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {
            const data = response.data;
            Swal.fire({
                title: data.detail,
                icon:  "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        }
    };

    useEffect(() => {
        confirmPasswordReset();
    }, []);
    return isValid ? (
        <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto', paddingTop: '2rem' }}>
            <Typography variant="h6" noWrap component="div">
                Reset Password
            </Typography>
            <form style={{ display: "flex", flexDirection: 'column', justifyContent: 'center'}} onSubmit={completeResetPassword}>
                <TextField sx={{ mt: 5 }}
                    id="password"
                    name="password"
                    label="password"
                    type="password">
                </TextField>
                <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }} >Submit</Button>
            </form>
        </div>
    ) : (
        <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto', paddingTop: '2rem' }}>
            <Typography variant="h6" noWrap component="div">
                Reset Password Link Expired, please try again !!!
            </Typography>
        </div>
    );
};