const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('../database/connection');

// Directory paths
const coverImageDir = path.join(__dirname, 'uploads/cover_image');
const bookDir = path.join(__dirname, 'uploads/books');
const demoFileDir = path.join(__dirname, 'uploads/demo_file');

// Ensure directories exist
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExistence(coverImageDir);
ensureDirectoryExistence(bookDir);
ensureDirectoryExistence(demoFileDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'cover_image') {
      cb(null, coverImageDir);
    } else if (file.fieldname === 'book') {
      cb(null, bookDir);
    } else if (file.fieldname === 'demo_file') {
      cb(null, demoFileDir);
    } else {
      cb(new Error('Unexpected field'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const add_book = (req, res) => {
  upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'book', maxCount: 1 },
    { name: 'demo_file', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error("Multer error: ", err.message);
      return res.status(400).send({ status: 400, message: err.message });
    }

    const { publisher_id, publisher_name, book_titile, book_description, auther_name, year_of_the_book, category_name, book_price } = req.body;

    // if (!publisher_id || !book_price || !category_name || !publisher_name || !book_titile || !book_description || !auther_name || !year_of_the_book) {
    //   return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    // }

    const coverImageName = req.files['cover_image'] ? req.files['cover_image'][0].filename : '';
    const bookName = req.files['book'] ? req.files['book'][0].filename : '';
    const demoFile = req.files['demo_file'] ? req.files['demo_file'][0].filename : '';

    // if (!coverImageName || !bookName || !demoFile) {
    //   return res.status(400).send({ status: 400, message: 'File data empty!' });
    // }

    const book_submit_date = new Date();
    const book_approval = 'NEW';

    const query = `INSERT INTO e_books(publisher_id, publisher_name, book_titile, book_description, book_cover_image, book_pdf, demo_file, category_name, auther_name, year_of_the_book, price, book_submit_date, book_approval) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    mysql.query(query, [publisher_id, publisher_name, book_titile, book_description, coverImageName, bookName, demoFile, category_name, auther_name, year_of_the_book, book_price, book_submit_date, book_approval], (err, result) => {
      if (err) {
        console.error("Database error: ", err.message);
        return res.status(500).send({ status: 500, message: err.message });
      }

      if (result.affectedRows != 0) {
        return res.status(200).send({ status: 200, message: "Book Submitted Successfully" });
      } else {
        return res.status(400).send({ status: 400, message: "Cannot Submit Book" });
      }
    });
  });
};

module.exports = { add_book };
