<?php
namespace App;
class Library {
    // Menggunakan access modifier secara tepat
    private array $mediaList = [], $collection = [];
    public function __construct(private string $owner) {}
    public function getOwner(): string { return $this->owner; }
    // Menambahkan media ke dalam library
    public function addMedia(Media $m): void { $this->mediaList[] = $m; }
    // Menampilkan daftar media yang tersedia
    public function listMedia(): void {
        foreach ($this->mediaList as $i => $m) echo ($i+1).". ".$m->getInfo().PHP_EOL;
    }
    // Mencari media berdasarkan judul
    public function search(string $kw): array {
        $kw = strtolower($kw);
        return array_values(array_filter($this->mediaList, fn(Media $m) => str_contains(strtolower($m->getTitle()), $kw)));
    }
    public function getMedia(int $i): ?Media { return $this->mediaList[$i] ?? null; }
    public function removeMedia(int $i): void { array_splice($this->mediaList, $i, 1); }
    public function addToCollection(Media $m): void {
        if (!in_array($m, $this->collection, true)) $this->collection[] = $m;
    }
    // Menampilkan koleksi media milik pengguna
    public function listCollection(): void {
        if (!$this->collection) { echo "  (kosong)".PHP_EOL; return; }
        foreach ($this->collection as $i => $m) echo "  ".($i+1).". ".$m->getInfo().PHP_EOL;
    }
}
