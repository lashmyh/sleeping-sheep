import { formatDate } from "../utils/formatDate" 
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

//generates single post component
export const PostComponent = ({ post, clickable }) => {

    const navigate = useNavigate();

    return (
        <div className={`text-white bg-sky-200/20 rounded-3xl mx-3 min-h-20 px-5 py-3 w-full flex flex-col duration-300 hover:scale-105 ${ clickable ? "cursor-pointer" : ""}`}
        onClick = {clickable ? () => navigate(`/profile/${post.id}`) : undefined } // posts on profile page are clickable (i.e takes you to post details page)
        key={post.id}>
            <p className="self-end mb-2 text-pink-200 text-sm">{formatDate(post.createdAt)}</p>
            <h4 className="mb-2">{post.content}</h4>
            {/* tags section */}
            <div className="text-pink-200/70 flex min-h-[28px]">
                {post.tags.length > 0 ? (
                post.tags.map((tag, index) => (
                    <div key={index} className="text-sm bg-pink-400/20 text-white px-2 rounded-md my-1 mr-2">
                    #{tag}
                    </div>
                ))
                ) : (
                <div className="invisible">Placeholder</div> // keeps space but remains hidden
                )}
            </div>
        </div>
    )
}


PostComponent.propTypes = {
    post: PropTypes.object.isRequired,
    clickable: PropTypes.bool,
};