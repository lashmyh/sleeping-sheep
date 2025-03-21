import { useState } from "react";
import PropTypes from "prop-types";
import close from "../assets/close.svg"

export const TagSelector = ({ posts, tags, selectedTag, setSelectedTag, mobileView }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); //hide dropdown initially

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div>
            {/* mobile version */}
            {mobileView ? 
            <div className={` mb-10 w-full rounded-3xl flex justify-left ${isDropdownOpen ? "justify-center" : "justify-start"} sm:hidden`}>

                {/* button to toggle dropdown */}
                <div>
                    <button
                        onClick={toggleDropdown}
                        className={`text-white mx-5 cursor-pointer mb-4 p-2 rounded-xl bg-mauve hover:bg-pink-300 ${isDropdownOpen ? "hidden" : ""}`}
                    >
                        Filter by tag
                    </button>
                </div>

                {/* Dropdown content for mobile  */}
                <div className={`${isDropdownOpen ? "block" : "hidden"} p-10 rounded-2xl w-[90vw] relative flex flex-col items-center justify-center bg-sky-teal/30`}>
                    <div className="absolute top-4 left-4">
                        <img onClick={toggleDropdown} src={close} className="h-6 invert x-10"></img>
                    </div>

                    {/* "All" tag */}
                    <div
                        className={`text-white cursor-pointer duration-300 p-1 mb-2 rounded-xl flex justify-between gap-5 min-w-[10rem] ${
                            selectedTag === "All" ? "bg-pink-300/50 scale-105" : "hover:scale-105 hover:bg-pink-300/50"
                        }`}
                        onClick={() => setSelectedTag("All")}
                    >
                        <h4>All</h4>
                        <h4 className="text-white/60">({posts.length})</h4>
                    </div>

                    {/* Individual tags */}
                    {tags.map((tag) => (
                        <div key={tag.tag}>
                            <div
                                className={`text-white cursor-pointer duration-300 p-1 rounded-xl mb-2 flex justify-between gap-5 min-w-[10rem] ${
                                    selectedTag === tag.tag ? "bg-pink-300/50 scale-105" : "hover:scale-105 hover:bg-pink-300/50"
                                }`}
                                onClick={() => setSelectedTag(tag.tag)}
                            >
                                <h4>{tag.tag}</h4>
                                <h4 className="text-white/60">({tag.count})</h4>
                            </div>
                        </div>
                    ))}
                </div>
        
            </div>

            : 

            // desktop view
            <div className="mt-30 ml-5 p-5 pb-10 hidden sm:block bg-sky-teal/30 rounded-2xl min-h-[30rem] mr-10">
                <h2 className="text-2xl pb-5 text-center">Your tags</h2>
                {/* "All" tag */}
                <div
                    className={`text-white cursor-pointer duration-300 p-1 mb-2 rounded-xl flex justify-between gap-5 min-w-[10rem] ${
                        selectedTag === "All" ? "bg-pink-300/50 scale-105" : "hover:scale-105 hover:bg-pink-300/50"
                    }`}
                    onClick={() => setSelectedTag("All")}
                >
                    <h4>All</h4>
                    <h4 className="text-white/60">({posts.length})</h4>
                </div>

                {/* Individual tags */}
                {tags.map((tag) => (
                    <div key={tag.tag}>
                        <div
                            className={`text-white cursor-pointer duration-300 p-1 rounded-xl mb-2 flex justify-between gap-5 min-w-[10rem] ${
                                selectedTag === tag.tag ? "bg-pink-300/50 scale-105" : "hover:scale-105 hover:bg-pink-300/50"
                            }`}
                            onClick={() => setSelectedTag(tag.tag)}
                        >
                            <h4>{tag.tag}</h4>
                            <h4 className="text-white/60">({tag.count})</h4>
                        </div>
                    </div>
                ))}

            </div>
            }
            
        </div>
    );
};

export default TagSelector;


TagSelector.propTypes = {
    posts: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    selectedTag: PropTypes.string.isRequired,
    setSelectedTag: PropTypes.func.isRequired,
    mobileView: PropTypes.bool.isRequired,

};