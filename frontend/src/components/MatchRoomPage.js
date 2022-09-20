import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { React, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import PopupChat from './PopupChat';

// TODO: need to find out how to use socketio to get users in the room and also do the online collaboration on the textfield

function MatchRoomPage({ socket }) {
	let navigate = useNavigate();
	let location = useLocation();
	const [user, setUser] = useState("Daemon");
	const [message, setMessage] = useState("");

	const handleLeaveChat = () => {
		// TODO: disconnect the socket
		socket.emit('disconnect-match', user);
		navigate("/home");

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
			navigate("/home");

			// browser refresh to reset socket. causes a stupid ass bug in popupchat.js if not here.
			navigate(0);
		})
	}, []);


	const handleChange = (e) => {
		setMessage(e.target.value);
		socket.emit('send-message', e.target.value);
		console.log("MSG", message);
	}

	// to add another disconnect event when user exits the broswer.

	return (
		<Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
			<Box flex={1} marginBottom={"auto"} padding={"2rem"}>
				<Typography variant={"h4"} marginBottom={"3rem"} fontWeight="bold">Users</Typography>
				<Box>
					<PopupChat socket={socket}/>
					{location.state.roommates.map((roommate, index) => (
					<Typography key={index} variant={"body1"} marginBottom={"1rem"} fontWeight="bold">{roommate}</Typography>
					))}
				</Box>
			</Box>

			<Box flex={4} padding={"2rem"}>
				<Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} marginBottom={"1rem"}>
					<Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">PeerPrep</Typography>
					<Button onClick={handleLeaveChat}>Leave Chat</Button>
				</Box>
				<Box sx={{ border: 1 }} minHeight={"50vh"} padding={"1rem"}>
					<Box display={"flex"} justifyContent={"space-between"} alignItems={"baseline"}>
						<Typography variant={"h5"} marginBottom={"1rem"} fontWeight="bold">{location.state.question.title}</Typography>
						<Typography variant={"body1"} marginBottom={"1rem"}>{location.state.difficultyLevel}</Typography>
					</Box>
					<Typography variant={"subtitle1"} marginBottom={"1rem"}>{location.state.question.description}</Typography>
					<TextField
						onChange={handleChange}
						placeholder="MultiLine with rows: 2 and rowsMax: 4"
						multiline
						rows={25}
						fullWidth
						value={message}
					/>
				</Box>
			</Box>
		</Box >
	)

}

export default MatchRoomPage;