import React, { useContext } from 'react'
import AuthContext from '../Context/userAuthContext'
import { TextField, Button, Link } from '@mui/material'



export const LoginPage = () => {

    const { loginUser } = useContext(AuthContext)
    const handleSubmit = e => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        email.length > 0 && loginUser(email, password)

        console.log(email)
        console.log(password)

    }

    return (
        <div>
            <>
                <div>
                    <form onSubmit={handleSubmit} >
                        <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto' }}>

                            <TextField
                                sx={{ mt: 5 }}
                                id="email"
                                name="email"
                                label="Email"

                            />

                            <TextField
                                sx={{ mt: 5 }}
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                            />

                            <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }}>
                                Submit
                            </Button>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                                    { `Don't have an account? ` } 
                                    <Link href="/register" underline="always" style={{ color: "#393f81" }}>
                                        Register Now
                                    </Link>
                                </p>
                                <Link href="/forgotPassword" underline="hover" style={{ color: "#393f81" }} sx={{ my: 2}}>
                                    forgot password
                                </Link>
                            </div>
                        </div>
                    </form>

                </div>


            </>

        </div>
    )
}






























// import React, { useContext } from 'react'
// import { useFormik } from 'formik';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { Box, margin } from '@mui/system';
// import AuthContext from '../Context/userAuthContext';


// export const LoginPage = () => {
//     const { loginUser } = useContext(AuthContext)
//     const handleSubmit = e => {
//         e.preventDefault()
//         const email = e.target.email.value
//         const password = e.target.password.value

//         email.length > 0 && loginUser(email, password)

//         console.log(email)
//         console.log(password)

//     }

//     const formik = useFormik({
//         initialValues: {
//             email: '',
//             password: '',
//         }
//     });



//     return (
    //     <div>
    //         <form onSubmit={formik.handleSubmit} >
    //             <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto' }}>
    //                 <TextField
    //                     id="email"
    //                     name="email"
    //                     label="Email"
    //                     value={formik.values.email}
    //                     onChange={formik.handleChange}
    //                     onBlur={formik.handleBlur}
    //                     error={formik.touched.email && Boolean(formik.errors.email)}
    //                     helperText={formik.touched.email && formik.errors.email}
    //                     sx={{ mt: 5 }}

    //                 />{ }

    //                 <TextField
    //                     sx={{ mt: 5 }}
    //                     id="password"
    //                     name="password"
    //                     label="Password"
    //                     type="password"
    //                     value={formik.values.password}
    //                     onChange={formik.handleChange}
    //                     onBlur={formik.handleBlur}
    //                     error={formik.touched.password && Boolean(formik.errors.password)}
    //                     helperText={formik.touched.password && formik.errors.password}
    //                 />

    //                 <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }}>
    //                     Submit
    //                 </Button>
    //             </div>
    //         </form>

    //     </div>

    // );
// };



