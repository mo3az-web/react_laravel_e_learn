<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Lesson;
use App\Models\User;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'category_id', 
    ];

    
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'course_id')
            ->orderBy('order');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('progress')
            ->withTimestamps();
    }
    public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}
}