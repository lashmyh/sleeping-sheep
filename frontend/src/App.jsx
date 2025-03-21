import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles.css'
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Post } from "./pages/Post";
import { SearchResults } from "./pages/SearchResults";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/:postId" element={<Post />}></Route>

          <Route path="/posts/search/:query" element={<SearchResults />}></Route>


        </Routes>
    </Router>
  );
};

export default App





