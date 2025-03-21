import { Link } from "react-router-dom";
import GithubIcon from "../assets/github-mark.svg"

export const Footer = () => {
    return (
        <footer>
            <Link to="http://github.com/lashmyh" className="flex items-center text-white hover:text-pink-300 transition duration-300 text-xs">
                <img src={GithubIcon} alt="Github" className="w-5 h-5 mr-2 filter-invert " />
                github.com/lashmyh
            </Link>
        </footer>
    );
};
  
