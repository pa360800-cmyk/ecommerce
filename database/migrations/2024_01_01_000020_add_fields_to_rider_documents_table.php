<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration adds missing fields that the frontend expects for document verification.
     * Uses try-catch to handle columns that might already exist.
     */
    public function up(): void
    {
        // Add driving_license field (document path)
        if (!Schema::hasColumn('rider_documents', 'driving_license')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->string('driving_license')->nullable()->after('government_id');
            });
        }
        
        // Add driving_license_verified field
        if (!Schema::hasColumn('rider_documents', 'driving_license_verified')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->boolean('driving_license_verified')->default(false)->after('driving_license');
            });
        }
        
        // Add vehicle_registration field (document path)
        if (!Schema::hasColumn('rider_documents', 'vehicle_registration')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->string('vehicle_registration')->nullable()->after('driving_license_verified');
            });
        }
        
        // Add vehicle_registration_verified field
        if (!Schema::hasColumn('rider_documents', 'vehicle_registration_verified')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->boolean('vehicle_registration_verified')->default(false)->after('vehicle_registration');
            });
        }
        
        // Add insurance field (document path)
        if (!Schema::hasColumn('rider_documents', 'insurance')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->string('insurance')->nullable()->after('live_selfie');
            });
        }
        
        // Add insurance_verified field
        if (!Schema::hasColumn('rider_documents', 'insurance_verified')) {
            Schema::table('rider_documents', function (Blueprint $table) {
                $table->boolean('insurance_verified')->default(false)->after('insurance');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rider_documents', function (Blueprint $table) {
            $table->dropColumn([
                'driving_license',
                'driving_license_verified',
                'vehicle_registration',
                'vehicle_registration_verified',
                'insurance',
                'insurance_verified',
            ]);
        });
    }
};
