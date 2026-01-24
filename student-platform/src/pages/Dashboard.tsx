import React, { useEffect, useState } from 'react';
import analyticsService, { DashboardStats, PerformanceStats } from '../services/analytics.service';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import {
    Activity, Award, Clock, TrendingUp, BookOpen, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [performance, setPerformance] = useState<PerformanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardData, performanceData] = await Promise.all([
                    analyticsService.getDashboardStats(),
                    analyticsService.getPerformanceStats()
                ]);
                setStats(dashboardData.data);
                setPerformance(performanceData.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's your comprehensive analysis.</p>
            </header>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Attempts"
                    value={stats?.totalAttempts || 0}
                    icon={<Activity className="text-white" />}
                    color="bg-indigo-600"
                />
                <StatsCard
                    title="Average Score"
                    value={`${stats?.avgScore || 0}%`}
                    icon={<Award className="text-white" />}
                    color="bg-emerald-500"
                />
                <StatsCard
                    title="Tests Taken"
                    value={stats?.totalAttempts || 0} // Using attempts as proxy for tests taken for now
                    icon={<BookOpen className="text-white" />}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Performance Trend"
                    value="+12%"
                    icon={<TrendingUp className="text-white" />}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Chart */}
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Subject Performance Analysis</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performance?.subjects || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="subject"
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="accuracy" name="Accuracy %" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Recent Activity</h2>
                    <div className="space-y-4">
                        {stats?.recentActivity?.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>No recent activity</p>
                            </div>
                        ) : (
                            stats?.recentActivity?.map((activity: any) => (
                                <div key={activity._id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{activity.testId?.title || 'Unknown Test'}</h3>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {new Date(activity.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${activity.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            ))
                        )}
                        <button
                            onClick={() => navigate('/tests')}
                            className="mt-4 w-full rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                        >
                            View All Tests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${color}`}>
                {icon}
            </div>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gray-50 opacity-50 blur-xl"></div>
    </div>
);

export default Dashboard;
