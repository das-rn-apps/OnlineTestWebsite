import React, { useEffect, useState } from 'react';
import userService, { User } from '../../services/user.service';
import { Search, Trash2, Shield } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({ page, limit: 10, search });
            setUsers(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    // Note: Role update requires Role list. For v1 simplified we might skip UI for role selection or hardcode standard role IDs if known.
    // For now showing read-only role.

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage students and administrators.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="h-10 rounded-lg border border-gray-300 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        {loading ? 'Loading...' : 'No users found'}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                <Shield className="mr-1 h-3 w-3" />
                                                {typeof user.roleId === 'object' ? user.roleId.name : user.roleId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
