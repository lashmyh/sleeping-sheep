import search from "../assets/search.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Searchbar = () => {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            navigate(`/posts/search/${query}`)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="h-8 w-[100%] max-w-100 flex gap-2 mr-5 justify-between p-1 items-center bg-sky-teal/20 rounded-md border-1">
                    <input 
                    type="text"
                    name="searchQuery"
                    placeholder = "Search for dreams..." 
                    className = " border-white/50 w-[100%] px-1"
                    value = {query}
                    onChange={(e) => setQuery(e.target.value)}
                    ></input>
                    <button type="submit" className="cursor-pointer">
                        <img src={search} className="w-6 h-6 invert"></img>
                    </button>
                </form>

        </div>
    )
}