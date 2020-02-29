const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const port = 3000;

// Middleware to limit the number of requests:
let counter = 0;

const countingMiddleware = (req, res, next) => {
  counter++;
  if (counter >= 6) {
    res.status(429);
  }
  next();
};

app.use(countingMiddleware);
app.use(jsonParser);

app.post("/messages", (req, res, next) => {
  const key = Object.keys(req.body);
  const value = Object.values(req.body);

  // Validation: if theres no valid property or string:
  if (!key || !req.body[key]) {
    res.status(400).end();
  } else {
    console.log("req.body object is:", req.body);
    console.log(`req.body as a text message is: "${key}: ${value}"`);
    res.json(req.body);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
