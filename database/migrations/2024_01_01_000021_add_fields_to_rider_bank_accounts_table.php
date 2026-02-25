<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration adds missing fields that the frontend expects.
     */
    public function up(): void
    {
        Schema::table('rider_bank_accounts', function (Blueprint $table) {
            // Add branch_code field (optional as per profile.jsx)
            $table->string('branch_code')->nullable()->after('account_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rider_bank_accounts', function (Blueprint $table) {
            $table->dropColumn([
                'branch_code',
            ]);
        });
    }
};
