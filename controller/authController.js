import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js"; // Added .js extension
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, address,userName,contry,gender } = req.body;

        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'email is required' });
        }
        if (!password) {
            return res.send({ message: 'password is required' });
        }
        if (!address) {
            return res.send({ message: 'address is required' });
        }
        if (!userName) {
            return res.send({ message: 'username is required' });
        }
        if (!contry) {
            return res.send({ message: 'contry is required' });
        }
        if (!gender) {
            return res.send({ message: 'gender is required' });
        }

        // Existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered, please login'
            });
        }

        // Register user
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email,address,userName,gender,contry,password: hashedPassword }).save(); // Added await

        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        });
    }
};

//post login
export const loginController = async (req, res) => {
    try {
        const { userName, password } = req.body;

      
        if (!userName || !password) {
            return res.status(404).send({
                success: false,
                message: "Email and password are required"
            });
        }

 
        const user = await userModel.findOne({ userName });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "username is not registered"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate the JWT token
        const token = JWT.sign(
            { _id: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                id:user._id
            },
            token,
        });
    } catch (error) {
        
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }
};


export const userFind = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the 'id' is valid
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid ID' });
        }

        const user = await userModel.findById(id);
        // if (!user) {
        //     return res.status(404).send({ message: 'User not found' });
        // }
if(user){
res.send(user);
}
       
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error' });
    }
};
//test controller
export const allUsers= async (req,res)=>{
try {
    const users=await userModel.find({})
    res.send(users)
} catch (error) {
    console.log(error);
    
}
}

export const blockUnblockUser= async (req,res)=>{
   
    try {
        
        
        const {id}=req.params
        const {isBlock}=req.body
       
      
        const user =await userModel.findById(id)

        user.isBlock=isBlock
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.log(error);
    }
}