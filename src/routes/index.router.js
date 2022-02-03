var express = require('express')
var router = express.Router()
const user = require('../controllers/user.controller')
const activity = require('../controllers/activity.controller')
const scores = require('../controllers/scores.controller')
const Auth = require('../middleware/auth.middelware').Auth
// middleware that is speciific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route

router.get('/user-info', function (req, res) {
    return res.json({
        message: "fetching the userinfo..."
    })
})

router.get('/user-detail', function (req, res) {
    return res.json({
        message: "fetching the user detail..."
    })
})


// LOGIN ROUTES
router.post('/login', user.login)
router.post('/otp-verification', user.otp_verification)
router.post('/user-profile', Auth, user.user_profile)

// ACTIVITY ROUTES
router.post('/create-activities',Auth, activity.activity_insert)
router.patch('/update-activity-status/:id',Auth, activity.activity_statusupdate)
router.patch('/update-activity-type/:id',Auth ,activity.activity_update)
router.delete('/activity-delete/:id',Auth, activity.activity_delete)
router.get('/activity-list',Auth, activity.activity_list)
router.get('/activity-dailystatuschange',Auth, activity.activity_dailystatuschange)

// SCORES ROUTES
router.get('/scores_create',Auth,scores.scores_create)

module.exports = router