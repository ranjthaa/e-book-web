const express    = require('express');
const getBooks   = require('../admin/getBooks');
const book       = require('../admin/update_book');
const publisher  = require('../admin/publisher_list');
const getReviews  = require('../admin/get_all_reviews');
const { getAllPurchesedBooks } = require('../admin/getAllPurchesedBooks');
const prepareBook = require('../admin/singlebookdetails');
const router     = express.Router();

router.post('/get_books', getBooks.getAllBooks);
router.post('/get_single_book', prepareBook);
router.post('/approve_book', book.approveBook);
router.post('/cancel_book', book.cancelBook);
router.post('/get_publisher', publisher.getPublisher);

router.post('/get_all_review', getReviews.getAllReviews);
router.post('/get_all_purchesed_books', getAllPurchesedBooks);

module.exports = router;
