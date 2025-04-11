'use client';

import React, { useState } from 'react';

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

const PlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (plan) => {
    setSelectedPlan(plan.name);
  };

  // This will be passed into your form logic later
  const rewardPool = selectedPlan ? 0 : 100; // default reward if no plan selected

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        {plans.map((plan, index) => (
          <div
            key={index}
            style={{
              width: 'calc(33.33% - 16px)',
              height: '450px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: plan.backgroundColor,
              transform: selectedPlan === plan.name ? 'scale(1.02)' : 'none',
              boxShadow: selectedPlan === plan.name ? '0 6px 16px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
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
              onMouseEnter={(e) => e.target.style.backgroundColor = selectedPlan === plan.name ? '#218838' : '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = selectedPlan === plan.name ? '#28a745' : '#007BFF'}
              onClick={() => handleSelect(plan)}
            >
              {selectedPlan === plan.name ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {/* 🔽 Placeholder for your form — this is where we’ll plug it in */}
      <div style={{ marginTop: '40px' }}>
        <h2>Campaign Form (coming next)</h2>
        <p>Selected Plan: {selectedPlan || 'None'}</p>
        <p>Reward Pool: {rewardPool} TRX</p>
      </div>
    </div>
  );
};

export default PlanSelection;
