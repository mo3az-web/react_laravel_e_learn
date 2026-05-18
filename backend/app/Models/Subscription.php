<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
         'plan_id', 
        'start_date',
        'end_date',
        'status',
    ];

        protected $casts = [
            'start_date' => 'datetime',
            'end_date'   => 'datetime',
        ];
  
    // ─── Helpers ──────────────────────────────────────────────

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }

    public function isExpired(): bool
    {
        return $this->end_date->isPast();
    }

    // ─── Relations ────────────────────────────────────────────
   public function plan()
{
    return $this->belongsTo(Plan::class);
}
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}