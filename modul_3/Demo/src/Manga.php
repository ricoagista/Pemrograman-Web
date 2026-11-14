<?php
namespace App;
class Manga extends Media {
    public function getLabel(): string { return 'Manga'; }
    public function getAction(): string { return 'Membaca'; }
}
