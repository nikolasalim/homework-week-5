const Sequelize = require("sequelize");
const express = require("express");
const app = express();
const port = 3000;
const databaseUrl = "postgres://postgres:secret@localhost:5432/postgres";
const sequelize = new Sequelize(databaseUrl);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Movie = sequelize.define("movie", {
  title: {
    type: Sequelize.TEXT
  },
  yearOfRelease: {
    type: Sequelize.INTEGER
  },
  synopsis: {
    type: Sequelize.TEXT
  }
});

sequelize.sync().then(() => console.log("Tables created successfully"));
// Inserting 3 example new rows
// .then(() =>
//   Promise.all([
//     Movie.create({
//       title: "Movie 1",
//       yearOfRelease: "2001",
//       synopsis: "Synopsis movie 1"
//     }),
//     Movie.create({
//       title: "Movie 2",
//       yearOfRelease: "2002",
//       synopsis: "Synopsis movie 2"
//     }),
//     Movie.create({
//       title: "Movie 3",
//       yearOfRelease: "2003",
//       synopsis: "Synopsis movie 3"
//     })
//   ])
// ).catch(err => {
//   console.error("Unable to create tables", err);
//   process.exit(1);
// })

// Adding a movie to the collection:
app.post("/movies", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next);
});

// Getting all movies of the collection:
app.get("/movies", (req, res, next) => {
  const limit = Math.min(req.query.limit || 10, 50);
  const offset = req.query.offset || 0;

  Movie.findAndCountAll({ limit, offset })
    .then(movies => {
      movies.count === 0
        ? res.status(404).send("No movies were found. Try again later.")
        : res.send({ movies: movies.rows, total: movies.count });
    })
    .catch(next);
});

// Getting a single movie by its ID:
app.get("/movies/:movieId", (req, res, next) => {
  Movie.findByPk(req.params.movieId)
    .then(movie => {
      !movie
        ? res.status(404).send("Movie not found. Please, try again.")
        : res.json(movie);
    })
    .catch(next);
});

// Updating a movie info:
app.put("/movies/:movieId", (req, res, next) => {
  Movie.findByPk(req.params.movieId)
    .then(movie =>
      !movie
        ? res.status(404).send("Movie not found. Please, try again.")
        : movie.update(req.body)
    )
    .then(movie => res.json(movie))
    .catch(next);
});

// Deleting a movie by its ID:
app.delete("/movies/:movieId", (req, res, next) => {
  Movie.destroy({ where: { id: req.params.movieId } })
    .then(number => {
      !number
        ? res.status(404).send("Movie not found. Please, try again.")
        : res.send({ number });
    })
    .catch(next);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
