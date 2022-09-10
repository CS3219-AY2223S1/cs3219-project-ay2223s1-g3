import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import { Box, createTheme, ThemeProvider } from "@mui/material";

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
                        </Routes>
                    </Router>
                </Box>
            </div>

        </ThemeProvider>
    );
}

export default App;
