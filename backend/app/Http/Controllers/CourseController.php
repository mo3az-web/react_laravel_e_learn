<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
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

    public function showCourses()
    {
        $courses = Course::latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'lessons' => 'nullable|array',
            'lessons.*.title' => 'required|string|max:255',
            'lessons.*.desc' => 'nullable|string',
            'lessons.*.thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        return DB::transaction(function () use ($request) {
            $courseThumbnail = $request->file('thumbnail')
                ->store('courses/thumbnails', 'public');

            $course = Course::create([
                'title' => $request->title,
                'description' => $request->description,
                'thumbnail' => $courseThumbnail,
                'created_by' => auth()->id(),
            ]);

            if ($request->has('lessons')) {
                foreach ($request->lessons as $index => $lesson) {
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

    public function destroy($id)
    {
        $course = Course::with('lessons')->findOrFail($id);

        DB::transaction(function () use ($course) {
            Storage::disk('public')->delete($course->thumbnail);
            $course->delete();
        });

        return response()->json([
            'message' => 'Course and all related lessons deleted'
        ]);
    }
}