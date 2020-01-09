const router = require("express").Router();

module.exports = db => {
  router.get("/login", (request, response) => {
    db.query(
      `
      SELECT users.id as userId, users.name as name, users.password as password, users.avatar_url as avatar_url, family_members.is_patient as is_patient
      FROM users Join family_members ON users.id=family_members.user_id
      WHERE users.name = $1 AND users.password = $2;
    `
      , [users.name,users.password]).then(({ rows: user }) => {
      response.json(user);
    })
    .catch(error => console.log(error));
  });
  
  router.post("/signup", (request, response) => {
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

  // router.post('/signup', (req, res) => {
  //   console.log(req.body);
  //   const table = req.body.jobber ? "jobbers" : "users";
  //   bcrypt.hash(req.body.password, 10)
  //   .then((hash) => {
  //     const queryString = `
  //       INSERT INTO ${table}(name, password, email, phone)
  //       VALUES ($1, $2, $3, $4)
  //     `;
  //     const values = [req.body.name, hash, req.body.email, req.body.phone];
  //     pool.query(queryString, values, (error, results) => {
  //       if (error) {
  //         res.json({
  //           result: false
  //         });
  //         throw error
  //       }
  //       res.json({
  //         result: true,
  //         message: "user created"
  //       });
  //       //response.status(200).json(results.rows)
  //     });
  //   });
  // });

  return router;
};