<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\RiderProfile;
use App\Models\RiderDocument;
use App\Models\RiderBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class RiderRegistrationController extends Controller
{
    /**
     * Display step 1: Basic Information
     */
    public function step1()
    {
        return Inertia::render('Auth/Register/Rider', [
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

        // Create user with logistics role
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'logistics',
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
            'is_approved' => false, // Requires admin approval
            'registration_step' => 2,
            'registration_status' => 'in_progress',
        ]);

        // Store user ID in session for multi-step registration
        session(['rider_registration_user_id' => $user->id]);

        return redirect()->route('register.rider.step2');
    }

    /**
     * Display step 2: Identity Verification
     */
    public function step2()
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        return Inertia::render('Auth/Register/Rider', [
            'step' => 2,
            'title' => 'Identity Verification',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 2: Identity Verification submission
     */
    public function storeStep2(Request $request): RedirectResponse
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        $validated = $request->validate([
            'government_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'live_selfie' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Handle file uploads
        $governmentIdPath = $validated['government_id']->store('rider_documents/' . $userId, 'public');
        $selfiePath = $validated['live_selfie']->store('rider_documents/' . $userId, 'public');

        // Create rider documents record
        RiderDocument::create([
            'user_id' => $userId,
            'government_id' => $governmentIdPath,
            'government_id_verified' => false,
            'live_selfie' => $selfiePath,
            'live_selfie_verified' => false,
            'background_check_status' => 'pending',
            'verification_status' => 'pending',
        ]);

        // Update user registration step
        User::where('id', $userId)->update(['registration_step' => 3]);

        return redirect()->route('register.rider.step3');
    }

    /**
     * Display step 3: Vehicle Details
     */
    public function step3()
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        return Inertia::render('Auth/Register/Rider', [
            'step' => 3,
            'title' => 'Vehicle Details',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 3: Vehicle Details submission
     */
    public function storeStep3(Request $request): RedirectResponse
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        $validated = $request->validate([
            'vehicle_type' => 'required|in:bike,car,scooter,van,truck',
            'plate_number' => 'required|string|max:20',
            'vehicle_registration' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'vehicle_insurance' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'drivers_license' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // Handle file uploads
        $vehicleRegistrationPath = $validated['vehicle_registration']->store('rider_documents/' . $userId, 'public');
        $vehicleInsurancePath = $validated['vehicle_insurance']->store('rider_documents/' . $userId, 'public');
        $driversLicensePath = $validated['drivers_license']->store('rider_documents/' . $userId, 'public');

        // Create rider profile
        RiderProfile::create([
            'user_id' => $userId,
            'vehicle_type' => $validated['vehicle_type'],
            'plate_number' => $validated['plate_number'],
            'vehicle_registration' => $vehicleRegistrationPath,
            'vehicle_insurance' => $vehicleInsurancePath,
            'drivers_license' => $driversLicensePath,
            'status' => 'pending',
        ]);

        // Update user registration step
        User::where('id', $userId)->update(['registration_step' => 4]);

        return redirect()->route('register.rider.step4');
    }

    /**
     * Display step 4: Bank / Wallet Setup
     */
    public function step4()
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        return Inertia::render('Auth/Register/Rider', [
            'step' => 4,
            'title' => 'Bank Account / Wallet',
            'user_id' => $userId,
        ]);
    }

    /**
     * Handle step 4: Bank / Wallet Setup submission
     */
    public function storeStep4(Request $request): RedirectResponse
    {
        $userId = session('rider_registration_user_id');
        
        if (!$userId) {
            return redirect()->route('register.rider.step1');
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'wallet_address' => 'nullable|string|max:100',
        ]);

        // Create rider bank account record
        RiderBankAccount::create([
            'user_id' => $userId,
            'bank_name' => $validated['bank_name'],
            'account_holder_name' => $validated['account_holder_name'],
            'account_number' => $validated['account_number'],
            'wallet_address' => $validated['wallet_address'] ?? null,
            'is_verified' => false,
            'verification_status' => 'pending',
        ]);

        // Update user registration step and status
        User::where('id', $userId)->update([
            'registration_step' => 5,
            'registration_status' => 'pending_approval',
        ]);

        // Clear session
        session()->forget('rider_registration_user_id');

        // Send notification to admin (you would implement this)

        return redirect()->route('register.rider.complete');
    }

    /**
     * Display completion page
     */
    public function complete()
    {
        return Inertia::render('Auth/Register/RiderComplete');
    }

    /**
     * Check registration status
     */
    public function status(Request $request)
    {
        $user = $request->user();
        
        if (!$user || !$user->isRider()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $profile = $user->riderProfile;
        $documents = $user->riderDocuments;
        $bankAccount = $user->riderBankAccount;

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
