//this is for just creating fake data ye project ka hissa nhai he like ye banayenge ekk bar and nodemon 

const mongoose = require("mongoose");


main()
    .then(()=>{
        console.log("connection suceesful");
    })
    .catch((err)=>{
        console.log(`error is ${err}`)
    })


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/notes');
}


    const noteSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true
    
        },
        content:{
            type:String,
            
            
        },
        createdAt:{
             type: Date,
        default: Date.now        //this bydefault set or tarcks the date of the note created 
        },
        isImportant:{
            type:Boolean,
            default:false        //this is impp to set its default value as false 
        }
    })
    
    const Note=mongoose.model("Note",noteSchema);
    
    Note.insertMany(
        [
  {
    title: "Learn Express Basics",
    content: "Understand routing, middleware, and request-response cycle in Express.",
    createdAt: new Date(),
    isImportant: true
  },
  {
    title: "MongoDB Revision",
    content: "Revise schemas, models, insertMany, find, update, and delete operations.",
    createdAt: new Date(),
    isImportant: false
  },
  {
    title: "Workout Plan",
    content: "Morning: pushups, squats. Evening: 20 min walk.",
    createdAt: new Date(),
    isImportant: true
  },
  {
    title: "Project Idea",
    content: "Build a notes app with Express, MongoDB, EJS, and later add authentication.",
    createdAt: new Date(),
    isImportant: true
  },
  {
    title: "College Assignment",
    content: "Complete DBMS Unit 1 ER diagrams before weekend.",
    createdAt: new Date(),
    isImportant: false
  },
  {
    title: "Bug Fix Reminder",
    content: "Fix the path issue in views folder and check EJS rendering.",
    createdAt: new Date(),
    isImportant: true
  },
  {
    title: "Daily Reflection",
    content: "Stayed consistent today. Need to avoid distractions and sleep early.",
    createdAt: new Date(),
    isImportant: false
  },
  {
    title: "Future Goals",
    content: "Master MERN stack and integrate AI features into projects.",
    createdAt: new Date(),
    isImportant: true
  }
]

    )
    .then(()=>{
        console.log("data enetrd");
    })
    .catch((err)=>{
        console.log(err);
    })

    //ekbar chalao fir bhul jaoo 
    //chill