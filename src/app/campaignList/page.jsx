'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/campaign.js';
import { collection, getDocs } from 'firebase/firestore';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'campaigns'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  if (campaigns.length === 0) {
    return <p style={{ textAlign: 'center' }}>No campaigns found.</p>;
  }

  return (
    <div style={{ overflowX: 'auto', margin: '40px auto', maxWidth: '90%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Campaign List
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Like (TRX)</th>
            <th style={thStyle}>Comment (TRX)</th>
            <th style={thStyle}>Repost (TRX)</th>
            <th style={thStyle}>Tweet</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}>{c.rewardLike}</td>
              <td style={tdStyle}>{c.rewardComment}</td>
              <td style={tdStyle}>{c.rewardRepost}</td>
              <td style={tdStyle}>
                <a
                  href={c.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#1DA1F2',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  View Tweet
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '12px 16px',
  fontWeight: '600',
  fontSize: '15px',
  borderBottom: '2px solid #ccc',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#333',
};
