const router = require("express").Router();

// for the all notifications calender view
module.exports = (db) => {
  router.get("/notifications", (request, response) => {
    db.query(
      `
      SELECT
        notifications.id,
        notifications.date as date,
        notifications.time as time,
        notifications.pills as pills,
        notifications.appointments as appointment,
        notifications.food as food,
      family_members.is_patient as patient,
      users.avatar_url as userUrl
      FROM family_members
      JOIN users ON users.id = family_members.user_id
      JOIN notifications ON family_members.user_id = notifications.family_id
      WHERE users.id = (SELECT family_members.user_id as user_id FROM family_members WHERE auth_code = $1::text AND family_members.is_patient = true) 
      GROUP BY notifications.id, family_members.is_patient, users.avatar_url
      ORDER BY to_date(notifications.date, 'Mon DD YYYY'), to_timestamp(notifications.time,'HH24:MI:SS');
    `,
      ['V|R|FAMILY'])
      // [request.query.auth_code])
      .then(({ rows: notifications }) => {
        response.json(notifications);
      });
  });

  router.get("/notifications/day", (request, response) => {

    db.query(
      `
      SELECT
        notifications.id,
        notifications.date as date,
        notifications.time as time,
        notifications.pills as pills,
        notifications.appointments as appointment,
        notifications.food as food,
        family_members.is_patient as patient,
        users.avatar_url as userUrl
      FROM family_members
      JOIN users ON users.id = family_members.user_id
      JOIN notifications ON family_members.user_id = notifications.family_id
      WHERE users.id = (SELECT family_members.user_id as user_id FROM family_members WHERE auth_code = $1::text AND family_members.is_patient = true) 
      AND notifications.date = TO_CHAR($2::DATE, 'Mon dd yyyy')
      GROUP BY notifications.id, family_members.is_patient, users.avatar_url
      ORDER BY to_date(notifications.date, 'Mon DD YYYY')
      LIMIT 30;
    `,
      ['V|R|FAMILY', 'Jan 17 2020'])
      // [request.query.auth_code, request.query.day])
      .then(({ rows: notifications }) => {
        response.json(notifications);
      });
  });


  router.post("/notifications", (request, response) => {
    // if (process.env.TEST_ERROR) {
    //   setTimeout(() => response.status(500).json({}), 1000);
    //   return;
    // }

    const { date, time, pills, appointment, food, info, daily } = request.body.notification;
  
    db.query(
      `
      INSERT INTO notifications (daily_repeat, time, pills, appointments, food, text, family_id, date) 
        VALUES 
        ($1::boolean, $2::integer, $3::boolean, $4::boolean, $5::boolean, $6::text, $7::integer, $8::text)
        RETURNING *
    `,
      [daily, time.trim(), pills, appointment, food, info, Number(request.sessions.user_id), date.trim().slice(4,15)]
    )
      .then(() => {
        response.status(204).json({});
      })
      .catch(error => console.log(error));
  });

  router.delete("/notifications/:id", (request, response) => {
    // if (process.env.TEST_ERROR) {
    //   setTimeout(() => response.status(500).json({}), 1000);
    //   return;
    // }

    db.query(`DELETE FROM notifications WHERE notification.id = $1::integer`,
      [request.params.id])
      .then(() => {
        response.status(204).json({});
      });
  });

  return router;
};


// test queries

// SELECT
// notifications.id,
// notifications.date as date,
// notifications.time as time,
// notifications.pills as pills,
// notifications.appointments as appointment,
// notifications.food as food,
// family_members.is_patient as patient,
// users.avatar_url as userUrl
// FROM family_members
// JOIN users ON users.id = family_members.user_id
// JOIN notifications ON family_members.user_id = notifications.family_id
// WHERE users.id = (SELECT family_members.user_id as user_id FROM family_members WHERE auth_code = 'V|R|FAMILY' AND family_members.is_patient = true)
// AND notifications.date = TO_CHAR('Jan 17 2020'::DATE, 'Mon dd yyyy')
// GROUP BY notifications.id, family_members.is_patient, users.avatar_url
// ORDER BY notifications.date
// LIMIT 30;

// SELECT
// notifications.id,
// notifications.date as date,
// notifications.time as time,
// notifications.pills as pills,
// notifications.appointments as appointment,
// notifications.food as food,
// family_members.is_patient as patient,
// users.avatar_url as userUrl
// FROM family_members
// JOIN users ON users.id = family_members.user_id
// JOIN notifications ON family_members.user_id = notifications.family_id
// WHERE users.id = (SELECT family_members.user_id as user_id FROM family_members WHERE auth_code = 'V|R|FAMILY' AND family_members.is_patient = true) 
// GROUP BY notifications.id, family_members.is_patient, users.avatar_url
// ORDER BY notifications.date, notifications.time;

// INSERT INTO notifications (daily_repeat, time, pills, appointments, food, text, family_id, date) 
// VALUES
// (false, '15:00:00',  false, true, true, 'see doctor', 1, 'Jan 7 2020'),
// (true, '13:00:00',  false, true, true, 'see doctor', 1, 'Jan 7 2020')
// RETURNING *;
