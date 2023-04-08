// StAuth10244: I Kartik Patel, 000839320 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

const express=require('express');
const app=express();
const sqlite3=require("sqlite3").verbose();
const db=new sqlite3.Database("MathGame.db");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
var username="";
var points=0;
db.serialize(function(){
    db.run("DROP TABLE IF EXISTS Users");
    db.run("CREATE TABLE Users(username TEXT,password TEXT)");
})

app.post('/register',function(req,resp){
    var usernameReg=req.body.username;
    const password=req.body.password;
    const cpassword=req.body.cpassword;
    if(password==""||usernameReg=="")
    {
        resp.send("null input");
    }
    else if(password==cpassword)
    {
    db.all("SELECT * FROM Users WHERE username=? AND password=?",usernameReg,password,function(err,res){
        if(res[0]==null)
        {
            db.all("SELECT * FROM Users WHERE username=?",usernameReg,function(err,output){
                if(output[0]!=null)
                {
                    resp.send("username taken");
                }
                else
            {
                db.run("INSERT INTO Users(username, password) VALUES (?,?)",usernameReg,password,function(err,result){
                    if(err==null)
                    {
                        db.serialize(function(){
                        var fixed="DROP TABLE IF EXISTS "+usernameReg;
                        db.run(fixed);
                        var stmt="CREATE TABLE "+usernameReg+"(score NUMBER)";
                        db.run(stmt);
                        var stmt2="INSERT INTO "+usernameReg+"(score) VALUES (0)";
                        db.run(stmt2);
                        })
                    }
                    resp.send("error:"+err);
                });
            }
            })
        }
        else{
            resp.send("registered");
        }
    })
}
else
{
    resp.send("does not match");
}
    
    
})

app.post('/login',function(req,res){
     username=req.body.username;
    const password=req.body.password;
    if(username==""||password=="")
    {
        res.send("null input");
    }
    else
    {
    db.all("SELECT * FROM Users WHERE username=? AND password=?",username,password,function(err,result){

        console.log("Login request received..");
        if(result[0]!=null)
        {
            console.log("login successful.");
            var st="SELECT score FROM "+username;
            db.all(st,function(err,result1){
                res.send([result,result1[0].score]);
            })
        }
        else{
            res.send(["Incorrect username and/or password!"]);
        }
    })
}
})

app.post('/score',function(req,res){
    var score=parseInt(req.body.score);
    
    var st="SELECT score FROM "+username;
    db.all(st,function(err,result){
        points=result[0].score;
        var p=(score)+(points);
     var st="UPDATE "+username+" SET score=?";
     db.run(st,p);
    res.send({num:parseInt(p.toString())});
    })
     
})

const PORT=process.env.PORT || 3000;

const server=app.listen(PORT,function(){
    console.log("MathGameServer is listening....");
})
