<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'government_id',
        'government_id_verified',
        'business_license',
        'business_license_verified',
        'tax_certificate',
        'tax_certificate_verified',
        'selfie_verification',
        'selfie_verified',
        'verification_status',
        'rejection_reason',
    ];

    protected $casts = [
        'government_id_verified' => 'boolean',
        'business_license_verified' => 'boolean',
        'tax_certificate_verified' => 'boolean',
        'selfie_verified' => 'boolean',
        'verification_status' => 'string',
    ];

    /**
     * Get the user that owns the seller documents.
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
}
