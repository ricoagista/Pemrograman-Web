<?php
require_once 'src/Media.php';
require_once 'src/Anime.php';
require_once 'src/Manga.php';
require_once 'src/Library.php';
use App\{Anime, Manga, Library};

$auras = ['High Energy'=>['adventure','battle','war','sky','journey'],
           'Melancholy'=>['orphan','death','mother','lost','memories','curse'],
           'Cozy'=>['family','friend','village','witch','neighbor']];

$lib = new Library(readline("Nama pengguna: ") ?: "Rico");
echo "Halo, ".$lib->getOwner()."!".PHP_EOL;

$json = @file_get_contents('https://ghibliapi.vercel.app/films', false,
    stream_context_create(['http'=>['timeout'=>5]]));
$films = $json ? json_decode($json, true) : null;
if (!is_array($films) || !$films) {
    $films = [['title'=>'Spirited Away','director'=>'Hayao Miyazaki','release_date'=>'2001','description'=>'A girl wanders away from her parents.'],
              ['title'=>'My Neighbor Totoro','director'=>'Hayao Miyazaki','release_date'=>'1988','description'=>'Two sisters discover their neighbor is a friendly forest spirit.'],
              ['title'=>'Princess Mononoke','director'=>'Hayao Miyazaki','release_date'=>'1997','description'=>'On a journey to find a cure, a warrior gets caught in a battle.']];
    echo "(API gagal, memakai data lokal)".PHP_EOL;
}
foreach ($films as $f) {
    $d = strtolower($f['description'] ?? ''); $a = 'Cozy';
    foreach ($auras as $name => $ks) { foreach ($ks as $k) if (str_contains($d, $k)) { $a = $name; break 2; } }
    $lib->addMedia(new Anime($f['title'], $f['director'] ?? '?', (int)($f['release_date'] ?? 0), $a));
}
$lib->addMedia(new Manga('One Piece', 'Eiichiro Oda', 1997, 'High Energy'));
$lib->addMedia(new Manga('Spy x Family', 'Tatsuya Endo', 2019, 'Cozy'));

while (true) {
    echo PHP_EOL."=== MENU ===".PHP_EOL."1. Lihat semua media".PHP_EOL."2. Cari media".PHP_EOL;
    echo "3. Tambah media baru".PHP_EOL."4. Lihat koleksi saya".PHP_EOL."0. Keluar".PHP_EOL;
    match (trim(readline("> "))) {
        '1' => (function() use ($lib) {
            $lib->listMedia();
            $n = trim(readline("Pilih nomor (0=kembali): "));
            if ($n === '0' || !($m = $lib->getMedia((int)$n-1))) { if ($n !== '0') echo "Tidak valid.".PHP_EOL; return; }
            // Menampilkan informasi detail suatu media
            echo PHP_EOL.$m->getInfo().PHP_EOL."Aksi: ".$m->getAction()." ".strtolower($m->getLabel()).PHP_EOL;
            echo "1. Simpan ke koleksi  2. ".$m->getAction()."  3. Edit  4. Hapus  0. Kembali".PHP_EOL;
            match (trim(readline(">> "))) {
                '1' => (function() use ($lib,$m) { $lib->addToCollection($m); echo "Disimpan!".PHP_EOL; })(),
                '2' => (function() use ($lib,$m) { echo $lib->getOwner()." sedang ".strtolower($m->getAction())." \"{$m->getTitle()}\"...".PHP_EOL; })(),
                '3' => (function() use ($m) {
                    $t = trim(readline("Judul baru (kosong=skip): ")); if ($t !== '') $m->setTitle($t);
                    $a = trim(readline("Aura baru (kosong=skip): ")); if ($a !== '') $m->setAura($a);
                    echo "Diupdate: ".$m->getInfo().PHP_EOL;
                })(),
                '4' => (function() use ($lib,$m,$n) {
                    if (strtolower(trim(readline("Hapus \"{$m->getTitle()}\"? (y/n): "))) === 'y')
                        { $lib->removeMedia((int)$n-1); echo "Dihapus.".PHP_EOL; }
                })(),
                default => null,
            };
        })(),
        '2' => (function() use ($lib) {
            $kw = trim(readline("Kata kunci: "));
            if ($kw === '') { echo "Kata kunci kosong.".PHP_EOL; return; }
            $res = $lib->search($kw);
            if (!$res) { echo "Tidak ditemukan.".PHP_EOL; return; }
            foreach ($res as $i => $m) echo ($i+1).". ".$m->getInfo().PHP_EOL;
        })(),
        '3' => (function() use ($lib) {
            echo "Tipe: 1. Anime  2. Manga".PHP_EOL;
            $t = trim(readline(">> ")); $title = trim(readline("Judul: "));
            $cr = trim(readline("Kreator: ")); $yr = (int)trim(readline("Tahun: "));
            $au = trim(readline("Aura: ")) ?: 'Cozy';
            if ($title === '') { echo "Judul tidak boleh kosong.".PHP_EOL; return; }
            $m = $t === '2' ? new Manga($title,$cr,$yr,$au) : new Anime($title,$cr,$yr,$au);
            $lib->addMedia($m); echo "Ditambahkan: ".$m->getInfo().PHP_EOL;
        })(),
        '4' => (function() use ($lib) { echo "Koleksi ".$lib->getOwner().":".PHP_EOL; $lib->listCollection(); })(),
        '0' => (function() { echo "Sampai jumpa!".PHP_EOL; exit; })(),
        default => (function() { echo "Pilihan tidak valid.".PHP_EOL; })(),
    };
}
