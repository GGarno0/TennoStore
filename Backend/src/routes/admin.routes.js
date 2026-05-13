const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyAdmin } = require('../middlewares/auth.middleware');

// Todas estas rutas requieren ser Admin
router.use(verifyAdmin);

router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
