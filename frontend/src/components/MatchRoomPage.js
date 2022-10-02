import { Button, Divider, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { React, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import PopupChat from './PopupChat';

function MatchRoomPage({ socket }) {
	let navigate = useNavigate();
	let location = useLocation();
	const [user, setUser] = useState("Daemon");
	const [message, setMessage] = useState("");

	const handleLeaveChat = () => {
		socket.emit('disconnect-match', user);
		navigate("/home", { state: {
			username: location.state.username
		}});

		// browser refresh to reset socket. causes a stupid ass bug in popupchat.js if not here.
		navigate(0);
	}

	useEffect(() => {

		// send message event.
		socket.on('send-message', message => {
			setMessage(message.message);
			console.log("called", message);
		})

		// disconnect event.
		socket.on('disconnect-event', message => {
			socket.emit('disconnect-event', user);
			console.log(message.user + "/disconnected");
			//navigate(-1);
			navigate("/home", { state: {
				username: location.state.username
			}});

			// browser refresh to reset socket. causes a stupid ass bug in popupchat.js if not here.
			navigate(0);
		})
	}, []);

	const handleChange = (e) => {
		setMessage(e.target.value);
		socket.emit('send-message', e.target.value);
		console.log("MSG", message);
	}

	return (
		<Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
			<Box style={{ background: "linear-gradient(#1976d2, #8dc3f7)" }} height="100vh" display={"flex"} flexDirection={"column"} justifyContent={"center"} flex={0.4} padding={"2rem"}>
				<Box>
					<Typography variant={"h5"} marginBottom={"1rem"} color="white" fontWeight="bold">Peer Group</Typography>
					<Box>
						{location.state.roommates.map((roommate, index) => (
							<Typography key={index} color="white" marginBottom={"1rem"}>{roommate}</Typography>
						))}
					</Box>
				</Box>
			</Box>
			<Divider style={{ marginRight: "2rem" }} orientation='vertical' />
			<Box flex={2.5} padding={"3rem"}>
				<Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} marginBottom={"1rem"}>
					<Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">PeerPrep</Typography>
				</Box>
				<Box minHeight={"50vh"}>
					<Box display={"flex"} justifyContent={"space-between"} alignItems={"baseline"}>
						<Typography variant={"h5"} marginBottom={"1rem"} fontWeight="bold">{location.state.question.title}</Typography>
						<Typography
							color={location.state.difficultyLevel === "Hard" ? "red" : location.state.difficultyLevel === "Medium" ? "orange" : "green"}
							variant={"body1"}
							marginBottom={"1rem"}>
							<b>{location.state.difficultyLevel}</b>
						</Typography>
					</Box>
					<Divider />
					<Typography variant={"subtitle1"} marginTop={"1rem"} marginBottom="1rem">{location.state.question.description}</Typography>
					<TextField
						inputProps={{ style: { fontFamily: "monospace" } }}
						style={{ backgroundColor: "whitesmoke", borderColor: "grey" }}
						onChange={handleChange}
						placeholder="Write your solution here"
						multiline
						rows={25}
						fullWidth
						value={message}
					/>
				</Box>
			</Box>
			<Box flex={0.3} >
				<Button variant="contained" color="error" style={{ marginLeft: "3rem", marginBottom: "50rem" }} onClick={handleLeaveChat}><b>Exit</b></Button>
				<PopupChat socket={socket} />
			</Box>
		</Box >
	)

}

export default MatchRoomPage;