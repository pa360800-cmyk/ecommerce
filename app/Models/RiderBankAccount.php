<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiderBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bank_name',
        'account_holder_name',
        'account_number',
        'wallet_address',
        'is_verified',
        'verification_status',
        'rejection_reason',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verification_status' => 'string',
    ];

    /**
     * Get the user that owns the bank account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the bank account is verified.
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}
