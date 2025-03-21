import rightArrow from "../assets/right-arrow.svg";
import leftArrow from "../assets/left-arrow.svg";

import PropTypes from "prop-types"; //for handling prop validation

//pagination component to navigate between pages
export const Pagination = ({ page, totalPages, setPage}) => {

    return (
        <div className="flex gap-4 my-6 items-center">
                {/* left arrow button for navigating to prev. page */}
                <button 
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))} //decrease page number, ensure it doesnyt go below 1
                    disabled={page === 1} //disable button if on page 1
                    className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-teal hover:bg-pink-300 duration-300 cursor-pointer'}`}
                >
                    <img src={leftArrow} className="w-6 invert" alt="left arrow icon"></img>

                </button>

                {/* display current page and number of pages */}
                <span className="text-white text-lg">Page {page} of {totalPages}</span>

                {/* right arrow button for navigating to next page */}
                <button 
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} //increase page number and ensure it doesn't go above totalPages
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-teal hover:bg-pink-300 duration-300 cursor-pointer'}`}
                >
                    <img src={rightArrow} className="w-6 invert" alt="right arrow icon"></img>
            
                </button>
            </div>
    )
};

Pagination.propTypes = {
    page: PropTypes.number.isRequired,  //current page
    totalPages: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired
};