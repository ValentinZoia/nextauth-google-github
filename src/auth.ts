import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import connectDB from "./lib/mongodb";
import {IUser , User } from "./models/User";
import bcrypt from "bcryptjs";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [

    github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize (credentials): Promise<IUser | null> {
        const { email, password } = credentials as {
          email: string | undefined;
          password: string | undefined;
        };


        if(!email  || !password){
          throw new CredentialsSignin("Please provide both email and password");
        }


        await connectDB();


        const user = await User.findOne({ email }).select("+password +role");
        


        if (!user) {
          throw new CredentialsSignin("Invalid email or password");
          
        }


        if(!user.password){
          throw new CredentialsSignin("Invalid email or password");
        }

        const isMatched: boolean = await bcrypt.compare(password, user.password)

        if (!isMatched) {
          throw new CredentialsSignin("Passwor did not match");
        }

       const userData = {
         _id: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
         role: user.role
       }
       return userData
      }
    })
      
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && user.role) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            const newUser = new User({
              firstName: name?.split(" ")[0] || '',
              lastName: name?.split(" ")[1] || '',
              email,
              authProviderId: id,
              image,
            });
            await newUser.save();
          }

          return true;
        } catch (error: any) {
          console.error("Error while creating user:", error);
          throw new Error("Error while creating user:", error);
        }
      } else if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
})