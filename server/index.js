const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);
app.use(express.json());
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secret = "102983c2u91u3bc1298ycbiobd9qucec0120s1nc";

const cookieParser = require("cookie-parser");
const Workout = require("./models/Workout");
const { json } = require("body-parser");
app.use(cookieParser());


app.get("/",(req,res)=>{
  console.log("/ ok ")
  alert("ok")
  res.status(200).json({status:"ok"});
})

app.get("/api",(req,res)=>{
  console.log("/api ok ")
  alert("ok")  
  res.status(200).json({status:"ok"});

})


app.get("/api/test",(req,res)=>{
  console.log("test ok ")  
  res.status(200).json({status:"ok"});

})

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    User.create({ username, password: hash })
      .then((doc) => {
        res.status(200).json(doc);
        console.log("Registration successful");
      })
      .catch((err) => {
        res.status(404).json(err);
        console.log({ err: "Registration failed" });
      });
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((doc) => {
      console.log(doc);

      bcrypt.compare(password, doc.password).then(function (result) {
        if (result) {
          jwt.sign({ username, id: doc._id }, secret, {}, (err, token) => {
            if (err) res.status(404).json({ err: "Login error" });
            else {
              res.cookie("token", token).json({
                id: doc._id,
                username: username,
              });
            }
          });
        } else {
          res.status(401).json({ error: "Password is incorrect" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: "Login failed" });
    });
});
app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error(err);
      res.status(404).json("error");
    } else {
      res.status(200).json(info);
    }
  });
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

app.post("/api/create", (req, res) => {
  const { user_id, name, reps, sets, weight } = req.body;
  formatted_name = trim(capitalizeWords(name));

  Workout.create({
    user_id,
    name: formatted_name,
    reps,
    sets,
    weight,
  })
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(404).json({ error: "Error creating workout" }));
});

app.get("/api/workouts/:user_id", (req, res) => {
  //get workouts for user with id.
  Workout.find({ user_id: req.params.user_id })
    .then((doc) => {
      //console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: "Could not get workouts" });
    });
});

app.delete("/api/workouts/:workout_id", (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.workout_id)) {
    res.status(404).json({ error: "Invalid workout id" });
    return;
  }
  Workout.findByIdAndDelete(req.params.workout_id)
    .then((doc) => res.status(200).json(doc))
    .catch((err) =>
      res.status(404).json({ error: "Could not delete workout" })
    );
});

if (process.env.API_PORT) {
  const listener = app.listen(process.env.API_PORT, () => {
    console.log("Your app is listening on port " + process.env.API_PORT);
  });
}
module.exports = app;
