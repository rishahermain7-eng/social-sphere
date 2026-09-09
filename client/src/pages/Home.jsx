import { useEffect, useState } from "react";

import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL;

function Home({ createPostTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/posts`
      );

      const result = await response.json();

      if (response.ok) {
        setPosts(result.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((currentPosts) => [
      newPost,
      ...currentPosts,
    ]);
  };

  return (
    <>
      <CreatePost
        onPostCreated={handlePostCreated}
        createPostTrigger={createPostTrigger}
      />

      <div className="feed-tabs">
        <button className="selected">For You</button>
        <button>Following</button>
        <button>Latest</button>
      </div>

      {loading ? (
        <div className="feed-message">
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="feed-message">
          No posts yet. Be the first to share something!
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
          />
        ))
      )}
    </>
  );
}

export default Home;