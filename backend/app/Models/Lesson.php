<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Lesson extends Model
{
protected $fillable = [
    'course_id',
    'order',
    'title',
    'video_url',
    'duration',
    'is_free',
];

protected $casts = [
    'is_free' => 'boolean',
];

public function course(): BelongsTo
{
    return $this->belongsTo(Course::class);
}

public function getNextLessonIdAttribute()
{
    return self::where('course_id', $this->course_id)
        ->where('order', '>', $this->order)
        ->orderBy('order')
        ->value('id');
}

public function progresses(): HasMany
{
    return $this->hasMany(Progress::class);
}

}