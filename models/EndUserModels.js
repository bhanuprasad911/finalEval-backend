const mongoose = require('mongoose')




const missedChats = new mongoose.Schema({
    day:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        required:true
    }
})


const endUserMessages = new mongoose.Schema({
    message: String,
    sender: String,
    receiver: String,
    createdAt:
    {
        type: Date,
        default: Date.now
        }


        }
)


const endUserDeatils = new mongoose.Schema({

    name: String,
    email: String,
    phone:String,
    status:String,
    ticket_id:String,
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:
    {
        type: Date,
        default: Date.now
        },
    messages:[endUserMessages],
    isMissed:{
        type:Boolean,
        default:false
    }
})
 const Enduser = mongoose.model('endusers', endUserDeatils)
 const MissedChats = mongoose.model('missedchats', missedChats)
 module.exports = 
 {Enduser,
   MissedChats
 };
