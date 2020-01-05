/* MODULE INITS */
const express = require('express');
    const router = express.Router();
// Database 
const db = require('./db.js');

const allLikes = async (req, res) => {
  try {
    let postId = parseInt(req.params.post_id)
    let getQuery =`
    SELECT DISTINCT (liker_id), post_id, users.firstname, users.lastname
    FROM likes JOIN users ON users.user_id = likes.liker_id WHERE post_id IN (
        SELECT posts.post_id FROM users 
            INNER JOIN user_holds ON users.user_id = user_holds.holds_user_id 
            INNER JOIN holds ON user_holds.holds_hold_id = holds.hold_id 
            INNER JOIN posts ON posts.poster_id = users.user_id
            WHERE holds.hold_id = $1 AND post_id = $2);`

    let allLikes = await db.any(getQuery, [req.params.hold_id, postId])
    res.json({
        payload: allLikes,
        message: "Yo ho, me hearties! Here be all the likes on all the posts! I'm a pirate server!"
    })
} catch (error) {
    res.json({
        message: "Oops! All Errors!"
    })
}
}

const postLikes = async (req, res) => {
  try {
    let postId = parseInt(req.params.post_id)
    let likerId = parseInt(req.params.liker_id)
    let insertQuery = `
    INSERT INTO likes (liker_id, post_id)
    VALUES($1, $2)
    `
    let addLike = await db.none(insertQuery, [likerId, postId])
    res.json({
      payload: req.params,
      message: "Yarrrrrr! Like added!"
    })
  } catch (error) {
    res.json({
      message: 
    })
  }
}

router.get("/posts/:hold_id/:post_id", allLikes)  //- Get all likes for a single post
router.post("/posts/:post_id/:liker_id", postLikes) //- Post single like