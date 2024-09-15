const mysql = require("../database/connection");

const saveBook = (req, res) => {

    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    if(!user_id || !book_id) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    const query = `INSERT INTO saved_list(user_id, book_id) VALUES (${user_id}, ${book_id})`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        return res.status(201).send({status: 201, message: 'Book Saved Successfully' });

    })

}

const checkBookSaved = (req, res) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    if(!user_id || !book_id) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    const query = `select * from saved_list where user_id = ${user_id} and book_id = ${book_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.length > 0) {
            return res.status(400).send({status: 400, message: 'Book Already Saved' });
        }

        saveBook(req, res);

    })
}

const getSavedBook = (req, res) => {

    const user_id = req.query.user_id;

    const SITE_COVER_IMAGE_URL = req.protocol + '://' + req.get('host') + '/cover_image/';
    const SITE_BOOK_URL        = req.protocol + '://' + req.get('host') + '/books/';
    const SITE_DEMO_BOOK_URL   = req.protocol + '://' + req.get('host') + '/demo_page/';

    if(!user_id) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    const query = `select * from saved_list inner join e_books on e_books.id=saved_list.book_id and saved_list.user_id=${user_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }
        
        if(result.length == 0) {
            return res.status(400).send({status: 400, message: `You Don't Have Any Book` });
        }

        const data = [];
        
        result.forEach(element => {
            const book = {};
            book.saved_id               = element.savedlist_id;
            book.book_id                = element.id;
            book.publisher_id           = element.publisher_id;
            book.publisher_name         = element.publisher_name;
            book.book_title             = element.book_title;
            // book.book_description       = element.book_description;
            book.book_cover_image       = SITE_COVER_IMAGE_URL + element.book_cover_image;
            // book.book_pdf               = SITE_BOOK_URL        + element.book_pdf;
            // book.demo_book              = SITE_DEMO_BOOK_URL   + element.demo_file;
            book.auther_name            = element.auther_name;
            book.year_of_the_book       = element.year_of_the_book;
            book.book_submit_date       = element.book_submit_date;
            book.book_approval_status   = element.book_approval;
            book.book_approval_date     = element.book_approval_date;
            book.book_cancelled_msg     = element.cancelled_msg;

            data.push(book);
        });

        return res.status(200).send({status: 200, message: `Success`, data:data });

    })

}

const deleteSavedBook = (req, res) => {

    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    if(!user_id || !book_id) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    const query = `delete from saved_list where user_id = ${user_id} and book_id = ${book_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Deleted Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Delete Failed"});
        }

    })

}


module.exports = { checkBookSaved, getSavedBook, deleteSavedBook };
