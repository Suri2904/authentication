//jshint esversion:6
//<-----requiring-----
require("dotenv").config();

const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const encrypt=require("mongoose-encryption");
const md5=require("md5");

const app=express();

//connecting to mongodb----------------
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

//<-------encryption----using mongoose-encryption----


// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})



const User=mongoose.model("User",userSchema);
//<--------------------------------------------------------------


app.use(express.static("public"));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

//<------get and post methods

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});
//<-------------------------------register
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

const newuser=new User({

email:req.body.username,
password:md5(req.body.password)


});

newuser.save(function(err){
  if(err){console.log(err);}
  else{res.render("secrets");}
});


});
//<-----------------------login

app.post("/login",function(req,res){

  const username=req.body.username;
  const password=md5(req.body.password);
User.findOne({email:username},function(err,foundUser){
    if(err){console.log(err);}
    else{
      if(foundUser){

        if(foundUser.password===password){res.render("secrets");}
        else{
            res.render("login");
        }



      }
      else{res.render("register");}
    }


});


});




app.listen(3000,function(){
  console.log("server started on port 3000");
})
