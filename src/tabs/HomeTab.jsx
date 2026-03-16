// src/tabs/HomeTab.jsx
// Description: Home feed tab showing active job listings filtered by keyword and user role.

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../constants/data.js';
import JobCard from '../components/jobs/JobCard.jsx';

const HomeTab = ({ jobs, apps, currentUser, keyword, onApply, onWithdraw, onOpenChat, onManage, onViewProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const filtered = jobs
    .filter(j => 
      j.status === "active" &&
      (selectedCategory === "ทั้งหมด" || j.category === selectedCategory) &&
      (!keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase())) &&
      (currentUser.role !== 'employer' || j.employerId === currentUser.id)
    )
    .sort((a, b) => b.postedAt - a.postedAt);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Filter */}
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 pb-2">
        {CATEGORIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-2 flex justify-center"><Search size={32} /></div>
              <p className="text-gray-500">ไม่พบงานที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                myApp={apps.find(a => a.jobId === job.id && a.userId === currentUser.id)}
                isOwner={currentUser.id === job.employerId}
                onApply={onApply}
                onWithdraw={onWithdraw}
                onOpenChat={onOpenChat}
                onManage={onManage}
                currentUser={currentUser}
                apps={apps}
                onViewProfile={onViewProfile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
