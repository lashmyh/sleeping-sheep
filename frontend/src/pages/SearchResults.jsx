import { fetchSearchedPosts } from "../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

import * as Sentry from "@sentry/react";

import { Pagination } from "../components/Pagination";
import { Navbar } from "../components/Navbar";

import sheep from "../assets/sheep.png";

//fetch all public posts containing search query
export const SearchResults = () => {
    
    const { query } = useParams(); 

    const [posts, setPosts] = useState([]);
    const [numberOfPosts, setNumberOfPosts] = useState(0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pagination variables
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // fetch posts when component mounts or search query or page changes
    useEffect(() => {
        const getPosts = async () => {
            setLoading(false);
            try {
                const response = await fetchSearchedPosts(query, page, 20);
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages)
                setNumberOfPosts(response.data.totalQueriedPosts);
            } catch (error) {
                // Log structured error details to Sentry
                Sentry.captureException(error, {
                    extra: {
                        location: "Search Component - fetching posts",
                        serachQuery: query,
                        errorMessage: error?.response?.data?.message || error.message,
                        status: error?.response?.status || "Unknown",
                    }
                });
                setError("Failed to load posts :-(");
            } finally {
                setLoading(false)
            
            }
        };
        getPosts();
        

    }, [query, page])


    return (
        <div className="w-full h-screen overflow-scroll flex flex-col items-center">
            <Navbar/>
            <header className="flex max-w-280 w-full justify-between items-center my-2 pr-10 pt-15">
                <h1 className="text-white text-3xl self-start p-5"> All dreams about &quot;{query}&quot; ({numberOfPosts} total)</h1>
            </header>

            {loading && <p>Loading posts...</p>}
            {error && <p>{error}</p>}

            {/* no posts found containing search query */}
            {!loading && posts.length === 0 && <p>No dreams about that yet!</p>}

            {/* list of posts containing search query */}
            <ul className="w-3/4 max-w-200">
                {posts.map((post) => (
                    <li key={post.id} className=" mb-6 mx-6 flex items-center cursor-pointer">
                        <img src={sheep} className=" scale-x-[-1] "/>
                        <div className="text-white bg-sky-200/20 rounded-3xl mx-3 min-h-20 px-5 py-3 w-full flex flex-col duration-300 hover:scale-105">
                            <p className="self-end mb-2 text-pink-200 text-sm">{formatDate(post.createdAt)}</p>
                            <h4 className="mb-2">{post.content}</h4>
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
                    </li>
                ))}
            </ul>
            <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
            

        </div>

    )
}