import React, { useEffect, useState } from 'react';
import adminSubscriptionService, { AdminSubscription } from '../../services/admin/subscription.service';

const AdminSubscriptions: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await adminSubscriptionService.getAllSubscriptions({ limit: 50 });
                setSubscriptions(response.data);
            } catch (error) {
                console.error('Failed to fetch subscriptions', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Management</h1>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : subscriptions.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center">No subscriptions found</td></tr>
                        ) : (
                            subscriptions.map((sub) => (
                                <tr key={sub._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{sub.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{sub.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{sub.planName}</td>
                                    <td className="px-6 py-4">₹{sub.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sub.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {sub.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSubscriptions;
