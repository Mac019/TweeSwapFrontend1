'use client';

import React, { useState } from 'react';
import { db } from '@/firebase/campaign.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const plans = [
  {
    name: 'Basic',
    price: '50 TRX',
    description: [
      'Ideal for individuals just starting out.',
      'Access to basic features like profile creation and resume storage.',
      'Email support with a response time of up to 48 hours.',
      'Limited usage of certain advanced features.'
    ],
    backgroundColor: '#E1F5FE',
  },
  {
    name: 'Advance',
    price: '150 TRX',
    description: [
      'For users who need more flexibility and features.',
      'Access to advanced features including analytics and custom templates.',
      'Priority email support with a response time of up to 24 hours.',
      'More storage and integrations with external platforms.',
      'Additional premium templates and customization options.'
    ],
    backgroundColor: '#FFF3E0',
  },
  {
    name: 'Premium',
    price: '300 TRX',
    description: [
      'The most comprehensive plan for power users.',
      'Full access to all features including advanced analytics, premium templates, and unlimited customizations.',
      '24/7 priority support with a dedicated account manager.',
      'Unlimited storage and integrations with all platforms.',
      'Access to exclusive updates, new features, and beta tests.',
      'Custom branding and personalized features for your profile.'
    ],
    backgroundColor: '#F3E5F5',
  },
];

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
    campaignFees: '', // <-- New editable only if no plan
  });

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);
    setFormData((prev) => ({ ...prev, campaignFees: '0' }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rewardPoolToUse = selectedPlan ? 0 : 100;
    const campaignFeesToUse = selectedPlan ? 0 : Number(formData.campaignFees);

    try {
      const payload = {
        ...formData,
        userLimit: Number(formData.userLimit),
        rewardLike: Number(formData.rewardLike),
        rewardComment: Number(formData.rewardComment),
        rewardRepost: Number(formData.rewardRepost),
        rewardPool: rewardPoolToUse,
        campaignFees: campaignFeesToUse,
        selectedPlan: selectedPlan || null,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'campaigns'), payload);
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign.');
    }
  };

  const cardWrapper = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    justifyContent: 'center',
    padding: '24px',
  };

  const cardStyle = (selected, backgroundColor) => ({
    width: 'calc(33.33% - 16px)',
    height: '450px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor,
    transform: selected ? 'scale(1.02)' : 'none',
    boxShadow: selected
      ? '0 6px 16px rgba(0,0,0,0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  });

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
    <>
      <div style={cardWrapper}>
        {plans.map((plan, index) => (
          <div
            key={index}
            style={cardStyle(selectedPlan === plan.name, plan.backgroundColor)}
          >
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>{plan.name}</h3>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>{plan.price}</p>

            <ul style={{ textAlign: 'left', fontSize: '14px', color: '#555', marginBottom: '24px' }}>
              {plan.description.map((point, idx) => (
                <li key={idx} style={{ marginBottom: '8px', listStyleType: 'disc', paddingLeft: '20px' }}>
                  {point}
                </li>
              ))}
            </ul>

            <button
              style={{
                backgroundColor: selectedPlan === plan.name ? '#28a745' : '#007BFF',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                e.target.style.backgroundColor =
                  selectedPlan === plan.name ? '#218838' : '#0056b3'
              }
              onMouseLeave={(e) =>
                e.target.style.backgroundColor =
                  selectedPlan === plan.name ? '#28a745' : '#007BFF'
              }
              onClick={() => handlePlanSelect(plan)}
            >
              {selectedPlan === plan.name ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {/* Form Section */}
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
          ].map((field) => (
            <div key={field} style={fieldStyle}>
              <label style={labelStyle}>
                {field.replace('reward', 'Reward for ')}
              </label>
              <input
                type={
                  field === 'endTime'
                    ? 'datetime-local'
                    : field.includes('reward') || field === 'userLimit'
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

          {/* Campaign Fees Field */}
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

          {/* Reward Pool (auto-set display) */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Reward Pool (Auto Set)</label>
            <input
              type="number"
              value={selectedPlan ? 0 : 100}
              disabled
              style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Submit Campaign
          </button>
        </form>
      </div>
    </>
  );
}
