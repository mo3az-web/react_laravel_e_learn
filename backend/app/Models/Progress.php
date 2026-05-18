<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Progress extends Model
{
    protected $fillable = [
        'user_id',
        'lesson_id',
        'watched_at',
        'watched',
    ];

    protected function casts(): array
    {
        return [
            'watched'    => 'boolean',
            'watched_at' => 'datetime',
        ];
    }

    // ─── Helpers ──────────────────────────────────────────────

    public function markAsWatched(): void
    {
        $this->update([
            'watched'    => true,
            'watched_at' => now(),
        ]);
    }

    // ─── Relations ────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}