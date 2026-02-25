<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration adds missing fields that the frontend and controller expect.
     */
    public function up(): void
    {
        Schema::table('rider_profiles', function (Blueprint $table) {
            // Add vehicle_model field
            $table->string('vehicle_model')->nullable()->after('vehicle_type');
            
            // Add vehicle_color field
            $table->string('vehicle_color')->nullable()->after('vehicle_model');
            
            // Add vehicle_plate_number field (the frontend uses this name)
            $table->string('vehicle_plate_number')->nullable()->after('plate_number');
            
            // Add driving_license_number field (the frontend uses this name)
            $table->string('driving_license_number')->nullable()->after('drivers_license');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rider_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'vehicle_model',
                'vehicle_color',
                'vehicle_plate_number',
                'driving_license_number',
            ]);
        });
    }
};
