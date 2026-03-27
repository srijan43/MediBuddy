const express = require('express');
const { validate } = require('../middleware/validate');
const { listDoctors, getDoctor, listDoctorsSchema } = require('../controllers/doctors.controller');

const router = express.Router();

router.get('/', validate(listDoctorsSchema), listDoctors);
router.get('/:id', getDoctor);

module.exports = router;

