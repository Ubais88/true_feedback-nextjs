import bcrypt from 'bcrypt';
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"123",
            name:"Ubais",
            credentials:{
                email:{label :"Email" , type:"text" },
                password:{label :"Password" , type:"password" }
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ $or:[
                        {email: credentials.identifier},
                        {username: credentials.identifier},
                    ]})

                    if(!user){
                        throw new Error('User not found')
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account first')
                    }

                    const isMatchPassword = await bcrypt.compare(credentials.password, user.password)

                    if(isMatchPassword){
                        return user
                    }
                    else{
                        throw new Error("Incorrect password")
                    }


                } catch (error:any) {
                    console.log("error", error);
                    throw new Error(error)
                }
            }

        })
    ],
    callbacks:{
        async jwt({token , user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessages;
                token.username = user.username
            }

            return token
        },
        async session({session , token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
    },
    pages:{
        signIn:'/signin',
    },
    session:{ strategy:"jwt"},
    secret:process.env.JWT_SECRET,

}