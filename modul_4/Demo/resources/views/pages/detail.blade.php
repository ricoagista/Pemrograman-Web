@extends('layouts.app')

@section('title', 'Detail Media - FlipPlay')

@section('content')
  <div class="bg-[#f5f5f7] py-12 px-6 min-h-[calc(100vh-44px-180px)]">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Top Navigation / Breadcrumb -->
      <div>
        <a href="{{ url('/') }}" class="inline-flex items-center gap-2 text-[14px] text-[#0066cc] hover:text-[#0071e3] font-medium transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Kembali ke Katalog
        </a>
      </div>

      <!-- Detail Card Container -->
      <div id="detail-card" data-media-id="{{ $id }}" class="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sm:p-10 shadow-sm transition">
        
        <!-- Loading State -->
        <div id="detail-loading" class="text-center py-20 text-[#7a7a7a] font-medium">
          <div class="inline-block animate-spin w-8 h-8 border-2 border-[#0066cc] border-t-transparent rounded-full mb-3"></div>
          <div>Mengambil data detail media dari API...</div>
        </div>

        <!-- Error / 404 State -->
        <div id="detail-error" class="text-center py-16 hidden">
          <div class="w-16 h-16 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#7a7a7a]">
            !
          </div>
          <h2 id="error-title" class="text-2xl font-semibold text-[#1d1d1f] mb-2">Media Tidak Ditemukan</h2>
          <p id="error-desc" class="text-[15px] text-[#7a7a7a] max-w-md mx-auto mb-6">
            Media dengan ID {{ $id }} tidak ditemukan dalam katalog sistem FlipPlay.
          </p>
          <a href="{{ url('/') }}" class="inline-flex items-center justify-center px-6 py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[15px] rounded-full transition active:scale-95">
            Kembali ke Beranda
          </a>
        </div>

        <!-- Detail Content (Populated via JS) -->
        <div id="detail-content" class="hidden">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <!-- Left Poster Placeholder -->
            <div id="detail-poster-wrapper" class="md:col-span-5">
              <!-- Rendered via renderMediaPoster -->
            </div>

            <!-- Right Details -->
            <div class="md:col-span-7 space-y-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span id="detail-type-badge" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1d1d1f] text-white">
                    ANIME
                  </span>
                  <span id="detail-aura-badge" class="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
                    Cozy
                  </span>
                </div>
                <h1 id="detail-title" class="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.28px] leading-tight">
                  Loading...
                </h1>
                <p id="detail-creator" class="text-[17px] text-[#7a7a7a] mt-1">
                  Kreator: -
                </p>
              </div>

              <!-- Key Attributes Grid -->
              <div class="grid grid-cols-2 gap-4 py-4 border-y border-[#e0e0e0] text-[14px]">
                <div>
                  <span class="text-[#7a7a7a] block text-[12px]">Tahun Rilis</span>
                  <span id="detail-year" class="font-semibold text-[#1d1d1f] text-[16px]">-</span>
                </div>
                <div>
                  <span class="text-[#7a7a7a] block text-[12px]">Format / Tipe</span>
                  <span id="detail-type-text" class="font-semibold text-[#1d1d1f] text-[16px] capitalize">-</span>
                </div>
                <div>
                  <span class="text-[#7a7a7a] block text-[12px]">Klasifikasi Aura</span>
                  <span id="detail-aura-text" class="font-semibold text-[#1d1d1f] text-[16px]">-</span>
                </div>
                <div>
                  <span class="text-[#7a7a7a] block text-[12px]">ID Katalog</span>
                  <span id="detail-id-text" class="font-semibold text-[#1d1d1f] text-[16px]">#{{ $id }}</span>
                </div>
              </div>

              <!-- Add to Collection Action -->
              <div class="pt-2">
                <button
                  type="button"
                  id="detail-add-btn"
                  class="inline-flex items-center justify-center bg-[#0066cc] hover:bg-[#0071e3] text-white text-[15px] font-medium px-6 py-2.5 rounded-full active:scale-95 transition shadow-sm"
                >
                  + Tambahkan ke Koleksi Saya
                </button>
              </div>

              <!-- Collectors List Section -->
              <div class="pt-6 border-t border-[#e0e0e0]">
                <h3 class="text-[16px] font-semibold text-[#1d1d1f] mb-3">
                  Pengguna yang Mengoleksi Media Ini
                </h3>
                <div id="detail-collectors-list" class="space-y-2">
                  <!-- Populated by JS -->
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
@endsection

@section('scripts')
  @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @vite(['resources/js/detail.js'])
  @else
    <script type="module" src="{{ asset('js/detail.js') }}"></script>
  @endif
@endsection
