import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, useLocation, useNavigate } from 'react-router-dom'

//TODO: integrate sign up APIs

function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const [isValidPassword, setIsValidPassword] = useState(true);

    let location = useLocation();

    const handleSignup = async () => {
        setIsSignupSuccess(false)
        if (password !== confirmPassword) {
            setErrorDialog("Passwords do not match")
            return;
        }
        if (!isValidPassword) {
            setErrorDialog("Invalid password")
            return;
        }
        const res = await axios.post(URL_USER_SVC, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog(err.response.data.message)
                } else {
                    setErrorDialog(err.response.data.message)
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Account successfully created')
            setIsSignupSuccess(true)
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setIsValidPassword(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&£]{8,}$/.test(e.target.value));
    }

    const handleResetPassword = async () => {
        setIsSignupSuccess(false)
        const res = await axios.post(URL_USER_SVC + "/pwChange", { username: username, oldPw: confirmPassword, newPw: password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog(err.response.data.message)
                } else {
                    setErrorDialog(err.response.data.message)
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Password successfully reset')
            setIsSignupSuccess(true)
        }
    }

    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    return (
        <Box display={"flex"} flexDirection={"row"} height="100vh">
            <Box display={"flex"} flex={1} flexDirection="column" justifyContent="center">
                <Box display={"flex"} flexDirection="column" padding="25%">
                    <Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">
                        {location.state === "signup" ? "Create your account" : "Change Password"}
                    </Typography>
                    <TextField
                        label="Username"
                        variant="standard"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                        autoFocus
                    />
                    <TextField
                        label="Password"
                        variant="standard"
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e)}
                        sx={{ marginBottom: "0.5rem" }}
                        error={!isValidPassword}
                    // inputProps={{ class pattern: '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$' }}
                    />
                    <Typography fontSize={12}><b>• At least 8 characters</b></Typography>
                    <Typography fontSize={12} ><b>• At least one letter and one number</b></Typography>
                    <Typography fontSize={12} marginBottom={"1rem"}><b>• At least one special character</b></Typography>
                    <TextField
                        label={location.state === "signup" ? "Confirm password" : "Old password"}
                        variant="standard"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ marginBottom: "2rem" }}
                    />
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        {location.state === "signup" ?
                            <Button variant={"contained"} onClick={handleSignup} fullWidth><b>Sign up</b></Button>
                            : <Button variant={"contained"} onClick={handleResetPassword} fullWidth><b>Reset Password</b></Button>
                        }
                    </Box>
                    <Dialog
                        open={isDialogOpen}
                        onClose={closeDialog}
                    >
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{dialogMsg}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            {isSignupSuccess
                                ? <Button component={Link} to="/login">Login</Button>
                                : <Button onClick={closeDialog}>Done</Button>
                            }
                        </DialogActions>
                    </Dialog>
                </Box>

            </Box>

            <Box flex={1} style={{ background: "linear-gradient(#1976d2, #8dc3f7)" }}>
                <Box style={{ paddingLeft: "25%", paddingTop: "20%", paddingRight: "10%" }}>
                    <Typography variant={"h1"} color={"common.white"} marginBottom={"3rem"} fontWeight="bold">PeerPrep</Typography>
                    <Typography variant={"h5"} color={"common.white"} marginBottom={"15rem"} fontWeight="bold">
                        Your all in one stop to tech interview preparation. Complete technical questions together with your peers
                        under realistic conditions and pass the interview of your dreams together.
                    </Typography>
                    <Typography display="block" variant={"subtitle"} color={"common.white"} marginBottom={"1rem"} >
                        "I used PeerPrep to prepare for my interview with Foogle and managed to secure my dream job within 2 weeks!" - Bob
                    </Typography>
                    <Typography display="block" variant={"subtitle"} color={"common.white"} marginBottom={"3rem"} >
                        "I had so much fun preparing for my tech interviews with PeerPrep!" - Alice
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default SignupPage;
