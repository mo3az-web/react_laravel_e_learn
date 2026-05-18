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
    
    public function showLesson($id)
    {
        $lesson = Lesson::with('course')->findOrFail($id);
        return response()->json([
            'lesson' => $lesson,
            'next_lesson_id' => $lesson->getNextLessonId(), // ميثود مساعدة في الموديل
        ]);
    }
public function showLessons($courseId)
{
    $lessons = Lesson::where('course_id', $courseId)
        ->orderBy('order')
        ->get();

    return response()->json([
        'lessons' => $lessons,
    ]);
} 
  
    public function updateProgress(Request $request, $id)
    {
        $user = Auth::user();
        
      
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
            'message' =>'fine
            ',
            'progress' => $progress
        ]);
    }
}