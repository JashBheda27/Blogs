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
export const login = async (req, res) => {
    try {
         const{email,password} = req.body;
         if(! email || ! password ){
            return res.status(400).json({
                success:false,
                message:"All field required"
            })
         }
         let user = await User.findOne({email})
         if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
         }
         const isPasswordValid = await bcrypt.compare(password,user.password)
         if(!isPasswordValid){
              return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
         }

         const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY,{expiresIn:"1d"})
         return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpsOnly:true, samesite:"strict"}).json({
            success:true,
            message: `Welcome back ${user.firstname}`

         })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })

    }
}
