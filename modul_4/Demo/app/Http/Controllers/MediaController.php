<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MediaController extends Controller
{
    /**
     * Tampilkan daftar media dengan filter opsional dan pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Media::query()->with('users');

        // Filter opsional: pencarian judul (LIKE)
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->query('search') . '%');
        }

        // Filter opsional: aura (exact match)
        if ($request->filled('aura')) {
            $query->where('aura', $request->query('aura'));
        }

        // Filter opsional: type (exact match)
        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        return MediaResource::collection($query->paginate(10));
    }

    /**
     * Buat data media baru.
     */
    public function store(StoreMediaRequest $request): JsonResponse
    {
        $media = Media::create($request->validated());

        return (new MediaResource($media))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Detail satu media beserta pengguna yang mengoleksinya.
     */
    public function show(Media $media): MediaResource
    {
        // Eager load relasi users agar dimuat oleh whenLoaded
        return new MediaResource($media->load('users'));
    }

    /**
     * Perbarui data media (PATCH).
     */
    public function update(StoreMediaRequest $request, Media $media): JsonResponse
    {
        $media->update($request->validated());

        return (new MediaResource($media))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Hapus data media.
     */
    public function destroy(Media $media): JsonResponse
    {
        $media->delete();

        return response()->json([
            'message' => 'Media berhasil dihapus.',
        ], 200);
    }
}
