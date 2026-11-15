<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages.home');
});

Route::get('/media/{id}', function ($id) {
    return view('pages.detail', ['id' => $id]);
});

Route::get('/collection', function () {
    return view('pages.collection');
});

