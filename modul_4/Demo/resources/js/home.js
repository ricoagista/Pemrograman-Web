import {
  escapeHtml,
  safeParseJson,
  getActiveUser,
  renderMediaPoster,
  addMediaToCollection,
} from './app.js';

// State management
let activeAura = 'Semua';
let activeType = 'Semua';
let searchKeyword = '';
let currentPage = 1;
let currentRequestId = 0;
let debounceTimer = null;

// DOM Elements
const searchInput = document.querySelector('#vibe-search');
const vibeList = document.querySelector('#vibe-list');
const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');
const emptyMessage = document.querySelector('#empty-message');
const paginationContainer = document.querySelector('#vibe-pagination');
const retryBtn = document.querySelector('#retry-btn');
const activeUserLabel = document.querySelector('#vibe-active-user-name');

const auraButtons = document.querySelectorAll('.aura-btn');
const typeButtons = document.querySelectorAll('.type-btn');

// Styling classes for button states
const ACTIVE_CLASSES = ['bg-[#0066cc]', 'hover:bg-[#0071e3]', 'text-white'];
const INACTIVE_CLASSES = ['bg-[#e0e0e0]', 'hover:bg-[#cccccc]', 'text-[#1d1d1f]'];
const COLOR_CLASSES = [...ACTIVE_CLASSES, ...INACTIVE_CLASSES];

/**
 * Updates the user indicator pill above the search bar.
 */
function updateActiveUserDisplay() {
  if (!activeUserLabel) return;
  const user = getActiveUser();
  activeUserLabel.textContent = `${user.name} (ID: ${user.id})`;
}

/**
 * Creates HTML for a single media card.
 */
function createCard(media) {
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
          class="btn-add-collection inline-flex items-center justify-center h-9 px-3 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium rounded-full active:scale-95 transition disabled:opacity-50"
        >
          + Koleksi
        </button>
      </div>
    </article>
  `;
}

/**
 * Renders pagination controls based on Laravel API meta/links.
 */
function renderPagination(meta, links) {
  if (!paginationContainer) return;

  if (!meta || meta.last_page <= 1) {
    paginationContainer.classList.add('hidden');
    paginationContainer.innerHTML = '';
    return;
  }

  paginationContainer.classList.remove('hidden');

  const prevDisabled = !links || !links.prev;
  const nextDisabled = !links || !links.next;

  paginationContainer.innerHTML = `
    <button
      id="btn-prev-page"
      ${prevDisabled ? 'disabled' : ''}
      class="px-4 py-1.5 rounded-full text-[13px] font-medium border border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-40 disabled:pointer-events-none transition"
    >
      &larr; Sebelumnya
    </button>
    <span class="text-[13px] text-[#7a7a7a] font-medium px-2">
      Halaman ${meta.current_page} dari ${meta.last_page} (${meta.total} media)
    </span>
    <button
      id="btn-next-page"
      ${nextDisabled ? 'disabled' : ''}
      class="px-4 py-1.5 rounded-full text-[13px] font-medium border border-[#e0e0e0] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-40 disabled:pointer-events-none transition"
    >
      Berikutnya &rarr;
    </button>
  `;

  const prevBtn = paginationContainer.querySelector('#btn-prev-page');
  const nextBtn = paginationContainer.querySelector('#btn-next-page');

  if (prevBtn && !prevDisabled) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchMedia();
      }
    });
  }

  if (nextBtn && !nextDisabled) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < meta.last_page) {
        currentPage++;
        fetchMedia();
      }
    });
  }
}

/**
 * Fetches media list from `/api/media` combining search, aura, type, and pagination.
 */
async function fetchMedia() {
  const thisRequestId = ++currentRequestId;

  try {
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    emptyMessage.classList.add('hidden');

    const params = new URLSearchParams();
    if (searchKeyword.trim()) {
      params.append('search', searchKeyword.trim());
    }
    if (activeAura !== 'Semua') {
      params.append('aura', activeAura);
    }
    if (activeType !== 'Semua') {
      params.append('type', activeType);
    }
    if (currentPage > 1) {
      params.append('page', String(currentPage));
    }

    const url = `/api/media${params.toString() ? '?' + params.toString() : ''}`;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    // Check for race conditions
    if (thisRequestId !== currentRequestId) {
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const json = await safeParseJson(res);
    const items = json && Array.isArray(json.data) ? json.data : [];

    if (items.length === 0) {
      vibeList.innerHTML = '';
      emptyMessage.classList.remove('hidden');
      if (paginationContainer) paginationContainer.classList.add('hidden');
    } else {
      vibeList.innerHTML = items.map(createCard).join('');
      renderPagination(json.meta, json.links);
    }
  } catch (err) {
    if (thisRequestId !== currentRequestId) return;
    console.error('Failed to fetch media from REST API:', err);
    vibeList.innerHTML = '';
    errorMessage.classList.remove('hidden');
    if (paginationContainer) paginationContainer.classList.add('hidden');
  } finally {
    if (thisRequestId === currentRequestId) {
      loadingMessage.classList.add('hidden');
    }
  }
}

/**
 * Handles clicks on the "Add to Collection" card buttons.
 */
vibeList.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-add-collection');
  if (!btn) return;

  const mediaId = btn.dataset.mediaId;
  const mediaTitle = btn.dataset.mediaTitle;

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="inline-block animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>`;

  try {
    await addMediaToCollection(mediaId, mediaTitle);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
});

// Search input with debounce (300ms)
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchKeyword = searchInput.value;
    currentPage = 1;
    fetchMedia();
  }, 300);
});

// Aura filter buttons
auraButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeAura = btn.dataset.aura;

    auraButtons.forEach((b) => {
      b.classList.remove(...COLOR_CLASSES);
      b.classList.add(...(b === btn ? ACTIVE_CLASSES : INACTIVE_CLASSES));
    });

    currentPage = 1;
    fetchMedia();
  });
});

// Type filter buttons
typeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeType = btn.dataset.type;

    typeButtons.forEach((b) => {
      b.classList.remove(...COLOR_CLASSES);
      b.classList.add(...(b === btn ? ACTIVE_CLASSES : INACTIVE_CLASSES));
    });

    currentPage = 1;
    fetchMedia();
  });
});

// Retry button
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    fetchMedia();
  });
}

// User changed listener
window.addEventListener('flipplay:user-changed', updateActiveUserDisplay);

// Initial setup
updateActiveUserDisplay();
fetchMedia();
