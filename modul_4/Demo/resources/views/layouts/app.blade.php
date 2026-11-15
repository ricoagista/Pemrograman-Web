<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'FlipPlay - Platform Hiburan Digital Terpadu')</title>
  
  <!-- Tailwind CSS Browser CDN (Sesuai Desain Modul 2) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- Vite Asset Loading -->
  @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @vite(['resources/css/app.css', 'resources/js/app.js'])
  @else
    <script type="module" src="{{ asset('js/app.js') }}"></script>
  @endif

  @yield('styles')
</head>
<body class="bg-white text-[#1d1d1f] font-['SF_Pro_Text',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] antialiased min-h-screen flex flex-col selection:bg-[#0066cc] selection:text-white">

  <!-- 1. Header & Navigation (Global Nav Apple style: 44px pure black bar) -->
  <header class="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#333333]">
    <nav class="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a href="{{ url('/') }}" class="text-[14px] font-semibold tracking-tight text-white hover:text-[#cccccc] transition">
          FlipPlay
        </a>
      </div>

      <div class="flex items-center gap-6 text-[12px] text-[#cccccc]">
        <a href="{{ url('/') }}" class="hover:text-white transition">Home</a>
        <a href="{{ url('/#fitur') }}" class="hover:text-white transition">Fitur</a>
        <a href="{{ url('/#vibe-grid') }}" class="hover:text-white transition">Vibe Grid</a>
        <a href="{{ url('/collection') }}" class="hover:text-white transition font-medium">Collection</a>

        <!-- Quick User Switcher in Nav -->
        <div class="hidden sm:flex items-center gap-2 border-l border-[#333333] pl-4 ml-2">
          <span class="text-[11px] text-[#7a7a7a]">User:</span>
          <select id="navbar-user-select" class="bg-[#1a1a1a] text-white text-[12px] rounded-full px-2.5 py-0.5 border border-[#333333] focus:outline-none focus:border-[#0066cc] cursor-pointer transition">
            <option value="1">Rico</option>
            <option value="2">Alice</option>
            <option value="3">Bob</option>
          </select>
        </div>
      </div>
    </nav>
  </header>

  <!-- 2. Main Content Slot -->
  <main class="flex-1">
    @yield('content')
  </main>

  <!-- 3. Apple-style Minimalist Footer -->
  <footer class="bg-[#f5f5f7] border-t border-[#e0e0e0] py-16 text-center text-[12px] text-[#7a7a7a]">
    <div class="max-w-6xl mx-auto px-6 space-y-3">
      <p class="text-[14px] font-semibold text-[#333333]">FlipPlay Digital Entertainment</p>
      <p>Katalog anime &amp; manga terpadu dengan integrasi RESTful API Laravel 12.</p>
      <p>&copy; 2026 FlipPlay. All rights reserved.</p>
    </div>
  </footer>

  <!-- Toast Notification Container -->
  <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"></div>

  @yield('scripts')
</body>
</html>
