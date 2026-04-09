const express=require("express");
const router =express.Router();
const mongoose = require("mongoose");
const Note=require("../models/notes.js");   ///   ./ coz under ke under he same dir me he >>models me se notes.js ko uthaya
const ExpressError=require("../utils/expressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const { validateNote, isAuthenticated } = require("../middleware.js");





   //home page 
router.get("/",wrapAsync(async (req,res)=>{
    let notes = [];  //so basically to show a empty page first l have to pass a empty array right
    let searchQuery = req.query.q || "";

    if (req.user) {
        let filter = { user: req.user.id };
        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } }
            ];
        }
        notes = await Note.find(filter).populate("user");
    }
    // console.log(notes);
    res.render("home.ejs", { notes, searchQuery });

}))


//now >> i want to create new note for that firstly i will get a form i.e throw a form to the user in whch wo apna sara kuch fill karega where waha pohochne ke liye we will add a button in our home page 
// wo anchor tag me rahega whose href=/notes/new which should be same as the route declared in index.js (iske niche)  which will render me a form


router.get("/new", isAuthenticated, (req,res)=>{
    res.render("new_form.ejs");

})

router.post("/form", isAuthenticated, validateNote,wrapAsync(async (req,res,next)=>{
    let {content,title,isImportant}=req.body;

    let newnote=new Note({
        title:title,
        content:content,
        isImportant:isImportant==="on",
        user:req.user.id

    });    

    
    await newnote.save();
    console.log("saved succenfully");
    res.redirect("/notes");

       
}))


// deleting a note >>
router.delete("/delete/:id", isAuthenticated, wrapAsync(async(req,res)=>{
    let {id}=req.params;
     let delnote= await Note.findByIdAndDelete({_id: id,user:req.user.id});
    console.log(`Deleted note : ${delnote}`);
    res.redirect("/notes");
    
}))


// rendering a page for updating a post >>

router.get("/:id/edit", isAuthenticated, wrapAsync(async(req,res)=>{
    
    let { id }=req.params;
     let find= await Note.findOne({_id: id, user:req.user.id});
     if(!find) {
         throw new ExpressError(404, "Note not found");
     }
     res.render("edit.ejs",{ find });
}))

// now actaully updating >> put req use karenege 

router.patch("/:id", isAuthenticated, validateNote, wrapAsync(async (req, res) => {
    
        let { id }=req.params;
        const { title, content, isImportant } = req.body;

        await Note.findOneAndUpdate({_id: id,user:req.user.id} ,{
            title,
            content,
            isImportant: isImportant === "on"
        });

        res.redirect("/notes");
   
}));


//so basically i want to view a perticular caed ike that note >> 

router.get("/:id/view", isAuthenticated, wrapAsync(async(req,res)=>{
    let{id}=req.params;

    let view = await Note.findOne({_id: id, user:req.user.id}).populate("user");
    
    if(!view) {
        throw new ExpressError(404, "Note not found");
    }
    
    console.log(view);
    res.render("view.ejs",{view});


}))


module.exports=router;
