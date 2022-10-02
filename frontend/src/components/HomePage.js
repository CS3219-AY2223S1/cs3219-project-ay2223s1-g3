import { useEffect, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	Typography
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"


function HomePage({socket}) {
	const [difficultyLevel, setDifficultyLevel] = useState("Easy");
	const [isLoading, setIsLoading] = useState(false);
	const [loadingComment, setLoadingComment] = useState("");
	const [timer, setTimer] = useState(-1);

	let navigate = useNavigate();
	let location = useLocation();

	const question_service_url = "http://localhost:8002/"
	const match_timeout = 30
	let username = "daemon";

	useEffect(() => {
		if (location.state != null && location.state.username != null) {
			username = location.state.username;
		}
	}, [])

	useEffect(() => {
		socket.on('match-found', message => {
			handleMatch(message.roommates)
		});

		return () => {
			socket.off('match-found');
		}
	}, [difficultyLevel])

	const handleChange = (event) => {
		setDifficultyLevel(event.target.value);
	}

	const handleClick = () => {
		setIsLoading(true);
		setLoadingComment("Finding match...");

		// Socket connections are disconnected on page refresh and that is the expected behavior across browsers.
		socket.emit('find-match', difficultyLevel, username);
		setTimer(match_timeout) // triggers useEffect
	}

	useEffect(() => {
		if (timer > 0) {
			setTimeout(() => setTimer(timer-1), 1000)
			setLoadingComment("Finding match... (" + timer + "s)")
		} else if (timer === 0) {
			handleNoMatch();
		}
	}, [timer])

	const handleMatch = (roommates) => {
		setTimer(-1);
		setLoadingComment("Fetching question...");

		fetch(question_service_url + difficultyLevel, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(roommates),
		})
		.then(res => {
			if (!res.ok) {
				return Promise.reject(res)
			}
			return res.json()
		})
		.then(res => {
			let question = "What is love?"
			if (res && Object.keys(res).length !== 0) {
				question = res
			}
			navigate("/room", { state: {
				question: question,
				difficultyLevel: difficultyLevel,
				roommates: roommates
			} });
		})
		.catch(err => console.log(err))
	}

	const handleNoMatch = () => {
		socket.emit("disconnect-match")
		setIsLoading(false);
		setLoadingComment("");
	}

	return (
		<Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
			<Typography variant={"h3"} marginBottom={"2rem"} fontWeight="bold">PeerPrep</Typography>
			<Typography variant={"body1"} fontWeight="bold">Select difficulty level</Typography>
			<FormControl sx={{ m: 1, minWidth: 300 }}>
				<Select
					labelId="select-label"
					id="difficulty-select"
					value={difficultyLevel}
					onChange={handleChange}
					size="medium"
				>
					<MenuItem value={"Easy"}><Typography color="common.black">Easy</Typography></MenuItem>
					<MenuItem value={"Medium"}>Medium</MenuItem>
					<MenuItem value={"Hard"}>Hard</MenuItem>
				</Select>
			</FormControl>
			{isLoading ?
			<>
			<Button onClick={handleNoMatch} color={"warning"}>Cancel matching</Button>
			<CircularProgress/>
			{loadingComment}
			</>
			: <Button onClick={handleClick}>Let's go</Button>
			}
		</Box>
	)

}

export default HomePage;