const mysql = require('../database/connection');

async function registerUser(req, res) {

    const body = req.body;

    try {const mysql = require('../database/connection');

async function registerUser(req, res) {

    const body = req.body;

    try {

        const query       = `INSERT INTO signup (name, phone, gender, user_type, email, password) VALUES (?,?,?,?,?,?)`;

        mysql.query(query, [ body.name, body.phone, body.gender, body.user_type, body.email, body.password ], (err, result) => {

            if(err) {
                const error = { message:'Error', error:err };
                console.log(error);
                return res.status(500).send({status:500, message:error.message});
            }

            return res.status(201).send({status: 201, message: 'User Registered Successfully' });

        });

    } catch (error) {
        res.status(500).send({status:500, message:error.message});
    }

}

function signup(req, res) {

    const body = req.body;

    if(!body.name || !body.phone || !body.email || !body.user_type || !body.gender || !body.password) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    try {

        const checkQuery = `SELECT * FROM signup WHERE email = '${body.email}'`;

        mysql.query(checkQuery, (err, result) => {
            if(err) {
                const error = { message:'Error', error:err };
                console.log(error);
                return res.status(500).send({status:500, message:error.message});
            } 
            
            if(result.length > 0) {
                return res.status(409).send({status:409, message:'User already exists'});
            } 

            registerUser(req, res);

        });

    } catch (error) {
        res.status(500).send({status:500, error:error.message});
    }

}   

const signin = (req, res) => {

    const { email, password } = req.body;

    const SITE_URL = req.protocol + '://' + req.get('host') + '/asserts/';

    if(!email || !password){
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    try {
        
        const query = `SELECT * FROM signup WHERE email = '${email}'`;

             mysql.query(query, async (err, result) => {
                if(err) {
                    const error = { message:'Error', error:err };
                    console.log(error);
                    return res.status(500).send({status:500, message:error.message});
                }    
                
                if(result.length === 0) {
                    return res.status(401).send({status:401, message:'Invalid credentials'});
                }

                if(password == result[0].password) {

                    const userInfo = result[0];
                    const user     = {};

                    user.id        = userInfo.id;
                    user.name      = userInfo.name;
                    user.phone     = userInfo.phone;
                    user.email     = userInfo.email;
                    user.user_type = userInfo.user_type;
                    user.gender    = userInfo.gender;
                    user.profile   = SITE_URL + userInfo.profile_photo;
                    
                    return res.status(200).send({ status:200, message:'Login Success', data:user });
                
                }else {
                    return res.status(401).send({ status:401, message:'Incorrect Password' }); 
                }
            
        });
        
    } catch (error) {
        res.status(500).send({status:500, message:error.message});
    }
    
}


module.exports = { signup, signin };

        const query       = `INSERT INTO signup (name, phone, gender, user_type, email, password) VALUES (?,?,?,?,?,?)`;

        mysql.query(query, [ body.name, body.phone, body.gender, body.user_type, body.email, body.password ], (err, result) => {

            if(err) {
                const error = { message:'Error', error:err };
                console.log(error);
                return res.status(500).send({status:500, message:error.message});
            }

            return res.status(201).send({status: 201, message: 'User Registered Successfully' });

        });

    } catch (error) {
        res.status(500).send({status:500, message:error.message});
    }

}

function signup(req, res) {

    const body = req.body;

    if(!body.name || !body.phone || !body.email || !body.user_type || !body.gender || !body.password) {
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    try {

        const checkQuery = `SELECT * FROM signup WHERE email = '${body.email}'`;

        mysql.query(checkQuery, (err, result) => {
            if(err) {
                const error = { message:'Error', error:err };
                console.log(error);
                return res.status(500).send({status:500, message:error.message});
            } 
            
            if(result.length > 0) {
                return res.status(409).send({status:409, message:'User already exists'});
            } 

            registerUser(req, res);

        });

    } catch (error) {
        res.status(500).send({status:500, error:error.message});
    }

}   

const signin = (req, res) => {

    const { email, password } = req.body;

    const SITE_URL = req.protocol + '://' + req.get('host') + '/asserts/';

    if(!email || !password){
        return res.status(400).send({ status: 400, message: 'Fields cannot be empty!' });
    }

    try {
        
        const query = `SELECT * FROM signup WHERE email = '${email}'`;

             mysql.query(query, async (err, result) => {
                if(err) {
                    const error = { message:'Error', error:err };
                    console.log(error);
                    return res.status(500).send({status:500, message:error.message});
                }    
                
                if(result.length === 0) {
                    return res.status(401).send({status:401, message:'Invalid credentials'});
                }

                if(password == result[0].password) {

                    const userInfo = result[0];
                    const user     = {};

                    user.id        = userInfo.id;
                    user.name      = userInfo.name;
                    user.phone     = userInfo.phone;
                    user.email     = userInfo.email;
                    user.user_type = userInfo.user_type;
                    user.gender    = userInfo.gender;
                    user.profile   = SITE_URL + userInfo.profile_photo;
                    
                    return res.status(200).send({ status:200, message:'Login Success', data:user });
                
                }else {
                    return res.status(401).send({ status:401, message:'Incorrect Password' }); 
                }
            
        });
        
    } catch (error) {
        res.status(500).send({status:500, message:error.message});
    }
    
}


module.exports = { signup, signin };
