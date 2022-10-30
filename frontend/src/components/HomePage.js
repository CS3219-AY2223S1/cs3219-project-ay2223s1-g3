import { useContext, useEffect, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	List,
	ListItem,
	MenuItem,
	Select,
	Typography
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"
import { getQuestion } from "../api/question-service"
import { addQuestionDone, getQuestionsDone } from "../api/history-service";
import { UserContext } from "./UserContext";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import BackgroundImage from "../HomeScreenBackground.png"

function HomePage({ socket }) {
	const [difficulty, setDifficulty] = useState("Easy");
	const [isLoading, setIsLoading] = useState(false);
	const [loadingComment, setLoadingComment] = useState("");
	const [timer, setTimer] = useState(-1);
	const [questionHistory, setQuestionHistory] = useState([]);

	let navigate = useNavigate();
	let location = useLocation();
	const { setIsLoggedInToken } = useContext(UserContext);

	const match_timeout = 30

	useEffect(() => {
		getQuestionsDone(location.state.username).then(res => setQuestionHistory(res.data));
	}, [])

	useEffect(() => {
		socket.on('match-found', message => {
			handleMatch(message.roommates)
		});

		return () => {
			socket.off('match-found');
		}
	}, [difficulty])

	const handleChange = (event) => {
		setDifficulty(event.target.value);
	}

	const handleClick = () => {
		setIsLoading(true);
		setLoadingComment("Finding match...");

		// Socket connections are disconnected on page refresh and that is the expected behavior across browsers.
		socket.emit('find-match', difficulty, location.state.username);
		setTimer(match_timeout) // triggers useEffect
	}

	useEffect(() => {
		if (timer > 0) {
			setTimeout(() => setTimer(timer - 1), 1000)
			setLoadingComment("Finding match... (" + timer + "s)")
		} else if (timer === 0) {
			handleNoMatch();
		}
	}, [timer])

	const handleMatch = (roommates) => {
		setTimer(-1);
		setLoadingComment("Fetching question...");
		const username = location.state.username;
		getQuestionsDone(username)
			.then((res) => res.data.filter(qn => qn.difficulty == difficulty))
			.then((res) => res.map((data) => data.question))
			.then((res) => {
				getQuestion(difficulty, roommates, res)
					.then((res) => {
						addQuestionDone(username, res.num, difficulty, res.title, roommates.filter(e => e != username))

						navigate('/room', {
							state: {
								username: username,
								question: res,
								difficulty: difficulty,
								roommates: roommates,
								token: location.state.token,
							},
						});
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	}

	const handleNoMatch = () => {
		socket.emit("disconnect-match")
		setIsLoading(false);
		setLoadingComment("");
	}

	const handleLogout = async () => {
		const username = location.state.username
		const res = await axios.post(URL_USER_SVC + "/logout", { username }, { withCredentials: true })

		if (res) {
			setIsLoggedInToken(null);
			window.localStorage.clear();
			navigate("/login");
		}
	}
	return (
		<Box display={"flex"} flexDirection={"column"} justifyContent={"center"} height="100vh" alignItems={"center"} style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: " center center" }}>
			<Button variant="contained" style={{ position: "absolute", top: "20px", right: "20px" }} onClick={() => handleLogout()} color={"warning"}><b>Logout</b></Button>
			<Typography variant={"h3"} marginBottom={"3rem"} fontWeight="bold">PeerPrep</Typography>
			<Typography variant={"body1"} fontWeight="bold">Select difficulty level</Typography>
			<FormControl sx={{ m: 2, minWidth: 300 }}>
				<Select
					labelId="select-label"
					id="difficulty-select"
					value={difficulty}
					onChange={handleChange}
					size="medium"
				>
					<MenuItem value={"Easy"}>Easy</MenuItem>
					<MenuItem value={"Medium"}>Medium</MenuItem>
					<MenuItem value={"Hard"}>Hard</MenuItem>
				</Select>
			</FormControl>
			{
				isLoading ?
					<>
						<Button onClick={handleNoMatch} color={"warning"}>Cancel matching</Button>
						<CircularProgress />
						{loadingComment}
					</>
					: <Button variant="contained" style={{ width: "300px", borderRadius: "8px", padding: "10px", marginBottom: "5rem" }} onClick={handleClick}><b>Let's go</b></Button>
			}
			<div style={{ display: "flex", flexDirection: "column", border: "solid 1px #1976d2", borderRadius: "14px", minWidth: "600px", minHeight: "400px" }}>
				<Typography variant="h5" component="div" style={{ color: "white", backgroundColor: "#1976d2", borderRadius: "11px 11px 0px 0px", height: "40px", padding: "14px" }}>
					Attempted Questions
				</Typography>
				<div style={{ display: "flex", flexDirection: "column" }}>
					{questionHistory.length === 0 ? <Typography style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "150px" }}>No attempts yet!</Typography> : <List >
						{questionHistory.map(item => {
							return (
								<>
									<ListItem style={{ width: "600px", display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
										<div>
											{item.question}
										</div>
										<div>
											{item.title}
										</div>
										<div>
											{item.roommates}
										</div>
										<div>
											<Typography color={item.difficulty === "Hard" ? "red" : item.difficulty === "Medium" ? "orange" : "green"}>
												<b>{item.difficulty}</b>
											</Typography>
										</div>
									</ListItem>
									<Divider style={{ marginTop: "15px" }} />
								</>
							)
						})}
					</List>}
				</div>
			</div>
		</Box >
	)

}

export default HomePage;