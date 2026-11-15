import {
  escapeHtml,
  safeParseJson,
  renderMediaPoster,
  addMediaToCollection,
} from './app.js';

const detailCard = document.querySelector('#detail-card');
const loadingEl = document.querySelector('#detail-loading');
const errorEl = document.querySelector('#detail-error');
const contentEl = document.querySelector('#detail-content');
const posterWrapper = document.querySelector('#detail-poster-wrapper');

const titleEl = document.querySelector('#detail-title');
const creatorEl = document.querySelector('#detail-creator');
const yearEl = document.querySelector('#detail-year');
const typeTextEl = document.querySelector('#detail-type-text');
const auraTextEl = document.querySelector('#detail-aura-text');
const typeBadgeEl = document.querySelector('#detail-type-badge');
const auraBadgeEl = document.querySelector('#detail-aura-badge');
const addBtn = document.querySelector('#detail-add-btn');
const collectorsList = document.querySelector('#detail-collectors-list');

const errorTitle = document.querySelector('#error-title');
const errorDesc = document.querySelector('#error-desc');

let currentMedia = null;

async function loadMediaDetail() {
  const mediaId = detailCard ? detailCard.dataset.mediaId : null;
  if (!mediaId) return;

  try {
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    contentEl.classList.add('hidden');

    const res = await fetch(`/api/media/${mediaId}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.status === 404) {
      errorTitle.textContent = 'Media Tidak Ditemukan (404)';
      errorDesc.textContent = `Media dengan ID #${mediaId} tidak ditemukan di katalog sistem.`;
      errorEl.classList.remove('hidden');
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const json = await safeParseJson(res);
    if (!json || !json.data) {
      throw new Error('Format data media kosong atau tidak sesuai.');
    }

    const media = json.data;
    currentMedia = media;

    // Render details
    renderDetail(media);
    contentEl.classList.remove('hidden');
  } catch (err) {
    console.error('Failed to load media detail:', err);
    errorTitle.textContent = 'Gagal Memuat Data';
    errorDesc.textContent = 'Terjadi kesalahan saat memuat data media dari REST API FlipPlay.';
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
  }
}

function renderDetail(media) {
  // Update document title
  document.title = `${media.title} - FlipPlay`;

  // Render poster
  posterWrapper.innerHTML = renderMediaPoster(media);

  titleEl.textContent = media.title;
  creatorEl.textContent = `Kreator: ${media.creator}`;
  yearEl.textContent = media.year;
  typeTextEl.textContent = media.type;
  auraTextEl.textContent = media.aura;

  typeBadgeEl.textContent = (media.type || '').toUpperCase();
  auraBadgeEl.textContent = media.aura || '';

  // Render Collectors List
  renderCollectors(media.users || []);
}

function renderCollectors(users) {
  if (!collectorsList) return;

  if (!Array.isArray(users) || users.length === 0) {
    collectorsList.innerHTML = `
      <div class="p-4 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] text-[13px] text-[#7a7a7a] flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#cccccc]"></span>
        <span>Belum ada pengguna yang memasukkan media ini ke dalam koleksi mereka.</span>
      </div>
    `;
    return;
  }

  collectorsList.innerHTML = users
    .map((u) => {
      const initial = escapeHtml((u.name || 'U').charAt(0).toUpperCase());
      const safeName = escapeHtml(u.name || 'Pengguna');
      const safeEmail = escapeHtml(u.email || '');

      return `
        <div class="flex items-center justify-between p-3 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] transition hover:border-[#cccccc]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-[13px]">
              ${initial}
            </div>
            <div>
              <p class="text-[14px] font-semibold text-[#1d1d1f]">${safeName}</p>
              <p class="text-[12px] text-[#7a7a7a]">${safeEmail}</p>
            </div>
          </div>
          <span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
            Kolektor
          </span>
        </div>
      `;
    })
    .join('');
}

// Add to collection button listener
if (addBtn) {
  addBtn.addEventListener('click', async () => {
    if (!currentMedia) return;

    const originalText = addBtn.innerHTML;
    addBtn.disabled = true;
    addBtn.innerHTML = `<span class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>Menyimpan...`;

    try {
      const success = await addMediaToCollection(currentMedia.id, currentMedia.title);
      if (success) {
        // Refresh details to show user in collectors list
        await loadMediaDetail();
      }
    } finally {
      addBtn.disabled = false;
      addBtn.innerHTML = originalText;
    }
  });
}

// Initial load
loadMediaDetail();
