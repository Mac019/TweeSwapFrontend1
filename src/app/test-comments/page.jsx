'use client';

import React, { useState } from 'react';
import axios from 'axios';

const TestComments = () => {
  const [tweetId, setTweetId] = useState('');
  const [data, setData] = useState(null);
  const [postResponse, setPostResponse] = useState(null);

  const testFetch = async () => {
    if (!tweetId) return;

    try {
      const res = await axios.get(`http://localhost:3000/tweet/${tweetId}/comments`);
      console.log('Test fetched data:', res.data);
      setData(res.data);
    } catch (err) {
      console.error('Fetch error:', err?.response?.data || err.message || err);
      setData({ error: err.message || 'Error occurred' });
    }
  };

  const testPost = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/store-comment', {
        tweetId: 'dummy123',
        name: 'Test User',
        username: 'testuser',
        text: 'This is a test comment',
        date: new Date().toISOString(),
        points: 10,
      });
      console.log('Post response:', res.data);
      setPostResponse(res.data);
    } catch (err) {
      console.error('POST error:', err?.response?.data || err.message || err);
      setPostResponse({ error: err.message || 'Error occurred' });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🧪 Comment API Tester</h2>
      <input
        type="text"
        placeholder="Tweet ID..."
        value={tweetId}
        onChange={(e) => setTweetId(e.target.value)}
        style={{ padding: '8px', marginRight: '10px', fontSize: '16px' }}
      />
      <button onClick={testFetch} style={{ padding: '8px 12px', fontSize: '16px', marginRight: '10px' }}>
        Fetch Comments JSON
      </button>
      <button onClick={testPost} style={{ padding: '8px 12px', fontSize: '16px', backgroundColor: '#1DA1F2', color: '#fff' }}>
        Test Post Comment
      </button>

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h4>GET /comments Response:</h4>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {postResponse && (
        <div style={{ marginTop: '20px' }}>
          <h4>POST /store-comment Response:</h4>
          <pre style={{ backgroundColor: '#f0f9f0', padding: '20px', borderRadius: '8px' }}>
            {JSON.stringify(postResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestComments;
