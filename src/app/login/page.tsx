
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { login } from "@/action/user";
// import {signIn } from "@/auth";
import { redirect, useRouter } from "next/navigation";
// import { getSession } from "@/lib/getSession";
import { useSession, signIn } from "next-auth/react";

const LoginPage =  async() => {
  // const session = await getSession();
  // const user  = session?.user;
  // if(user){
  //   redirect('/private/dashboard')
  // }
  
  // const { data: session } = useSession();
  // const router = useRouter();
  // useEffect(() => {
  //   if (session?.user) {
  //     router.push('/private/dashboard');
  //   }
  // }, [session, router]);
  


  return (
    <div className="mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white border border-[#121212] dark:bg-black">
      <form className="my-8" action={login}>
        
        <Label htmlFor="email">Email Adress</Label>
        <Input
          id="email"
          placeholder="exaple@example.com"
          type="email"
          name="email"
        />

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="********"
          type="password"
          name="password"
        />

        <button className="mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Login &rarr;
        </button>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <section className="flex flex-col space-y-4">
        <form action = {async() =>{'use server'; await signIn("github")}}>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
            // onClick={() => signIn("github")}
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Github
            </span>
          </button>
        </form>
        <form action = {async() =>{'use server'; await signIn("google")}}>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
            // onClick={() => signIn("google")} 
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
