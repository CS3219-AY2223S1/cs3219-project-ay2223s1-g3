import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { React, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

// TODO: need to find out how to use socketio to get users in the room and also do the online collaboration on the textfield

function MatchRoomPage({ socket, question }) {
	let navigate = useNavigate();
	let location = useLocation();
	const [user, setUser] = useState("Daemon");
	const [message, setMessage] = useState("");

	const handleLeaveChat = () => {
		// TODO: disconnect the socket
		socket.emit('disconnect-match', user);
		navigate(-1);
	}

	useEffect(() => {
		socket.on('send-message', message => {
			setMessage(message.message);
			console.log("called", message);
		})
		socket.on('disconnect-event', message => {
			console.log(message.user + "/disconnected");
			//navigate(-1);
			navigate("/home");
		})
	}, [message]);

	// socket.on('send-message', message => {
	// 	setMessage(message.message);
	// 	console.log("called", message);
	// })
	// socket.on('disconnect-event', message => {
	// 	console.log(message.user + "/disconnected");
	// 	navigate(-1);
	// })

	const handleChange = (e) => {
		setMessage(e.target.value);
		socket.emit('send-message', e.target.value);
		console.log("MSG", message);
	}

	return (
		<Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
			<Box flex={1} marginBottom={"auto"} padding={"2rem"}>
				<Typography variant={"h4"} marginBottom={"3rem"} fontWeight="bold">Users</Typography>
				<Box>
					<Typography variant={"body1"} marginBottom={"1rem"} fontWeight="bold">User 1</Typography>
					<Typography variant={"body1"} marginBottom={"1rem"} fontWeight="bold">User 2</Typography>
				</Box>
			</Box>

			<Box flex={4} padding={"2rem"}>
				<Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} marginBottom={"1rem"}>
					<Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">PeerPrep</Typography>
					<Button onClick={handleLeaveChat}>Leave Chat</Button>
				</Box>
				<Box sx={{ border: 1 }} minHeight={"50vh"} padding={"1rem"}>
					<Typography variant={"h5"} marginBottom={"1rem"} fontWeight="bold">Question:</Typography>
					<Typography variant={"body1"} marginBottom={"1rem"} fontWeight="bold">{location.state.question}</Typography>
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