<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\UserCollectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// CRUD Media (parameters wajib agar route model binding {media} tidak menjadi {medium})
Route::apiResource('media', MediaController::class)->parameters(['media' => 'media']);

// Koleksi pengguna
Route::get('/users/{user}/collection', [UserCollectionController::class, 'index']);
Route::post('/users/{user}/collection', [UserCollectionController::class, 'store']);
Route::delete('/users/{user}/collection/{media}', [UserCollectionController::class, 'destroy']);
