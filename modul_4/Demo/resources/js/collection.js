import {
  escapeHtml,
  safeParseJson,
  getActiveUser,
  setActiveUserId,
  renderMediaPoster,
  showToast,
} from './app.js';

// DOM Elements
const userSelectButtons = document.querySelectorAll('.user-select-btn');
const userAvatar = document.querySelector('#user-avatar');
const userDisplayName = document.querySelector('#user-display-name');
const userDisplayEmail = document.querySelector('#user-display-email');
const collectionCountBadge = document.querySelector('#collection-count-badge');

const collectionLoading = document.querySelector('#collection-loading');
const collectionError = document.querySelector('#collection-error');
const collectionEmpty = document.querySelector('#collection-empty');
const collectionList = document.querySelector('#collection-list');
const retryBtn = document.querySelector('#collection-retry-btn');

/**
 * Updates UI of user selection buttons and profile card.
 */
function updateUserUI(user) {
  if (userAvatar) userAvatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
  if (userDisplayName) userDisplayName.textContent = user.name;
  if (userDisplayEmail) userDisplayEmail.textContent = user.email;

  userSelectButtons.forEach((btn) => {
    const isCurrent = Number(btn.dataset.userId) === user.id;
    if (isCurrent) {
      btn.className =
        'user-select-btn active px-5 py-2 rounded-full text-[14px] font-medium transition bg-[#0066cc] text-white shadow-sm';
    } else {
      btn.className =
        'user-select-btn px-5 py-2 rounded-full text-[14px] font-medium transition text-[#1d1d1f] hover:bg-[#f5f5f7]';
    }
  });
}

/**
 * Creates HTML for a collection card.
 */
function createCollectionCard(media) {
  const posterHtml = renderMediaPoster(media);
  const safeTitle = escapeHtml(media.title);
  const safeCreator = escapeHtml(media.creator);
  const safeYear = escapeHtml(media.year);
  const safeAura = escapeHtml(media.aura);
  const safeType = escapeHtml(media.type);

  return `
    <article class="group bg-white border border-[#e0e0e0] rounded-[18px] p-4 transition duration-200 hover:border-[#cccccc] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col justify-between">
      <div>
        <div class="mb-4">
          ${posterHtml}
        </div>
        <h3 class="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-1 line-clamp-1 group-hover:text-[#0066cc] transition">
          ${safeTitle}
        </h3>
        <p class="text-[13px] text-[#7a7a7a] mb-3 line-clamp-1">Kreator: ${safeCreator}</p>
        <div class="flex items-center gap-2 mb-4 text-[12px] text-[#7a7a7a]">
          <span class="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f] font-medium">${safeYear}</span>
          <span class="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] capitalize">${safeAura}</span>
          <span class="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] uppercase font-semibold text-[10px]">${safeType}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0f0f0]">
        <a
          href="/media/${media.id}"
          class="inline-flex items-center justify-center h-9 px-3 bg-transparent border border-[#0066cc] text-[#0066cc] text-[13px] font-medium rounded-full hover:bg-[#0066cc]/5 active:scale-95 transition"
        >
          Detail
        </a>
        <button
          type="button"
          data-media-id="${media.id}"
          data-media-title="${safeTitle}"
          class="btn-remove-collection inline-flex items-center justify-center h-9 px-3 bg-transparent border border-rose-500 text-rose-600 hover:bg-rose-50 text-[13px] font-medium rounded-full active:scale-95 transition disabled:opacity-50"
        >
          Hapus
        </button>
      </div>
    </article>
  `;
}

/**
 * Fetches user's media collection from `/api/users/{id}/collection`.
 */
async function loadCollection() {
  const user = getActiveUser();
  updateUserUI(user);

  try {
    collectionLoading.classList.remove('hidden');
    collectionError.classList.add('hidden');
    collectionEmpty.classList.add('hidden');
    collectionList.innerHTML = '';

    const res = await fetch(`/api/users/${user.id}/collection`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const json = await safeParseJson(res);
    const items = json && Array.isArray(json.data) ? json.data : [];

    if (collectionCountBadge) {
      collectionCountBadge.textContent = `${items.length} Media Tersimpan`;
    }

    if (items.length === 0) {
      collectionEmpty.classList.remove('hidden');
      collectionList.innerHTML = '';
    } else {
      collectionEmpty.classList.add('hidden');
      collectionList.innerHTML = items.map(createCollectionCard).join('');
    }
  } catch (err) {
    console.error('Failed to load user collection:', err);
    collectionError.classList.remove('hidden');
  } finally {
    collectionLoading.classList.add('hidden');
  }
}

/**
 * Removes media from collection via `DELETE /api/users/{userId}/collection/{mediaId}`.
 */
async function removeMediaFromCollection(mediaId, mediaTitle) {
  const user = getActiveUser();

  try {
    const res = await fetch(`/api/users/${user.id}/collection/${mediaId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await safeParseJson(res).catch(() => ({}));

    if (res.status === 200) {
      showToast(`"${mediaTitle || 'Media'}" berhasil dihapus dari koleksi ${user.name}.`, 'success');
      await loadCollection();
    } else if (res.status === 404) {
      const msg = data && data.message ? data.message : 'Media tidak ditemukan dalam koleksi.';
      showToast(msg, 'warning');
      await loadCollection();
    } else {
      const msg = data && data.message ? data.message : 'Gagal menghapus media dari koleksi.';
      showToast(msg, 'error');
    }
  } catch (err) {
    console.error('Failed to delete media from collection:', err);
    showToast('Gagal menghubungi server REST API. Periksa jaringan Anda.', 'error');
  }
}

// User selector buttons click handling
userSelectButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedId = Number(btn.dataset.userId);
    setActiveUserId(selectedId);
    loadCollection();
  });
});

// Remove button click handling in collection grid
collectionList.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-remove-collection');
  if (!btn) return;

  const mediaId = btn.dataset.mediaId;
  const mediaTitle = btn.dataset.mediaTitle;

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="inline-block animate-spin w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full"></span>`;

  try {
    await removeMediaFromCollection(mediaId, mediaTitle);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
});

// Retry button listener
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    loadCollection();
  });
}

// Listen to user change from navbar
window.addEventListener('flipplay:user-changed', () => {
  loadCollection();
});

// Initial load
loadCollection();
