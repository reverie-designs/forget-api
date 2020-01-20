# ⏰ Forget Me Not API ⏰ 

Forget Me Not is there to assist families with family members who have dementia. The application allows caregivers to create notifications (reminders to eat medicine, food, and appointments) for their loved ones while also keeping track of their location. If the patient leaves the 3 KM geofence, the caregiver will receive an alert notifying them that their family member has left the safety radius. The family member with dementia will see pop up notifications on their homepage and have a day and night display to help distinguish different times of day. 

## Setup
Install dependencies with `npm install`.

You must have PostrgeSQL or a vagrant machine that has PostgreSQL in order to run the server successfully 

## 🧱 Tech Stack 🧱

## Creating the DB

Use the `psql -U development` command to login to the PostgreSQL server with the username development and the password development. This command MUST be run in a vagrant terminal, we are using the PostgreSQL installation provided in the vagrant environment.

Create a database with the command `CREATE DATABASE forget_development;`.

Copy the `.env.example` file to `.env.development` and fill in the necessary PostgreSQL configuration. The node-postgres library uses these environment variables by default.

## Seeding
Use the browser to navigate to `http://localhost:8001/api/debug/reset`.

## Dependencies
   - express: "^4.16.4"
   - cors: "^2.8.5"
   - dotenv: "^7.0.0"
   - pg: "^7.8.1"
   - request: "^2.88.0"
   - request-promise-native: "^1.0.8"
   - bcrypt: "^3.0.7"
   - body-parser: "^1.18.3"
   - cookie-session: "^1.3.3"
   - helmet: "^3.18.0"
   - ws: "^7.0.0"
   
## Dev Dependencies
 - nodemon: "^2.0.2"
