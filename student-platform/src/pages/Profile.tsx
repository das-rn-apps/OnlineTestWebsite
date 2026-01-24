import React from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="col-span-1">
                    <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            <Shield className="mr-1 h-3 w-3" />
                            {user.roleId?.name || user.roleName || 'Student'}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="col-span-2 space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900">Personal Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center rounded-lg border border-gray-100 p-4">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Full Name</p>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center rounded-lg border border-gray-100 p-4">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Email Address</p>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center rounded-lg border border-gray-100 p-4">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400">Phone</p>
                                    <p className="font-medium text-gray-900">{(user as any).phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-semibold text-gray-900">Account Security</h3>
                        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
