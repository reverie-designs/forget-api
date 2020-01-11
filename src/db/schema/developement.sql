INSERT INTO users (name, password, avatar_url) VALUES  
  ('bob', 'bob1', 'https://i.imgur.com/LpaY82x.png'),
  ('bill', 'bill1', 'https://i.imgur.com/Nmx0Qxo.png'),
  ('jill', 'jill1', 'https://i.imgur.com/T2WwVfS.png'),
  ('job', 'job1', 'https://i.imgur.com/FK8V841.jpg');

INSERT INTO notifications (daily_repeat, time, text, pills, appointments, food, family_id, date)
  VALUES 
  (false, '15:00:00', 'time to eat', true, false, true, 1, 'Jan 16 2020'),
  (false, '16:00:00', 'see doctor', false, true, true, 1, 'Jan 16 2020'),
  (false, '18:00:00', 'eat, medicate, meet doc', true, true, true, 1, 'Jan 16 2020'),
  (false, '15:00:00', 'time to eat', true, false, true, 1, 'Jan 17 2020'),
  (false, '13:00:00', 'food', false, false, true, 1, 'Jan 17 2020'),
  (false, '18:00:00', 'eat, meet doc', true, false, true, 1, 'Jan 17 2020'),
  (false, '14:00:00', 'time to eat', true, false, true, 1, 'Jan 17 2020'),
  (false, '16:00:00', 'food', false, false, true, 1, 'Jan 17 2020'),
  (false, '21:00:00', 'medicate', true, false, true, 1, 'Jan 17 2020');
  

INSERT INTO patient_settings (patient_id, patient_home, lat, lng)
  VALUES
  (1, '662 King St W, Toronto, ON ,M5V 1M7, CANADA', 43.644206, -79.402201);


INSERT INTO current_locations (patient_id, lat, lng, date)
  VALUES
  (1, 43.645307, -79.396772, 'Jan 12 2020'),
  (1, 43.647650, -79.384845, 'Jan 12 2020'),
  (1, 43.645307, -79.396772, 'Jan 12 2020'),
  (1, 43.647650, -79.384845, 'Jan 13 2020'),
  (1, 43.645307, -79.396772, 'Jan 13 2020'),
  (1, 43.647650, -79.384845, 'Jan 14 2020'),
  (1, 43.645307, -79.396772, 'Jan 16 2020'),
  (1, 43.647650, -79.384845, 'Jan 17 2020');

INSERT INTO family_members (user_id, patient_id, is_patient, auth_code)
 VALUES
 (1, 1, true, 'V|R|FAMILY'),
 (2, 1, false, 'V|R|FAMILY'),
 (3, 1, false, 'V|R|FAMILY'),
 (4, 1, false, 'V|R|FAMILY');


INSERT INTO geofence (user_id, radius, radius_on)
 VALUES
 (1, 3, true);

