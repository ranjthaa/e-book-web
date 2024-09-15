const mysql = require("../database/connection");

const getBooks = (req, res) => {

    const { publisher_id, status } = req.body;
    
    const SITE_COVER_IMAGE_URL = req.protocol + '://' + req.get('host') + '/cover_image/';
    const SITE_BOOK_URL        = req.protocol + '://' + req.get('host') + '/books/';
    const SITE_DEMO_BOOK_URL   = req.protocol + '://' + req.get('host') + '/demo_page/';

    if(!publisher_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    let query = ``;

    if(!status) {
        query = `SELECT * FROM e_books WHERE publisher_id = ${publisher_id}`;
    }else {
        if(status == 'NEW') {
            query = `SELECT * FROM e_books WHERE publisher_id = ${publisher_id} AND book_approval='NEW' `;
        } else if(status == 'APPROVED') {
            query = `SELECT * FROM e_books WHERE publisher_id = ${publisher_id} AND book_approval='APPROVED' `;
        } else if(status == 'CANCELLED') {
            query = `SELECT * FROM e_books WHERE publisher_id = ${publisher_id} AND book_approval='CANCELLED' `;
        }
    }

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.length === 0) {
            return res.status(401).send({status:401, message:`You Don't have any books`});
        }

        const sendBook = [];

        result.forEach(element => {
            const book = {};
            book.book_id                = element.id;
            book.publisher_id           = element.publisher_id;
            book.publisher_name         = element.publisher_name;
            book.book_title             = element.book_title;
            book.book_description       = element.book_description;
            book.book_cover_image       = SITE_COVER_IMAGE_URL + element.book_cover_image;
            book.book_pdf               = SITE_BOOK_URL        + element.book_pdf;
            book.demo_book              = SITE_DEMO_BOOK_URL   + element.demo_file;   
            book.auther_name            = element.auther_name;
            book.category_name          = element.category_name;
            book.year_of_the_book       = element.year_of_the_book;
            book.book_submit_date       = element.book_submit_date;
            book.book_approval_status   = element.book_approval;
            book.book_approval_date     = element.book_approval_date;
            book.book_cancelled_msg     = element.cancelled_msg;
            sendBook.push(book);
        });

        return res.status(200).send({status:200, message:"Success", data:sendBook});

    })

}

module.exports = { getBooks };
