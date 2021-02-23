//const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname+'\\access.log', { flags: 'a' });
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))


app.use(express.json());
//app.use(express.urlencoded());

app.post('/profile',(req,res)=>{
    //console.log(req);
    let newUser = req.body;
    //console.log(newUser);

    fs.readFile('./users.txt',(err,data)=>{
        let usersList = [];
        if(err!= null && err!=undefined){
            console.log(err.message);
        }
        else{
            usersList = JSON.parse(data);
        }
        usersList.push(newUser);
        fs.writeFile('./users.txt',JSON.stringify(usersList), (err,data)=>{
            if(err!= null && err!=undefined){
                console.log(err.message);
                res.send('please try again later')
            }    
            else{
                console.log('saved successfully');
                res.send('Saved');

            }
        });
    });

});

app.get('/profile',(req,res)=>{
    res.contentType('html');
    res.write('<link href="/style" rel ="stylesheet" type="text/css">');
    res.write('<img src="/myimage"/>');

    //console.log(req.url);
    //console.log(req.query);
    const query = req.query;
    fs.readFile('./users.txt',(err,data)=>{
        let usersList = [];
        if(err!= null && err!=undefined){
            console.log(err.message);
        }
        else{
            usersList = JSON.parse(data);
        }
        let user = [];
        if(query.id != null && query.id != undefined)
            user = usersList.filter(u => u.id == parseInt( query.id ));
        else if(query.name != null && query.name != undefined)
            user = usersList.filter(u => u.name == query.name);
        else if(query.age != null && query.age != undefined)
            user = usersList.filter(u => u.age == parseInt( query.age ));
        else if(query.phone != null && query.phone != undefined)
            user = usersList.filter(u => u.phone == query.phone);
        
        // console.log(user);
        // console.log(query);
        user.forEach(u => {
            //console.log(u.id);
            
            res.write(`<h3>id = ${u.id}</h3>`);
            res.write(`<h3>username = ${u.name}</h3>`);
            res.write(`<h3>age = ${u.age}</h3>`);
            res.write(`<h3>phone = ${u.phone}</h3>`);

        });

        //res.send('');
        res.end('<br>');
        
    });

  
    //res.end('');
});

app.get('/myimage',(req,res)=>{
    res.sendFile(__dirname + "\\3.jpeg");
});

app.get('/style',(req,res)=>{
    res.sendFile(__dirname + "\\style.css");
});

app.get('/logs',(req,res)=>{
    res.sendFile(__dirname+'\\access.log');
});

app.use("*", function (req, res) {
    res.sendStatus(404);
    res.send("not matched");   
});

app.listen(3000,()=>{
    console.log('listening');
});