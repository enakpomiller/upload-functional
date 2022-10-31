
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const fileUpload = require('express-fileupload'); 

require('dotenv').config();


const app = express();
const port = process.env.PORT || 8000; 

// default option for file ulpoad
app.use(fileUpload());
// pass application via url
app.use(bodyParser.urlencoded({ extended: false}));
// pass application / json
app.use(bodyParser.json());
// setting up static files and folders 
app.use(express.static('public'));
app.use(express.static('upload'));
// templating engine
app.engine('hbs', exphbs.engine({extname:'.hbs'}));
app.set('view engine','hbs');

// creating  pool for database
const pool = mysql.createPool({
    connectionLimit     : 100,
    host                : process.env.DB_HOST,
    user                : process.env.DB_USER,
    password            : process.env.DB_PASSWORD,
    database            : process.env.DB_NAME
});

 // declaring session 
 app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
   }));

// connecting to the database
pool.getConnection((err,connection)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connection ID '+connection.threadid);
    }
});


// routes
const routes = require('./server/routes/user');
app.use('/',routes);


app.listen(port, ()=>console.log(` app running at port ${port} `));