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
    console.log("got to settings", request.query);
    db.query(
      `
      SELECT patient_settings.patient_id, patient_settings.patient_home as address, patient_settings.lat, patient_settings.lng, family_members.is_patient as is_patient
      FROM family_members
      JOIN patient_settings ON family_members.patient_id = patient_settings.patient_id
      WHERE family_members.user_id = $1
      Group by patient_settings.id, family_members.is_patient
      order by patient_settings.id desc
      limit 1;
    `
      // ,[2])
      , [Number(request.query.user_id)])
      .then(({ rows: settings }) => {
        console.log("sending settings");
        response.json(settings);
      })
      .catch(error => console.log(error));
  });
  
  router.get("/settings/geofence", (request, response) => {
    console.log("recieving radius settings")
    db.query(
      `
      SELECT family_members.patient_id as patient_Id, geofence.radius as radius, geofence.radius_on as radius_on
      FROM family_members
      JOIN geofence ON geofence.user_id = family_members.patient_id
      WHERE family_members.user_id = $1
      ORDER BY geofence.id DESC 
      LIMIT 1;
    `
      , [Number(request.query.user_id)])
      .then(({ rows: geofence }) => {
        console.log("radius - settings - being sent", geofence);
        response.json(geofence);
      })
      .catch(error => console.log(error));
  });


  router.post("/settings", (request, response) => {
    // const { address1, address2, city, province, country, auth_code, is_patient} = request.body.settings;
    console.log('settings', request.body.params);
    const { user_id, addressOne, addressTwo, city, province, country, auth_code} = request.body.params;
    const address = `${addressOne}, ${addressTwo === "" ? '' : address2 + ", " }${city}, ${province}, ${country}`;
    console.log("This is conc address",address);
    // patient_settings have unique patient_id

    getLatLng(key, address).then((obj) => {
      // console.log("coord response", obj[0].lat);
      const lat = Number(obj[0].lat);
      const lng = Number(obj[0].lon);
      console.log("new coordinates", user_id,lat, lng, address, auth_code);
      return db.query(
        `
        INSERT INTO patient_settings (patient_id, patient_home, lat, lng)
        (SELECT patient_id as patient_id, $2 as patient_home, $3 as lat, $4 as lng
          FROM family_members WHERE auth_code = $5 AND user_id = $1
          LIMIT 1);
      `
        ,[Number(user_id), address, lat, lng, auth_code]);
    }).then(() => {
      // console.log(user);
      console.log("query complete");
      response.status(204).json({});
      // response.json(user);
      return true;
    })
      .catch(error => response.status('500').send(JSON.stringify(error)));
  });

  router.post("/settings/geofence", (request, response) => {
    // const { address1, address2, city, province, country, auth_code, is_patient} = request.body.settings;
    console.log("TURNING RADIUS OFF",request.body.params);
    const {radius, radius_on, user_id} = request.body.params;
    // patient_settings have unique patient_id
    db.query(
      `
      INSERT INTO geofence (user_id, radius, radius_on) 
      (SELECT patient_id as user_id, $2 as radius, $3::boolean as radius_on
      FROM family_members WHERE user_id = $1
      LIMIT 1)
      
      RETURNING *;
    `
      ,[Number(user_id), radius, radius_on])
      .then(({ rows: user }) => {
        console.log("set Radius complete");
        console.log(user);
        response.json(user);
      })
      .catch(error => console.log(error));
  });

  return router;
};
