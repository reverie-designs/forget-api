const router = require("express").Router();
const request = require('request');
// const key = process.node.ENV;
const key = "83668d24329553";
// const test = "https://locationiq.com/v1/search.php?key=83668d24329553&q=Empire%20State%20Building&format=json";
// const test_url = `https://locationiq.com/v1/search.php?key=${key}&q=${address}&format=json`;

const getLatLng = function(key, address) {
  return new Promise(function(resolve, reject) {
    request(`https://locationiq.com/v1/search.php?key=${key}&q=${address}&format=json`, function(err, res, body) {
          
      if (err) return reject(err);
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
};

module.exports = db => {
  router.get("/settings", (request, response) => {
    db.query(
      `
      SELECT patient_settings.patient_id as patient_Id, patient_settings.patient_home as address, users.name as patient_name, family_members.is_patient as is_patient
      FROM users 
      JOIN family_members ON users.id=family_members.user_id
      JOIN patient_settings ON patient_settings.patient_id = users.id
      WHERE users.id = (select family_members.patient_id FROM users JOIN family_members ON users.id = family_members.users_id WHERE family_members.user_id = $1);
    `
      ,[2])
      // , [Number(request.session.user_id)])
      .then(({ rows: settings }) => {
        response.json(settings);
      })
      .catch(error => console.log(error));
  });
  
  router.post("/settings", (request, response) => {
    // const { address1, address2, city, province, country, auth_code, is_patient} = request.body.settings;
    const { address1, address2, city, province, country} = request.body.settings;
    const address = `${address1}, ${address2 === "" ? '' : address2 + ", " }${city}, ${province}, ${country}`;
    // patient_settings have unique patient_id

    getLatLng(key, address).then((obj) => {
      const lat = obj.data[0].lat;
      const lng = obj.data[0].lng;
      return db.query(
        `
        INSERT INTO patient_settings (patient_id, patient_home, is_patient, lat, lng)
        (SELECT patient_id as user_id, $2::text as patient_home, $3::boolean as is_patient, $4::decimal as lat, $5::decimal as lng
          FROM family_members WHERE auth_code = $6::auth_code AND user_id = $1
          LIMIT 1)
        ON CONFLICT (patient_id) DO
        UPDATE SET patient_home = $2::text, lat = $4, lng = $5
        RETURNING *;
      `
        ,[Number(request.session.user_id), address, is_patient, lat, lng, request.session.auth_code]);
    }).then(({ rows: user }) => {
      response.json(user);
      return true;
    })
      .catch(error => response.status('500').send(JSON.stringify(error)));
  });

  router.post("/settings/geofence", (request, response) => {
    // const { address1, address2, city, province, country, auth_code, is_patient} = request.body.settings;
    const {radius, radius_on} = request.body.settings;
    // patient_settings have unique patient_id
    db.query(
      `
      INSERT INTO geofence (user_id, radius, radius_on) 
      (SELECT patient_id as user_id, $2::integer as radius, $3::boolean as radius_on
      FROM family_members WHERE user_id = $1::text
      LIMIT 1)
      
      RETURNING *;
    `
      ,[Number(request.session.user_id), radius, radius_on])
      .then(({ rows: user }) => {
        response.json(user);
      })
      .catch(error => console.log(error));
  });

  return router;
};
