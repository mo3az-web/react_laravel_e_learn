<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Choice;
use App\Models\User;
use App\Models\Quiz;

class StudentAnswer extends Model
{
    protected $table = 'student_answers';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'question_id',
        'choice_id',
        'point',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function choice()
    {
        return $this->belongsTo(Choice::class, 'choice_id');
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}