import { fetchAllPosts } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as Sentry from "@sentry/react";

import { isTokenExpired } from "../utils/tokenCheck";

import { NewPost } from "./NewPost";
import { Navbar } from "../components/Navbar";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Pagination } from "../components/Pagination";
import { Button } from "../components/Button";
import { PostComponent } from "../components/PostComponent";

import sheep from "../assets/sheep.png";

//display all public anonymous posts
export const Home = () => {
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const navigate = useNavigate();

    // fetch posts when the component mounts or when page changes
    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            try {
                const response = await fetchAllPosts(page, 20);
                setPosts(response.data.publicPosts);
                setTotalPages(response.data.totalPages); 
            } catch (error) {
                // Log structured error details to Sentry
                Sentry.captureException(error, {
                    extra: {
                        location: "Home Component - Fetching Posts",
                        pageNumber: page,
                        errorMessage: error?.response?.data?.message || error.message,
                        status: error?.response?.status || "Unknown",
                    }
                });
                setError(error);
            } finally {
                setLoading(false)
            }
        };
        getPosts();
    }, [page])

    const token = localStorage.getItem("token");
    const tokenIsValid = !isTokenExpired(token); //true when JWT session has not expired

    const handleError = () => {
        setIsDialogOpen(false),
        navigate("/login")
    }

    return (
        <div className="w-full h-screen overflow-scroll flex flex-col items-center">
            <Navbar/>
            <div className="flex max-w-280 w-full justify-between items-center my-2 pr-10 pt-15">
                <h1 className="text-white text-3xl self-start p-5"> All dreams</h1>
                <Button text={"Add a dream"} action={tokenIsValid? () => setIsModalOpen(true) : () => setIsDialogOpen(true)}></Button>
            </div>

            {loading && <p>Loading posts...</p>}
            {error && <p>{error}</p>}

            {/* no posts */}
            {!loading && posts.length === 0 && <p>No dreams yet!</p>}

            {/* list of posts */}
            <ul className="sm:w-3/4 max-w-200 my-5 sm:my-0 ">
                {posts.map((post) => (
                    <li key={post.id} className=" mb-6 mx-2 sm:mx-6 flex items-center">
                        <img src={sheep} className="w-15 sm:w-30 scale-x-[-1] "/>
                        <PostComponent post={post}></PostComponent>
                    </li>
                ))}
            </ul>
            {/* new post modal */}
            <NewPost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            {/* login prompt dialog */}
            <ConfirmDialog 
                isOpen={isDialogOpen} 
                message="Please log in to log your dreams! :)"
                onCancel={handleError} 
                type = "error"
            />

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />

        </div>

    )
}