import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SubscriptionPage from './pages/Subscription';
import ExamList from './pages/exams/ExamList';
import TestList from './pages/tests/TestList';
import TestAttempt from './pages/tests/TestAttempt';
import ResultDetail from './pages/results/ResultDetail';
import SingleExam from './pages/exams/SingleExam';

// Admin Imports
import AdminLayout from './components/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import { Exams as AdminExams, Subscriptions as AdminSubscriptions, Coupons as AdminCoupons } from './pages/admin/Placeholders';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const RoleBasedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({
    children,
    allowedRoles,
}) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" />;

    const userRole = user?.roleId?.name || user?.roleName;

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                            <AdminLayout />
                        </RoleBasedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="exams" element={<AdminExams />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                </Route>

                {/* Student Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subscription"
                    element={
                        <ProtectedRoute>
                            <SubscriptionPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/exams" element={<ExamList />} />
                <Route
                    path="/exams/:id"
                    element={
                        <ProtectedRoute>
                            <SingleExam />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tests"
                    element={
                        <ProtectedRoute>
                            <TestList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/test-attempt/:id"
                    element={
                        <ProtectedRoute>
                            <TestAttempt />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/results/:attemptId"
                    element={
                        <ProtectedRoute>
                            <ResultDetail />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
