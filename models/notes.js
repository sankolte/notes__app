const mongoose = require("mongoose");

const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    content:{
        type:String,
        required:true
        
        
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
//ye hogyi sari fields like schema jo ki use hogi in models

//abb actual model like Note hua apne model ka naam

const Note=mongoose.model("Note",noteSchema);

module.exports=Note;
