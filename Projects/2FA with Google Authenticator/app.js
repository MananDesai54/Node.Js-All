const express = require("express");
const speakeasy = require("speakeasy");
const { v4: generateId } = require("uuid");
const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const app = express();
const PORT = process.env.PORT || 5000;

const db = new JsonDB(new Config("myDatabase", true, false, "/"));

app.use(
  express.json({
    extended: false,
  })
);

//Register user and create temp secret
app.post("/api/register", (req, res) => {
  const id = generateId();
  try {
    const path = `/user/${id}`;
    const temp_secret = speakeasy.generateSecret();
    db.push(path, { id, secret: temp_secret });
    res.json({
      id,
      secret: temp_secret,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error generating the secret",
    });
  }
});

//Verify token and make secret permanent
app.post("/api/verify", (req, res) => {
  const { token, id } = req.body;
  try {
    const path = `/user/${id}`;
    const user = db.getData(path);

    const { base32: secret } = user.temp_secret;

    const verify = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });

    if (verify) {
      db.push(path, { id, secret: user.temp_secret });
      res.json({
        verified: true,
      });
    } else {
      res.status(400).json({
        verified: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//Validate token
app.post("/api/verify", (req, res) => {
  const { token, id } = req.body;
  try {
    const path = `/user/${id}`;
    const user = db.getData(path);

    const { base32: secret } = user.secret;

    const verify = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (verify) {
      res.json({
        verified: true,
      });
    } else {
      res.status(400).json({
        verified: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/", (req, res) => {
  res.send("2FA is running");
});

app.listen(PORT, () =>
  console.log(`App is running at http://localhost:${PORT}`)
);
