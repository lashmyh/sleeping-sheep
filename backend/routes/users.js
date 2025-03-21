import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

//delete own account
router.delete("/delete", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await prisma.user.delete({ where: { id: userId } });

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update own user profile details (just username change for now) !!!! NOT IN USE CURRENTLY !!!!!!
router.put("/", authenticateJWT, async (req, res) => {

    const { username } = req.body;
    const userId = req.user.id;

    try {
        //check if user exists
        const currentUser = await prisma.user.findUnique( {where: { id: userId }});
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        };
        //check new username is available 
        if (username && username !== currentUser.username) {
            const existingUser = await prisma.user.findUnique({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        };
        //update user details
        const updatedProfile = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || currentUser.username,
            },
            select: { id: true, username: true,  }
        });
        res.json({message: "Profile updated successfully", user: updatedProfile})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

//search for a specific user !!!!!!! NOT CURRENTLY IN USE !!!!!!!!
router.get("/:userId", async(req, res) => {
    const { userId } = req.params;

    try{
        //check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, accountVisibility: true, posts: true }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };
        //dont return posts if user is private
        if (user.accountVisibility === "PRIVATE") {
            return res.json({ username: user.username, message: "This user's dreams are private." });
        }
        //user is public
        res.json({
            username: user.username,
            posts: user.posts
        });
    } catch (error) {
        res.json(500).status({error: error.message})
    }

});

export default router;