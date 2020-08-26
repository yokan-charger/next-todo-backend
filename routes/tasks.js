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
  let statusCode
  await pool.query('select * from public.tasks join users on users.id = tasks.user_id where users.email = $1 order by tasks.created_at', [req.query.email])
            .then(res => {
              tasks = res.rows
              statusCode = 200
            }).catch(err => statusCode = 500);
  res.status(statusCode).send(tasks);
});

router.post('/', async (req, res) => {
  let task
  let date = new Date();
  let statusCode
  let user
  await pool.query("select * from users where users.email = $1", [req.body.email])
            .then(res => {
              user = res.rows[0]
            }).catch(err => console.log('user not found'))

  await pool.query("insert into public.tasks(title, completed, created_at, user_id) values($1, $2, $3, $4) returning id, title, completed, created_at", [req.body.title, false, Math.floor(date.getTime() / 1000), user.id])
            .then(res => {
              task = res.rows[0]
              statusCode = 200
            }).catch(err => statusCode = 500);
  res.status(statusCode).send(task)
})

router.delete('/', async (req, res) => {
  let statusCode
  await pool.query("delete from public.tasks where id = $1", [req.query.id]).then(() => statusCode = 200).catch(err => statusCode = 500)
  res.status(statusCode).send("OK")
})

router.put('/status', async (req, res) => {
  let statusCode
  await pool.query("update public.tasks set completed = $1 where id = $2", [req.body.completed, req.body.id]).then(() => statusCode = 200).catch(err => statusCode = 500)
  res.status(statusCode).send("OK")
})

router.put('/title', async (req, res) => {
  let statusCode
  await pool.query("update public.tasks set title = $1 where id = $2", [req.body.title, req.body.id]).then(() => statusCode = 200).catch(err => statusCode = 500)
  res.status(statusCode).send("OK")
})
module.exports = router;
