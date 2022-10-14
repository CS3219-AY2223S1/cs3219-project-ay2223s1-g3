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
import { getQuestion } from "../api/question-service"
import { addQuestionDone, getQuestionsDone } from "../api/history-service";

function HomePage({socket}) {
	const [difficulty, setDifficulty] = useState("Easy");
	const [isLoading, setIsLoading] = useState(false);
	const [loadingComment, setLoadingComment] = useState("");
	const [timer, setTimer] = useState(-1);

	let navigate = useNavigate();
	let location = useLocation();

	const match_timeout = 30

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

    getQuestionsDone(location.state.username, location.state.token)
    .then((res) =>  res.data.filter(qn => qn.difficulty == difficulty))
    .then((res) => res.map((data) => data.question))
    .then((res) => {
      getQuestion(difficulty, roommates, res)
      .then((res) => {
        addQuestionDone(location.state.username, res.num, difficulty)

        navigate('/room', {
          state: {
            username: location.state.username,
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

	return (
		<Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
			<Typography variant={"h3"} marginBottom={"2rem"} fontWeight="bold">PeerPrep</Typography>
			<Typography variant={"body1"} fontWeight="bold">Select difficulty level</Typography>
			<FormControl sx={{ m: 1, minWidth: 300 }}>
				<Select
					labelId="select-label"
					id="difficulty-select"
					value={difficulty}
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
					<CircularProgress />
					{loadingComment}
				</>
				: <Button onClick={handleClick}>Let's go</Button>
			}
		</Box>
	)

}

export default HomePage;