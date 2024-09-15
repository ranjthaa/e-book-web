const multer = require("multer");
const mysql = require("../database/connection");

var fileName="";
const storage = multer.diskStorage({

  destination: (req, file, cb) => { cb(null, 'C:\\VEERAMANI\\book\\e-book\\backend\\src\\uploads\\category_images\\'); },

  filename: (req, file, cb) => {

      fileName = Date.now() + '-' + file.originalname;
      cb(null, fileName);

  },

});

const upload = multer({ storage });

const addCategory = (req, res) => {

    upload.single("category_image")(req, res, (err) => {

        if(err) {console.log("error "+err.message); return res.status(400).send({ status:400, message: 'image data missing'})}

        const category_name = req.body.category_name;
        
        if (!category_name || !req.file) {
          return res.status(400).send({status:400, message: 'Content or image data missing'});
        }

        const query = `INSERT INTO books_category(category_name, category_image) VALUES ('${category_name}','${fileName}')`;

          mysql.query(query, (err, result) => {

            if (err) {
              return res.status(500).send({status:500, message: 'Error inserting data into database' });
            }
            
            return res.status(200).send({ status: 200, message: 'Category Added Successfully' });

          });

    })

}

const deleteCategory = (req, res) => {
    const category_id = req.query.category_id;

    if (!category_id) {
        return res.status(400).send({status:400, message: 'Content missing'});
    }

    const query = `DELETE FROM books_category WHERE id = ${category_id}`;

    mysql.query(query, (err, result) => {

        if (err) {
            return res.status(500).send({status:500, message: 'Error inserting data into database' });
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({ status: 200, message: 'Category Deleted Successfully' });
        }else {
            return res.status(400).send({status:400, message: "Category Deletion Failed"});
        }

    });


}

const updateCategory = (req, res) => {

    upload.single("category_image")(req, res, (err) => {

        if(err) {console.log("error "+err.message); return res.status(400).send({ status:400, message: 'image data missing'})}

        const category_name = req.body.category_name;
        const category_id   = req.body.category_id;
        
        if (!category_name || !category_id) {
          return res.status(400).send({status:400, message: 'Content missing'});
        }

        let query = ``;

        if(!req.file) {
            query = `UPDATE books_category SET category_name='${category_name}' WHERE id=${category_id}`;
        }else {
            query = `UPDATE books_category SET category_name='${category_name}', category_image='${fileName}' WHERE id=${category_id}`;
        }

        mysql.query(query, (err, result) => {

            if (err) {
                return res.status(500).send({status:500, message: 'Error inserting data into database' });
            }

            if(result.affectedRows!=0) {
                return res.status(200).send({ status: 200, message: 'Category Updated Successfully' });
            }else {
                return res.status(400).send({status:400, message: "Category Update Failed"});
            }

        });

    })

}

const getCategory = (req, res) => {

    const SITE_CATEGORY_IMAGE_URL = req.protocol + '://' + req.get('host') + '/category_image/';

    const query = `SELECT * FROM books_category `;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.length === 0) {
            return res.status(401).send({status:401, message:`Category Empty`});
        }

        const sendBook = [];

        result.forEach(element => {
            const book = {};
            book.category_id            = element.id;
            book.category_name          = element.category_name;
            book.category_image         = SITE_CATEGORY_IMAGE_URL + element.category_image;
            sendBook.push(book);
        });

        return res.status(200).send({status:200, message:"Success", data:sendBook});

    })
}

module.exports = { addCategory, deleteCategory, updateCategory, getCategory };
