import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExamStore } from '../../store/examStore';
import {
    Clock, FileText, ChevronRight, Info,
    BookOpen, ExternalLink, Calendar, User
} from 'lucide-react';

const TestList: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isLoading, fetchExamById, selectedExam } = useExamStore();

    useEffect(() => {
        if (id) fetchExamById(id);
    }, [id, fetchExamById]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!selectedExam) return null;

    return (
        <div className="min-h-screen bg-[#f2f3f5] text-sm">
            {/* AWS STYLE BREADCRUMBS */}
            <nav className="bg-white border-b border-gray-300 px-6 py-2">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500">
                    <Link to="/exams" className="hover:text-blue-600 hover:underline">Exams</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900 font-medium">{selectedExam.code}</span>
                </div>
            </nav>

            {/* AWS STYLE TOP HEADER */}
            <header className="bg-white border-b border-gray-300 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded text-blue-700">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{selectedExam.name}</h1>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                                    {selectedExam.code}
                                </span>
                                <span className="capitalize">{selectedExam.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT SIDE: SYLLABUS (66% Width) */}
                    <div className="col-span-12 lg:col-span-8 space-y-4">
                        <div className="bg-white border border-gray-300 rounded">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Info className="w-4 h-4 text-blue-600" /> Syllabus Breakdown
                                </h2>
                            </div>

                            <div className="p-0">
                                {selectedExam.subjects?.map((subject) => (
                                    <details key={subject._id} className="group border-b border-gray-100 last:border-0" open>
                                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                                            <div className="flex items-center gap-3">
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                                <span className="font-bold text-gray-700">{subject.name}</span>
                                                <span className="text-[10px] font-mono text-gray-400">{subject.code}</span>
                                            </div>
                                        </summary>

                                        <div className="px-10 pb-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            {subject.topics.map((topic: any) => (
                                                <div key={topic._id} className="pt-2">
                                                    <h4 className="font-semibold text-blue-800 text-xs mb-1 flex items-center gap-1.5 uppercase">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                        {topic.name}
                                                    </h4>
                                                    <ul className="space-y-1 border-l border-gray-200 ml-0.5 pl-3">
                                                        {topic.subtopics.map((sub: any, idx: number) => (
                                                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                                                <span className="text-gray-300">-</span> {sub}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: TESTS & METADATA (33% Width) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">

                        {/* AVAILABLE TESTS SECTION */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Available Tests</h3>
                            <div className="space-y-2">
                                {selectedExam.tests?.map((test) => (
                                    <div key={test._id} className="bg-white border border-gray-300 rounded p-3 hover:border-blue-500 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-800 text-sm">{test.title}</h4>
                                            <Link to={`/instructions/${test._id}`} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}m</div>
                                            <div className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.totalQuestions} Questions</div>
                                        </div>
                                        <Link
                                            to={`/instructions/${test._id}`}
                                            className="mt-3 block w-full text-center py-1.5 border border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-colors"
                                        >
                                            Launch Test
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* EXAM INFO CARD */}
                        <div className="bg-white border border-gray-300 rounded shadow-sm">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 text-xs uppercase">Exam Details</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Author</div>
                                    <div className="text-gray-900 font-medium text-right">{(selectedExam.createdBy as any)?.name || 'Admin'}</div>

                                    <div className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated</div>
                                    <div className="text-gray-900 font-medium text-right">{new Date(selectedExam.updatedAt).toLocaleDateString()}</div>
                                </div>
                                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 text-[11px] text-blue-800 leading-relaxed">
                                    Curriculum is updated based on the latest 2024 patterns and verified sources.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default TestList;