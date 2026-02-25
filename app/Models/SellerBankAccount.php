<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bank_name',
        'account_holder_name',
        'account_number',
        'branch_code',
        'test_deposit_amount',
        'is_verified',
        'verification_status',
        'rejection_reason',
    ];

    protected $casts = [
        'test_deposit_amount' => 'decimal:2',
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
