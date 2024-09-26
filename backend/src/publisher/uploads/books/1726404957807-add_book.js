const multer = require('multer');
const mysql = require('../database/connection');

const path = 'C:\\e-book\\web\\e-book\\client\\e-book-web\\backend\\src\\publisher\\uploads\\';

let coverImageName = "";
let bookName       = "";
let demoFile       = "";
const storage = multer.diskStorage({

  destination: (req, file, cb) => { 
    if(file.fieldname === path + 'cover_image\\') {
        cb(null, 'cover_image\\'); 
    }
    if(file.fieldname === 'book') {
       cb(null, path + 'books\\');
    }
    if(file.fieldname === 'demo_file') {
        cb(null, path + 'demo_file\\');
    }
    
},

  filename: (req, file, cb) => {

    if(file.fieldname === 'book') {
        bookName = Date.now() + '-' + file.originalname;
        cb(null, bookName);
     }
     if(file.fieldname === 'cover_image') {
        coverImageName = Date.now() + '-' + file.originalname;
         cb(null, coverImageName);
     }
     if(file.fieldname === 'demo_file') {
        demoFile = Date.now() + '-' + file.originalname;
        cb(null, demoFile);
     }

  },

});

const add_book = (req, res) => {

    const upload = multer({ storage });

    upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'book', maxCount: 1 }, { name:'demo_file', maxCount: 1}])(req, res, (err) => {

        if(err){console.log("error "+err.message); return res.status(400).send({ status:400,message: 'image data missing'})}

            const publisher_id      = req.body.publisher_id;
            const publisher_name    = req.body.publisher_name;
            const book_titile       = req.body.book_titile;
            const book_description  = req.body.book_description;    
            const auther_name       = req.body.auther_name;
            const year              = req.body.year_of_the_book;
            const category_name     = req.body.category_name;
            const book_price        = req.body.book_price;

            // console.log(req.body);

            if(!publisher_id || !book_price || !category_name || !publisher_name || !book_titile || !book_description || !auther_name || !year) {
                return res.status(200).send({status: 400, message: 'Fields cannot be empty!'});
            }

            if(!coverImageName || !bookName || !demoFile) {
                return res.status(200).send({status: 400, message: 'File data empty!'});
            }

            return res.send({msg:"ok"})

            const book_submit_date  = new Date();
            const book_approval     = 'NEW';

            const query = `INSERT INTO e_books(publisher_id, publisher_name, book_titile, book_description, book_cover_image, book_pdf, demo_file, category_name, auther_name, year_of_the_book, price, book_submit_date, book_approval) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            mysql.query(query, [publisher_id, publisher_name, book_titile, book_description, coverImageName, bookName, demoFile, category_name, auther_name, year, book_price, book_submit_date, book_approval], (err, result) => {
                if(err) {
                    const error = { message:'Error', error:err };
                    console.log(error);
                    return res.status(500).send({status:500, message:error.message});
                }

                if(result.affectedRows!=0) {
                    return res.status(200).send({status:200, message:"Book Submitted Successfully"});
                }else {
                    return res.status(200).send({status:400, message:"Cannot Submite Book"});
                }
        
            })

    });

}

module.exports = { add_book };
