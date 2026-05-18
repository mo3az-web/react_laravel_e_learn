<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
    'title',
    'description',
    'price',
    'duration_days',
];
 public function subscriptions()
{
    return $this->hasMany(Subscription::class);
}
public function getDurationAttribute()
{
    return $this->duration_days;
}
}