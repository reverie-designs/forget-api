const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const allJobs = require('./routes/jobs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieSession({
  name: 'session',
  keys: ["yolo"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use('/jobs', allJobs);

// Start server
const port = process.env.PORT || 3001;
app.listen(port);

console.log('App is listening on port ' + port);