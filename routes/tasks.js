var express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const { Pool } = require('pg');
let pool;
const env = process.env;

function init() {
  pool = new Pool({
    user: env.PGUSER,
    host: env.PGHOST,
    database: env.PGDB,
    password: env.PGPW,
    port: 5432
  });
}
router.get('/', async (req, res, next) => {
  init();
  let tasks
  await pool.query('select * from public.tasks')
            .then(res => tasks = res.rows[0]);

  res.send(tasks);
});

module.exports = router;
