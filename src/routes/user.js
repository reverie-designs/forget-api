const router = require("express").Router();

module.exports = db => {
  router.get("/user", (request, response) => {
    // console.log("THIS IS REQUEST",request.query);
    const {name, password} = request.query;
    // console.log("This is Query",request.query);
    // console.log("This is Body", request.body);
    db.query(
    //   `
    //   SELECT users.id as user_id, users.name as name, users.password as password
    //   FROM users 
    //   WHERE users.name = $1 AND users.password = $2
    //   LIMIT 1;
    // `
    `SELECT users.id as user_id, users.name as name, users.password as password, users.avatar_url as avatar_url, family_members.is_patient as is_patient, family_members.patient_id as patient_id,
     family_members.auth_code as auth_code
      FROM users JOIN family_members ON users.id=family_members.user_id
      WHERE users.name = $1 AND users.password = $2
      LIMIT 1;`
      , [name, password])
      // , ['bob', 'bob1'])
      // console.log("Thisisresponse", response)
      .then(({rows:user}) => {
        // console.log(user);
        // console.log("query",request.query);
        // console.log("BIG OBJECT",object);
        // console.log(rows);
        // console.log(object);
        response.json(user);
        // console.log(response.json(user));

      })
      .catch(error => console.log(error));
  });
  
  router.post("/user", (request, response) => {
    const {name, password} = request.body.user;
    // console.log("THIs IS BODY",request.body);
    db.query(
      `
      INSERT INTO users (name, password) VALUES ($1::text, $2::text)
      RETURNING *;
    `
      ,[name, password])
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