<?php

namespace App\Http\Controllers;
use  App\Models\Quiz;
use App\Models\Question;
use App\Models\Choice;
use Illuminate\Http\Request;

class quizController extends Controller
{
    public function addQuiz(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'lesson_id' => 'required'
        ]);

        $quiz = Quiz::create($validated);

        return response()->json([
            'message' => 'quiz added successfully',
            'data' => $quiz
        ], 201);
    }

    public function addQuestions(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question' => 'required|string|max:255',
        ]);

        $quiz = Quiz::findOrFail($validated['quiz_id']);

        $quiz->questions()->create([
            'question' => $validated['question']
        ]);

        return response()->json([
            'message' => 'question added!',
        ]);
    }

    public function addChoices(Request $request)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'choice' => 'required|string|max:255',
            'is_true' => 'boolean'
        ]);

        $question = Question::findOrFail($validated['question_id']);

        $question->choices()->create([
            'choice' => $validated['choice'],
            'is_true' => $request->boolean('is_true')
        ]);

        return response()->json([
            'message' => 'choice added',
        ]);
    }
}