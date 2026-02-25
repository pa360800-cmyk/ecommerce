<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiderDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'government_id',
        'government_id_verified',
        'live_selfie',
        'live_selfie_verified',
        'background_check_status',
        'background_check_completed_at',
        'verification_status',
        'rejection_reason',
    ];

    protected $casts = [
        'government_id_verified' => 'boolean',
        'live_selfie_verified' => 'boolean',
        'background_check_completed_at' => 'datetime',
        'verification_status' => 'string',
        'background_check_status' => 'string',
    ];

    /**
     * Get the user that owns the rider documents.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if all documents are verified.
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    /**
     * Check if documents are pending verification.
     */
    public function isPending(): bool
    {
        return $this->verification_status === 'pending';
    }

    /**
     * Check if background check is passed.
     */
    public function isBackgroundCheckPassed(): bool
    {
        return $this->background_check_status === 'passed';
    }
}
