//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); //in order to access to local modules


const app = express();
const items =["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs"); //enabling EJS using express

app.use(bodyParser.urlencoded({extended: true})); // in order to use bodyParser

app.use(express.static("public"));

app.get("/", function(req, res) {

const day = date.getDate();


  res.render("list", { // all lists must be in the same object
    listTitle: day, newListItems: items
  }); // you have to have a file called list.ejs in order to res.render to work

});


app.post("/",function(req,res){
  const item = req.body.newItem; //using bodyParser we can request data from index.html
  if (req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item); //will push value of item to global variable with array
    res.redirect("/");
  }

//redirect to home route

});  // this will post a data that is writen on a main page writted by user


app.get("/work", function(req,res){
  res.render("list", {listTitle:"Work List", newListItems: workItems});
});

app.post("/work", function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req,res){
res.render("about");
});



app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
