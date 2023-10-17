import React, { useState, useEffect } from 'react';
import './PostPage.css'; 

interface PostProps {
  title: string;
  content: string;
  city: string;
  imageUrl: string;
  published: boolean;
  timestamp: string;
}

const PostPage: React.FC<PostProps> = ({ title, content, city, imageUrl, published, timestamp }) => {
  return (
    <div className="post-container">
      <img
        src={imageUrl}
        alt="User's Post"
        className="post-image"
      />
      <div className="post-info">
        <p className="post-title">Title: {title}</p>
        <p className="post-content">Content: {content}</p>
        <p className="post-city">City: {city}</p>
        <p className="post-published">{published ? 'Published' : 'Not Published'}</p>
        <p className="post-timestamp">Timestamp: {timestamp}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const apiUrl = 'http://192.168.0.112:3000/api/posts'; 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="App">
      {posts.map((post, index) => (
        <PostPage
          key={index}
          title={post.title}
          content={post.content}
          city={post.city}
          imageUrl={post.imageUrl}
          published={post.published}
          timestamp={post.timestamp}
        />
      ))}
    </div>
  );
};

export default App;




















