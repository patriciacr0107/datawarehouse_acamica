const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getContactById,
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  deleteContacts,
} = require('../controllers/contact.controller');

router.use(protect);

router.route('').get(getAllContacts).post(createContact).delete(deleteContacts);

router
  .route('/:id')
  .get(getContactById)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
