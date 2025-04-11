'use client';

import React, { useState } from 'react';
import axios from 'axios';

const TestComments = () => {
  const [tweetId, setTweetId] = useState('');
  const [data, setData] = useState(null);

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
      <button onClick={testFetch} style={{ padding: '8px 12px', fontSize: '16px' }}>
        Fetch Comments JSON
      </button>

      {data && (
        <pre style={{ marginTop: '20px', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default TestComments;
