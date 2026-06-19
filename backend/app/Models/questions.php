<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\quizzes;
class Question extends Model
{


protected $table = 'question';

    protected $fillable = 
    [
        'quiz_id' ,  
        'question_id',
        'question' ,
        'question_point',
    ]; 

public function choices()
{
    return $this->hasMany(choices::class, 'question_id');
}
    public function quiz(){
    return $this->belongTo( quizzes::class, 'quiz_id');
    }
}
