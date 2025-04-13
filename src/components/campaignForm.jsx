'use client';

import React, { useState } from 'react';
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
    rewardPool: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        rewardPool: Number(formData.rewardPool),
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
          'rewardPool',
        ].map((field) => (
          <div key={field} style={fieldStyle}>
            <label style={labelStyle}>
              {field.replace('reward', 'Reward for ').replace('Pool', 'Pool (TRX)')}
            </label>
            <input
              type={
                field === 'endTime'
                  ? 'datetime-local'
                  : field.includes('reward') || field === 'userLimit' || field === 'rewardPool'
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

        <button type="submit" style={buttonStyle}>
          Submit Campaign
        </button>
      </form>
    </div>
  );
}
