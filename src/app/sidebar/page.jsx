'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase/campaign';
import { collection, getDocs } from 'firebase/firestore';
import CampaignForm from '@/components/CampaignForm';
import CampaignList from '@/app/campaignList/page';
import CampaignMetricsChart from '@/components/CampaignMetricsChart';

export default function Sidebar() {
  const [campaigns, setCampaigns] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

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

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3
          onClick={() => setShowDropdown((prev) => !prev)}
          style={{ cursor: 'pointer', marginBottom: '10px' }}
        >
          ▸ My Campaigns
        </h3>

        {showDropdown && (
          <ul style={{ paddingLeft: '10px', marginBottom: '20px' }}>
            {campaigns.map((c) => (
              <li
                key={c.id}
                style={{
                  ...liStyle,
                  cursor: 'pointer',
                  color: selectedCampaign?.id === c.id ? '#007BFF' : 'black',
                  fontWeight: selectedCampaign?.id === c.id ? 'bold' : 'normal',
                }}
                onClick={() => setSelectedCampaign(c)}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}

        <button
          style={addButtonStyle}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? '− Close Form' : '+ Add a Campaign'}
        </button>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {showForm && (
          <div style={{ marginBottom: '40px' }}>
            <CampaignForm />
          </div>
        )}

        {/* Engagement Chart */}
        {selectedCampaign && (
          <CampaignMetricsChart campaign={selectedCampaign} />
        )}

        <CampaignList />
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: '250px',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRight: '1px solid #ddd',
  minHeight: '100vh',
};

const liStyle = {
  listStyleType: 'disc',
  padding: '5px 0',
  fontSize: '14px',
};

const addButtonStyle = {
  backgroundColor: '#007BFF',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
};

const mainContentStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
};
