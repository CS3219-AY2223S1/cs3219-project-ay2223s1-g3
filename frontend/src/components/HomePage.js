import { useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom"

const question_service_url = "http://localhost:8002/"

function HomePage({socket}) {
	const [difficultyLevel, setDifficultyLevel] = useState("Easy");
	const [isLoading, setIsLoading] = useState(false);

	let navigate = useNavigate();

	const handleChange = (event) => {
		setDifficultyLevel(event.target.value);
	}

	const handleClick = () => {
		setIsLoading(true);

		// Socket connections are disconnected on page refresh and that is the expected behavior across browsers.
		socket.emit('find-match', difficultyLevel);
		//TODO: API to find match with another user
		setTimeout(() => {
			handleMatch();
		}, 2000)

		// frontend to call 'disconnect-event' after 30 seconds.
	}

	const handleMatch = () => {
		setIsLoading(false);

		fetch(question_service_url + difficultyLevel)
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
			navigate("/room", { state: { question: question, difficultyLevel: difficultyLevel } });
		})
		.catch(err => console.log(err))
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
			{isLoading ? <CircularProgress /> :
				<Button onClick={handleClick}>Let's go</Button>
			}
		</Box>
	)

}

export default HomePage;