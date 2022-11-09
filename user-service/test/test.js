import app from "../index.js";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import UserModel from "../model/user-model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";

let should = chai.should();
chai.use(chaiHttp);

mongoose.connect(process.env.DB_LOCAL_URI);
const db = mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", (error) => {
        console.warn("Error : ", error);
    });

const defaultUser = "test-user";
const simplePw = "password";

describe("user-service", () => {
    beforeEach(async () => {
        const password = bcrypt.hashSync(simplePw);
        const newUser = new UserModel({
            username: defaultUser,
            password: password,
        });
        await newUser.save();
    });

    afterEach(async () => {
        await db.collections.usermodels.drop();
    });

    it("should create a user", async () => {
        const username = "test-user1";
        const password = simplePw;
        const result = await chai
            .request(app)
            .post("/api/user")
            .set("content-type", "application/json")
            .send({
                username: username,
                password: password,
            });
        result.should.have.status(201);
        result.body.should.be.deep.equal({
            message: "Created new user test-user1 successfully!",
        });
        const user = await db.collections.usermodels.findOne({
            username: username,
        });
        should.equal(true, bcrypt.compareSync(password, user.password));
    });

    it("should login a user", async () => {
        const result = await chai
            .request(app)
            .post("/api/user/login")
            .set("content-type", "application/json")
            .send({
                username: defaultUser,
                password: simplePw,
            });
        result.should.have.status(201);
        result.body.message.should.be.deep.equal("Login successful!");
        should.exist(result.body.token);
    });

    it("should logout a user", async () => {
        const result = await chai
            .request(app)
            .post("/api/user/login")
            .set("content-type", "application/json")
            .send({
                username: defaultUser,
                password: simplePw,
            });
        const token = result.body.token;
        const result1 = await chai
            .request(app)
            .post("/api/user/logout")
            .set("content-type", "application/json")
            .set("authorization", token)
            .send({
                username: defaultUser,
            });
        result1.should.have.status(201);
        result1.body.message.should.be.deep.equal("Logout successful!");
    });

    it("should change a user's password", async () => {
        const username = "test-user1";
        const password = simplePw;
        const result = await chai
            .request(app)
            .post("/api/user")
            .set("content-type", "application/json")
            .send({
                username: username,
                password: password,
            });
        result.should.have.status(201);
        const result1 = await chai
            .request(app)
            .post("/api/user/login")
            .set("content-type", "application/json")
            .send({
                username: username,
                password: password,
            });
        const token = result1.body.token;
        const complicatedPw = "IUH2pu4HIP2767UhPkJL8Hf1idyvkjNL@#!"
        const result2 = await chai
            .request(app)
            .post("/api/user/pwChange")
            .set("content-type", "application/json")
            .set("authorization", token)
            .send({
                username: username,
                oldPw: password,
                newPw: complicatedPw,
            });
        result2.should.have.status(201);
        result2.body.message.should.be.deep.equal("Changed password of username: test-user1 successfully!");
        const user = await db.collections.usermodels.findOne({
            username: username,
        });
        should.equal(true, bcrypt.compareSync(complicatedPw, user.password));
    });
});
