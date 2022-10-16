
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
import { useContext, useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function LoginPage() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [dialogTitle, setDialogTitle] = useState("")
	const [dialogMsg, setDialogMsg] = useState("")
	const [isLoginSuccess, setIsLoginSuccess] = useState(false)
	const navigate = useNavigate();

	const { isLoggedInToken, setIsLoggedInToken } = useContext(UserContext);

	const handleLogin = async () => {
		setIsLoginSuccess(false)
		const res = await axios.post(URL_USER_SVC + "/login", { username, password })
			.catch((err) => {
				if (err.response.status === STATUS_CODE_CONFLICT) {
					setErrorDialog(err.response.data.message)
				} else {
					setErrorDialog(err.response.data.message)
				}
			})
		if (res && res.status === STATUS_CODE_CREATED) {
			setIsLoggedInToken(res.data.token);
			setIsLoginSuccess(true)
			document.cookie = res.data.token;
			navigate("/home", { state: { token: res.data.token, username: username } })
		}
	}

	const closeDialog = () => setIsDialogOpen(false)

	const setErrorDialog = (msg) => {
		setIsDialogOpen(true)
		setDialogTitle('Error')
		setDialogMsg(msg)
	}

	const handleForgetPassword = () => {
		navigate("/signup", { state: "resetPassword" });

	}

	const handleSignUp = () => {
		navigate("/signup", { state: "signup" });

	}

	return (
		<Box display={"flex"} flexDirection={"row"} height="100vh">
			<Box display={"flex"} flex={1} flexDirection="column" justifyContent="center">
				<Box display={"flex"} flexDirection="column" padding="25%">
					<Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">Welcome Back</Typography>
					<Typography variant={"body2"} marginBottom={"2rem"}><b>Please enter your details</b></Typography>
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
						onChange={(e) => setPassword(e.target.value)}
						sx={{ marginBottom: "1rem" }}
					/>
					<Typography variant={"body2"}>
						<a style={{
							fontWeight: "bolder",
							textDecoration: "none",
							color: "#1976d2",
						}}
							href={""} onClick={handleForgetPassword}>Reset password</a>
					</Typography>
					<Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} marginTop="0.5rem">
						<Button variant={"contained"} onClick={handleLogin} fullWidth><b>Login</b></Button>
					</Box>
					<Typography variant={"body2"} marginTop={"1rem"}>Don't have an account?
						<a style={{
							marginLeft: "0.5em",
							fontWeight: "bolder",
							textDecoration: "none",
							color: "#1976d2"
						}}
							href={""} onClick={handleSignUp}>Sign up now</a>
					</Typography>
					<Dialog
						open={isDialogOpen}
						onClose={closeDialog}
					>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogContent>
							<DialogContentText>{dialogMsg}</DialogContentText>
						</DialogContent>
						<DialogActions>
							{isLoginSuccess
								? <Button component={Link} to="/login">Log in</Button>
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
		</Box >
	)
}

export default LoginPage;
