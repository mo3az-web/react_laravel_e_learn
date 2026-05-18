<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Progress;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    /**
     * تسجيل أو تحديث تقدم الطالب في درس معين
     */
    public function toggleComplete(Request $request, $lessonId)
    {
        $user = Auth::user();

        // التأكد من أن الدرس موجود
        $lesson = Lesson::findOrFail($lessonId);

        // تحديث أو إنشاء سجل التقدم
        $progress = Progress::updateOrCreate(
            [
                'user_id'   => $user->id,
                'lesson_id' => $lessonId,
            ],
            [
                'watched'    => $request->status ?? true, // ممكن تبعت true أو false
                'watched_at' => now(),
            ]
        );

        // حساب نسبة الإنجاز الكلية في الكورس ده بعد التحديث
        $completionPercentage = $this->calculateCourseProgress($user->id, $lesson->course_id);

        return response()->json([
            'message' => 'Progress updated successfully',
            'watched' => $progress->watched,
            'course_completion' => $completionPercentage . '%',
        ]);
    }

    /**
     * جلب حالة التقدم لكورس كامل (عشان تظهر علامات الصح في الـ Sidebar)
     */
    public function getCourseProgress($courseId)
    {
        $user = Auth::user();

        $completedLessons = Progress::where('user_id', $user->id)
            ->whereHas('lesson', function($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->where('watched', true)
            ->pluck('lesson_id'); // هيرجع IDs الدروس اللي خلصت بس

        return response()->json([
            'completed_lessons' => $completedLessons,
            'percentage' => $this->calculateCourseProgress($user->id, $courseId)
        ]);
    }

    /**
     * Private Function لحساب النسبة المئوية
     */
    private function calculateCourseProgress($userId, $courseId)
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        
        if ($totalLessons === 0) return 0;

        $completedCount = Progress::where('user_id', $userId)
            ->where('watched', true)
            ->whereHas('lesson', function($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })->count();

        return round(($completedCount / $totalLessons) * 100);
    }
}