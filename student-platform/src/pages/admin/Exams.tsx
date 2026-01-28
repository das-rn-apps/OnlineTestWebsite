import React, { useEffect, useState } from 'react';
import adminExamService, { Exam, CreateExamDTO } from '../../services/admin/exam.service';
import { Trash2, Plus, X } from 'lucide-react';

const AdminExams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState<CreateExamDTO>({
        name: '',
        code: '',
        description: '',
        category: 'government',
        subjects: [],
        instructions: ''
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await adminExamService.getAllExams({ limit: 100 }); // Fetch all for now
            setExams(response.data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;
        try {
            await adminExamService.deleteExam(id);
            fetchExams();
        } catch (error) {
            alert('Failed to delete exam');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add dummy subject if none provided to satisfy schema
            const payload = { ...formData };
            if (payload.subjects.length === 0) {
                payload.subjects.push({
                    name: 'General Awareness',
                    code: 'GEN',
                    topics: []
                });
            }

            await adminExamService.createExam(payload);
            setShowModal(false);
            setFormData({
                name: '',
                code: '',
                description: '',
                category: 'government',
                subjects: [],
                instructions: ''
            });
            fetchExams();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create exam');
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
                    <p className="text-gray-500">Create and manage exams and categories.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Exam
                </button>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Code</th>
                            <th className="px-6 py-3">Exam Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : exams.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center">No exams found</td></tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{exam.code}</td>
                                    <td className="px-6 py-4">{exam.name}</td>
                                    <td className="px-6 py-4 capitalize">{exam.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${exam.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {exam.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(exam._id)}
                                            className="ml-2 text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simple Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create New Exam</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                                <input
                                    type="text" required
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code (Unique)</label>
                                    <input
                                        type="text" required
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="government">Government</option>
                                        <option value="engineering">Engineering</option>
                                        <option value="medical">Medical</option>
                                        <option value="banking">Banking</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    required rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Create Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExams;
