'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '@/firebase/campaign.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PlanSelectionWithForm() {
  const [selectedPlan, setSelectedPlan] = useState(null);
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
  });
  const [twitterId, setTwitterId] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // Extract Twitter ID from tweet URL
  useEffect(() => {
    const match = formData.tweetUrl.match(/(?:x|twitter)\.com\/([^\/]+)\/status/i);
    if (match) {
      setTwitterId(match[1]);
    }
  }, [formData.tweetUrl]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);
    setFormData((prev) => ({ ...prev, campaignFees: '0' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const campaignFeesToUse = selectedPlan ? 0 : Number(formData.campaignFees);
    let logoURL = '';

    try {
      if (logoFile) {
        const storageRef = ref(storage, `logos/${logoFile.name}_${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, logoFile);
        logoURL = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        ...formData,
        twitterId,
        userLimit: Number(formData.userLimit),
        rewardLike: Number(formData.rewardLike),
        rewardComment: Number(formData.rewardComment),
        rewardRepost: Number(formData.rewardRepost),
        totalReward: Number(formData.totalReward),
        campaignFees: campaignFeesToUse,
        selectedPlan: selectedPlan || null,
        logo: logoURL,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'campaigns'), payload);
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Create Campaign</h2>
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
          'totalReward'
        ].map((field) => (
          <div key={field} style={fieldStyle}>
            <label style={labelStyle}>
              {field === 'totalReward'
                ? 'Total Reward (TRX)'
                : field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
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

        {/* Campaign Fees */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Campaign Fees (TRX)</label>
          <input
            type="number"
            name="campaignFees"
            value={selectedPlan ? 0 : formData.campaignFees}
            onChange={handleChange}
            required={!selectedPlan}
            disabled={!!selectedPlan}
            style={{
              ...inputStyle,
              backgroundColor: selectedPlan ? '#f0f0f0' : '#fff',
            }}
          />
        </div>

        <button type="submit" style={buttonStyle}>Submit Campaign</button>
      </form>
    </div>
  );
}
