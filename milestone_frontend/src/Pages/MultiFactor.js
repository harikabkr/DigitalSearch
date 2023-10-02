import React, { useContext } from 'react'
import { Button, TextField } from "@mui/material"
import AuthContext from '../Context/userAuthContext'

export const MultiFactor = () => {
    const { validate2FA } = useContext(AuthContext)
    const handleOTPFormSubmit = (e) => {
        e.preventDefault()
        const otp = e.target.otp.value
        console.log("Declaring otp variable")
        console.log(otp)
        validate2FA(otp)
        console.log("validated", otp)
    }
    return (
        <>
            <form style={{ display: "flex", flexDirection: 'column', width: 200, justifyContent: 'center', margin: 'auto' }} onSubmit={handleOTPFormSubmit}>
                <TextField sx={{ mt: 5 }}
                    id="otp"
                    name="otp"
                    label="otp">
                </TextField>
                <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }} >Submit</Button>
            </form>
        </>
    )
}