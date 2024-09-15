const mysql = require("../database/connection");

const approveBook = (req, res) => {

    const { book_id, publisher_id } = req.body;

    if(!book_id || !publisher_id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const book_approval_msg = 'APPROVED';

    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const day = date + '-' + month + '-' + year;

    const query = `UPDATE e_books SET book_approval='${book_approval_msg}', book_approval_date='${day}' WHERE id=${book_id} and publisher_id=${publisher_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Updated Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Update Failed"});
        }

    })

}

const cancelBook = (req, res) => {

    const { book_id, publisher_id, cancelMsg  } = req.body;

    if(!book_id || !publisher_id || !cancelMsg) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const book_approval_msg = 'CANCELLED';

    const date  = new Date().getDate();
    const month = new Date().getMonth();
    const year  = new Date().getFullYear();

    const day = date + '-' + month + '-' + year;

    const query = `UPDATE e_books SET book_approval='${book_approval_msg}', book_approval_date='${day}', cancelled_msg='${cancelMsg}' WHERE id=${book_id} and publisher_id=${publisher_id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message});
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Updated Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Update Failed"});
        }

    })

}

module.exports = { approveBook, cancelBook };
