import jwt from 'jsonwebtoken';



require('dotenv').config();


const JWT_KEY : any = process.env.JWT_SECRET;

if (!JWT_KEY) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
}

interface UserPayload {
    id: string;
    name: string;
    email: string;
    password : string;
}


export function generateToken(user: UserPayload): string {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password : user.password 
    };
 
 
    const token = jwt.sign(payload, JWT_KEY , {
        expiresIn: '1d',
    });

    return token;
}