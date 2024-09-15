const mysql = require("../database/connection");

const addReview = (req, res) => {

    const { user_id, publisher_id, book_id, review_text} =  req.body;

    if(!user_id || !publisher_id || !book_id || !review_text) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }
    
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const day = date + '-' + month + '-' + year;

    const query = `INSERT INTO review( user_id, publisher_id, book_id, review_text, date) VALUES (${user_id},${publisher_id},${book_id},'${review_text}','${day}')`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        return res.status(200).send({status:200, message:"Submitted Successfully"});

    })
}

const viewBookReview = (req, res) => {

     const { book_id } = req.body;

     if(!book_id ) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

     const SITE_URL = req.protocol + '://' + req.get('host') + '/asserts/';

     let query = `SELECT rv.id as review_id, rv.publisher_id, rv.book_id, rv.review_text, rv.date, name, phone, email, user_type, gender, profile_photo  FROM review rv inner JOIN signup su ON rv.user_id = su.id AND rv.book_id = ${book_id}`;
     
    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.length === 0){
            return res.status(400).send({status:400, message:"Not Found"});
        }

        const data = [];

        result.forEach(userInfo => {
                const user          = {};
                user.review_id      = userInfo.review_id;
                user.user_id        = userInfo.user_id;
                user.publisher_id   = userInfo.publisher_id;
                user.review_text    = userInfo.review_text;
                user.user_name      = userInfo.name;
                user.user_phone     = userInfo.phone;
                user.user_email     = userInfo.email;
                user.user_type      = userInfo.user_type;
                user.gender         = userInfo.gender;
                user.date           = userInfo.date;
                user.profile        = SITE_URL + userInfo.profile_photo;
                data.push(user);
                    
            });

         return res.status(200).send({ status:200, message:'Success', data:data });
        
    })

}

const deleteReivew = (req, res) => {

    const id = req.query.id;

    if(!id) {
        return res.status(400).send({status: 400, message: 'Fields cannot be empty!'});
    }

    const query =`DELETE FROM review WHERE id=${id}`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.affectedRows!=0) {
            return res.status(200).send({status:200, message:"Deleted Successfully"});
        }else {
            return res.status(400).send({status:400, message:"Cannot Delete"});
        }
    })

}

module.exports = { addReview, viewBookReview, deleteReivew };
