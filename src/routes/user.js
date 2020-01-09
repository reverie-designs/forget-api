const router = require("express").Router();

module.exports = db => {
  router.get("/:id", (request, response) => {
    db.query(
      `
      SELECT * 
      FROM users
      WHERE user.id = $1
    `
      , [request.session.user_id]).then(({ rows: user }) => {
      response.json(user);
    });
  });
  
  router.post("/:id", (request, response) => {
    const {name, password, avatar_url} = request.body.user;
    db.query(
      `
      INSERT INTO users (name, password, avatar_url) VALUES ($1::text, $2::text, $3::text)
      RETURNING *;
    `
      ,[name, password, avatar_url]).then(({ rows: user }) => {
      response.json(user);
    })
      .catch(error => console.log(error));
  });

  return router;
};