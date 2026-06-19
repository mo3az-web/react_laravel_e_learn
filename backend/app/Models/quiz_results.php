<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\quizzes;
use App\Models\User; // أو اسم موديل الطالب عندك لو اسمه Student

class quiz_result extends Model
{
    protected $table = 'quiz_results';

    protected $fillable = [
        'student_id',   // رقم الطالب اللي امتحن
        'quiz_id',      // رقم الامتحان المرجعي
        'earned_score', // الدرجة اللي جابها في الآخر
    ];

    // النتيجة دي تابعة لانهي امتحان؟
    public function quiz()
    {
        return $this->belongsTo(quizzes::class, 'quiz_id');
    }

    // النتيجة دي تابعة لانهي طالب؟
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // النتيجة دي جواها تفاصيل إجابات كتير
    public function studentAnswers()
    {
        return $this->hasMany(student_answers::class, 'quiz_result_id');
    }
}