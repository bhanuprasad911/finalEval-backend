const express = require('express')
const chatRouter = express.Router()
const {
    addEnduser,
    addMessage,
    messagefetch,
    fetchUsers,
    updatechatstatus,
    assign,
    memberMessagefetch,
    updateMissed,
    fetchMissed
}= require('../controllers/MessageControllers')


chatRouter.get('/', messagefetch)
chatRouter.get('/users', fetchUsers)
chatRouter.get('/member/:id', memberMessagefetch)
chatRouter.post('/adduser', addEnduser)
chatRouter.patch('/adduser', updateMissed)
chatRouter.get('/missed', fetchMissed)
chatRouter.post('/addmessage', addMessage)
chatRouter.post('/updatestatus', updatechatstatus)
chatRouter.get('/assign', assign)


module.exports = chatRouter