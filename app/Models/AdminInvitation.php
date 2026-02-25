<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AdminInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'invited_by',
        'email',
        'role',
        'token',
        'expires_at',
        'is_used',
        'used_at',
        'status',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Get the user who created this invitation.
     */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Check if the invitation is valid.
     */
    public function isValid(): bool
    {
        return !$this->is_used 
            && $this->status === 'pending' 
            && $this->expires_at->isFuture();
    }

    /**
     * Check if the invitation has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Mark the invitation as used.
     */
    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
            'status' => 'accepted',
        ]);
    }

    /**
     * Generate a new invitation token.
     */
    public static function generateToken(): string
    {
        return Str::random(64);
    }

    /**
     * Create a new invitation.
     */
    public static function createInvitation(int $invitedBy, string $email, string $role = 'support'): self
    {
        return self::create([
            'invited_by' => $invitedBy,
            'email' => $email,
            'role' => $role,
            'token' => self::generateToken(),
            'expires_at' => now()->addHours(24),
            'status' => 'pending',
        ]);
    }
}
