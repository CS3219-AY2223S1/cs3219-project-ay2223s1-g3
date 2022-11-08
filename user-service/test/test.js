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

const simplePw = "password";

describe("user-service", () => {
    beforeEach(async () => {
        const password = bcrypt.hashSync(simplePw);
        const newUser = new UserModel({
            username: "test-user",
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
});
