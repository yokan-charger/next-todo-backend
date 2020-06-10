var express = require('express');
var router = express.Router();

/*
id:
title:
completed:
created_at:
*/
router.get('/', function(req, res, next) {
  const tasks = {
    id: 1,
    title: "沼田家",
    completed: false,
    created_at: 1591790280
  }
  res.send(tasks);
});

module.exports = router;
