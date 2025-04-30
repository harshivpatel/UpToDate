var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET change password page (protected)
router.get('/change-password', authMiddleware, (req, res) => {
  res.render('change-password'); // Assumes you have a view file named change-password.ejs or similar
});

// POST change password (protected)
router.post('/change-password', authMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  // TODO: Add logic to check old password, hash new password, and update DB

  res.json({ message: 'Password changed successfully' });
});

module.exports = router;
