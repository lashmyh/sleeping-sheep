import { createNewPost } from "../api"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isTokenExpired } from "../utils/tokenCheck";
import * as Sentry from "@sentry/react";

import { Button } from "../components/Button";

import close from "../assets/close.svg";


//make new post modal
export const NewPost = ({ isOpen, onClose }) => {

    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const navigate = useNavigate();

    if (!isOpen) return null; // hide modal

    //add tag
    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]); 
            setTagInput(""); 
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const tokenIsValid = !isTokenExpired(token);
        if (!tokenIsValid) {
            alert("Session timed out. Please log in again to make a post!")
            navigate("/login")
            return;
        }

        try {
            const postData = {
                content,
                tags,
                visibility
            };
            await createNewPost(token, postData);
            navigate("/");
            setContent("");
            setTags([]);
            onClose(); //close modal
            window.location.reload(); //reload page to reflect changes


        } catch (error) {
            // Log structured error details to Sentry
            Sentry.captureException(error, {
                extra: {
                    location: "Login Component",
                    status: error?.response?.status || "Unknown",
                }
            });
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black/60 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} w-full`}>
            <form onSubmit={handleSubmit} className="bg-sky-dark border-1 border-mauve p-7 rounded-3xl flex flex-col w-[90vw] max-w-[40rem]">
                
                <button onClick={() => onClose()} className="hover:scale-125 duration-300 cursor-pointer self-end"><img src={close} className="w-7 h-7 mr-2 invert"></img> </button>
                <h3 className="text-xl mb-5">What did you dream?</h3>
                
                <textarea className="bg-sky-teal/30 rounded-xl p-3 mb-5 h-30"
                    placeholder="...zzz zzz zzz....."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                {/* Display added tags */}
                <div className="mb-3 flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                        <span className="rounded-sm bg-mauve p-1 mr-2 hover:scale-150 duration-300 hover:line-through cursor-pointer"
                         key={index} onClick={() => setTags(tags.filter((_, i) => i !== index))}>
                            #{tag}
                        </span>
                    ))}
                </div>
                {/* Add a tag */}
                <div className="flex gap-5 mb-5 flex-col items-start sm:flex-row sm:items-center">
                    <label className="mr-2">Add a tag: </label>
                    <div className="flex">
                        <input className=" rounded-sm h-10 px-2 mr-5 bg-sky-teal/20"
                            type="text"
                            placeholder="(e.g. happy, home, etc...)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                        />
                        <button className="bg-sky-teal rounded-xl p-2 hover:bg-pink-300/80 hover:scale-105 duration-300 font-medium cursor-pointer" onClick={addTag}>Add tag</button>
                    </div>
                </div>
                {/* Select post visibility */}
                <div className="flex items-center mb-8">
                    <label className="mr-2">Post visibility:</label>
                    <select className="bg-sky-teal/20 rounded-sm p-1" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                </div>
                <Button text="Post" type="submit"></Button>
            </form>
        </div>
    )
}

NewPost.propTypes = {
    isOpen: PropTypes.bool.isRequired, 
    onClose: PropTypes.func.isRequired 
};