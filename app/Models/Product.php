<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'seller_id',
        'name',
        'category',
        'description',
        'price',
        'stock',
        'unit',
        'harvest_date',
        'farm_location',
        'image_url',
        'is_organic',
        'is_approved',
        'is_active',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'harvest_date' => 'date',
        'is_organic' => 'boolean',
        'is_approved' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the seller (farmer) that owns the product.
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the order items for this product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the reviews for this product.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the average rating for this product.
     */
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    /**
     * Get the review count for this product.
     */
    public function getReviewCountAttribute()
    {
        return $this->reviews()->count();
    }

    /**
     * Get the category options.
     */
    public static function getCategoryOptions(): array
    {
        return [
            // Fresh Crops
            'rice' => 'Rice',
            'corn' => 'Corn',
            'vegetables' => 'Vegetables',
            'fruits' => 'Fruits',
            'root_crops' => 'Root Crops',
            // Farm Inputs
            'fertilizers' => 'Fertilizers',
            'seeds' => 'Seeds',
            'pesticides' => 'Pesticides',
            'farming_tools' => 'Farming Tools',
            // Dairy
            'dairy' => 'Dairy Products',
            // Others
            'other' => 'Other',
        ];
    }

    /**
     * Get the full URL for the product image.
     * This accessor transforms image_url to a complete image URL.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->attributes['image_url']) {
            return null;
        }

        // If the image already has a full URL (http/https), return it as is
        if (filter_var($this->attributes['image_url'], FILTER_VALIDATE_URL)) {
            return $this->attributes['image_url'];
        }

        // Otherwise, prepend the storage URL
        return asset('storage/' . $this->attributes['image_url']);
    }
    
    /**
     * Get the full URL for the product image (alias for backward compatibility).
     * This ensures $product->image works in addition to $product->image_url.
     */
    public function getImageAttribute()
    {
        return $this->image_url;
    }
}
