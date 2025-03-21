import PropTypes from "prop-types";

//standard button

export const Button = ({ text, action, colour = "bg-sky-teal", type }) => {
    return (
        <button 
            className={`${colour} rounded-xl py-2 px-4 hover:bg-pink-300 hover:scale-105 duration-300 font-medium cursor-pointer self-center ${text === "Post" ? "px-20" : ""}`}
            onClick={action} type={type}>
                {text}
        </button>
    )
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    colour: PropTypes.string,
    type: PropTypes.string
};