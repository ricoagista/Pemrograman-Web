@extends('layouts.app')

@section('title', 'Koleksi Media - FlipPlay')

@section('content')
  <div class="bg-[#f5f5f7] py-16 px-6 min-h-[calc(100vh-44px-180px)]">
    <div class="max-w-6xl mx-auto space-y-10">

      <!-- Header Section -->
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <p class="text-[13px] font-semibold text-[#0066cc] uppercase tracking-wider">
          Personal Library
        </p>
        <h1 class="text-3xl lg:text-[40px] font-semibold text-[#1d1d1f] leading-[1.10] tracking-[-0.28px]">
          Koleksi Pengguna
        </h1>
        <p class="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
          Pilih profil pengguna untuk melihat dan mengelola anime serta manga yang telah disimpan ke dalam koleksi pribadi.
        </p>
      </div>

      <!-- User Selector (Rico ID 1, Alice ID 2, Bob ID 3) -->
      <div class="flex flex-col items-center gap-3">
        <span class="text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wider">
          Pilih Profil Pengguna:
        </span>
        <div class="inline-flex p-1 rounded-full bg-white border border-[#e0e0e0] shadow-sm gap-1">
          <button
            type="button"
            data-user-id="1"
            class="user-select-btn active px-5 py-2 rounded-full text-[14px] font-medium transition bg-[#0066cc] text-white"
          >
            Rico (ID: 1)
          </button>
          <button
            type="button"
            data-user-id="2"
            class="user-select-btn px-5 py-2 rounded-full text-[14px] font-medium transition text-[#1d1d1f] hover:bg-[#f5f5f7]"
          >
            Alice (ID: 2)
          </button>
          <button
            type="button"
            data-user-id="3"
            class="user-select-btn px-5 py-2 rounded-full text-[14px] font-medium transition text-[#1d1d1f] hover:bg-[#f5f5f7]"
          >
            Bob (ID: 3)
          </button>
        </div>
      </div>

      <!-- User Summary Card -->
      <div class="max-w-xl mx-auto bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-4">
          <div id="user-avatar" class="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            R
          </div>
          <div>
            <h2 id="user-display-name" class="text-[18px] font-semibold text-[#1d1d1f]">Rico</h2>
            <p id="user-display-email" class="text-[13px] text-[#7a7a7a]">rico@flipplay.test</p>
          </div>
        </div>
        <div>
          <span id="collection-count-badge" class="px-3 py-1 rounded-full text-[13px] font-semibold bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f]">
            0 Media
          </span>
        </div>
      </div>

      <!-- Loading, Error & Empty State Indicators -->
      <div id="collection-loading" class="text-center py-16 text-[#7a7a7a] font-medium">
        <div class="inline-block animate-spin w-6 h-6 border-2 border-[#0066cc] border-t-transparent rounded-full mb-3"></div>
        <div>Mengambil koleksi dari REST API...</div>
      </div>

      <div id="collection-error" class="text-center py-16 text-rose-600 font-medium hidden">
        <p class="text-lg font-semibold mb-1">Gagal Memuat Koleksi</p>
        <p class="text-[14px] text-[#7a7a7a]">Terjadi kesalahan saat memuat data koleksi dari endpoint API.</p>
        <button id="collection-retry-btn" class="mt-4 px-5 py-2 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] rounded-full transition">
          Coba Lagi
        </button>
      </div>

      <div id="collection-empty" class="text-center py-20 bg-white border border-[#e0e0e0] rounded-[18px] max-w-2xl mx-auto p-8 hidden">
        <div class="w-16 h-16 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#7a7a7a]">
          📂
        </div>
        <h3 class="text-2xl font-semibold text-[#1d1d1f] mb-2">Koleksi Masih Kosong</h3>
        <p class="text-[15px] text-[#7a7a7a] max-w-md mx-auto mb-6">
          Pengguna ini belum menambahkan anime atau manga ke dalam pustaka koleksinya.
        </p>
        <a href="{{ url('/#vibe-grid') }}" class="inline-flex items-center justify-center px-6 py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[15px] font-medium rounded-full active:scale-95 transition">
          Jelajahi The Vibe Grid
        </a>
      </div>

      <!-- Collection Media Grid -->
      <div id="collection-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Rendered by collection.js via GET /api/users/{id}/collection -->
      </div>

    </div>
  </div>
@endsection

@section('scripts')
  @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @vite(['resources/js/collection.js'])
  @else
    <script type="module" src="{{ asset('js/collection.js') }}"></script>
  @endif
@endsection
