import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

//get all public posts
router.get("/", async(req, res) => {

    let { page, limit } = req.query;

    //convert query params to int
    page = parseInt(page);
    limit = parseInt(limit);


    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit; //offset


    try {
        //get all public posts
        const publicPosts = await prisma.post.findMany({
            skip,
            where: { visibility: "PUBLIC" },
            take: limit,
            orderBy: { createdAt: "desc" }, 
            select: {
                id: true,
                content: true,
                tags: true,
                createdAt: true,
            }
        });

        //get total no. of public posts
        const totalPublicPosts = await prisma.post.count({
            where: { visibility: "PUBLIC" },
        });

        res.json({
            publicPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPublicPosts / limit),
            totalPublicPosts,
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//get all posts from a user (only authenticated users)
router.get("/user", authenticateJWT, async(req, res) => {

    let { page, limit, tags } = req.query;

    //convert query params to int
    page = parseInt(page);
    limit = parseInt(limit);


    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit; //offset

    try {
        //check user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorised: No user ID found" });
        }

        //Convert tags into an array, if provided
        let tagFilter = {};
        if (tags) {
            const tagArray = tags.split(",").map(tag => tag.trim());
            tagFilter = {tags: {hasSome: tagArray } };
        }

        //get all posts from user with provided ID
        const userPosts = await prisma.post.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }, 
            where: { 
                authorId: req.user.id,
                ...tagFilter,
            
            }
        });

        //get total no. of posts from user
        const totalPosts = await prisma.post.count({
            where: { 
                authorId: req.user.id ,
                ...tagFilter,
            },
        });

        res.json({
            userPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

//get all public posts containing a search query
router.get("/search/:query", async(req, res) => {

    let { page, limit } = req.query;

    //convert query params to int
    page = parseInt(page);
    limit = parseInt(limit);


    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit; //offset

    const { query } = req.params;

    try {
        const totalQueriedPosts = await prisma.post.count({
            where: { 
                visibility: "PUBLIC",
                content: {
                    contains: query,
                    mode: "insensitive"
                } 
            }
        });

        const queriedPosts = await prisma.post.findMany({
            skip,
            take: limit,
            where: { 
                visibility: "PUBLIC",
                content: {
                    contains: query,
                    mode: "insensitive"
                } 
            },
            orderBy: { createdAt: "desc" }, 
            select: {
                id: true,
                content: true,
                tags: true,
                createdAt: true,
            }
        });


        res.json({
            posts: queriedPosts,
            currentPage: page,
            totalPages: totalQueriedPosts > 0 ? Math.ceil(totalQueriedPosts / limit) : 1,
            totalQueriedPosts,
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


//get all unique tags used by a user (authenticated user only)
router.get("/user/tags", authenticateJWT, async(req, res) => {
    try {

        //check user exists and is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: No user ID found" });
        };

        //fetch all posts from user
        const userPosts = await prisma.post.findMany({
            where: { authorId: req.user.id },
            select: { tags: true },
        });

        // Count all tag occurrences
        const tagCounts = userPosts.flatMap(post => post.tags).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        //count all tags and occurences of each tag
        const sortedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count); 

        res.json({ tags: sortedTags});

    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

//get a specific post (from authenticated user)
router.get("/:postId", authenticateJWT, async(req, res) => {
    const { postId } = req.params ;
    try {

        //check user exists and is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorised: No user ID found" });
        };

        //fetch post from userId
        const userPost = await prisma.post.findFirst({
            where: { id: postId, authorId: req.user.id, },
        });

        res.json({userPost});

    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

//create new post 
router.post("/", authenticateJWT, async(req, res) => {
    const { content, tags, visibility } = req.body;

    // Set max character limit 
    const MAX_CONTENT_LENGTH = 1000;

    // Check content length within bounds
    if (!content || content.length > MAX_CONTENT_LENGTH) {
        return res.status(400).json({
            error: `Content must be between 1 and ${MAX_CONTENT_LENGTH} characters.`,
        });
    }

    try {

        const newPost = await prisma.post.create({
            data: {
                content,
                authorId: req.user.id,
                tags,
                visibility,
            }
        });

        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update own post 
router.put("/:postId", authenticateJWT, async (req, res) => {

    const { postId } = req.params;
    const { content, tags, visibility } = req.body;

    try {
        //check if post exists
        const currentPost = await prisma.post.findUnique( {where: { id: postId }});
        if (!currentPost) {
            return res.status(404).json({ message: "Post not found" });
        };
        //check post belongs to authenticated user
        if (currentPost.authorId !== req.user.id ) {
            return res.status(403).json({ message: "Unauthorised to make this change" });
        }
        
        const updatedData = {};
        if (content) updatedData.content = content;
        if (tags !== undefined) updatedData.tags = tags; // Allow empty array
        if (visibility) updatedData.visibility = visibility;

        //check if there is any data to be changed
        if (Object.keys(updatedData).length === 0) {
            return res.json({ message: "No changes were made.", post: currentPost });
        }

        // update the post
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updatedData
        });

        res.json({ message: "Post updated successfully", post: updatedPost });
        // res.json(updatedPost)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

//delete own post 
router.delete("/:postId", authenticateJWT, async (req, res) => {

    const { postId } = req.params;

    try {
        //check if post exists
        const currentPost = await prisma.post.findUnique( {where: { id: postId }});
        if (!currentPost) {
            return res.status(404).json({ message: "Post not found" });
        };
        //check post belongs to authenticated user
        if (currentPost.authorId !== req.user.id ) {
            return res.status(403).json({ message: "Unauthorised: You can only delete your own posts" });
        }
        //delete post
        await prisma.post.delete({
            where: { id: postId }
        });
        res.json({message: "Post deleted successfully" })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});


export default router;