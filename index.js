const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();

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
    })

})


app.listen(3000,()=>{
    console.log('listening');
});