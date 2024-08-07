import mongoose from "mongoose";


export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
    image?: string;
    authProviderId?: string;
}


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, select:false},
    role: {type: String, default:'user' },
    image: {type: String},
    authProviderId: {type: String},

});

export const User = mongoose.models?.User || mongoose.model('User', userSchema)