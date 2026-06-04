<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Lesson;

class Progress extends Model
{
    protected $table = 'progresses';
    protected $fillable = [
        'user_id',
        'lesson_id',
        'watched_at',
        'watched',
        'last_second',
    ];

    protected $casts = [
        'watched'    => 'boolean',
        'watched_at' => 'datetime',
    ];

    // ─── Helpers ─────────────────────────────

    public function markAsWatched(): void
    {
        $this->update([
            'watched'    => true,
            'watched_at' => now(),
        ]);
    }

    // ─── Relations ───────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}