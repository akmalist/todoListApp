//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
var favicon = require('serve-favicon');

// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//css file

//connect your data into mongodDB atlas servers
mongoose.connect("mongodb+srv://admin-aki:test-123@cluster0-ewgxe.mongodb.net/todolistDB", {useNewUrlParser:true}); //connecting to database mongodb

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

//create itmes schema it will have one field it calles Name: String

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true, "Make sure to specify the Name"]
  }
});


//create module Mongoose

const Item = new mongoose.model("Item", itemsSchema);//collections calls Items

//create mongose documents
const item1 = new Item({
  name: "Welcome to your todoList"
});

 const item2= new Item({
   name: "Hit the + button to add a new item."
 });

 const item3 = new Item({
   name: "<--- Hit this to delete an item."
 });

const defaultItems = [item1, item2, item3 ];

//insert our arrays to mongodb

//create a new ListSchema

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});


//create a new model

 const List = mongoose.model ("List", listSchema);


app.get("/", function(req, res) {

//mongoose find()
Item.find({}, function(err, foundItems) {

if (foundItems.length == 0) {
  Item.insertMany(defaultItems, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesffully added new items to DB");
    }
  });
  res.redirect("/");

} else {
  res.render("list", {
    listTitle: "Today",
    newListItems: foundItems
  });
}
});
});


app.get("/:customListName", function(req, res) {
  const customListName = _.upperFirst(req.params.customListName);//upper case using Lo dash

  // search for listTitle

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          //show existing list
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }

    }
  });

});

//post button
app.post("/", function(req, res) {

      const itemName = req.body.newItem;
      const listName =req.body.list;

      const item = new Item({
        name: itemName
      });

      if (listName==="Today"){
        item.save();
        res.redirect("/");
      }else{
        List.findOne({name: listName}, function(err, foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        });
      }

// if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});




//delete checked boxes with checked form

 app.post("/delete", function(req, res) {
       const checkedItemId = req.body.checkbox;
       const listName = req.body.listName;

       if (listName === "Today") {
         Item.findByIdAndRemove(checkedItemId, function(err) {
           if (!err) {
             console.log("Succesffully deleted checked Item from DB");
             res.redirect("/"); //after deleting redirect to main page to show the reflected items
           }
         });
       } else {
         List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:checkedItemId}}}, function(err, foundList){
           if(!err){
             res.redirect("/"+listName);
           }
         });
       }

 });




//
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res) {
  res.render("about");
});

//heroku ports listen

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started Succesffully");
});
