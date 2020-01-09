const router = require("express").Router();

module.exports = db => {
  router.get("/settings", (request, response) => {
    db.query(
      `
      SELECT patient_settings.patient_id as patient_Id, patient_settings.patient_address as address, users.name as patient_name, family_members.is_patient as is_patient
      FROM users Join family_members ON users.id=family_members.user_id
      WHERE users.id = $1;
    `
      , [request.session.user_id]).then(({ rows: settings }) => {
      response.json(settings);
    })
    .catch(error => console.log(error));
  });
  
  router.post("/settings", (request, response) => {
    const { address1, address2, city, province, country, auth_code, is_patient} = request.body.settings;
    const address = `${address1}, ${address2}, ${city}, ${province}, ${country}`
    db.query(
      `
      INSERT INTO patient_settings (patient_id, address, auth_code, is_patient) VALUES ($1::text, $2::text, $3::boolean)
      RETURNING *;
    `
      ,[request.session.user_id,address, auth_code, is_patient]).then(({ rows: user }) => {
      response.json(user);
    })
      .catch(error => console.log(error));
  });

  return router;
};