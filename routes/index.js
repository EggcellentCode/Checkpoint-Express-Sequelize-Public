const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get("/", async (req, res, next) => {
    try {
        const users = await todos.listPeople();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/:name/tasks', async (req, res, next) => {
    try {
        if (!todos.listPeople().includes(req.params.name)) {
            res.status(404).send("Not Found");
          } else {
            res.send(todos.list(req.params.name, req.body))
          }
        } catch (error) {
          next(error);
        }
      
});

router.post("/:name/tasks", async (req, res, next) => {
    try {
        if (!req.body.content) {
            res.status(400).send("Does not Exist");
        } else {
            todos.add(req.params.name, req.body);
            res.status(201).send(todos.list(req.params.name)[0]);
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:name/tasks/:index', (req, res, next) => {
    try {
      todos.complete(req.params.name, req.params.index);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  })
  
  router.delete('/:name/tasks/:index', (req, res, next) => {
    try {
      todos.remove(req.params.name, req.params.index);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  })