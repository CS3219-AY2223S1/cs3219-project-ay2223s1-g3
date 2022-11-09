import { createServer } from "http";
import { Server } from "socket.io";
import socketIO from "socket.io-client";
import { assert, expect } from "chai";
import MatchModel from "../model/matching-model.js";
import "dotenv/config";
import mongoose from "mongoose";
import chai from "chai";
import chaiHttp from "chai-http";
import {
  createListeners,
} from "../controller/matchingController.js";

let client1, client2, db;

describe("Socket-io test", () => {
  before((done) => {
    mongoose.connect(process.env.MONGO_TEST_DB_URL);
    db = mongoose.connection;
    db.on("error", console.error.bind(console, "Unable to connect to MongoDB"));
    db.once("open", function () {
      console.log("Connected to MongoDB");
      done();
    });
    const httpServer = createServer();
    const io = new Server(httpServer, { cors: {} });

    httpServer.listen(8001, () => {
      console.log("listening on *:8001");
    });

    io.on("connection", (socket) => {
      console.log("a user connected: " + socket.id);
      createListeners(socket, io);
    });

    client1 = socketIO.connect("http://localhost:8001");
    client1.on("connection", () => {});
    client2 = socketIO.connect("http://localhost:8001");
    client2.on("connection", () => {});
  });

  after(() => {
    client1.close();
    client2.close();
    mongoose.connection.collections.matchmodels.drop()
  });

  describe("events", () => {
    it("match event", (done) => {
      let mates = ["Pepe", "ThePig"];
      client1.emit("find-match", "Easy", "ThePig");
      setTimeout(() => {
        client2.emit("find-match", "Easy", "Pepe");
        console.log("Delayed for 0.5 second.");
      }, "500")
      client1.on("match-found", (obj) => {
        expect(obj).to.be.a("object");
        expect(obj.roommates).to.be.a("array");
        expect(obj.roommates).to.have.members(mates);
        done();
      });
    });

    it("send collab message", (done) => {
      let message = "FML SOCKET.IO TESTING IS HELL";
      client1.emit("send-message", message);
      client2.on("send-message", (obj) => {
        expect(obj).to.be.a("object");
        expect(obj.message).to.equals(message);
        done();
      });
    });

    it("disconnect event", (done) => {
      let message = "leaving room";
      client1.emit("disconnect-match", message);
      let roomID1 = client1.id + "collab";
      let roomID2 = client2.id + "collab";
      let possibleRooms = [roomID1, roomID2];
      client2.on("disconnect-event", (obj) => {
        expect(obj).to.be.a("object");
        expect(possibleRooms).to.include.members([obj.room])
        done();
      });
    });
  });
});