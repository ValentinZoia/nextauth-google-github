
import { register } from "@/action/user";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { getSession } from "@/lib/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";


async function  RegisterPage()  {
  const session = await getSession();
  const user  = session?.user;
  if(user){
    redirect('/private/dashboard')
  }

  return (
    <div className="mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white border border-[#121212] dark:bg-black">
      <h2 className="font-bold text-x1 text-neutral-800 dark:text-neutral-200">
        Welcome to MyShop!
      </h2>
      <p className="text-sm max-w-sm mt-2 text-neutral-600 dark:text-neutral-300">
        Please provide all the necessary information
      </p>

      <form action={register} className="my-8">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="flex flex-col">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            type="text"
            id="firstname"
            placeholder="Tyler"
            name="firstname"
          />
          </div>
          <div className="flex flex-col">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            type="text"
            id="lastname"
            placeholder="Durden"
            name="lastname"
          />
          </div>
          

          
        </div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="example@ex.com"
          name="email"
        />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="**********"
          name="password"
        />

        <button className=" mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Sign up &rarr;
        </button>

        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;