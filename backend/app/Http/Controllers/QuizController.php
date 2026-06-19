<?php

namespace App\Http\Controllers;
use  App\Models\Quiz;
use App\Models\Question;
use App\Models\Choice;
use Illuminate\Http\Request;

class QuizController extends Controller
{
//////////
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
///////////
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
///////////
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




    public function selectChoice($choice_id)
    {
   $choice = Choice::with('question')->FindOrFail($choice_id);
    
   $point = $choice->is_true ? $choice->question->question_point:0;

   studentAnswer::updateOrCreate(
    [
   'user_id'=> auth()->id(),
   'question_id' => $choice->question->id,

    ],
    [
    'choice_id' => $choice->id,
    'is_correct' => $choice-> is_true,
    'point'=> $point,
    ]
   );
     return response()->json([
        "question_point" => $points
    ]);
   }

public function submitquiz($quiz_id)
{
    $userId = auth()->id();

    $answers = StudentAnswer::where('user_id', $userId)
        ->where('quiz_id', $quiz_id)
        ->get();

    $totalScore = $answers->sum('points');

    quiz_result::updateOrCreate(
        [
            'user_id' => $userId,
            'quiz_id' => $quiz_id,
        ],
        [
            'score' => $totalScore,
        ]
    );

    return response()->json([
        'score' => $totalScore,
        'answers_count' => $answers->count(),
        'message' => 'Submitted successfully'
    ]);
}
    //  public function selecChoice($choice_id)
    //  {
    //      $choice = Choice::findOrFail($choice_id);

    //      $question = Question::findOrFail($question_id);
           
    //      if($choice.is_true = 0){

    //        return response()->([
                   
    //           '$question.question_point' => 0,

    //        ]);
    //      }else{
           
    //      return response()->([
                   
    //           '$question.question_point',

    //        ]);
           
    //        }
    // }
}