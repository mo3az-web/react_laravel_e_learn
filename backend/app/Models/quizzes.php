<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\questions;
use App\Models\Lesson;

class quizzes extends Model
{


protected $table = 'quizzes';

    protected $fillable = 
    [
        'lesson_id',
        'title',
    ]; 

public function question()
{
    return $this->hasMany(questions::class, 'quiz_id');
}
public function lesson()
{
return $this->belongsTo(Lesson::class, 'lesson_id');
}
}
