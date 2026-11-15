<?php

namespace App\Http\Controllers;

use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserCollectionController extends Controller
{
    /**
     * Tampilkan koleksi media milik user.
     */
    public function index(User $user): AnonymousResourceCollection
    {
        return MediaResource::collection($user->media);
    }

    /**
     * Tambahkan media ke dalam koleksi user.
     */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ], [
            'media_id.required' => 'ID media wajib diisi.',
            'media_id.exists' => 'Media tidak ditemukan.',
        ]);

        $mediaId = (int) $validated['media_id'];

        // Cek apakah media sudah ada di koleksi user
        if ($user->media()->where('media.id', $mediaId)->exists()) {
            return response()->json([
                'message' => 'Media sudah ada di koleksi.',
            ], 409);
        }

        $user->media()->attach($mediaId);

        return response()->json([
            'message' => 'Media berhasil ditambahkan ke koleksi.',
        ], 201);
    }

    /**
     * Hapus media dari koleksi user.
     */
    public function destroy(User $user, Media $media): JsonResponse
    {
        // Cek apakah media benar-benar ada di koleksi user
        if (! $user->media()->where('media.id', $media->id)->exists()) {
            return response()->json([
                'message' => 'Media tidak ditemukan dalam koleksi user.',
            ], 404);
        }

        $user->media()->detach($media->id);

        return response()->json([
            'message' => 'Media berhasil dihapus dari koleksi.',
        ], 200);
    }
}
