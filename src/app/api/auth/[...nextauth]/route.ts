import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import {IUser , User } from "@/models/User";
import bcrypt from "bcryptjs";
 
declare module 'next-auth/jwt' {
    interface JWT {
      id?: string | undefined
      provider?: string | undefined
      accessToken?: string | undefined
      role?: string | undefined
      
    }
  }
  declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
      accessToken?: string | undefined
      user?: IUser & DefaultSession["user"];
    }
  }


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [

    github({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),

    google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
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
      async authorize (credentials,req) {
        const { email, password } = credentials as {
          email: string | undefined;
          password: string | undefined;
        };


        if(!email  || !password){
          throw new Error("Please provide both email and password");
        }


        await connectDB();


        const user = await User.findOne({ email }).select("+password +role");
        


        if (!user) {
          throw new Error("Invalid email or password");
          
        }


        if(!user.password){
          throw new Error("Invalid email or password");
        }

        const isMatched: boolean = await bcrypt.compare(password, user.password)

        if (!isMatched) {
          throw new Error("Passwor did not match");
        }

       const userData = {
         id: user._id.toString(),
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         role: user.role
       }
       return user
      }
    })
      
  ],

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    
    
    async signIn({ user, account}) {
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

      async jwt({ token, user, account }) {
        if(account?.access_token){
          token.accessToken = account.access_token
        }
          if(user?.id){
            token.id = user?.id
            token.sub = user?.id
            token.role = user.role
          }
          
        
        return token
      },


      async session({ session, token, }) {
        if (token?.accessToken) {
            session.accessToken = token.accessToken;
          }
          
          if (token?.id && token?.role) {
            session.user._id = token.id;
            session.user.role = token.role
          }

        return session;
      },
    
    
  },
})

export {handlers as GET, handlers as POST}