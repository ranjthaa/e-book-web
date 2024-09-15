const mysql = require("../database/connection");


const getAllPurchesedBooks = (req, res) => {

    const SITE_COVER_IMAGE_URL = req.protocol + '://' + req.get('host') + '/cover_image/';
    const SITE_BOOK_URL        = req.protocol + '://' + req.get('host') + '/books/';
    const SITE_DEMO_BOOK_URL   = req.protocol + '://' + req.get('host') + '/demo_page/';
    const SITE_URL             = req.protocol + '://' + req.get('host') + '/asserts/';

    const {publisher_id} = req.body;

    if(!publisher_id) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    let query = `select pb.id , pb.date as purchased_book_date, pb.transaction_id as purchased_book_transaction_id, 
    user_id, book_id, pb.publisher_id, pb.price as user_payed_amount, eb.publisher_name as eb_publisher_name, 
    book_titile, book_cover_image, book_pdf, demo_file, category_name, auther_name, year_of_the_book, eb.price as book_price,
     eb.book_submit_date, su.name as user_name, su.phone as user_phone, su.user_type, email, 
     profile_photo from purchased_books pb  inner join e_books eb on pb.publisher_id=${publisher_id} and pb.book_id = eb.id inner join signup su on su.id = pb.user_id`;
    
   mysql.query(query, (err, result) => {
       if(err) {
           const error = { message:'Error', error:err };
           console.log(error);
           return res.status(500).send({status:500, message:error.message,err:err});
       }

       if(result.length === 0){
           return res.status(400).send({status:400, message:"Not Found"});
       }

       const sendData = [];

       result.forEach(element => {
           const obj                    = {};
           obj.purches_id               = element.id;
           obj.purches_date             = element.purchased_book_date;
           obj.purchased_transaction_id = element.purchased_book_transaction_id;
           obj.user_id                  = element.user_id;
           obj.book_id                  = element.book_id;
           obj.publisher_id             = element.publisher_id;
           obj.user_payed_amount        = element.user_payed_amount;
           obj.book_publisher_name      = element.eb_publisher_name
           obj.book_titile              = element.book_titile;
           obj.book_cover_image         = SITE_COVER_IMAGE_URL + element.book_cover_image;
           obj.book_pdf                 = SITE_BOOK_URL + element.book_pdf;
           obj.demo_book                = SITE_DEMO_BOOK_URL + element.demo_file;
           obj.category_name            = element.category_name;
           obj.book_auther_name         = element.auther_name;
           obj.year                     = element.year_of_the_book;
           obj.book_price               = element.book_price;
           obj.user_name                = element.user_name;
           obj.user_phone               = element.user_phone;
           obj.user_type                = element.user_type;
           obj.email                    = element.email;
           obj.user_profile_photo       = SITE_URL + element.profile_photo;
           sendData.push(obj);
       });

        return res.status(200).send({ status:200, message:'Success', data:sendData });
       
   })

}

module.exports = getAllPurchesedBooks;
