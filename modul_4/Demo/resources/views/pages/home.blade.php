@extends('layouts.app')

@section('title', 'FlipPlay - Discover Stories. Find Your Vibe.')

@section('content')
  <!-- 1. Hero Section (Product Tile Light: pure white canvas, tight tracking, system product drop-shadow) -->
  <section id="hero" class="bg-white py-20 px-6">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <p class="text-[14px] font-semibold text-[#0066cc] tracking-wide uppercase">
          All-in-One Entertainment
        </p>
        <h1 class="text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] text-[#1d1d1f]">
          Discover Stories.<br>Find Your Vibe.
        </h1>
        <p class="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px] max-w-xl">
          Jelajahi koleksi anime dan manga, temukan cerita sesuai mood, dan simpan media favoritmu di satu tempat.
        </p>
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <!-- button-primary: Action Blue pill -->
          <a href="#vibe-grid" class="inline-flex items-center justify-center bg-[#0066cc] hover:bg-[#0071e3] text-white text-[17px] font-normal px-[22px] py-[11px] rounded-full active:scale-95 transition">
            Explore Media
          </a>
          <!-- button-secondary-pill: Ghost Action Blue pill -->
          <a href="{{ url('/collection') }}" class="inline-flex items-center justify-center bg-transparent border border-[#0066cc] text-[#0066cc] text-[17px] font-normal px-[22px] py-[11px] rounded-full active:scale-95 transition">
            My Collection
          </a>
        </div>
      </div>
      <div class="flex justify-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhJqkC0PlwMZyeUIVsHyiwyCMeoO3FAb8in1ZnVJWS05stEuVuUZN_9g&s=10"
          alt="Preview Platform Hiburan FlipPlay"
          class="w-full max-w-lg object-cover rounded-[18px] shadow-[3px_5px_30px_rgba(0,0,0,0.22)]"
          loading="lazy"
        >
      </div>
    </div>
  </section>

  <!-- 2. Fitur Section (Parchment background alternating rhythm, Store Utility Cards 18px radius) -->
  <section id="fitur" class="bg-[#f5f5f7] py-20 px-6 border-t border-[#e0e0e0]">
    <div class="max-w-6xl mx-auto space-y-12">
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <h2 class="text-3xl lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.10] tracking-[-0.28px]">
          Semua Hiburan Favoritmu dalam Satu Tempat
        </h2>
        <p class="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
          Jelajahi koleksi anime dan manga pilihan yang terhubung langsung dengan RESTful API FlipPlay.
        </p>
      </div>

      <!-- 3-column store-utility-card grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <article class="bg-white border border-[#e0e0e0] rounded-[18px] p-6 transition duration-200 hover:border-[#cccccc]">
          <img
            src="https://i.pinimg.com/736x/5d/7c/32/5d7c3234244ad48955c4ee98f5a59907.jpg"
            alt="Anime Collection di FlipPlay"
            class="w-full h-48 object-cover rounded-[8px] mb-6"
            loading="lazy"
          >
          <h3 class="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
            Anime Collection
          </h3>
          <p class="text-[14px] text-[#7a7a7a] leading-[1.43] tracking-[-0.224px]">
            Koleksi anime klasik dan terbaru dari berbagai sutradara ternama dengan klasifikasi aura suasana.
          </p>
        </article>

        <!-- Card 2 -->
        <article class="bg-white border border-[#e0e0e0] rounded-[18px] p-6 transition duration-200 hover:border-[#cccccc]">
          <img
            src="https://i.pinimg.com/736x/ba/19/af/ba19afe8fd6aa94a94832eee83463f9b.jpg"
            alt="Manga Collection di FlipPlay"
            class="w-full h-48 object-cover rounded-[8px] mb-6"
            loading="lazy"
          >
          <h3 class="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
            Manga Collection
          </h3>
          <p class="text-[14px] text-[#7a7a7a] leading-[1.43] tracking-[-0.224px]">
            Serial manga dan komik pilihan dari beragam mangaka terpopuler untuk menemani berbagai momen harimu.
          </p>
        </article>

        <!-- Card 3 -->
        <article class="bg-white border border-[#e0e0e0] rounded-[18px] p-6 transition duration-200 hover:border-[#cccccc]">
          <img
            src="https://i.pinimg.com/1200x/eb/fb/ed/ebfbed1aeb973d84ce3dbfcec413eece.jpg"
            alt="Personal Library di FlipPlay"
            class="w-full h-48 object-cover rounded-[8px] mb-6"
            loading="lazy"
          >
          <h3 class="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
            Personal Library
          </h3>
          <p class="text-[14px] text-[#7a7a7a] leading-[1.43] tracking-[-0.224px]">
            Simpan dan kelola media favoritmu ke dalam pustaka pribadi untuk setiap akun dengan integrasi data instan.
          </p>
        </article>
      </div>
    </div>
  </section>

  <!-- 3. The Vibe Grid Section -->
  <section id="vibe-grid" class="bg-white py-20 px-6 border-t border-[#e0e0e0]">
    <div class="max-w-6xl mx-auto space-y-10">
      <!-- Judul + subjudul singkat -->
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <h2 class="text-3xl lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.10] tracking-[-0.28px]">
          The Vibe Grid
        </h2>
        <p class="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
          Temukan anime dan manga favoritmu berdasarkan mood dan energi. Cari judul atau filter berdasarkan aura dan tipe media.
        </p>

        <!-- Active User Status Pill -->
        <div class="pt-2 flex items-center justify-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[13px] text-[#7a7a7a]">
            <span>Menambahkan sebagai:</span>
            <span id="vibe-active-user-name" class="font-semibold text-[#1d1d1f]">Rico (ID: 1)</span>
            <span class="text-[#cccccc]">•</span>
            <a href="{{ url('/collection') }}" class="text-[#0066cc] hover:text-[#0071e3] font-medium transition">
              Kelola Koleksi
            </a>
          </div>
        </div>
      </div>

      <!-- Unified Search -->
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input
            type="text"
            id="vibe-search"
            placeholder="Cari judul anime atau manga..."
            class="w-full h-12 pl-12 pr-6 bg-white border border-[#e0e0e0] rounded-full text-[17px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition"
          >
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7a7a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Filter Controls: Aura & Type -->
      <div class="space-y-4 max-w-3xl mx-auto">
        <!-- Aura Filter Row -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <span class="text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wider mr-2">Aura:</span>
          <button type="button" data-aura="Semua" class="aura-btn active px-4 py-1.5 bg-[#0066cc] text-white text-[13px] font-medium rounded-full hover:bg-[#0071e3] transition border border-transparent">
            Semua
          </button>
          <button type="button" data-aura="Cozy" class="aura-btn px-4 py-1.5 bg-[#e0e0e0] text-[#1d1d1f] text-[13px] font-medium rounded-full hover:bg-[#cccccc] transition border border-transparent">
            Cozy
          </button>
          <button type="button" data-aura="High Energy" class="aura-btn px-4 py-1.5 bg-[#e0e0e0] text-[#1d1d1f] text-[13px] font-medium rounded-full hover:bg-[#cccccc] transition border border-transparent">
            High Energy
          </button>
          <button type="button" data-aura="Melancholy" class="aura-btn px-4 py-1.5 bg-[#e0e0e0] text-[#1d1d1f] text-[13px] font-medium rounded-full hover:bg-[#cccccc] transition border border-transparent">
            Melancholy
          </button>
        </div>

        <!-- Type Filter Row -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <span class="text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wider mr-2">Tipe:</span>
          <button type="button" data-type="Semua" class="type-btn active px-4 py-1.5 bg-[#0066cc] text-white text-[13px] font-medium rounded-full hover:bg-[#0071e3] transition border border-transparent">
            Semua
          </button>
          <button type="button" data-type="anime" class="type-btn px-4 py-1.5 bg-[#e0e0e0] text-[#1d1d1f] text-[13px] font-medium rounded-full hover:bg-[#cccccc] transition border border-transparent">
            Anime
          </button>
          <button type="button" data-type="manga" class="type-btn px-4 py-1.5 bg-[#e0e0e0] text-[#1d1d1f] text-[13px] font-medium rounded-full hover:bg-[#cccccc] transition border border-transparent">
            Manga
          </button>
        </div>
      </div>

      <!-- Loading, Error & Empty States -->
      <div id="loading-message" class="text-center py-12 text-[#7a7a7a] font-medium hidden">
        <div class="inline-block animate-spin w-6 h-6 border-2 border-[#0066cc] border-t-transparent rounded-full mb-3"></div>
        <div>Memuat data media dari REST API...</div>
      </div>

      <div id="error-message" class="text-center py-12 text-rose-600 font-medium hidden">
        <p class="text-lg font-semibold mb-1">Gagal Mengambil Data</p>
        <p class="text-[14px] text-[#7a7a7a]">Terjadi kendala saat menghubungi server REST API. Silakan coba kembali.</p>
        <button id="retry-btn" class="mt-4 px-5 py-2 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] rounded-full transition">
          Coba Lagi
        </button>
      </div>

      <div id="empty-message" class="text-center py-16 text-[#7a7a7a] hidden">
        <div class="w-12 h-12 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center mx-auto mb-3 text-lg font-bold text-[#7a7a7a]">
          ∅
        </div>
        <p class="text-lg font-semibold text-[#1d1d1f] mb-1">Tidak Ada Media Ditemukan</p>
        <p class="text-[14px]">Coba ubah kata kunci pencarian atau sesuaikan filter aura dan tipe.</p>
      </div>

      <!-- Grid Cards -->
      <div id="vibe-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        <!-- Rendered by home.js via REST API -->
      </div>

      <!-- Pagination -->
      <div id="vibe-pagination" class="flex items-center justify-center gap-3 pt-6 hidden">
        <!-- Pagination buttons rendered by home.js -->
      </div>
    </div>
  </section>
@endsection

@section('scripts')
  @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @vite(['resources/js/home.js'])
  @else
    <script type="module" src="{{ asset('js/home.js') }}"></script>
  @endif
@endsection
