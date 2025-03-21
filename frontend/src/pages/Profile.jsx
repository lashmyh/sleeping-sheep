import { fetchUserPosts, fetchUserTags } from "../api";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import sheep from "../assets/sheep.png";

import * as Sentry from "@sentry/react";

import { deleteAccount } from "../api";
import { isTokenExpired } from "../utils/tokenCheck";

import { NewPost } from "./NewPost";
import { Navbar } from "../components/Navbar";
import { Pagination } from "../components/Pagination";
import { PostComponent } from "../components/PostComponent";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../components/Button";
import { TagSelector } from "../components/TagSelector";

export const Profile = () => {
    
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // pagination variables
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const tokenIsValid = !isTokenExpired(token)

    useEffect(() => {

        if (!tokenIsValid) {
            navigate("/login");
            return;
        }

        const getPosts = async () => {
            setLoading(true);
            try {
                if (!tokenIsValid) {
                    setError("There was an error getting user info");
                    setLoading(false);
                    return;
                }
                const response = await fetchUserPosts(token, page, 20);
                setPosts(response.data.userPosts);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                Sentry.captureException(error, {
                    extra: {
                        location: "Profile Component - fetching posts",
                        errorMessage: error?.response?.data?.message || error.message,
                        status: error?.response?.status || "Unknown",
                    }
                });
            } finally {
                setLoading(false)
            }
        };

        const getTags = async () => {
            try {
                const response = await fetchUserTags(token);
                setTags(response.data.tags);
            } catch (error) {
                setError("Failed to load tags :-(");

                // Log structured error details to Sentry
                Sentry.captureException(error, {
                    extra: {
                        location: "Profile Component - Fetching tags",
                        errorMessage: error?.response?.data?.message || error.message,
                        status: error?.response?.status || "Unknown",
                    }
                });
            } finally {
                setLoading(false)
            }
        };
        getPosts();
        getTags();
    }, [navigate, page, token, tokenIsValid])

    // open delete confirmation dialog
    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    }

    const handleDeleteAccount = async () => {
        setIsDialogOpen(false);
        if (!tokenIsValid) {
            alert("Session timed out. Please log in again");
            navigate("/login")
            return;
        }

        try {
            await deleteAccount(token);
            navigate("/login");

        } catch (error) {
            console.error("Error deleting account:", error)
        }
    }

    // only display posts containing selected tag
    const filteredPosts = selectedTag === "All" 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag));


    return (
        <div className="w-full h-screen overflow-scroll flex flex-col items-center">
            <Navbar/>
            <div className="flex justify-between">
                {/* desktop view tags sidebar, hidden on mobile */}
                <TagSelector
                    posts={posts}
                    tags={tags}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    mobileView={false}
                ></TagSelector>
                <section className="flex w-full flex-col justify-center items-center mt-15">
                    <div className="flex max-w-280 w-full justify-between items-center my-2 pr-4 sm:pt-8 sm:pr-10">
                        <h1 className="text-white text-3xl self-start p-5"> Your dreams</h1>
                        <Button text={"Add a dream"} action={tokenIsValid? () => setIsModalOpen(true) : () => setIsDialogOpen(true)}></Button>
                    </div>
                    {/* mobile view tags selection bar, hidden on desktop */}
                    <TagSelector
                        posts={posts}
                        tags={tags}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        mobileView={true}
                    ></TagSelector>
                    {/* list of posts filtered by tag */}
                    <ul className="max-w-200 h-full ">
                        {loading && <p>Loading posts...</p>}
                        {!loading && posts.length === 0 && <p className="pl-5">You haven&apos;t logged any  dreams yet!</p>}
                        {error && <p className="pl-5">{error}</p>}
                
                        {filteredPosts.map((post) => (
                            <li key={post.id} className=" mb-6 mx-6 flex items-center ">
                                <img src={sheep} className="w-15 sm:w-30 scale-x-[-1]"/>
                                <PostComponent post={post} clickable={true}></PostComponent>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
            
            {/* delete account */}
            <a className="mb-5 text-xs underline text-pink-200 hover:text-red-400 hover:cursor-pointer duration-300"
            onClick={handleDeleteClick}>
                Want to delete your account? Click here</a>
            <ConfirmDialog 
                isOpen={isDialogOpen} 
                message="Are you sure you want to delete your account?"
                onCancel={() => setIsDialogOpen(false)} 
                onConfirm= {handleDeleteAccount} 
                type = "warning"
            />
            {/* modal for creating new post */}
            <NewPost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

