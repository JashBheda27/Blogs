import { User } from "../models/user.model.js";
//import bcrypt from "bcryptjs"


export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({
                success: false,
                message: "Email Required"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters"
            }
    )}
    const exisitingUserByEmail = await User.findOne({email:email});
    if(exisitingUserByEmail){
        return res.status(400).json({
            success:false,
            message:"Email already exists"
    }
)}
const hashPassword = await bcrypt.hash(password,10)
await User.create({
    firstname,
    lastname,
    email,
    password:hashPassword,
})
return res.status(201).json({
    success:true,
    message:"Account create successfully"
})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}
