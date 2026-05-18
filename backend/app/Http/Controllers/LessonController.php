<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Course;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    /**
     * عرض تفاصيل درس معين للطالب
     * مع التأكد إن الطالب مشترك في الكورس
     */
    public function show($id)
    {
        $lesson = Lesson::with('course')->findOrFail($id);
        $user = Auth::user();

        // التأكد من وجود اشتراك فعال (بناءً على الـ ERD الخاص بك)
        $isSubscribed = $user->subscriptions()
            ->where('course_id', $lesson->course_id)
            ->where('status', 'active')
            ->exists();

        if (!$isSubscribed) {
            return response()->json([
                'message' => 'يجب الاشتراك في الكورس لمشاهدة هذا الدرس'
            ], 403);
        }

        return response()->json([
            'lesson' => $lesson,
            'next_lesson_id' => $lesson->getNextLessonId(), // ميثود مساعدة في الموديل
        ]);
    }

    /**
     * تحديث تقدم الطالب في الدرس (Mark as Watched)
     */
    public function updateProgress(Request $request, $id)
    {
        $user = Auth::user();
        
        // استخدام updateOrCreate لضمان عدم تكرار السجلات
        $progress = Progress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $id,
            ],
            [
                'watched' => true,
                'watched_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'تم تحديث التقدم بنجاح',
            'progress' => $progress
        ]);
    }
}