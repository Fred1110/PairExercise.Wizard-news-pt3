const express = require('express');
const router = express.Router();
// could use one line instead: const router = require('express').Router();
const client = require("../db");
const postList = require("../views/postList");
const postDetails = require("../views/postDetails");
const addPost = require ("../views/addPost");

const baseQuery = "SELECT posts.*, users.name, counting.upvotes FROM posts INNER JOIN users ON users.id = posts.userId LEFT JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting ON posts.id = counting.postId\n";

router.get("/", async (req, res, next) => {
  try {
    const data = await client.query(baseQuery);
    res.send(postList(data.rows));
  } catch (error) { next(error) }
});

router.get("/add", (req, res) => {
  res.send(addPost());
});

router.get("/:id", async (req, res) => {
  try {
    const data = await client.query(baseQuery + 'WHERE posts.id = $1', [req.params.id]);
    const post = data.rows[0];
    res.send(postDetails(post));
  } catch (error) { next(error) }
});

router.post("/", async (req, res) => {
  const name = req.body.name;
  const title = req.body.title;
  const content = req.body.content;

  // Insert the post in the database
  // NB: You don't need to do this in one big SQL query. Try breaking it up!
  const userId = client.query('SELECT * FROM USERS WHERE USERS.NAME = $1', [name])

  res.redirect(`/posts/${postId}`); // Redirect to the post details page


})

module.exports = router;
