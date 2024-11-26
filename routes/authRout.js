import express from 'express'
import {allUsers, blockUnblockUser, loginController,
     registerController, 
     userFind} from '../controller/authController.js'
     const router=express.Router()

router.post("/register",registerController)
router.post('/login',loginController)
router.get('/allusers',allUsers)
router.get('/findusers/:id',userFind)
router.patch('/blockunblock/:id', blockUnblockUser);

 
export default router;