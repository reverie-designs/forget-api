const router = require("express").Router();

module.exports = db => {
  router.get("/locations", (request, response) => {
    db.query(
      `
      SELECT current_locations.patient_id as patient_id, current_locations.lat as lat, current_locations.lng as lng, current_locations.date as date
      FROM current_locations
      JOIN family_members ON family_members.user_id=current_locations.patient_id
      WHERE family_members.auth_code = $1
      ORDER BY to_date(current_locations.date, 'Mon DD YYYY') DESC
      LIMIT 5;
    `
      // , ['V|R|FAMILY'])
      , [request.session.auth_code])
      .then(({ rows: settings }) => {
        response.json(settings);
      })
      .catch(error => console.log(error));
  });
  
  router.post("/locations", (request, response) => {
    const {latitude, longitude} = request.body.user;
    db.query(
      `
      INSERT INTO current_locations (patient_id, lat, lng, date) VALUES ($1::integer, $2::decimal, $3::decimal, NOW()::DATE)
      RETURNING *;
    `
      ,[Number(request.session.user_id), latitude, longitude])
      .then(({ rows: user }) => {
        response.json(user);
      })
      .catch(error => console.log(error));
  });

  return router;
};

// test queries
// SELECT current_locations.patient_id as patient_id, current_locations.lat as lat, current_locations.lng as lng, current_locations.date as date
//       FROM current_locations
//       JOIN family_members ON family_members.user_id=current_locations.patient_id
//       WHERE family_members.auth_code = 'V|R|FAMILY'
//       ORDER BY to_date(current_locations.date, 'Mon DD YYYY') DESC
//       LIMIT 5;
// INSERT INTO current_locations (patient_id, lat, lng, date) VALUES (1, 43, 23, NOW()::DATE) RETURNING *;