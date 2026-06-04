<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Progress;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    public function saveTime(Request $request, $lessonId)
    {
        $request->validate([
            'second' => 'required|integer|min:0'
        ]);

        $user = $request->user(); // 👈 Passport user

        $progress = Progress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lessonId
            ],
            [
                'last_second' => $request->second
            ]
        );

        return response()->json([
            'message' => 'time saved',
            'data' => $progress
        ]);
    }

    public function markWatched(Request $request, $id)
    {
        $request->validate([
            'second' => 'nullable|integer|min:0'
        ]);

        $user = $request->user(); // 👈 مهم جدًا

        $progress = Progress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $id
            ],
            [
                'watched' => 1,
                'watched_at' => now(),
                'last_second' => $request->second ?? 0
            ]
        );

        return response()->json([
            'message' => 'marked as watched',
            'data' => $progress
        ]);
    }
}