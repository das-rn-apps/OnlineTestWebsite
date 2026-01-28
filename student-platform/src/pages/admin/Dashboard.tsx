import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, BookOpen } from 'lucide-react';
import analyticsService, { AdminStats } from '../../services/analytics.service';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await analyticsService.getAdminStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        { title: 'Total Students', value: stats?.totalStudents || 0, icon: <Users className="text-white" />, color: 'bg-blue-500' },
        { title: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: <DollarSign className="text-white" />, color: 'bg-emerald-500' },
        { title: 'Active Exams', value: stats?.totalExams || 0, icon: <BookOpen className="text-white" />, color: 'bg-purple-500' },
        { title: 'Total Attempts', value: stats?.totalAttempts || 0, icon: <TrendingUp className="text-white" />, color: 'bg-indigo-600' },
    ];

    // Mock data for chart - Future: Get from backend
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Overview of system performance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {statItems.map((stat, index) => (
                    <div key={index} className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-md ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-bold text-gray-900">Revenue Trend (Mock)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
