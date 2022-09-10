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

function HomePage() {
	const [difficultyLevel, setDifficultyLevel] = useState("Easy");
	const [isLoading, setIsLoading] = useState(false);

	let navigate = useNavigate();

	const handleChange = (event) => {
		setDifficultyLevel(event.target.value);
	}

	const handleClick = () => {
		setIsLoading(true);
		//TODO: API to find match with another user
		setTimeout(() => {
			handleMatch();
		}, 2000)
	}

	const handleMatch = () => {
		setIsLoading(false);
		//TODO: GET api for question, setQuestion as prop to pass to MatchRoomPage
		let question = "What is love?"
		navigate("/room", { state: { question: question } });
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