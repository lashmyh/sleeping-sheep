import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



const router = express.Router();

//generate token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

//register user 
router.post("/register", async (req, res) => {
    const { email, username, password, confirmPassword, accountVisibility } = req.body;
    
    //check passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }
    //check password strength
    
    const isValidPassword = (password) => {
        return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    };

    if (!isValidPassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long, include at least one uppercase letter and one number.",
        });
    }
    //check is user exists
    try {
        const existingUser = await prisma.user.findUnique( {where: { email }});
        if (existingUser) {
            return res.status(400).json({message: "Username is not available"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        const token = generateToken(newUser);
        res.json({ token, user: newUser });

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
});

//login user
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email }});
        if (!user) return res.status(400).json({ message: "User not found"});

        //check login details match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Incorrect login details"})};
        const token = generateToken(user);
        res.json( { token, user });

    }catch (error) {
        res.status(500).json( { error: error.message })
    }
});

export default router;