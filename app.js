require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 8000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

/*
const isItPierre = (req, res) => {
  if (req.body.email === "pierre@wild.com" && req.body.password === "pass123") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

app.post("/api/login", isItPierre);
*/

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  checkUserId,
} = require("./auth");

//Public Routes:

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post("/api/users", hashPassword, userHandlers.postUser);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

//Protected Routes :
app.use(verifyToken);

app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put(
  "/api/users/:id",
  verifyToken,
  checkUserId,
  hashPassword,
  userHandlers.updateUser
);
app.delete("/api/users/:id", verifyToken, checkUserId, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
