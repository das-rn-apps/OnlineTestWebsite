import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CreditCard, Ticket, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/users', label: 'Users', icon: <Users size={20} /> },
        { path: '/exams', label: 'Exams & Tests', icon: <BookOpen size={20} /> },
        { path: '/subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} /> },
        { path: '/coupons', label: 'Coupons', icon: <Ticket size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">AdminPanel</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm font-medium'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 px-4 py-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
