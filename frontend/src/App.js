import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import MatchRoomPage from './components/MatchRoomPage';
import { Box, createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./components/HomePage";
import socketIO from "socket.io-client"

const theme = createTheme({
    typography: {
        h4: {
            color: "#1976d2",
        },
        body1: {
            color: "darkgrey"
        },
        body2: {
            color: "#8dc3f7"
        }
    },
});

const socket = socketIO.connect("http://localhost:8001")
socket.on('connection', () => {
})

// const data = "Hard"
// 	// frontend needs to store socket.id in session storage/cookie. Browser refresh causes a new socket.id to be created, 
// 	// which is not the expected input from the server side.
// socket.emit('find-match', data);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box display={"flex"} flexDirection={"column"} height="100vh">
                    <Router>
                        <Routes>
                            <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/home" element={<HomePage socket={socket} />} />
                            <Route path="/room" element={<MatchRoomPage socket={socket} />} />
                        </Routes>
                    </Router>
                </Box>
            </div>

        </ThemeProvider>
    );
}

export default App;
