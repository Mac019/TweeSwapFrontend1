'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { app } from '../firebase/config.js';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { storeUserTask } from '../firebase/dbUtils.js';

const CACHE_DURATION = 30 * 60 * 1000;
const db = getFirestore(app);

const TweetComments = () => {
  const [tweetId, setTweetId] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (!tweetId) return;
    setLoading(true);
  
    const cacheKey = `comments-${tweetId}`;
    const cached = localStorage.getItem(cacheKey);
  
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setComments(data);
        setLoading(false);
        return;
      }
    }
  
    try {
      const res = await axios.get(`http://localhost:3000/tweet/${tweetId}/comments`);
      const commentsWithPoints = res.data.map(comment => ({
        ...comment,
        points: comment.points || 0, // Default to 0 if points field is missing
      }));
      setComments(commentsWithPoints);
      localStorage.setItem(cacheKey, JSON.stringify({ data: commentsWithPoints, timestamp: Date.now() }));
  
      // Store comments in Firebase and award points
      for (const comment of commentsWithPoints) {
        try {
          await addDoc(collection(db, 'comments'), {
            tweetId,
            name: comment.name,
            username: comment.username,
            text: comment.text,
            date: comment.date,
            storedAt: new Date().toISOString(),
            points: 10,
          });
        } catch (err) {
          console.error(`Failed to store comment by @${comment.username}:`, err.message || err);
        }
  
        try {
          const userId = comment.username;
          const taskId = `comment-${tweetId}-${comment.username}`;
          const points = comment.points;
          await storeUserTask(userId, taskId, points);
        } catch (err) {
          console.error(`Failed to store task for @${comment.username}:`, err.message || err);
        }
      }
    } catch (err) {
      console.error('Error fetching comments from backend:', err?.response?.data || err.message || err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchLikes = async () => {
    if (!tweetId) return;
    setLoading(true);

    const cacheKey = `likes-${tweetId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Cached likes:', data);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axios.get(`http://localhost:3000/tweet/${tweetId}/liking_users`);
      const likes = res.data;

      localStorage.setItem(cacheKey, JSON.stringify({ data: likes, timestamp: Date.now() }));

      for (const like of likes) {
        await addDoc(collection(db, 'likes'), {
          tweetId,
          name: like.name,
          username: like.username,
          likedAt: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error('Error fetching likes:', err?.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '900px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1DA1F2' }}>
        🐦 Twitter Comments Viewer
      </h1>

      {comments.length > 0 && (
        <p style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
          Total Comments: {comments.length}
        </p>
      )}

      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Tweet ID..."
          value={tweetId}
          onChange={e => setTweetId(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        <button
          onClick={fetchComments}
          style={{
            padding: '12px 20px',
            backgroundColor: '#1DA1F2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Fetch Comments
        </button>
        <button
          onClick={fetchLikes}
          style={{
            padding: '12px 20px',
            backgroundColor: '#17bf63',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Fetch Likes
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Fetching data...</p>}

      {!loading && comments.length === 0 && (
        <p style={{ textAlign: 'center', color: '#777' }}>No comments found.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((c, i) => (
          <li
            key={i}
            style={{
              backgroundColor: '#f9f9f9',
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#1DA1F2' }}>
                {c.name} <span style={{ color: '#555' }}>@{c.username}</span>
              </strong>
            </div>
            <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{c.text}</p>
            <small style={{ color: '#999' }}>{new Date(c.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <ul style={{ listStyle: 'none', padding: 0 }}>
  {comments.map((c, i) => (
    <li
      key={i}
      style={{
        backgroundColor: '#f9f9f9',
        marginBottom: '15px',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#1DA1F2' }}>
          {c.name} <span style={{ color: '#555' }}>@{c.username}</span>
        </strong>
      </div>
      <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{c.text}</p>
      <small style={{ color: '#999' }}>{new Date(c.date).toLocaleString()}</small>
      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Points: {c.points}
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default TweetComments;
