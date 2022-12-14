import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]); // UseState est un Hook permet d’ajouter l’état local React à des fonctions 
  const { user } = useContext(AuthContext); // useContext me fourni les données dans AuthContext

  useEffect(() => {
    const fetchPosts = async () => {
       
      const token = JSON.parse(localStorage.getItem('user')).user.token
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      console.log(config)
      const res = await axios.get("http://localhost:4200/api/posts/", config )
     
      
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user?.user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user?.user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
