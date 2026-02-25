<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerPaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'type',
        'email',
        'account_name',
        'account_number',
        'bank_name',
        'card_last_four',
        'card_brand',
        'expiry_month',
        'expiry_year',
        'is_default',
        'is_verified',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_verified' => 'boolean',
    ];

    /**
     * Get the buyer that owns the payment method.
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Get the display name for the payment method type.
     */
    public function getTypeNameAttribute()
    {
        return match($this->type) {
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'gcash' => 'GCash',
            'paypal' => 'PayPal',
            default => ucfirst($this->type),
        };
    }

    /**
     * Get the display details for the payment method.
     */
    public function getDisplayDetailsAttribute()
    {
        return match($this->type) {
            'card' => "{$this->card_brand} •••• {$this->card_last_four}",
            'bank_transfer' => "{$this->bank_name} - {$this->account_number}",
            'gcash' => $this->phone ?? $this->email,
            'paypal' => $this->email,
            default => $this->email ?? $this->account_number,
        };
    }
}
