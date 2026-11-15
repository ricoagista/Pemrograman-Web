<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 3 pengguna (statis, salah satunya Rico)
        $rico = User::firstOrCreate(
            ['email' => 'rico@flipplay.test'],
            [
                'name' => 'Rico',
                'password' => Hash::make('password'),
            ]
        );

        $alice = User::firstOrCreate(
            ['email' => 'alice@flipplay.test'],
            [
                'name' => 'Alice',
                'password' => Hash::make('password'),
            ]
        );

        $bob = User::firstOrCreate(
            ['email' => 'bob@flipplay.test'],
            [
                'name' => 'Bob',
                'password' => Hash::make('password'),
            ]
        );

        // Media statis
        $mediaItems = [
            [
                'title' => 'Spirited Away',
                'creator' => 'Hayao Miyazaki',
                'year' => 2001,
                'aura' => 'Cozy',
                'type' => 'anime',
            ],
            [
                'title' => 'My Neighbor Totoro',
                'creator' => 'Hayao Miyazaki',
                'year' => 1988,
                'aura' => 'Cozy',
                'type' => 'anime',
            ],
            [
                'title' => 'Princess Mononoke',
                'creator' => 'Hayao Miyazaki',
                'year' => 1997,
                'aura' => 'High Energy',
                'type' => 'anime',
            ],
            [
                'title' => 'One Piece',
                'creator' => 'Eiichiro Oda',
                'year' => 1997,
                'aura' => 'High Energy',
                'type' => 'manga',
            ],
            [
                'title' => 'Spy x Family',
                'creator' => 'Tatsuya Endo',
                'year' => 2019,
                'aura' => 'Cozy',
                'type' => 'manga',
            ],
        ];

        foreach ($mediaItems as $item) {
            Media::firstOrCreate(['title' => $item['title']], $item);
        }
    }
}
