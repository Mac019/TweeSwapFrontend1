'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/campaign.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CampaignForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tweetUrl: '',
    endTime: '',
    userLimit: '',
    rewardLike: '',
    rewardComment: '',
    rewardRepost: '',
    campaignFees: '',
    totalReward: '',
    twitterId: '',
  });

  // Extract Twitter ID whenever tweetUrl changes
  useEffect(() => {
    const extractTwitterId = () => {
      const match = formData.tweetUrl.match(/(?:x|twitter)\.com\/([^\/]+)\/status/i);
      if (match) {
        setFormData((prev) => ({ ...prev, twitterId: match[1] }));
      }
    };

    extractTwitterId();
  }, [formData.tweetUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, logo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        userLimit: Number(formData.userLimit),
        rewardLike: Number(formData.rewardLike),
        rewardComment: Number(formData.rewardComment),
        rewardRepost: Number(formData.rewardRepost),
        campaignFees: Number(formData.campaignFees),
        totalReward: Number(formData.totalReward),
        selectedPlan: null,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'campaigns'), payload);
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign.');
    }
  };

  const formContainer = {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  };

  const fieldStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '500',
    marginBottom: '6px',
    textTransform: 'capitalize',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={formContainer}>
      <h2 style={headingStyle}>Create Campaign</h2>
      <form onSubmit={handleSubmit}>
        {[
          'name',
          'description',
          'tweetUrl',
          'endTime',
          'userLimit',
          'rewardLike',
          'rewardComment',
          'rewardRepost',
          'totalReward',
        ].map((field) => (
          <div key={field} style={fieldStyle}>
            <label style={labelStyle}>
              {field === 'totalReward'
                ? 'Total Reward (TRX)'
                : field.replace('reward', 'Reward for ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase())}
            </label>
            <input
              type={
                field === 'endTime'
                  ? 'datetime-local'
                  : field.includes('reward') || field === 'userLimit' || field === 'totalReward'
                  ? 'number'
                  : 'text'
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        ))}

        <div style={fieldStyle}>
          <label style={labelStyle}>Twitter ID</label>
          <input
            type="text"
            name="twitterId"
            value={formData.twitterId}
            readOnly
            style={{ ...inputStyle, backgroundColor: '#f9f9f9' }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Campaign Fees (TRX)</label>
          <input
            type="number"
            name="campaignFees"
            value={formData.campaignFees}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Campaign Logo (PNG)</label>
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Submit Campaign
        </button>
      </form>
    </div>
  );
}
