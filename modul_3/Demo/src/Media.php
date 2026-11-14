<?php
// Menggunakan namespace untuk mengorganisasi class
namespace App;

class Media {
    // Memiliki property dan method
    // Menggunakan access modifier secara tepat
    private string $title, $creator, $aura;
    private int $year;
    // Menerapkan constructor (__construct)
    public function __construct(string $title, string $creator, int $year, string $aura) {
        $this->title = $title; $this->creator = $creator; $this->year = $year; $this->aura = $aura;
    }
    public function getTitle(): string { return $this->title; }
    public function getAura(): string { return $this->aura; }
    public function setTitle(string $t): void { $this->title = $t; }
    public function setAura(string $a): void { $this->aura = $a; }
    public function getLabel(): string { return 'Media'; }
    // Menerapkan type hinting dan return type pada method yang sesuai
    public function getAction(): string { return 'Mengonsumsi'; }
    public function getInfo(): string {
        return "[{$this->getLabel()}] {$this->title} ({$this->year}) - {$this->creator} | Aura: {$this->aura}";
    }
}
