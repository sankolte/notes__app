const express=require("express");
const router =express.Router();
const mongoose = require("mongoose");
const Note=require("../models/notes.js");   ///   ./ coz under ke under he same dir me he >>models me se notes.js ko uthaya
const ExpressError=require("../utils/expressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const validateNote=require("../middleware.js");





   //home page
router.get("/",wrapAsync(async (req,res)=>{
    let notes = await Note.find();
    // console.log(notes);
    res.render("home.ejs",{notes});

}))


//now >> i want to create new note for that firstly i will get a form i.e throw a form to the user in whch wo apna sara kuch fill karega where waha pohochne ke liye we will add a button in our home page 
// wo anchor tag me rahega whose href=/notes/new which should be same as the route declared in index.js (iske niche)  which will render me a form


router.get("/new", (req,res)=>{
    res.render("new_form.ejs");

})

router.post("/form",validateNote,wrapAsync(async (req,res,next)=>{
    let {content,title,isImportant}=req.body;

    let newnote=new Note({
        title:title,
        content:content,
        isImportant:isImportant==="on"
    })
    
    await newnote.save();
    console.log("saved succenfully");
    res.redirect("/notes");

       
}))


// deleting a note >>
router.delete("/delete/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
     let delnote= await Note.findByIdAndDelete(id);
    console.log(`Deleted note : ${delnote}`);
    res.redirect("/notes");
    
}))


// rendering a page for updating a post >>

router.get("/:id/edit",wrapAsync(async(req,res)=>{
    
    let { id }=req.params;
     let find= await Note.findById(id);
     res.render("edit.ejs",{ find });
}))

// now actaully updating >> put req use karenege 

router.patch("/:id",validateNote, wrapAsync(async (req, res) => {
    
        const { title, content, isImportant } = req.body;

        await Note.findByIdAndUpdate(req.params.id, {
            title,
            content,
            isImportant: isImportant === "on"
        });

        res.redirect("/notes");
   
}));


//so basically i want to view a perticular caed ike that note >> 

router.get("/:id/view",wrapAsync(async(req,res)=>{
    let{id}=req.params;

    let view = await Note.findById(id);
    
    if(!view) {
        throw new ExpressError(404, "Note not found");
    }
    
    console.log(view);
    res.render("view.ejs",{view});


}))


module.exports=router;
