<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of all users (admin only).
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by approval status
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'pending') {
                $query->where('is_approved', false)->where('role', 'farmer');
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true);
            }
        }

        // Filter by search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate(15);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['products', 'orders']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'role' => 'required|in:buyer,farmer,admin,logistics',
            'is_approved' => 'boolean',
            'farm_location' => 'nullable|string|max:255',
            'farm_description' => 'nullable|string',
        ]);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent admin from deleting themselves
        if ($user->id === Auth::id()) {
            return redirect()->route('users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Approve a farmer user.
     */
    public function approve(User $user)
    {
        if ($user->role !== 'farmer') {
            return redirect()->route('users.index')
                ->with('error', 'Only farmers can be approved.');
        }

        $user->update(['is_approved' => true]);

        return redirect()->route('users.index')
            ->with('success', 'User approved successfully.');
    }

    /**
     * Reject a farmer user.
     */
    public function reject(User $user)
    {
        if ($user->role !== 'farmer') {
            return redirect()->route('users.index')
                ->with('error', 'Only farmers can be rejected.');
        }

        $user->update(['is_approved' => false]);

        return redirect()->route('users.index')
            ->with('success', 'User rejected successfully.');
    }
}
