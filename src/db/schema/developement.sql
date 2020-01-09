INSERT INTO users (name, password, avatar_url) values  
  ('bob', 'bob1', 'https://i.imgur.com/LpaY82x.png'),
  ('bill', 'bill1', 'https://i.imgur.com/Nmx0Qxo.png');

INSERT INTO notifications (daily_repeat, time, text, pills, appointments, food, family_id, date)
  values 
  (false, '15:00:00', 'time to eat', true, false, true, 1, 'Jan 16 2020'),
  (false, '16:00:00', 'see doctor', false, true, true, 1, 'Jan 16 2020'),
  (false, '18:00:00', 'eat, medicate, meet doc', true, true, true, 1, 'Jan 16 2020');

INSERT INTO patient_settings (patient_id, patient_address, patient_lat, patient_lng, radius, radius_on)
  values
  (1, '662 King St W, Toronto, ON ,M5V 1M7, CANADA', 43.644206, -79.402201, 3, true);


INSERT INTO current_locations (patient_id, longitude, latitude)
  values
  (1, 43.645307, -79.396772),
  (1, 43.647650, -79.384845);

INSERT INTO families (auth_code)
  values
  ('V|R|FAMILY');

INSERT INTO family_members (user_id, family_id, is_patient)
 values
 (2, 1, false);

