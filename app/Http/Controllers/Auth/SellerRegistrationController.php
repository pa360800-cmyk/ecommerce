<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SellerProfile;
use App\Models\SellerDocument;
use App\Models\SellerBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class SellerRegistrationController extends Controller
{
    /**
     * Display step 1: Basic Information
     */
    public function step1()
    {
        return Inertia::render('Auth/Register/Seller', [
            'step' => 1,
            'title' => 'Basic Information',
        ]);
    }

    /**
     * Handle step 1: Basic Information submission
     */
    public function storeStep1(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        // Create user with farmer role
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'farmer',
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
            'is_approved' => false, // Requires admin approval
            'registration_step' => 2,
            'registration_status' => 'in_progress',
        ]);

        // Store user ID in session for multi-step registration
        session(['seller_registration_user_id' => $user->id]);

        return redirect()->route('register.seller.step2');
    }

    /**
     * Display step 2: Business Information
     */
    public function step2()
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        return Inertia::render('Auth/Register/Seller', [
            'step' => 2,
            'title' => 'Business Information',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 2: Business Information submission
     */
    public function storeStep2(Request $request): RedirectResponse
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        $validated = $request->validate([
            'store_name' => 'required|string|max:255|unique:seller_profiles,store_name',
            'business_type' => 'required|in:individual,company',
            'business_address' => 'nullable|string|max:500',
            'tax_id' => 'nullable|string|max:50',
        ]);

        // Create seller profile
        SellerProfile::create([
            'user_id' => $userId,
            'store_name' => $validated['store_name'],
            'business_type' => $validated['business_type'],
            'business_address' => $validated['business_address'] ?? null,
            'tax_id' => $validated['tax_id'] ?? null,
            'status' => 'pending',
        ]);

        // Update user registration step
        User::where('id', $userId)->update(['registration_step' => 3]);

        return redirect()->route('register.seller.step3');
    }

    /**
     * Display step 3: Document Upload
     */
    public function step3()
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        return Inertia::render('Auth/Register/Seller', [
            'step' => 3,
            'title' => 'Document Verification',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 3: Document Upload submission
     */
    public function storeStep3(Request $request): RedirectResponse
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        $validated = $request->validate([
            'government_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'business_license' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'tax_certificate' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'selfie_verification' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Handle file uploads
        $governmentIdPath = $validated['government_id']->store('seller_documents/' . $userId, 'public');
        $businessLicensePath = isset($validated['business_license']) 
            ? $validated['business_license']->store('seller_documents/' . $userId, 'public') 
            : null;
        $taxCertificatePath = isset($validated['tax_certificate']) 
            ? $validated['tax_certificate']->store('seller_documents/' . $userId, 'public') 
            : null;
        $selfiePath = $validated['selfie_verification']->store('seller_documents/' . $userId, 'public');

        // Create seller documents record
        SellerDocument::create([
            'user_id' => $userId,
            'government_id' => $governmentIdPath,
            'government_id_verified' => false,
            'business_license' => $businessLicensePath,
            'business_license_verified' => false,
            'tax_certificate' => $taxCertificatePath,
            'tax_certificate_verified' => false,
            'selfie_verification' => $selfiePath,
            'selfie_verified' => false,
            'verification_status' => 'pending',
        ]);

        // Update user registration step
        User::where('id', $userId)->update(['registration_step' => 4]);

        return redirect()->route('register.seller.step4');
    }

    /**
     * Display step 4: Bank Account Verification
     */
    public function step4()
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        return Inertia::render('Auth/Register/Seller', [
            'step' => 4,
            'title' => 'Bank Account Verification',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 4: Bank Account Verification submission
     */
    public function storeStep4(Request $request): RedirectResponse
    {
        $userId = session('seller_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.seller.step1');
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'branch_code' => 'nullable|string|max:50',
        ]);

        // Create seller bank account record
        SellerBankAccount::create([
            'user_id' => $userId,
            'bank_name' => $validated['bank_name'],
            'account_holder_name' => $validated['account_holder_name'],
            'account_number' => $validated['account_number'],
            'branch_code' => $validated['branch_code'] ?? null,
            'is_verified' => false,
            'verification_status' => 'pending',
        ]);

        // Update user registration step and status
        User::where('id', $userId)->update([
            'registration_step' => 5,
            'registration_status' => 'pending_approval',
        ]);

        // Clear session
        session()->forget('seller_registration_user_id');

        // Send notification to admin (you would implement this)

        return redirect()->route('register.seller.complete');
    }

    /**
     * Display completion page
     */
    public function complete()
    {
        return Inertia::render('Auth/Register/SellerComplete');
    }

    /**
     * Check registration status
     */
    public function status(Request $request)
    {
        $user = $request->user();
        
        if (!$user || !$user->isFarmer()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $profile = $user->sellerProfile;
        $documents = $user->sellerDocuments;
        $bankAccount = $user->sellerBankAccount;

        return response()->json([
            'registration_step' => $user->registration_step,
            'registration_status' => $user->registration_status,
            'profile_status' => $profile?->status ?? 'not_started',
            'documents_status' => $documents?->verification_status ?? 'not_started',
            'bank_account_status' => $bankAccount?->verification_status ?? 'not_started',
            'is_approved' => $user->is_approved,
        ]);
    }
}
