const router = require("express").Router();

module.exports = db => {
  router.get("/currentlocation", (request, response) => {
    db.query(
      `
      SELECT patient_settings.patient_id as patientId, users.name as name, users.password as password, users.avatar_url as avatar_url, family_members.is_patient as is_patient
      FROM users 
      Join patient_settings ON users.id=patient_id
      WHERE users.id = $1;
    `
    , [request.session.user_id]).then(({ rows: settings }) => {
      response.json(settings);
    })
    .catch(error => console.log(error));
  });
  
  router.post("/settings", (request, response) => {
    const {name, password, avatar_url} = request.body.user;
    db.query(
      `
      INSERT INTO current_locations (patient_id, longitude, latitude) VALUES ($1::intrger, $2::float, $3::float)
      RETURNING *;
    `
      ,[request.session.user_id, longitiude, latitude]).then(({ rows: user }) => {
      response.json(user);
    })
      .catch(error => console.log(error));
  });

  return router;
};