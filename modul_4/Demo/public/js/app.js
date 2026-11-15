// FlipPlay Shared Utilities & Core Logic

export const USERS = [
  { id: 1, name: 'Rico', email: 'rico@flipplay.test' },
  { id: 2, name: 'Alice', email: 'alice@flipplay.test' },
  { id: 3, name: 'Bob', email: 'bob@flipplay.test' },
];

/**
 * Escapes unsafe characters for secure DOM rendering.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Safely parses response as JSON, extracting JSON payload even if
 * unexpected warnings, notices or leading whitespace were prepended.
 */
export async function safeParseJson(res) {
  const text = await res.text();
  if (!text || !text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    // If PHP warnings/notices or HTML comments are prepended to JSON
    const jsonStart = text.search(/[\{\[]/);
    if (jsonStart !== -1) {
      try {
        const sanitized = text.slice(jsonStart);
        return JSON.parse(sanitized);
      } catch (fallbackErr) {
        // Fallback failed
      }
    }
    throw new Error(`Respons server bukan format JSON yang valid (HTTP ${res.status}).`);
  }
}

/**
 * Gets the current active user from localStorage (defaults to Rico ID 1).
 */
export function getActiveUser() {
  const storedId = localStorage.getItem('flipplay_active_user_id');
  const found = USERS.find((u) => u.id === Number(storedId));
  return found || USERS[0];
}

/**
 * Sets the active user in localStorage and dispatches a broadcast event.
 */
export function setActiveUserId(id) {
  const numericId = Number(id);
  localStorage.setItem('flipplay_active_user_id', numericId);
  window.dispatchEvent(
    new CustomEvent('flipplay:user-changed', {
      detail: { userId: numericId, user: getActiveUser() },
    })
  );
}

/**
 * Displays an Apple-styled toast notification pill.
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className =
      'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  const badgeBg = isSuccess
    ? 'bg-emerald-500/20 text-emerald-400'
    : isWarning
    ? 'bg-amber-500/20 text-amber-400'
    : 'bg-rose-500/20 text-rose-400';

  const icon = isSuccess ? '✓' : isWarning ? '!' : '✕';

  toast.className =
    'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full text-[14px] font-medium bg-[#000000]/95 backdrop-blur-md text-white border border-[#333333] shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 transform translate-y-3 opacity-0';

  toast.innerHTML = `
    <span class="flex items-center justify-center w-5 h-5 rounded-full ${badgeBg} text-[11px] font-bold shrink-0">${icon}</span>
    <span class="flex-1">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto dismiss after 3.2s
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Creates an aesthetic CSS-based poster placeholder based on media data and type.
 */
export function renderMediaPoster(media) {
  const isAnime = (media.type || '').toLowerCase() === 'anime';
  const aura = media.aura || 'Cozy';

  let gradientClass = 'from-slate-700 to-slate-900';
  let auraBadgeClass = 'bg-white/20 text-white backdrop-blur-sm border border-white/20';

  if (isAnime) {
    if (aura === 'Cozy') {
      gradientClass = 'from-emerald-700 via-teal-800 to-slate-950';
      auraBadgeClass = 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/40';
    } else if (aura === 'High Energy') {
      gradientClass = 'from-amber-600 via-rose-700 to-neutral-950';
      auraBadgeClass = 'bg-amber-400/25 text-amber-100 border border-amber-300/40';
    } else {
      // Melancholy
      gradientClass = 'from-indigo-700 via-purple-900 to-slate-950';
      auraBadgeClass = 'bg-indigo-400/25 text-indigo-100 border border-indigo-300/40';
    }
  } else {
    // Manga
    if (aura === 'Cozy') {
      gradientClass = 'from-stone-700 via-zinc-800 to-stone-950';
      auraBadgeClass = 'bg-stone-300/25 text-stone-100 border border-stone-300/40';
    } else if (aura === 'High Energy') {
      gradientClass = 'from-red-700 via-stone-800 to-neutral-950';
      auraBadgeClass = 'bg-rose-400/25 text-rose-100 border border-rose-300/40';
    } else {
      // Melancholy
      gradientClass = 'from-slate-800 via-zinc-900 to-black';
      auraBadgeClass = 'bg-zinc-400/25 text-zinc-100 border border-zinc-400/40';
    }
  }

  const firstLetter = escapeHtml((media.title || 'M').charAt(0).toUpperCase());
  const safeTitle = escapeHtml(media.title || 'Media');
  const safeType = escapeHtml((media.type || 'Media').toUpperCase());
  const safeYear = escapeHtml(media.year || '');
  const safeAura = escapeHtml(media.aura || 'Cozy');

  return `
    <div class="relative w-full h-56 bg-gradient-to-br ${gradientClass} rounded-[12px] p-4 flex flex-col justify-between overflow-hidden shadow-inner select-none transition group-hover:scale-[1.01] duration-300">
      <!-- Watermark letter -->
      <span class="absolute -right-4 -bottom-6 text-8xl font-black text-white/5 pointer-events-none tracking-tighter">
        ${firstLetter}
      </span>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_65%)] pointer-events-none"></div>

      <!-- Top Badges -->
      <div class="relative z-10 flex items-center justify-between gap-2">
        <span class="text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase bg-white/95 text-[#1d1d1f] shadow-sm">
          ${safeType}
        </span>
        <span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full ${auraBadgeClass}">
          ${safeAura}
        </span>
      </div>

      <!-- Center Emblem -->
      <div class="relative z-10 my-auto text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xl shadow-sm">
          ${firstLetter}
        </div>
      </div>

      <!-- Bottom Meta inside Poster -->
      <div class="relative z-10 flex items-center justify-between text-white/80 text-[11px] font-medium pt-2 border-t border-white/15">
        <span class="truncate max-w-[130px] text-white/90 font-semibold">${safeTitle}</span>
        <span>${safeYear}</span>
      </div>
    </div>
  `;
}

/**
 * Adds media to active user's collection via REST API.
 */
export async function addMediaToCollection(mediaId, mediaTitle) {
  const user = getActiveUser();
  if (!user) {
    showToast('Silakan pilih user di halaman Collection terlebih dahulu.', 'warning');
    return false;
  }

  try {
    const res = await fetch(`/api/users/${user.id}/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ media_id: Number(mediaId) }),
    });

    const data = await safeParseJson(res).catch(() => ({}));

    if (res.status === 201) {
      showToast(`"${mediaTitle || 'Media'}" berhasil ditambahkan ke koleksi ${user.name}.`, 'success');
      return true;
    } else if (res.status === 409) {
      showToast(`"${mediaTitle || 'Media'}" sudah ada di koleksi ${user.name}.`, 'warning');
      return false;
    } else if (res.status === 422) {
      const msg = data && data.message ? data.message : 'Validasi gagal.';
      showToast(msg, 'error');
      return false;
    } else if (res.status === 404) {
      const msg = data && data.message ? data.message : 'Media atau pengguna tidak ditemukan.';
      showToast(msg, 'error');
      return false;
    } else {
      const msg = data && data.message ? data.message : 'Gagal menambahkan media ke koleksi.';
      showToast(msg, 'error');
      return false;
    }
  } catch (err) {
    console.error('Network error adding to collection:', err);
    showToast('Gagal menghubungi server REST API. Periksa jaringan Anda.', 'error');
    return false;
  }
}

/**
 * Initializes navbar active user dropdown/sync.
 */
export function initNavbarUserSync() {
  const label = document.getElementById('navbar-active-user-label');
  const select = document.getElementById('navbar-user-select');

  function update() {
    const user = getActiveUser();
    if (label) label.textContent = user.name;
    if (select) select.value = String(user.id);
  }

  if (select) {
    select.addEventListener('change', (e) => {
      setActiveUserId(e.target.value);
    });
  }

  window.addEventListener('flipplay:user-changed', update);
  update();
}

// Attach globally for convenience
window.FlipPlay = {
  USERS,
  escapeHtml,
  safeParseJson,
  getActiveUser,
  setActiveUserId,
  showToast,
  renderMediaPoster,
  addMediaToCollection,
  initNavbarUserSync,
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbarUserSync();
});
