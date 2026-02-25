<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 2FA fields
            $table->string('two_factor_secret')->nullable()->after('farm_description');
            $table->string('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->boolean('two_factor_enabled')->default(false)->after('two_factor_recovery_codes');
            
            // Email and phone verification
            $table->timestamp('email_verified_at')->nullable()->change();
            $table->string('phone_verified_at')->nullable()->after('email_verified_at');
            
            // Account security
            $table->string('last_login_ip')->nullable()->after('two_factor_enabled');
            $table->timestamp('last_login_at')->nullable()->after('last_login_ip');
            $table->text('login_alert_ips')->nullable()->after('last_login_at');
            
            // Activity logging
            $table->text('action_logs')->nullable()->after('login_alert_ips');
            
            // Verification step tracking for multi-step registration
            $table->integer('registration_step')->default(1)->after('action_logs');
            $table->string('registration_status')->default('pending')->after('registration_step');
            $table->timestamp('invited_at')->nullable()->after('registration_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_enabled',
                'phone_verified_at',
                'last_login_ip',
                'last_login_at',
                'login_alert_ips',
                'action_logs',
                'registration_step',
                'registration_status',
                'invited_at',
            ]);
        });
    }
};
