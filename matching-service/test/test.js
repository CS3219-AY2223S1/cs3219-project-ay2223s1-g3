import { createServer } from "http";
import { io as Client } from "socket.io-client";
import io from "socket.io-client";
import { Server } from "socket.io";
import socketIO from "socket.io-client";
import { assert, expect } from "chai";
import MatchModel from "../model/matching-model.js";
import "dotenv/config";
import mongoose from "mongoose";
import chai from "chai";
import chaiHttp from "chai-http";
import {
  sendChatMessage,
  sendMessage,
  findMatch,
  disconnect_match,
  createListeners,
} from "../controller/matchingController.js";

let should = chai.should();
chai.use(chaiHttp);

let client1, client2, db;

describe("Socket-io test", () => {
  before(() => {
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
    client1.on("connection", () => {
      console.log("connected!");
    });
    client2 = socketIO.connect("http://localhost:8001");
    client2.on("connection", () => {
      console.log("connected!");
    });
  });

  after(() => {
    //io.close();
    //client1.close();
    //client2.close();
  });

  describe("match event", () => {
    it("match 1", (done) => {
      client1.emit("find-match", "Easy", "Pepe");
      client2.emit("find-match", "Easy", "ThePig");
      let mates = ["Pepe", "ThePig"];
      client1.on("match-found", (obj) => {
        //expect(obj).to.be.a("object");
        //expect(obj.roommates).to.be.a("array");
        expect(obj.roommates).to.have.members(mates);
        //client1.disconnect();
        //client2.disconnect();
        done();
      });
    });

    // it("send collab message", (done) => {
    //   let message = "FML SOCKET.IO TESTING IS HELL";
    //   client1.emit("send-message", message);
    //   client2.on("send-message", (obj) => {
    //     expect(obj).to.be.a("object");
    //     expect(obj.message).to.equals(message);
    //     done();
    //   });
    // });

    // it("disconnect", (done) => {
    //   let message = "leaving room";
    //   client1.emit("disconnect-match", message);
    //   client2.on("disconnect-event", (obj) => {
    //     expect(obj).to.be.a("object");
    //     expect(obj.message).to.equals(message);
    //     //client1.disconnect();
    //     //client2.disconnect();
    //     done();
    //   });
    // });
  });

  // describe("send message", () => {
  //   it("send collab message", (done) => {
  //     let message = "FML SOCKET.IO TESTING IS HELL";
  //     client1.emit("send-message", message);
  //     client2.on("send-message", (obj) => {
  //       //expect(obj).to.be.a("object");
  //       expect(obj.message).to.equals(message);
  //       done();
  //     });
  //   });

  // });

  // describe("disconnect-event", () => {
  //   let message = "leaving room"
  //   it("disconnect", (done) => {
  //     let message = "leaving room"
  //     client1.emit("disconnect-match", message);
  //     client2.on("disconnect-event", (obj) => {
  //       expect(obj).to.be.a("object");
  //       expect(obj.message).to.equals(message);
  //       //client1.disconnect();
  //       //client2.disconnect();
  //       done();
  //     });
  //   });
  // });
});
