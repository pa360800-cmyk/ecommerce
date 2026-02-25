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
        Schema::create('seller_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('government_id')->nullable();
            $table->string('government_id_verified')->default(false);
            $table->string('business_license')->nullable();
            $table->string('business_license_verified')->default(false);
            $table->string('tax_certificate')->nullable();
            $table->string('tax_certificate_verified')->default(false);
            $table->string('selfie_verification')->nullable();
            $table->string('selfie_verified')->default(false);
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_documents');
    }
};
