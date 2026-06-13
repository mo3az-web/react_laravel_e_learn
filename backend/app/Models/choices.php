<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use App\Models\questions;

class Choice extends Model
{

protected $table = 'choises';

    protected $fillable =
    [
      'question_id',
      'choise',
      'Is_correct',
    ]

    protected $casts = [
    'is_correct' => 'boolean',
       ];
                 

     public function question()
{
    return $this->belongsTo(question::class, 'question_id');
}      
}
