import React from 'react';

const Users: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">User list and management interface will go here.</p>
                {/* Implement user table with pagination using apiService.get('/users') */}
            </div>
        </div>
    );
};

export default Users;
