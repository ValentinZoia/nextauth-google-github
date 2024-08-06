"use server";

import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";


const login = async (formData: FormData) =>{
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
       await signIn("credentials", {email, password, redirect: false, callbackUrl: "/"});
        
        


    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause
    }
    redirect("/private/dashboard")

}

const register = async (formData: FormData)=>{
    const firstName = formData.get('firstname') as string;
    const lastName = formData.get('lastname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if(!firstName || !lastName || !email || !password){
        throw new Error('All fields are required');
    }
    
    await connectDB();

    //existing user
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error('User already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create and save user
    const user = new User({firstName, lastName, email, password: hashedPassword});
    await user.save();
    redirect("/login")
}

const fetchAllUsers = async () =>{
    await connectDB();
    const users = await User.find({});
    return users
}

export {register, login, fetchAllUsers}