import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createListeners } from "./controller/matchingController.js";
import jwt from 'jsonwebtoken'


const app = express();
const corsOptions = {
  origin: '*',
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {}});

httpServer.listen(8001, () => {
  console.log("listening on *:8001");
});

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.isLoggedInToken){
    jwt.verify(socket.handshake.query.isLoggedInToken, process.env.JWT_KEY, function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }    
})
.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);
  createListeners(socket, io);
});
