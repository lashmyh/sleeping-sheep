import { fetchUserSinglePost, deletePost } from "../api"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

import { Navbar } from "../components/Navbar";
import { EditPost } from "./EditPost";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { isTokenExpired } from "../utils/tokenCheck";
import { Button } from "../components/Button";

import edit from "../assets/edit.svg";
import trash from "../assets/trashcan.svg";

import * as Sentry from "@sentry/react";

export const Post = () => {
    const { postId } = useParams(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem("token");
    const tokenIsValid = !isTokenExpired(token)

    //  Fetch single post
    useEffect(() => {
        const getPost = async () => {
            if (!tokenIsValid) {
                setError("Please log in to view this post.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetchUserSinglePost(token, postId);
                setPost(response.data.userPost);
            } catch (error) {
                // Log structured error details to Sentry
                Sentry.captureException(error, {
                    extra: {
                        location: "Post Component - fetching post",
                        postId: postId, 
                        errorMessage: error?.response?.data?.message || error.message,
                        status: error?.response?.status || "Unknown",
                    }
                });
                setError("Failed to load post.");
            } finally {
                setLoading(false);
            }
        };
        getPost();
    }, [postId, navigate, tokenIsValid, token]);

    // open confirm delete dialog 
    const handleDeleteClick = () => {
        setIsDialogOpen(true); 
    };

    const handleDelete = async () => { 
        setIsDialogOpen(false);
        if (!tokenIsValid) {
            alert("Session timed out. Please log in again");
            navigate("/login")
            return;
        }
        try {
            await deletePost(token, postId);
            navigate("/profile");

        } catch (error) {
            Sentry.captureException(error, {
                extra: {
                    location: "Post Component - Deleting post",
                    postId: postId,
                    errorMessage: error?.response?.data?.message || error.message,
                    status: error?.response?.status || "Unknown",
                }
            });
        }
    };



    return (
        <div className="h-[100%]">
            <Navbar/>
            <div className="mt-25 ml-10">
                <Button text="Back" action={() => {navigate(-1)}}></Button>
            </div>

            {loading && <p>Loading posts...</p>}
            {error && <p className="mt-20">{error}</p>}

            {/* load if post exists */}
            {post && (
                    <div className=" flex flex-col items-center pt-20">
                        <div className="text-white bg-sky-200/20 rounded-3xl px-5 py-3 w-150 max-w-[90%] flex flex-col hover:scale-105 duration-500" >
                            <p className="self-end mb-2 text-pink-200 text-sm">{formatDate(post.createdAt)}</p>
                            <h4 className="mb-2">{post.content}</h4>
                            {/* display tags if they exist */}
                            <div className="text-pink-200/70 flex min-h-[28px]">
                                {post.tags.length > 0 ? (
                                    post.tags.map((tag, index) => (
                                    <div key={index} className="text-sm bg-pink-400/20 text-white px-2 rounded-md my-1 mr-2">
                                        #{tag}
                                    </div>
                                ))
                                ) : (
                                <div className="invisible">Placeholder</div> // Keeps space but remains hidden
                                )}
                            </div>                      
                        </div>
                        <div className="flex justify-evenly gap-10 mt-10 items-center bg-sky-200/20 rounded-3xl p-5">
                            <p>{post.visibility}</p>
                            <button onClick={() => setIsModalOpen(true)} ><img src={edit} className="w-7 h-7 mr-2 invert hover:scale-125 duration-300 cursor-pointer"></img> </button>
                            <button onClick={handleDeleteClick} ><img src={trash} className="w-7 h-7 mr-2 invert hover:scale-125 duration-300 cursor-pointer"></img> </button>

                        </div>
                        {/* display edit post modal when open */}
                        <EditPost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={post} />
                        <ConfirmDialog 
                            isOpen={isDialogOpen} 
                            message="Are you sure you want to delete this post?"
                            onCancel={() => setIsDialogOpen(false)} 
                            onConfirm={handleDelete} 
                            type = "warning"
                        />
                    </div>
                )}
                
        </div>
    )
}


