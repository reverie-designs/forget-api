const router = require("express").Router();

// for the all notifications calender view
module.exports = (db, updateNotification) => {
  router.get("notifications/", (request, response) => {
    db.query(
      `
      SELECT
        notifications.id,
        categories.name as title,
        notifications.date as date,
        notifications.date as time,
        notifications.pills as pills,
        notifications.appointment as appointment,
        notifications.food as food,
        family_members.is_patient as patient,
        users.avatar_url as userUrl
      FROM family_members
      JOIN users ON users.id = family_members.user_id
      JOIN notifications ON family_members.family_id = notifications.family_id
      WHERE user.id = $1::integer
      GROUP BY notifications.id
      ORDER BY notifications.start_date
    `,
      [request.session.user_id]
    ).then(({ rows: notifications }) => {
      response.json(
        notifications.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
  });


  router.put("/notifications/:id", (request, response) => {
    // if (process.env.TEST_ERROR) {
    //   setTimeout(() => response.status(500).json({}), 1000);
    //   return;
    // }

    const { date, time, pills, appointment, food, info, daily } = request.body.notification;
  
    db.query(
      `
      INSERT INTO notifications (daily_repeat, time, pills, appointment, food, text, family_id, date) VALUES ($1::boolean, $2::integer, $3::boolean, $4::boolean, $5::boolean, $6::integer, $7::integer, $8::integer)
      ON CONFLICT (notifications) DO
      UPDATE SET student = $1::text, interviewer_id = $2::integer
    `,
      [daily, time, pills, appointment, food, info, Number(request.sessions.user_id), date]
    )
      .then(() => {
        setTimeout(() => {
          response.status(204).json({});
          updateNotification(Number(request.params.id), request.body.interview);
        }, 1000);
      })
      .catch(error => console.log(error));
  });

  router.delete("/notifications/:id", (request, response) => {
    // if (process.env.TEST_ERROR) {
    //   setTimeout(() => response.status(500).json({}), 1000);
    //   return;
    // }

    db.query(`DELETE FROM notifications WHERE notification.id = $1::integer`, [
      request.params.id
    ]).then(() => {
      setTimeout(() => {
        response.status(204).json({});
        updateNotification(Number(request.params.id), null);
      }, 1000);
    });
  });

  return router;
};
