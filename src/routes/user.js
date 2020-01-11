const router = require("express").Router();

module.exports = db => {
  router.get("/user", (request, response) => {
    // const {name, password} = request.body.user;
    db.query(
      `
      SELECT users.id as user_id, users.name as name, users.password as password, users.avatar_url as avatar_url, family_members.is_patient as is_patient, family_members.patient_id as patient_id
      FROM users JOIN family_members ON users.id=family_members.user_id
      WHERE users.name = $1 AND users.password = $2
      LIMIT 1;
    `
      // , [request.query.name, request.query.password])
      , ['bob', 'bob1'])
      .then(({ rows: user }) => {
        response.json(user);
      })
      .catch(error => console.log(error));
  });
  
  router.post("/user", (request, response) => {
    const {username, password, avatar_url} = request.body.user;
    db.query(
      `
      INSERT INTO users (name, password, avatar_url) VALUES ($1::text, $2::text, $3::text)
      ON CONFLICT (avatar_url) DO
      UPDATE SET avatar_url = $3::text
      RETURNING *;
    `
      ,[username, password, avatar_url])
      // ,['bobs', 'bobb3', 'https://image.flaticon.com/icons/png/512/194/194938.png'])
      .then(({ rows: user }) => {
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