// Simpan hasil fetch di variabel global agar tidak perlu fetch ulang saat filter berubah.
let filmsData = [];
let activeAura = "Semua";

// Referensi elemen DOM.
const searchInput = document.querySelector("#vibe-search");
const vibeList = document.querySelector("#vibe-list");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const auraButtons = document.querySelectorAll(".aura-btn");

// Kelas Tailwind untuk status tombol aura aktif dan tidak aktif.
const ACTIVE_CLASSES = ["bg-[#0066cc]", "hover:bg-[#0071e3]", "text-white"];
const INACTIVE_CLASSES = ["bg-[#e0e0e0]", "hover:bg-[#cccccc]", "text-[#1d1d1f]"];
// Semua kelas warna yang perlu dilepas sebelum menerapkan style baru.
const COLOR_CLASSES = [...ACTIVE_CLASSES, ...INACTIVE_CLASSES];

// Definisi Aura dalam satu object: nama aura -> fungsi (film) => boolean.
// API tidak punya genre, jadi aura ditentukan dari kata kunci pada description.
const AURA_FILTERS = {
  Semua: () => true,
  "High Energy": (film) => {
    const keywords = ["adventure", "pirate", "battle", "fight", "war", "sky", "journey"];
    const description = (film.description || "").toLowerCase();
    return keywords.some((keyword) => description.includes(keyword));
  },
  Melancholy: (film) => {
    const keywords = ["orphan", "death", "mother", "lost", "memories", "survive", "curse"];
    const description = (film.description || "").toLowerCase();
    return keywords.some((keyword) => description.includes(keyword));
  },
  "Binge Mode": (film) => Number(film.running_time) >= 120,
};

// Ambil data dari Ghibli API, lalu render ke grid.
const fetchFilms = async () => {
  try {
    // Tampilkan loading, sembunyikan pesan error lama.
    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    const response = await fetch("https://ghibli-api.vercel.app/api/films");

    // Cek status HTTP, lempar error jika gagal.
    if (!response.ok) {
      throw new Error(`Gagal memuat data: ${response.status}`);
    }

    // Respons berbentuk { data: [...] }, bukan array langsung.
    const { data } = await response.json();

    filmsData = data;
    renderFilms();
  } catch (error) {
    // Tampilkan pesan error jika fetch gagal.
    console.error(error);
    errorMessage.classList.remove("hidden");
    vibeList.innerHTML = "";
  } finally {
    // Loading selalu disembunyikan, baik sukses maupun gagal.
    loadingMessage.classList.add("hidden");
  }
};

// Susun HTML satu card memakai template literal.
const createCard = (film) => {
  // Poster dengan alt judul dan lazy loading.
  const poster = film.image
    ? `<img src="${film.image}" alt="${film.title}" class="w-full h-full object-cover rounded-[8px]" loading="lazy">`
    : `<div class="w-full h-full bg-[#d2d2d7] rounded-[8px] flex items-center justify-center text-[13px] text-[#7a7a7a]">Tanpa Poster</div>`;

  // Durasi dan skor dikonversi ke angka dengan Number().
  const duration = Number(film.running_time);
  const score = Number(film.rt_score);

  return `
    <article class="bg-white border border-[#e0e0e0] rounded-[18px] p-4 transition duration-200 hover:border-[#cccccc]">
      <div class="w-full h-64 mb-4 overflow-hidden">
        ${poster}
      </div>
      <h3 class="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-1 line-clamp-2">
        ${film.title}
      </h3>
      <p class="text-[13px] text-[#7a7a7a] mb-2">Sutradara: ${film.director}</p>
      <div class="flex items-center justify-between text-[13px] text-[#1d1d1f]">
        <span>${film.release_date}</span>
        <span>${duration} menit</span>
        <span>&#9733; ${score}</span>
      </div>
    </article>
  `;
};

// Filter data berdasarkan search dan aura, lalu render ulang ke grid.
const renderFilms = () => {
  const keyword = searchInput.value.toLowerCase();
  const auraFilter = AURA_FILTERS[activeAura];

  const filtered = filmsData
    .filter(auraFilter)
    .filter((film) => film.title.toLowerCase().includes(keyword));

  vibeList.innerHTML = filtered.map(createCard).join("");
};

// Event input: filter judul secara real-time (tidak case-sensitive).
searchInput.addEventListener("input", renderFilms);

// Event click: ganti aura aktif dan ubah style tombol.
auraButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeAura = button.dataset.aura;

    // Setiap tombol dilepas dari kelas warna lama, lalu diatur ulang.
    auraButtons.forEach((btn) => {
      btn.classList.remove(...COLOR_CLASSES);
      btn.classList.add(...(btn === button ? ACTIVE_CLASSES : INACTIVE_CLASSES));
    });

    // Render ulang dari data yang sudah ada (tanpa fetch ulang).
    renderFilms();
  });
});

// Muat data saat halaman siap.
fetchFilms();
