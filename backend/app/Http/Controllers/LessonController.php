<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function showLessons($courseId)
    {
        $course = Course::findOrFail($courseId);

        $lessons = $course->lessons()->get();

        return response()->json([
            'status'  => true,
            'lessons' => $lessons,
        ]);
    }

    public function addLesson(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title'     => 'required|string|max:255',
            'video_url' => 'required|url',
            'duration'  => 'required|integer|min:1',
            'is_free'   => 'boolean',
            'order'     => 'nullable|integer|min:0',
        ]);

        // auto-assign order if not provided
        if (empty($validated['order'])) {
            $maxOrder = Lesson::where('course_id', $validated['course_id'])->max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        $lesson = Lesson::create($validated);

        return response()->json([
            'status'  => true,
            'message' => 'تم إضافة الدرس بنجاح',
            'lesson'  => $lesson,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);

        $validated = $request->validate([
            'title'     => 'sometimes|string|max:255',
            'video_url' => 'sometimes|url',
            'duration'  => 'sometimes|integer|min:1',
            'is_free'   => 'sometimes|boolean',
            'order'     => 'sometimes|integer|min:0',
        ]);

        $lesson->update($validated);

        return response()->json([
            'status'  => true,
            'message' => 'تم تحديث الدرس',
            'lesson'  => $lesson,
        ]);
    }

    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json([
            'status'  => true,
            'message' => 'تم حذف الدرس',
        ]);
    }
}