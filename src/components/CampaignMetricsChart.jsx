'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const CampaignMetricsChart = ({ campaign }) => {
  const [metrics, setMetrics] = useState(null);

  const extractTweetId = (url) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const fetchMetrics = async (tweetURL) => {
    const tweetId = extractTweetId(tweetURL);
    if (!tweetId) return;

    try {
      const response = await fetch(`http://localhost:3000/tweet/${tweetId}/metrics`);
      const data = await response.json();

      const chartData = [
        {
          day: 'Today',
          likes: data.likes || 0,
          comments: data.comments || 0,
          reposts: data.retweets || 0, // Adjusted from your previous simulated formula
        },
      ];

      setMetrics(chartData);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  useEffect(() => {
    if (campaign?.tweetURL) {
      fetchMetrics(campaign.tweetURL);
    }
  }, [campaign]);

  if (!campaign) return null;

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
        Engagement Trends for: {campaign.name}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={metrics || []}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#8884d8" />
          <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
          <Line type="monotone" dataKey="reposts" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CampaignMetricsChart;
