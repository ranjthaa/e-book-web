const express           = require('express');
const book              = require('../publisher/add_book');
const getBooks          = require('../publisher/get_books');
const udpateBook        = require('../publisher/update_book');
const category          = require('../publisher/category');
const getAllPurchesedBooks = require('../publisher/buyed_books');
const router            = express.Router();

//books
router.post('/add_books', book.add_book);
router.post('/get_book', getBooks.getBooks);
router.post('/update_book', udpateBook.udpateBook);
router.post('/delete_book', udpateBook.deleteBook);
router.post('/buyed_books', getAllPurchesedBooks)

//category 
router.post('/get_category', category.getCategory);
router.post('/add_category', category.addCategory);
router.post('/update_category', category.updateCategory);
router.post('/delete_category', category.deleteCategory);

module.exports = router;
