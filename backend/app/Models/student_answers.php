<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\quiz_results;
use App\Models\questions;
use App\Models\choices;

class student_answers extends Model
{
    protected $table = 'student_answers';

    // مش بنحط timestamps هنا لأنها بتبقى تابعة لوقت نتيجة الامتحان نفسه
    public $timestamps = false; 

    protected $fillable = [
        'quiz_result_id', // مربوط بجدول النتيجة اللي فوق
        'question_id',    // السؤال اللي الطالب جاوب عليه
        'choice_id',      // الاختيار (الـ Option) اللي الطالب داس عليه
    ];

    // الإجابة دي تابعة لانهي سجل نتيجة؟
    public function result()
    {
        return $this->belongsTo(quiz_results::class, 'quiz_result_id');
    }

    // الإجابة دي تابعة لانهي سؤال؟
    public function question()
    {
        return $this->belongsTo(questions::class, 'question_id');
    }

    // الإجابة دي بتمثل انهي اختيار؟
    public function choice()
    {
        return $this->belongsTo(choices::class, 'choice_id');
    }
}