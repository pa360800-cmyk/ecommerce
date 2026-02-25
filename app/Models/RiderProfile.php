<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiderProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_type',
        'plate_number',
        'vehicle_registration',
        'vehicle_insurance',
        'drivers_license',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'status' => 'string',
        'vehicle_type' => 'string',
    ];

    /**
     * Get the user that owns the rider profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the rider is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the rider is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the rider is suspended.
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }
}
