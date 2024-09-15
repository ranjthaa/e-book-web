const mysql = require("../database/connection");

const getAllReviews = (req, res) => {


    const SITE_URL = req.protocol + '://' + req.get('host') + '/asserts/';

    let query = `SELECT review.id as review_id, signup.id as signup_id, review_text, user_id, publisher_id, book_id, date, name, phone, gender, user_type, email, profile_photo  FROM review LEFT JOIN signup ON review.user_id = signup.id`;
    
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
                const user     = {};

                user.review_id = userInfo.review_id;
                user.user_id   = userInfo.signup_id;
                user.book_id   = userInfo.book_id;
                user.publisher_id = userInfo.publisher_id;
                user.name      = userInfo.name;
                user.phone     = userInfo.phone;
                user.email     = userInfo.email;
                user.user_type = userInfo.user_type;
                user.gender    = userInfo.gender;
                user.review_text = userInfo.review_text;
                user.date      = userInfo.date;
                user.profile   = SITE_URL + userInfo.profile_photo;
                data.push(user);
                   
           });

        return res.status(200).send({ status:200, message:'Success', data:data });
       
   })

}

module.exports = {getAllReviews};
