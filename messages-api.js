const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const port = 3000;

app.use(jsonParser);

// Middleware to count requests:
let counter = 0;

const countingMiddleware = (req, res, next) => {
  counter++;
  if (counter >= 6) {
    res.status(429);
  }
  next();
};

app.use(countingMiddleware);

// app.post("/messages", (req, res) => {
//   console.log(req.body);
//   res.json({
//     message: `This is the message being sent`
//   });
// });

app.post("/messages", (req, res) => {
  console.log(
    "####################################################################################" /* ,
    res.json(req.body) */
  );

  const key = Object.keys(req.body);
  // const value = Object.values(req.body);

  // console.log("value is", req.body[key]);
  // console.log("value's length is", req.body[key].length);
  // console.log("key is", key);

  console.log("req.body is", req.body);

  if (!key || !req.body[key]) {
    res.status(400).end();
  } else {
    res.json(req.body);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

// 1. Perform the following validation: if the body does NOT have a `text` property or the string is empty,
// then send a "Bad Request" HTTP status code to the client. //400

// if (typeof req.body === "string") {
//   console.log("is object");
//   res.status(400).end();
// }

// https://reader.codaisseur.com/courses/advanced-bootcamp/02-rest-apis/express/express-middleware

// app.post("/messages", (req, res) => {
//   req.body = { message: "This is the message being sent" };
//   res.json(req.body);
//   console.log(req.body.message);
// });
