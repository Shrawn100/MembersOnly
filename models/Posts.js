const mongoose=require("mongoose");
const Schema=mongoose.Schema;

PostsSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    title:{type:String,required:true},
    message:{type:String,required:true},
    date:{type:Date,default:Date.now}
})

module.exports=mongoose.model("Posts",PostsSchema)