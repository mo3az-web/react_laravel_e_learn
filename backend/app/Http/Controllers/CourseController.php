<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{


// get course  
public function showCourse($id)
{
    $course = Course::with('lessons')->find($id);

    if (!$course) {
        return response()->json([
            'message' => 'Course not found'
        ], 404);
    }

    return response()->json([
        'data' => $course
    ]);
}

    // show courses for both users and admin
public function showCourses()
{
    // getting courses
    $courses = Course::latest()->paginate(20);

    return response()->json([
        
    'status' => 'success',
    'data'=>$courses
    ]);
}

    // 
    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',

        // lessons
        'lessons' => 'nullable|array',
        'lessons.*.title' => 'required|string|max:255',
        'lessons.*.desc' => 'nullable|string',
        'lessons.*.thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    return DB::transaction(function () use ($request) {

        // رفع صورة الكورس
        $courseThumbnail = $request->file('thumbnail')
            ->store('courses/thumbnails', 'public');

        // إنشاء الكورس
        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'thumbnail' => $courseThumbnail,
            'created_by' => auth()->id(),
        ]);

        // إنشاء الدروس
        if ($request->has('lessons')) {
            foreach ($request->lessons as $index => $lesson) {

                // رفع صورة الدرس
                $lessonThumbnail = $lesson['thumbnail']
                    ->store('courses/lessons', 'public');

                $course->lessons()->create([
                    'title' => $lesson['title'],
                    'desc' => $lesson['desc'] ?? null,
                    'thumbnail' => $lessonThumbnail,
                    'order' => $index + 1,
                ]);
            }
        }

        return response()->json([
            'message' => 'Course created successfully',
            'data' => $course->load('lessons')
        ], 201);
    });
}

    // 3. إضافة درس لكورس معين (رفع فيديو)
    public function addLesson(Request $request, $courseId)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'video_url' => 'required|url', // بقى URL مش file
        'duration' => 'nullable|string',
        'order' => 'required|integer',
    ]);

    $course = Course::findOrFail($courseId);

    $lesson = $course->lessons()->create([
        'title' => $request->title,
        'video_url' => $request->video_url, // بنخزن الرابط مباشرة
        'duration' => $request->duration,
        'order' => $request->order,
    ]);

    return response()->json([
        'message' => 'Lesson added successfully',
        'lesson' => $lesson
    ], 201);
}

    // 4. حذف كورس بالكامل مع ملفاته
    public function destroy($id)
{
    $course = Course::with('lessons')->findOrFail($id);

    DB::transaction(function () use ($course) {
        // مسح صورة الكورس بس
        Storage::disk('public')->delete($course->thumbnail);

        // مش هنمسح فيديوهات لأنهم على YouTube
        $course->delete();
    });

    return response()->json([
        'message' => 'Course and all related lessons deleted'
    ]);
}
}