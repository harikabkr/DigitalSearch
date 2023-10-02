import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../Context/userAuthContext'
import { Button, TextField } from '@mui/material'


export const RegisterPage = () => {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const { registerUser } = useContext(AuthContext)

    console.log(email);
    console.log(username);
    console.log(password);
    console.log(password2);


    const handleSubmit = async e => {
        e.preventDefault()
        registerUser(email, username, password, password2)
    }


    return (
        <div>
            <>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto' }}>
               
                    <TextField
                        sx={{ mt: 5 }}
                        id="email"
                        name="email"
                        label="Email"
                        onChange={e => setEmail(e.target.value)}
                    ></TextField>
                    {/* <input
                              type="email"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              placeholder="Email Address"
                              onChange={e => setEmail(e.target.value)}
                            /> */}
                    <TextField
                        sx={{ mt: 5 }}
                        id="Username"
                        name="Username"
                        label="Username"
                        onChange={e => setUsername(e.target.value)}
                    ></TextField>
                    {/* <div className="form-outline mb-4">
                            <input
                              type="text"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              placeholder="Username"
                              onChange={e => setUsername(e.target.value)}

                            />
                          </div> */}
                    <TextField
                        sx={{ mt: 5 }}
                        id="password"
                        name="password"
                        label="password"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    ></TextField>
                    {/* <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              placeholder="Password"
                              onChange={e => setPassword(e.target.value)}

                            />
                          </div> */}
                    <TextField
                        sx={{ mt: 5 }}
                        id="password2"
                        name="password2"
                        type="password"
                        label="Confirm password"
                        onChange={e => setPassword2(e.target.value)}
                    ></TextField>

                    {/* <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="form2Example27"
                              className="form-control form-control-lg"
                              placeholder="Confirm Password"
                              onChange={e => setPassword2(e.target.value)}

                            />
                          </div> */}

                    <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }}>
                        Register
                    </Button>

                    {/* <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Register
                            </button>
                          </div> */}
                    {/* <a className="small text-muted" href="#!">
                            Forgot password?
                          </a> */}
                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#393f81" }}>
                            Login Now
                        </Link>
                    </p>
                    {/* <a href="#!" className="small text-muted">
                        Terms of use.
                    </a> */}
                    {/* <a href="#!" className="small text-muted">
                        Privacy policy
                    </a> */}
                    </div>
                </form>
            </>
        </div>
    )
}

// export default Registerpage