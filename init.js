//This file is used to insert multiple data into the database and is not used in the main application

const mongoose = require('mongoose');   // importing mongoose
const Chat = require('./models/chats.js');   //importing chat model which contains the schema

main()     // calling the main function to connect to the database - connect to the database setup
  .then(() => {
    console.log('Connection successful');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
        from: "Adam",
        to: "Eve",
        msg: "Hey Eve send your notes",
        created_at: new Date(),
    },
    {
        from: "Rohit",
        to: "Ravi",
        msg: "Hey Ravi send your notes",
        created_at: new Date(),
    },
    {
        from: "Amit",
        to: "Sumit",
        msg: "Hey Sumit send your notes",
        created_at: new Date(),
    },
    {
        from: "Anitha",
        to: "Raj",
        msg: "Hey Raj send your notes",
        created_at: new Date(),
    },
    {
        from: "Tony",
        to: "Steve",
        msg: "Hey Steve send your notes",
        created_at: new Date(),
    },
];

Chat.insertMany(allChats);