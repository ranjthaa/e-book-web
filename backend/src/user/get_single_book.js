const mysql = require("../database/connection");

const getBook = (req, res) => {

    const book_id = req.query.book_id;
    const user_id = req.query.user_id;

    if(!book_id || !user_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const query = `SELECT * FROM purchased_books WHERE user_id=? and book_id=?`;

    mysql.query(query, [user_id, book_id], (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        prepareBook(req, res, result.length);

    })

}

const prepareBook = (req, res, length) => {

    const SITE_COVER_IMAGE_URL = req.protocol + '://' + req.get('host') + '/cover_image/';
    const SITE_BOOK_URL        = req.protocol + '://' + req.get('host') + '/books/';
    const SITE_DEMO_BOOK_URL   = req.protocol + '://' + req.get('host') + '/demo_page/';

    const book_id = req.query.book_id;
    const user_id = req.query.user_id;

    const query = `SELECT * FROM e_books WHERE book_approval='APPROVED' and id='${book_id}'`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        if(result.length==0) {
            return res.status(404).send({status: 404, message: 'Book Not Found!'});
        }

        const element = result[0];
        const book    = {};
        book.book_id                = element.id;
        book.publisher_id           = element.publisher_id;
        book.publisher_name         = element.publisher_name;
        book.book_title             = element.book_title;
        book.book_description       = element.book_description;
        book.book_cover_image       = SITE_COVER_IMAGE_URL + element.book_cover_image;
        book.demo_book              = SITE_DEMO_BOOK_URL   + element.demo_file;
        book.book_pdf               = SITE_BOOK_URL        + element.book_pdf;
        book.auther_name            = element.auther_name;
        book.year_of_the_book       = element.year_of_the_book;
        book.book_submit_date       = element.book_submit_date;
        book.price                  = element.price;
        book.book_approval_status   = element.book_approval;
        book.book_approval_date     = element.book_approval_date;
        book.book_cancelled_msg     = element.cancelled_msg;

        if(length>0) {
            book.payment_status     = true;
        } else {
            book.payment_status     = false;
        }

        return res.status(200).send({status:200, message:"Success", data:book});


    })

}

module.exports = { getBook };
