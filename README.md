## Setup

### Local Install Instructions

1. Clone repository `git clone https://github.com/BlinkVonDoom/fuzeCallboard.git`
1. Navigate to the repsitory `cd fuzeCallboard`
1. Install root dependencies `npm install`
1. Install client dependencies `cd client && npm install`
1. Create a file named `.env` in the /client directory, add the enviromental variables (and their corrasponding values) listed at the bottom of this document
1. Create a file named `dev.js` in the /config directory, add the enviromental variables (and their corrasponding values) listed at the bottom of this document
1. Launch application `npm run dev`

### Heroku Install Instruction
_Instructions assume Heroku CLI is installed_
1. In your Heroku app, set up config-vars for the enviromental variables listed at the bottom of this document
1. Clone the repository locally `git clone https://github.com/BlinkVonDoom/fuzeCallboard.git`
1. Navigate to the repository `cd fuzeCallboard`
1. Add Heroku as a remote `heroku git:remote -a pure-ocean-82350`
1. Deploy to Heroku `git push heroku master`

#### Enviromental Variables
```
REACT_APP_ADMIN_QUEUE
REACT_APP_API_TOKEN
REACT_APP_PASSWORD
REACT_APP_STUDENT_QUEUE
REACT_APP_USERNAME
React_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
REACT_APP_AUTH0_CLIENT_SECRET
REACT_APP_PROD_URL
```