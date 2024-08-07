'use client'
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
// import { getSession } from "@/lib/getSession";
// import { signOut } from "@/auth";
import { useSession, signOut } from "next-auth/react";

const NavBar =  () => {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  

  return (
    <nav className="flex justify-around items-center py-4 bg-[#141414] text-white">
      <Link href="/" className="text-xl font-bold">
        LOGO
      </Link>

      <ul className="hidden md:flex items-center gap-4 list-none">
        {user ? (
          //si estoy logeado
          <>
            <li>
              <Link href="/private/dashboard" className="hover:text-gray-400">
                Dashboard
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <p className="text-gray-400 cursor-pointer">{user.email}</p>
              {user.image && <img src={user.image as string} alt="" className="w-10 h-10 rounded-full cursor-pointer" />}
              
            </li>
            <form action={ () => {
              
               signOut()
            }}>
              <Button type="submit" variant={"ghost"}>
                Logout
              </Button>
            </form>
          </>
        ) : (
          //si no estoy logeado
          <>
            <li>
              <Link href="/login" className="hover:text-gray-400">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-gray-400">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
