const mysql = require("../database/connection");

const udpateBook = (req, res) => {

    const { book_id, publisher_id, book_titile, book_description, auther_name, year } = req.body;

    if(!book_id || !publisher_id || !book_titile || !book_description || !auther_name || !year) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const query = `UPDATE e_books SET book_titile='${book_titile}', book_description='${book_description}', auther_name='${auther_name}', year_of_the_book='${year}' WHERE id=${book_id} and publisher_id=${publisher_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Book Updated Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Book Update Failed"});
        }

    })

}

const deleteBook = (req, res) => {

    const book_id      = req.query.book_id;
    const publisher_id = req.query.publisher_id;

    if(!book_id || !publisher_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const query = `DELETE FROM e_books WHERE id=${book_id} and publisher_id=${publisher_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }
        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Book Deleted Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Book Delete Failed"});
        }

    })

}

module.exports = { udpateBook, deleteBook };
