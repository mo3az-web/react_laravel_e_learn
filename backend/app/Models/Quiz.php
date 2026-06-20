<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Lesson;

class Quiz extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
    ]; 

    public function questions()
    {
        return $this->hasMany(Question::class, 'quiz_id');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}