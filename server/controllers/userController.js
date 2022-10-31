const mysql = require('mysql');
const bcrypt = require('bcrypt');
 const session = require('express-session');
const fileUpload = require('express-fileupload'); 

// database pool
const pool = mysql.createPool({
    connectionLimit   :   100,
    host              : process.env.DB_HOST,
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME

});


exports.view = (req,res)=>{
  // connecting to the database
   pool.getConnection((err,connection)=>{
      if(err) throw err; // display error if not connected
      console.log('connected as ID ' + connection.threadid); // if connection is successful
      // user the mysql query connection to display record
      connection.query('SELECT * FROM tbl_signup WHERE email="queen@yahoo.com"',(err,rows)=>{
      // when done with the connection, release it
      connection.release();
      if(!err){
          console.log("found");
          //res.render('home',{rows}); // passing rows as object if no error
          res.render('display_result',{rows});
        
        
      }else{
          console.log(err);
      }
      console.log('the data from user table: ',rows);

  });
});

}


// signup form
exports.signupform = (req,res)=>{
      res.render('home');
    
}

// exports.signup_logic = async (req,res)=>{
//     const {fname,other_names,address,phone,gender,email,password} = req.body;
//     const hashpassword = await bcrypt.hash(password, 10);
//     // connecting to database using our connection pool
//     pool.getConnection((err,connection)=>{
//         if(err) throw err;
//         console.log('connection as ID'+ connection.threadid);
//         connection.query('SELECT * FROM tbl_signup WHERE email=?',[email],(req,rows)=>{
//             connection.release();
//             const userExist = rows[0];
           
//             if(userExist){
//              console.log(userExist);
//                  res.render('home',{error:' Sorry that user already exist'});
//               }else {
//               // insert into database 
//               connection.query('INSERT INTO tbl_signup SET fname=?,other_names=?,address=?,phone=?,gender=?,email=?,password=?',[fname,other_names,address,phone,gender,email,hashpassword],(err,rows)=>{
//                 //connection.release();
//                 if(!err){
//                     res.redirect('login');
//                 }else{
//                     console.log(err);
//                 }
//                 console.log('the data from table',rows);
//             });
//             // end insert

//               }

//         });

//     })
// }



exports.signup_logic = async (req,res)=>{
       
          const {fname,other_names,address,phone,gender,email,password} = req.body;
          const hashpassword = await bcrypt.hash(password, 10); 
                      // start file upload
                       let userfile;
                      let uploadPath;
                        if(!req.files || Object.keys(req.files).length === 0){ 
                          return res.status(400).send('no file was uploaded');
                        }
                        userfile = req.files.userfile;
                        uploadPath = 'upload/' + userfile.name;
                        console.log(uploadPath);

                           // use the mv function to upload file on the path
                                 userfile.mv(uploadPath, function(err){
                                  if(err) return res.status(500).send(err);
                                   // res.send('file uploaded');
                      
                    // end file upload 

          // connecting to database using our connection pool
          pool.getConnection((err,connection)=>{
              if(err) throw err;
                          // start file upload
                            // let userfile;
                            // let uploadPath;
                            //   if(!req.files || Object.keys(req.files).length === 0){ 
                            //     return res.status(400).send('no file was uploaded');
                            //   }
                            //   userfile = req.files.userfile;
                            //   uploadPath = __dirname + '/upload/' + userfile.name;
                            //   console.log(userfile);
                          
                        // end file upload 

              connection.query('SELECT email FROM tbl_signup WHERE email=?',[email],(req,row)=>{
                  connection.release();
                  const userExist = row[0]; 

                  if( fname =="" || other_names=="" || address=="" || phone=="" || gender=="" || email=="" || password=="" || userfile==""){
                    res.render('home',{wrong_email:' please fill all entries '});
                    }else{ 
                  
                    if(userExist){ 
                      console.log(userExist);
                        res.render('home',{wrong_email:' Sorry that user  already exist'});
                    }if(!userExist){ 
                        console.log("email does not exist ");

                          // insert into database 

                          connection.query('INSERT INTO tbl_signup SET  fname=?,other_names=?,address=?,phone=?,gender=?,email=?,password=?,userfile=?',[fname,other_names,address,phone,gender,email,hashpassword,userfile.name],(err,rows)=>{
                            if(!err){
                                res.redirect('login');
                                res.render('login',{msg_sent:' user created '});
                            }else{
                                console.log(err);
                            }
                            console.log('the data from table',rows);
                        }); 

                  
                    
                        // end insert
                    
                        //res.render('home',{wrong_email:' email does not exist'}); 

                    } 
                    }
              
                  
              });
          }) 

        });
        


}


exports.displayform = (req,res)=>{ 
     if(req.session.loggedin){
        const fname = req.session.fname;
        const other_names = req.session.other_names;
        const userfile  = req.session.userfile;
       res.render('display_result',{login_success:'  '+ fname+' '+other_names+'  '});

     }else{
       res.render('login',{alert:'you must login'});
     }
}
 

 exports.search =(req,res)=>{
   pool.getConnection((err,connection)=>{
     if(err) throw err;
     console.log('connection as ID '+ connection.threadid);

      let  searchitem = req.body.search;
       connection.query('SELECT * FROM tbl_ailment WHERE name LIKE ?',['%'+searchitem+'%'],(req,rows)=>{
       connection.release();
       if(!err){
          res.render('display_result',{rows});
          // console.log('search found ');
       }else{
         console.log(err);
       }
       console.log('the data from user table: ',rows);
     })

   })

 }

 

 exports.adminailmentform = (req,res)=>{ 
   res.render('ailment');
 }

exports.adminailment_logic = (req,res)=>{
  const values = {name,content,description}=req.body;

     pool.getConnection((err,connection)=>{
       if(err) throw err;
       console.log('connection as ID '+ connection.threadid);
       if(values){
        //  console.log('insert into database');
        connection.query('INSERT INTO ailment SET name=?, content=?, description=?',[name,content,description],(err,rows)=>{
          if(!err){
            res.render('ailment',{ailment_sent:' created successfully '});
          }else{
            console.log('wrong');
          }
        })
       }else if(value==""){
         console.log('cannot inset enter values');
       }

     })

}


exports.loginform = (req,res)=>{
    res.render('login');
}

exports.login_logic = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
  pool.getConnection((err,connection)=>{
      if(err) throw err; // display error if not connected
      console.log('connected as ID ' + connection.threadid); // if connection is successful
     if(email && password){
          connection.query('SELECT * FROM tbl_signup WHERE email=?',[email],async (err,rows)=>{
          connection.release();
           const userExist = rows[0];
         
              if(userExist){
                    console.log(connection.fname);
                      const match = await bcrypt.compare(password, userExist.password);
                      console.log(match);
                      if(match){
                        req.session.loggedin = true;
                        req.session.userfile = userExist.userfile;
                        req.session. fname = userExist.fname;
                        req.session.other_names = userExist.other_names;
                        req.session.userfile = userExist.userfile;
                        // res.redirect('/display_result');
                        res.render('display_result',{rows});
                    }else{
                      res.render('login',{error:' Incorrect Password '});
                    }
                }else{
                      res.render('login',{error:' Invalid credentials '});
                }

          });
       }else if(email==''){
        res.render('login',{error:' Enter your email'});
      }else if(password==''){
        res.render('login',{error:' Enter password'});
      }

    });

}


