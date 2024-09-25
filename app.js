const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/", (req, res) => {
    fs.readdir(`./files`, function(err, files){
        res.render('index', {files});
    })
})

app.post("/create", (req, res) => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');  // Months are zero-based
    const year = today.getFullYear();
    const fn = `${day}-${month}-${year}.txt`;
    if ((req.body.title).length <= 0){
        fs.writeFile(`./files/${fn}`, req.body.text , function(err){
            if (err) return res.send(err.message);
            res.redirect("/");
            }) 
    }
    else{
        fs.writeFile(`./files/${req.body.title}.txt`, req.body.text , function(err){
            if (err) return res.send(err.message);
            res.redirect("/");
            })      
    }
})
 
app.get("/create", (req, res) => {
    res.render("create", { filename: '', data: '' }); // Display form, empty data initially
});

app.get("/view/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, data){
        if(err) return res.send(err);
        res.render("view", {data, filename: req.params.filename});
    }) 
})

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, data){
        if(err) return res.send(err);
        res.render("edit", {data, filename: req.params.filename});
    })
})

app.post("/update/:filename", (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.text, function(err, data){
        if(err) return res.send(err);
        res.redirect("/");
    }) 
})


app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, function(err, data){
        if(err) return res.send(err);
        res.redirect("/");
    })  
})

app.listen(3000);