import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import LogisticsSidebar from "./sidebar";
import LogisticsHeader from "./header";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import {
    User,
    Truck,
    FileCheck,
    CreditCard,
    Mail,
    Phone,
    MapPin,
    Building2,
    Hash,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    Edit2,
    Camera,
    Car,
    IdCard,
} from "lucide-react";

export default function LogisticsProfile({
    auth,
    riderProfile,
    riderDocuments,
    riderBankAccount,
}) {
    const user = auth?.user;

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
            case "verified":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "rejected":
            case "suspended":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200";
        }
    };

    // Helper function to get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case "approved":
                return "Approved";
            case "verified":
                return "Verified";
            case "pending":
                return "Pending";
            case "rejected":
                return "Rejected";
            case "suspended":
                return "Suspended";
            default:
                return status || "Not Set";
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    // Form handling
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            profile_image: null,
            vehicle_type: riderProfile?.vehicle_type || "",
            vehicle_plate_number: riderProfile?.vehicle_plate_number || "",
            vehicle_model: riderProfile?.vehicle_model || "",
            vehicle_color: riderProfile?.vehicle_color || "",
            driving_license_number: riderProfile?.driving_license_number || "",
        });

    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_image", file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    // Submit form
    const submit = (e) => {
        e.preventDefault();
        patch(route("logistic.profile.update"), {
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                setProfileImagePreview(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <LogisticsSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <LogisticsHeader user={user} />

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="My Profile" />

                    {/* Page Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                My Profile
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your account and delivery information
                            </p>
                        </div>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Basic Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Your personal details
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Profile Image */}
                                <div className="flex items-center gap-4 mb-6">
                                    {user?.profile_image ? (
                                        <img
                                            src={
                                                user.profile_image.startsWith(
                                                    "/storage",
                                                )
                                                    ? user.profile_image
                                                    : `/storage/${user.profile_image}`
                                            }
                                            alt={user.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {user?.name || "No name set"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Logistics Partner
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email Address
                                        </p>
                                        <p className="text-gray-900">
                                            {user?.email || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Phone Number
                                        </p>
                                        <p className="text-gray-900">
                                            {user?.phone || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Address
                                        </p>
                                        <p className="text-gray-900">
                                            {user?.address || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Vehicle Information
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Your delivery vehicle details
                                        </p>
                                    </div>
                                </div>
                                {riderProfile?.status && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(riderProfile.status)}`}
                                    >
                                        {getStatusLabel(riderProfile.status)}
                                    </span>
                                )}
                            </div>

                            {riderProfile ? (
                                <div className="space-y-4">
                                    {/* Vehicle Type */}
                                    <div className="flex items-start gap-3">
                                        <Car className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Vehicle Type
                                            </p>
                                            <p className="text-gray-900">
                                                {riderProfile.vehicle_type ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vehicle Model */}
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Vehicle Model
                                            </p>
                                            <p className="text-gray-900">
                                                {riderProfile.vehicle_model ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vehicle Color */}
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Vehicle Color
                                            </p>
                                            <p className="text-gray-900">
                                                {riderProfile.vehicle_color ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Plate Number */}
                                    <div className="flex items-start gap-3">
                                        <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Plate Number
                                            </p>
                                            <p className="text-gray-900">
                                                {riderProfile.vehicle_plate_number ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Driving License Number */}
                                    <div className="flex items-start gap-3">
                                        <IdCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Driving License Number
                                            </p>
                                            <p className="text-gray-900">
                                                {riderProfile.driving_license_number ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rejection Reason */}
                                    {riderProfile.rejection_reason && (
                                        <div className="flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-red-600">
                                                    Rejection Reason
                                                </p>
                                                <p className="text-gray-900">
                                                    {
                                                        riderProfile.rejection_reason
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">
                                        No vehicle profile yet
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Add your vehicle information to start
                                        delivering
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Document Verification Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <FileCheck className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Document Verification
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Your submitted documents
                                        </p>
                                    </div>
                                </div>
                                {riderDocuments?.verification_status && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(riderDocuments.verification_status)}`}
                                    >
                                        {getStatusLabel(
                                            riderDocuments.verification_status,
                                        )}
                                    </span>
                                )}
                            </div>

                            {riderDocuments ? (
                                <div className="space-y-4">
                                    {/* Government ID */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Government ID
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    National ID or Passport
                                                </p>
                                            </div>
                                        </div>
                                        {riderDocuments.government_id_verified ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-500" />
                                        )}
                                    </div>

                                    {/* Driving License */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <IdCard className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Driving License
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Valid driver's license
                                                </p>
                                            </div>
                                        </div>
                                        {riderDocuments.driving_license_verified ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-500" />
                                        )}
                                    </div>

                                    {/* Vehicle Registration */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Vehicle Registration
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Vehicle registration
                                                    document
                                                </p>
                                            </div>
                                        </div>
                                        {riderDocuments.vehicle_registration_verified ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-500" />
                                        )}
                                    </div>

                                    {/* Insurance */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileCheck className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Insurance
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Vehicle insurance
                                                    certificate
                                                </p>
                                            </div>
                                        </div>
                                        {riderDocuments.insurance_verified ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-500" />
                                        )}
                                    </div>

                                    {/* Rejection Reason */}
                                    {riderDocuments.rejection_reason && (
                                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-red-600">
                                                    Rejection Reason
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    {
                                                        riderDocuments.rejection_reason
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">
                                        No documents submitted
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Submit your documents for verification
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Bank Account Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Bank Account
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Your payout account
                                        </p>
                                    </div>
                                </div>
                                {riderBankAccount?.verification_status && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(riderBankAccount.verification_status)}`}
                                    >
                                        {getStatusLabel(
                                            riderBankAccount.verification_status,
                                        )}
                                    </span>
                                )}
                            </div>

                            {riderBankAccount ? (
                                <div className="space-y-4">
                                    {/* Bank Name */}
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Bank Name
                                            </p>
                                            <p className="text-gray-900">
                                                {riderBankAccount.bank_name ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Holder Name */}
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Account Holder Name
                                            </p>
                                            <p className="text-gray-900">
                                                {riderBankAccount.account_holder_name ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Number */}
                                    <div className="flex items-start gap-3">
                                        <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                Account Number
                                            </p>
                                            <p className="text-gray-900">
                                                {riderBankAccount.account_number
                                                    ? `****${riderBankAccount.account_number.slice(-4)}`
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Branch Code */}
                                    {riderBankAccount.branch_code && (
                                        <div className="flex items-start gap-3">
                                            <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Branch Code
                                                </p>
                                                <p className="text-gray-900">
                                                    {
                                                        riderBankAccount.branch_code
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Verification Status */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        {riderBankAccount.is_verified ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                <p className="text-sm font-medium text-emerald-700">
                                                    Bank account verified
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-5 h-5 text-amber-500" />
                                                <p className="text-sm font-medium text-amber-700">
                                                    Pending verification
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Rejection Reason */}
                                    {riderBankAccount.rejection_reason && (
                                        <div className="flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-red-600">
                                                    Rejection Reason
                                                </p>
                                                <p className="text-gray-900">
                                                    {
                                                        riderBankAccount.rejection_reason
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">
                                        No bank account added
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Add your bank account to receive payouts
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Status Summary */}
                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Account Status Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div
                                className={`p-4 rounded-lg border ${user?.email_verified_at ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
                            >
                                <div className="flex items-center gap-2">
                                    {user?.email_verified_at ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span
                                        className={`font-medium ${user?.email_verified_at ? "text-emerald-700" : "text-red-700"}`}
                                    >
                                        Email Verified
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`p-4 rounded-lg border ${riderProfile?.status === "approved" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
                            >
                                <div className="flex items-center gap-2">
                                    {riderProfile?.status === "approved" ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    )}
                                    <span
                                        className={`font-medium ${riderProfile?.status === "approved" ? "text-emerald-700" : "text-amber-700"}`}
                                    >
                                        Profile Approved
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`p-4 rounded-lg border ${riderDocuments?.verification_status === "verified" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
                            >
                                <div className="flex items-center gap-2">
                                    {riderDocuments?.verification_status ===
                                    "verified" ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    )}
                                    <span
                                        className={`font-medium ${riderDocuments?.verification_status === "verified" ? "text-emerald-700" : "text-amber-700"}`}
                                    >
                                        Documents Verified
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`p-4 rounded-lg border ${riderBankAccount?.is_verified ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
                            >
                                <div className="flex items-center gap-2">
                                    {riderBankAccount?.is_verified ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    )}
                                    <span
                                        className={`font-medium ${riderBankAccount?.is_verified ? "text-emerald-700" : "text-amber-700"}`}
                                    >
                                        Bank Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                maxWidth="2xl"
            >
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Edit Profile
                    </h2>

                    {/* Scrollable Content */}
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-6">
                            {/* Profile Image */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-shrink-0">
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : user?.profile_image ? (
                                        <img
                                            src={`/storage/${user.profile_image}`}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <label
                                        htmlFor="profile_image"
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            id="profile_image"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Profile Photo
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Click the camera icon to upload a new
                                        photo
                                    </p>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name"
                                        />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Phone Number"
                                        />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.phone}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="address"
                                            value="Address"
                                        />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.address}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">
                                    Vehicle Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="vehicle_type"
                                            value="Vehicle Type"
                                        />
                                        <TextInput
                                            id="vehicle_type"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.vehicle_type}
                                            onChange={(e) =>
                                                setData(
                                                    "vehicle_type",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., Motorcycle, Car, Van"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.vehicle_type}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="vehicle_model"
                                            value="Vehicle Model"
                                        />
                                        <TextInput
                                            id="vehicle_model"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.vehicle_model}
                                            onChange={(e) =>
                                                setData(
                                                    "vehicle_model",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., Toyota Hilux"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.vehicle_model}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="vehicle_color"
                                            value="Vehicle Color"
                                        />
                                        <TextInput
                                            id="vehicle_color"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.vehicle_color}
                                            onChange={(e) =>
                                                setData(
                                                    "vehicle_color",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., White"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.vehicle_color}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="vehicle_plate_number"
                                            value="Plate Number"
                                        />
                                        <TextInput
                                            id="vehicle_plate_number"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.vehicle_plate_number}
                                            onChange={(e) =>
                                                setData(
                                                    "vehicle_plate_number",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., ABC-1234"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={
                                                errors.vehicle_plate_number
                                            }
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="driving_license_number"
                                            value="Driving License Number"
                                        />
                                        <TextInput
                                            id="driving_license_number"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.driving_license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "driving_license_number",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., DL123456789"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={
                                                errors.driving_license_number
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <SecondaryButton
                            type="button"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save Changes"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
