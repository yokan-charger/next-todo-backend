var express = require('express');
const Router = require('express-promise-router');
const router = new Router();
const { Pool } = require('pg');
const env = process.env;

const pool = new Pool({
  user: env.PGUSER,
  host: env.PGHOST,
  database: env.PGDB,
  password: env.PGPW,
  port: 5432
});

router.get('/', async (req, res, next) => {
  let tasks
  await pool.query('select * from public.tasks')
            .then(res => tasks = res.rows);
  res.send(tasks);
});

router.post('/', async (req, res) => {
  let task
  let date = new Date();
  await pool.query("insert into public.tasks(title, completed, created_at) values($1, $2, $3) returning id, title, completed, created_at", [req.body.title, false, Math.floor(date.getTime() / 1000)])
            .then(res => task = res.rows[0]);
  console.log("========")
  console.log(task)
  console.log("========")
  res.send(task)
})

module.exports = router;
