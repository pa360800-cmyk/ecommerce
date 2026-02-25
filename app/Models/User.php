<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'is_approved',
        'farm_location',
        'farm_description',
        'profile_image',
        // 2FA fields
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_enabled',
        // Verification fields
        'phone_verified_at',
        // Security fields
        'last_login_ip',
        'last_login_at',
        'login_alert_ips',
        'action_logs',
        // Registration tracking
        'registration_step',
        'registration_status',
        'invited_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_approved' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',
            'registration_step' => 'integer',
            'invited_at' => 'datetime',
        ];
    }

    public function getRoleAttribute($value): string
    {
        return $value ?? 'buyer';
    }

    public function isBuyer(): bool
    {
        return $this->role === 'buyer';
    }

    public function isFarmer(): bool
    {
        return $this->role === 'farmer';
    }

    public function isSeller(): bool
    {
        return $this->role === 'farmer';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    /**
     * Check if the user is a super admin
     * 
     * @return bool
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isLogistics(): bool
    {
        return $this->role === 'logistics';
    }

    public function isRider(): bool
    {
        return $this->role === 'logistics';
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    // Seller Relationships
    public function sellerProfile(): HasOne
    {
        return $this->hasOne(SellerProfile::class);
    }

    public function sellerDocuments(): HasOne
    {
        return $this->hasOne(SellerDocument::class);
    }

    public function sellerBankAccount(): HasOne
    {
        return $this->hasOne(SellerBankAccount::class);
    }

    // Rider Relationships
    public function riderProfile(): HasOne
    {
        return $this->hasOne(RiderProfile::class);
    }

    public function riderDocuments(): HasOne
    {
        return $this->hasOne(RiderDocument::class);
    }

    public function riderBankAccount(): HasOne
    {
        return $this->hasOne(RiderBankAccount::class);
    }

    // Admin Invitations
    public function adminInvitations(): HasMany
    {
        return $this->hasMany(AdminInvitation::class, 'invited_by');
    }

    // 2FA Methods
    public function isTwoFactorEnabled(): bool
    {
        return $this->two_factor_enabled === true;
    }

    public function enableTwoFactorAuth(string $secret, array $recoveryCodes = []): void
    {
        $this->update([
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => json_encode($recoveryCodes),
            'two_factor_enabled' => true,
        ]);
    }

    public function disableTwoFactorAuth(): void
    {
        $this->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_enabled' => false,
        ]);
    }

    public function getTwoFactorRecoveryCodes(): array
    {
        if (!$this->two_factor_recovery_codes) {
            return [];
        }
        return json_decode($this->two_factor_recovery_codes, true) ?? [];
    }

    // Profile Completion
    public function hasCompleteProfile(): bool
    {
        switch ($this->role) {
            case 'buyer':
                return $this->email_verified_at !== null;
            case 'farmer':
                return $this->hasCompleteSellerProfile();
            case 'logistics':
                return $this->hasCompleteRiderProfile();
            case 'admin':
            case 'super_admin':
                return $this->isTwoFactorEnabled();
            default:
                return false;
        }
    }

    public function hasCompleteSellerProfile(): bool
    {
        $profile = $this->sellerProfile;
        $documents = $this->sellerDocuments;
        $bankAccount = $this->sellerBankAccount;

        if (!$profile || !$documents || !$bankAccount) {
            return false;
        }

        return $profile->isApproved() 
            && $documents->isVerified() 
            && $bankAccount->isVerified()
            && $this->email_verified_at !== null;
    }

    public function hasCompleteRiderProfile(): bool
    {
        $profile = $this->riderProfile;
        $documents = $this->riderDocuments;
        $bankAccount = $this->riderBankAccount;

        if (!$profile || !$documents || !$bankAccount) {
            return false;
        }

        return $profile->isApproved() 
            && $documents->isVerified()
            && $bankAccount->isVerified()
            && $this->email_verified_at !== null;
    }

    // Security Methods
    public function updateLastLogin(string $ip): void
    {
        $this->update([
            'last_login_ip' => $ip,
            'last_login_at' => now(),
        ]);
    }

    public function logAction(string $action, string $details = ''): void
    {
        $logs = $this->action_logs ? json_decode($this->action_logs, true) : [];
        $logs[] = [
            'action' => $action,
            'details' => $details,
            'ip' => request()->ip(),
            'timestamp' => now()->toIso8601String(),
        ];
        $logs = array_slice($logs, -100);
        $this->update(['action_logs' => json_encode($logs)]);
    }

    public function canAccessDashboard(): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        if ($this->isFarmer()) {
            return $this->is_approved && $this->hasCompleteSellerProfile();
        }

        if ($this->isLogistics()) {
            return $this->is_approved && $this->hasCompleteRiderProfile();
        }

        return true;
    }
}
