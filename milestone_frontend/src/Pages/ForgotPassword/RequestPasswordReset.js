import { Button, TextField, Typography } from "@mui/material";
import { API_URI } from "../../utils/constants";
import Swal from "sweetalert2";

export const RequestPasswordReset = () => {
    const handleResetPasswordEmailSubmit = async (e) => {
        e.preventDefault()
        const email = e.target.email.value;
        console.log("Reset email: ", email);
        const response = await fetch(`${API_URI}/api/request-reset-email`, { method: 'POST', headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            email,
        })
        });
        const data = await response.json();
        console.log(' Reset Email: ', data);
        const isResponseSuccess = response.status === 200;
        Swal.fire({
            title: isResponseSuccess ? data.success: data.error,
            icon:  isResponseSuccess? "success" : "error",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }
    return (<>
        <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto', paddingTop: '50px' }}>
            <Typography variant="h6" noWrap component="div">
                Please confirm you email address
            </Typography>
            <form style={{ display: "flex", flexDirection: 'column', justifyContent: 'center'}} onSubmit={handleResetPasswordEmailSubmit}>
                <TextField sx={{ mt: 5 }}
                    id="email"
                    name="email"
                    label="email">
                </TextField>
                <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }} >Submit</Button>
            </form>

        </div>
    </>)
};
