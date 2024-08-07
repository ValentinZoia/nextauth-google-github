'use server'

import { isValidEmail } from "@/lib/isValidEmail";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

 type FormState =
  | {
      errors?: {
        generaL?: string;
        email?: string;
        password?: string;
      };
      message?: string;
    }
  | undefined;


export async function signup(state: FormState, formData: FormData) {
    //1. Validate fields
    const firstName = formData.get('firstname') as string;
    const lastName = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if(!firstName || !lastName || !email || !password){
        return{
           errors: {general: ('All fields are required')}, 
        }
        
    }

    //validate email
    if(!isValidEmail(email)){
        return{
            errors:{email: ('Please enter a valid email')}
        }
    }

    //validate password contains at least 8 characters
    if(password.length < 8){
        return{
            errors:{password: ('Password must be at least 8 characters')}
        }
    }

    //validate password contains at least 1 number
    if(!password.match(/\d/)){
        return{
            errors:{password: ('Password must contain at least 1 number')}
        }
    }


    
    await connectDB();

    //existing user
    const existingUser = await User.findOne({email});
    if(existingUser){
        return{
            errors: {general: ('User already exists')}, 
         }
    }
    //2. Create user
    try{
        // hash password
     const hashedPassword = await bcrypt.hash(password, 10);

     //create and save user
     const user = new User({firstName, lastName, email, password: hashedPassword});
     await user.save();
    
     return{
        message: 'User created successfully! 🎉',
        redirectTo: '/login'
    }
    }catch(error: any){
        return{
            errors: {general: ('Error while creating user')},
        }
    
    }
     
     
    
}