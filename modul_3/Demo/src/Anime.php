<?php
namespace App;
class Anime extends Media {
    public function getLabel(): string { return 'Anime'; }
    public function getAction(): string { return 'Menonton'; }
}
