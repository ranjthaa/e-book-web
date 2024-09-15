const mysql = require("../database/connection");

const getPublisher = (req, res) => {

    const SITE_URL = req.protocol + '://' + req.get('host') + '/asserts/';

    const query = `SELECT id, name, phone, gender, email, profile_photo FROM signup WHERE user_type = 110`;

    mysql.query(query, (err, result) => {
        if(err) {
            const error = { message:'Error', error:err };
            console.log(error);
            return res.status(500).send({status:500, message:error.message,err:err});
        }

        if(result.length === 0) {
            return res.status(401).send({status:401, message:`You Don't have any books`});
        }

        const users = [];
        result.forEach(userInfo => {
            const user     = {};

            user.id        = userInfo.id;
            user.name      = userInfo.name;
            user.phone     = userInfo.phone;
            user.email     = userInfo.email;
            user.user_type = userInfo.user_type;
            user.gender    = userInfo.gender;
            user.profile   = SITE_URL + userInfo.profile_photo;
            users.push(user);

        });

        return res.status(200).send({status:200, message:"Success", data:users});

    })

}

module.exports = { getPublisher }
