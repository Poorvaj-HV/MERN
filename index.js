require('dotenv').config();  // importing dotenv to use environment variables
// This file is used to create a server and handle requests and responses
// It is the main file of the application
const express = require('express');     // importing express
const app = express();
const mongoose = require('mongoose');   // importing mongoose
const path = require('path');   // importing path
const Chat = require('./models/chats.js');   //importing chat model which contains the schema
const methodOverride = require("method-override");  //requiring method override for PUT and DELETE requests

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("views", path.join(__dirname, "views"));  // setting the views directory
app.set("view engine", "ejs");  //setting the view engine to ejs
app.use(express.static(path.join(__dirname, 'public')));  // setting the public directory for static files
app.use(express.urlencoded({ extended: true }));  // parsing the request body (to access form data) - middleware (Miscellaneous topic on notes for more)
app.use(methodOverride("_method"));  //after requiring we have to use methodOverride so I wrote this

main()     // calling the main function to connect to the database - connect to the database setup
  .then(() => {
    console.log('Connection successful');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);  
}
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp'); //to connect mongodb database
// }

// let chat1 = new Chat({
//     from: "Adam",
//     to: "Eve",
//     msg: "Hey Eve send your notes",
//     created_at: new Date(),
// });

// chat1
//     .save() 
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });


//Index route
app.get('/chats', async (req, res) => {  //since Chat.find() is an asyncronous fun, which returns a promise, we have to await & await only used by async fun. So this callback function is to be async
    let chats = await Chat.find({}); // finds all the chats in the database
    // console.log(chats);
    res.render("index.ejs", { chats }); // render the index.ejs file and pass the chats to it 
});

//New route
app.get('/chats/new', (req, res) => {
    res.render("new.ejs"); // render the new.ejs file
});

app.post('/chats', (req, res) => {
    let { from, msg, to } = req.body; // destructuring the request body
    let newChat = new Chat({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date(),
    });
    newChat  // here saving, deleting in database is also a promise. here we used .then() and .catch() to handle the promise when .then() is used there is no need to use async and await functions
      .save()
      .then((res) => {
        console.log("chat was saved");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect('/chats'); // redirect to the chats page
});

//Edit route
app.get('/chats/:id/edit', async (req, res) => { 
    let { id } = req.params;
    let chat = await Chat.findById(id);  //find in db is an asynchronous fun & we didn't use .then so we used async & await to handle this promise
    res.render("edit.ejs", { chat });
});

//Update Route by submit of edit above this route takes charge to edit changes
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true }); //async-await = same reason as above 

    res.redirect("/chats");
});

//Delete route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id) //find in db is an asynchronous fun & we didn't use .then so we used async & await to handle this promise
    console.log(deletedChat);
    res.redirect("/chats"); // redirect to the chats page
});

app.get('/', (req, res) => {
    res.send("Server started now you are in root page");
});

app.listen(8000, () => {
    console.log('Server is listening on port 8080');
});


