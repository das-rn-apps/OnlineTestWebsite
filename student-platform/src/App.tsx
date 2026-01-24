import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ExamList from './pages/exams/ExamList';
import TestList from './pages/tests/TestList';
import TestAttempt from './pages/tests/TestAttempt';
import ResultDetail from './pages/results/ResultDetail';
import SingleExam from './pages/exams/SingleExam';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/exams" element={<ExamList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route
                    path="/exams"
                    element={
                        <ProtectedRoute>
                            <ExamList />
                        </ProtectedRoute>
                    }
                /> */}
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
                <Route path="/" element={<Navigate to="/exams" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
