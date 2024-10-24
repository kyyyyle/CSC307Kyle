// backend.js
import express from "express";

import cors from "cors";

import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));


const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());
//start
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

	userService.getUsers(name, job).then((result) => {
		res.send({ users_list: result})
	}).catch((error) => {
		res.status(500).send("Failed to get users");
	});
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService.findUserById(id).then((result) => {  
  if (!result) {
    res.status(404).send("Resource not found.");
  } else {
    res.send({ users_list: result});
  }
});
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

	userService.addUser(userToAdd).then((userToAdd) => {
		res.status(201).send(userToAdd);
	}).catch((error) => {
                res.status(500).send("Failed to add users");
        });
});

app.delete("/users/:id", (req, res) => {
	const id = req.params.id;

	userService.deleteUserById(id).then((result) => {
	if (result) {
        	res.sendStatus(204);
        } else {
        	res.sendStatus(404);	
	}
  }).catch((error) => {
                res.status(500).send("Failed to add users");
        });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
