import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, redirect } from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import MatchRoomPage from './components/MatchRoomPage';
import { Box, createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./components/HomePage";
import socketIO from "socket.io-client"
import { UserContext } from "./components/UserContext";

const theme = createTheme({
    typography: {
        h4: {
            color: "#1976d2",
        },
        h3: {
            color: "#1976d2",
        },
        h5: {
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

//const socket = socketIO.connect("http://localhost:8001")
const socket = socketIO.connect("https://matching-service-xkpqea35pq-as.a.run.app")
socket.on('connection', () => {
})

function App() {
    const [isLoggedInToken, setIsLoggedInToken] = useState(null);

    const ProtectedRoute = ({ children }) => {
        if (!isLoggedInToken && !window.localStorage.getItem("jwt_token")) {
            return <Navigate to="/" />;
        }
        return children;
    }
    return (
        <UserContext.Provider value={{ isLoggedInToken, setIsLoggedInToken }}>
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Box display={"flex"} flexDirection={"column"} height="100vh">
                        <Router>
                            <Routes>
                                <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/home" element={<ProtectedRoute><HomePage socket={socket} /> </ProtectedRoute>} />
                                <Route path="/room" element={<ProtectedRoute><MatchRoomPage socket={socket} /></ProtectedRoute>} />
                            </Routes>
                        </Router>
                    </Box>
                </div>

            </ThemeProvider>

        </UserContext.Provider>
    );
}

export default App;
