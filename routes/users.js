var express = require('express');
var router = express.Router();
const env = process.env;
const { Pool } = require('pg');

const pool = new Pool({
  user: env.PGUSER,
  host: env.PGHOST,
  database: env.PGDB,
  password: env.PGPW,
  port: 5432
});

router.post('/', async (req, res) => {
  let user
  let date = new Date();
  let statusCode
  await pool.query("insert into public.users(email, provider, created_at) values($1, $2, $3) returning email", [req.body.email, "google", Math.floor(date.getTime() / 1000)])
            .then(res => {
              user = res.rows[0]
              statusCode = 200
            })
            .catch(err => {
              if(err.code == '23505'){
                statusCode = 409
              } else {
                statusCode = 500
              }
            });
  res.status(statusCode).send(user)
})


module.exports = router;
