import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [createdPost, setCreatedPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch Users List (Replace with your API endpoint)
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handlePostCreation = () => {
    if (selectedUser) {
      // Create new post
      axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: newPost.title,
        body: newPost.body,
        userId: selectedUser.id
      })
      .then(response => {
        setCreatedPost(response.data);
        // Fetch comments for the created post
        return axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${response.data.id}`);
      })
      .then(response => setComments(response.data))
      .catch(error => console.error('Error creating post or fetching comments:', error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">API Chaining Dashboard</h1>

      {/* Users Dropdown */}
      <div className="my-4">
        <label className="block text-sm font-medium">Select User</label>
        <select 
          onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* Create Post */}
      {selectedUser && (
        <div className="my-4">
          <h2 className="text-xl">Create Post for {selectedUser.name}</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <textarea
            placeholder="Post Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <button 
            onClick={handlePostCreation} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Create Post
          </button>
        </div>
      )}

      {/* Display Created Post */}
      {createdPost && (
        <div className="my-4">
          <h2 className="text-xl font-bold">Post Created</h2>
          <p>Title: {createdPost.title}</p>
          <p>Body: {createdPost.body}</p>
        </div>
      )}

      {/* Display Comments */}
      {comments.length > 0 && (
        <div className="my-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <ul className="list-disc pl-5">
            {comments.map(comment => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
