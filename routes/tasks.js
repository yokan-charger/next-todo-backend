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
  await pool.query('select * from public.tasks order by created_at')
            .then(res => tasks = res.rows);
  res.send(tasks);
});

router.post('/', async (req, res) => {
  let task
  let date = new Date();
  await pool.query("insert into public.tasks(title, completed, created_at) values($1, $2, $3) returning id, title, completed, created_at", [req.body.title, false, Math.floor(date.getTime() / 1000)])
            .then(res => task = res.rows[0]);
  res.send(task)
})

router.delete('/', async (req, res) => {
  await pool.query("delete from public.tasks where id = $1", [req.query.id])
  res.status(200).send("Hoge")
})

router.put('/status', async (req, res) => {
  await pool.query("update public.tasks set completed = $1 where id = $2", [req.body.completed, req.body.id])
  res.status(200).send("Hoge")
})

router.put('/title', async (req, res) => {
  await pool.query("update public.tasks set title = $1 where id = $2", [req.body.title, req.body.id])
  res.status(200).send("Hoge")
})
module.exports = router;
