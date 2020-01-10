const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const db = require("./db");

const locations = require("./routes/location");
const notifications = require("./routes/notifications");
const settings = require("./routes/settings");
const users = require("./routes/user");


// module.exports = {locations, users, settings, notifications};


function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8"
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

module.exports = function application () {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  app.use("/api", locations(db));
  app.use("/api", notifications(db));
  app.use("/api", settings(db));
  app.use("/api", users(db));

      Promise.all([
      read(path.resolve(__dirname, `db/schema/create.sql`)),
      read(path.resolve(__dirname, `db/schema/developement.sql`))
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (request, response) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => {
              console.log("Database Reset");
              response.status(200).send("Database Reset");
            });
        });
      })
      .catch(error => {
        console.log(`Error setting up the reset route: ${error}`);
    });


  app.close = function() {
    return db.end();
  };

  return app;
};