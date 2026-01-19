//firstly setting up everything
const express =require("express");
const app = express();

const mongoose = require("mongoose");
const Note=require("./models/notes.js");   ///   ./ coz under ke under he same dir me he >>models me se notes.js ko uthaya

const path = require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));     //for parsing the data cmong from form
const methodOverride = require("method-override");

app.use(methodOverride("_method"));





async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/notes');
}

main()
    .then(()=>{
        console.log("connection suceesful");
    })
    .catch((err)=>{
        console.log(`error is ${err}`)
    })
 
    //home page
app.get("/notes",async (req,res)=>{
    let notes = await Note.find();
    console.log(notes);
    res.render("home.ejs",{notes});
      
})


//now >> i want to create new note for that firstly i will get a form i.e throw a form to the user in whch wo apna sara kuch fill karega where waha pohochne ke liye we will add a button in our home page 
// wo anchor tag me rahega whose href=/notes/new which should be same as the route declared in index.js (iske niche)  which will render me a form


app.get("/notes/new", (req,res)=>{
    res.render("new_form.ejs");

})

app.post("/notes/form",async (req,res)=>{
    let {content,title,isImportant}=req.body;
    let newnote=new Note({
        title:title,
        content:content,
        isImportant:isImportant==="on"  //basically here html sends checkbox result result as true id cehkcend or undefined if not cehckedn but our scehma wants it in bollean 
                                        // so for that udahr ye logical operator lagaya if on it will send 1 otherise 0
    })
    await newnote.save()
        .then(()=>{
            console.log("saved succenfully");
             res.redirect("/notes")
        })
        .catch((err)=>{
            console.log(err);

        })
       
})
app.get("/notes/:id/edit",async (req,res)=>{
    
    let { id }=req.params;
     let find= await Note.findById(id);
     res.render("edit.ejs",{ find });
})

app.put("/notes/:id", async (req, res) => {
    try {
        const { title, content, isImportant } = req.body;

        await Note.findByIdAndUpdate(req.params.id, {
            title,
            content,
            isImportant: isImportant === "on"
        });

        res.redirect("/notes");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating note");
    }
});

app.delete("/notes/delete/:id",async(req,res)=>{
    let {id}=req.params;
     await Note.findByIdAndDelete(id);
    console.log("deleted");
    res.redirect("/notes");
    
})


app.get("/",(req,res)=>{
    console.log("working");
    res.send("hello");
})

const port=3000;
app.listen(port,()=>{
    console.log("server is listening at port no 3000");
})