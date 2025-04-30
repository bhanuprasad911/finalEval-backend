const express = require("express")
const userRouter = express.Router()
const {Signin, editProfile, Login, Addteammember, fetchTeammembers, deleteMember} = require('../controllers/UserControllers')

userRouter.post('/signup', Signin)
userRouter.put('/signup', editProfile)

userRouter.post('/login', Login)
userRouter.post('/member', Addteammember)
userRouter.delete('/member', deleteMember)
userRouter.get('/fetchmembers/:id', fetchTeammembers)





module.exports = userRouter