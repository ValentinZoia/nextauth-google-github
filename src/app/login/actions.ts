'use server'
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";



export const login = async (formData: FormData) =>{
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
       await signIn("credentials", {email, password, redirect: false, callbackUrl: "/"});
        
        


    } catch (error) {
        console.log(error)
        return error
        
    }
    redirect("/private/dashboard")

}