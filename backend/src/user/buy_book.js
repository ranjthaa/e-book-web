const mysql = require("../database/connection");

const buyBook = (req, res) => {

    const { user_id, publisher_id, book_id, price, transaction_id } = req.body;

    if(!publisher_id || !user_id || !book_id || !price || !transaction_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const checkQeury = `SELECT * FROM purchased_books where user_id=? and book_id = ?`;
    mysql.query(checkQeury, [user_id, publisher_id, book_id, price, transaction_id ], (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }
        if(result.length == 0){
            const query = `INSERT INTO purchased_books(user_id, publisher_id, book_id, price, transaction_id) VALUES (?, ?, ?, ?, ?)`;

            mysql.query(query, [user_id, publisher_id, book_id, price, transaction_id ], (err, result) => {
                if(err) {
                    const error = { message:'Error', error:err };
                    console.log(error);
                    return res.status(500).send({status:500, message:error.message});
                }
        
                return res.status(200).send({status:200, message:"Success"});
            })
        }else{
            return res.status(200).send({status:300, message:"Book Already Purchesed"});
        }
    })
    

}

const getPurchesedBooks = (req, res) => {

    const SITE_COVER_IMAGE_URL = req.protocol + '://' + req.get('host') + '/cover_image/';
    const SITE_BOOK_URL        = req.protocol + '://' + req.get('host') + '/books/';
    const SITE_DEMO_BOOK_URL   = req.protocol + '://' + req.get('host') + '/demo_page/';

    const user_id = req.query.user_id;

    if(!user_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const query = `select * from purchased_books pb inner join e_books eb on pb.user_id=? and eb.id = pb.book_id`;

    mysql.query(query, [user_id], (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        if(result.length <= 0) {

            return res.status(200).send({status:200, message:"You Don't Have Books"});

        }
        const data = [];
        result.forEach(element => {

                const book    = {};
            book.book_id                = element.book_id;
            book.user_id                = element.user_id;
            book.price                  = element.price;
            book.buy_date               = element.date;
            book.transaction_id         = element.transaction_id;
            book.publisher_id           = element.publisher_id;
            book.publisher_name         = element.publisher_name;
            book.book_titile             = element.book_titile;
            book.book_description       = element.book_description;
            book.book_cover_image       = SITE_COVER_IMAGE_URL + element.book_cover_image;
            book.demo_book              = SITE_DEMO_BOOK_URL   + element.demo_file;
            book.book_pdf               = SITE_BOOK_URL        + element.book_pdf;
            book.auther_name            = element.auther_name;
            book.year_of_the_book       = element.year_of_the_book;
            book.book_submit_date       = element.book_submit_date;
            // book.price                  = element.price;
            // book.book_approval_status   = element.book_approval;
            book.book_approval_date     = element.book_approval_date;
            book.book_cancelled_msg     = element.cancelled_msg;

            data.push(book);
        });

        return res.status(200).send({status:200, message:"Success", data:data});
    })

}

module.exports = { buyBook, getPurchesedBooks };
