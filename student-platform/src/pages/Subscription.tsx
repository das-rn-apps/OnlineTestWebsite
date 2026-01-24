import React, { useEffect, useState } from 'react';
import subscriptionService, { Subscription } from '../services/subscription.service';
import { Check } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await subscriptionService.getMySubscriptions();
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Failed to fetch subscriptions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planType: string) => {
        setProcessing(planType);
        try {
            const response = await subscriptionService.createSubscription({ planType });
            alert(`Subscription created: ${response.data._id}. Mock payment flow...`);
            // Ideally redirect to payment gateway or show payment modal
            // For now just refresh listing (it will show as pending)
            fetchSubscriptions();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to subscribe');
        } finally {
            setProcessing(null);
        }
    };



    const plans = [
        {
            id: 'basic',
            name: 'Basic Plan',
            price: 499,
            features: ['Access to 50+ Tests', 'Basic Analytics', 'Email Support'],
            color: 'bg-blue-500'
        },
        {
            id: 'premium',
            name: 'Premium Plan',
            price: 999,
            features: ['Access to All Tests', 'Advanced Analytics', 'Priority Support', 'Video Solutions'],
            color: 'bg-indigo-600',
            popular: true
        },
        {
            id: 'ultimate',
            name: 'Ultimate Plan',
            price: 1499,
            features: ['Everything in Premium', '1-on-1 Mentorship', 'Live Doubt Clearing', 'Offline Access'],
            color: 'bg-purple-600'
        }
    ];

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Preparation</h1>
                <p className="text-gray-500">Choose the plan that fits your needs.</p>
            </header>

            {/* Plans */}
            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:scale-105 hover:shadow-lg ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
                        {plan.popular && (
                            <div className="absolute top-0 right-1/2 -mt-3 translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                                Most Popular
                            </div>
                        )}
                        <div className="p-8 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-4xl font-bold tracking-tight">₹{plan.price}</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
                            </div>
                            <ul className="mt-6 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex">
                                        <Check className="mr-3 h-5 w-5 flex-shrink-0 text-indigo-600" />
                                        <span className="text-sm text-gray-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-b-2xl">
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={!!processing}
                                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 ${plan.color}`}
                            >
                                {processing === plan.id ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* History */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Subscription History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center">No subscriptions found</td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub._id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{sub.planName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' :
                                                sub.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {sub.isActive ? 'Active' : sub.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">₹{sub.amount}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
