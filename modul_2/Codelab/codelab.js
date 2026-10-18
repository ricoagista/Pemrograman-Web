// Codelab script for simple API demonstration
// Fetches users from jsonplaceholder and renders them as cards

import { normalizeItem } from './config.js';

// State
let allUsers = [];
let filteredUsers = [];

// Fetch users from JSONPlaceholder
async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    allUsers = data;
    // Filter out empty entries
    allUsers = allUsers.filter(u => u.id != null);
    filteredUsers = [...allUsers];
    renderResults();
    renderCards();
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    showError('Gagal mengunduh data. Coba lagi nanti.');
  }
}

// Render results list
function renderResults() {
  const container = document.getElementById('results-container');
  if (!container) return;

  if (filteredUsers.length === 0) {
    container.innerHTML = '<p class="text-center py-12 text-[#7a7a7a]">Tidak ada data yang cocok.</p>';
    return;
  }

  const html = filteredUsers.map(user => `
    <div class="bg-white border border-[#e0e0e0] rounded-[18px] p-6 mb-4">
      <div class="flex items-start gap-4">
        <img
          src="https://i.pinimg.com/450x270/large/placeholder-user-${user.id}.jpg"
          alt="User ${user.name}"
          class="w-16 h-16 object-cover rounded-[8px]"
        >
        <div class="flex-1">
          <h3 class="text-[15px] font-semibold text-[#1d1d1f]">${user.name}</h3>
          <p class="text-[12px] text-[#7a7a7a]">${user.email}</p>
          <p class="text-[11px] text-[#6b7280]">${user.website || '-'}</p>
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Render cards (simplified version)
function renderCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;

  if (filteredUsers.length === 0) {
    container.innerHTML = '<p class="text-center py-12 text-[#7a7a7a]">Tidak ada judul yang cocok.</p>';
    return;
  }

  const html = filteredUsers.map(user => `
    <article class="bg-white border border-[#e0e0e0] rounded-[18px] p-6">
      <div class="flex items-center gap-4">
        <img
          src="https://i.pinimg.com/450x270/large/placeholder-user-${user.id}.jpg"
          alt="User ${user.name}"
          class="w-16 h-16 object-cover rounded-[8px]"
        >
        <div class="flex-1">
          <h3 class="text-[15px] font-semibold text-[#1d1d1f]">${user.name}</h3>
          <p class="text-[12px] text-[#7a7a7a]">${user.email}</p>
        </div>
      </div>
    </article>
  `).join('');

  container.innerHTML = html;
}

// Helper functions
function showError(message) {
  // In a real app, inject into UI
  console.log('Error shown:', message);
}

// Initialize
fetchUsers();
