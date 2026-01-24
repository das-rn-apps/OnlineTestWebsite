import React, { useEffect, useState } from 'react';
import { useExamStore } from '../../store/examStore';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Box,
    ArrowUpRight,
    MoreHorizontal,
    TestTube
} from 'lucide-react';

const ExamCard = ({ exam }: { exam: any }) => (
    <div className="flex flex-col h-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200">

        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-start">
            <div className="flex gap-3">
                <div className="mt-1 p-1.5 bg-blue-50 text-blue-700 rounded-md h-fit">
                    <Box className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                        {exam.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 font-mono">
                        {exam.code}
                    </span>
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>

        <div className="px-4 flex-grow">
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {exam.description}
            </p>
        </div>

        {/* Card Footer: Metadata & Action */}
        <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-200 rounded-b-lg flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <TestTube className="w-3.5 h-3.5" />
                    <span>{exam.tests?.length || 0} Tests</span>
                </div>
            </div>

            <Link
                to={`/exams/${exam._id}`}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
                Details
                <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    </div>
);

// --- MODULE 2: The Control Bar ---
// Compact search and filter inputs.
const ControlBar = ({ onSearch, className = "" }: { onSearch: (val: string) => void, className?: string }) => (
    <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Filter by name..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-3.5 w-3.5" />
        </button>
    </div>
);

// --- MODULE 3: Main Layout ---
const ExamList: React.FC = () => {
    const { exams, isLoading, fetchExams } = useExamStore();
    const [query, setQuery] = useState('');

    useEffect(() => { fetchExams(); }, []);

    const filtered = exams.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.code.toLowerCase().includes(query.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-sm text-gray-500">Loading resources...</div>;

    return (
        <div className="min-h-screen bg-[#f2f3f5] p-8">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between">
                    <div className='flex-1 min-w-0'>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Exam Services <span className="text-gray-400 font-bold">| By Das</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            Select a certification path to begin testing.
                        </p>
                    </div>
                    <div className='w-full md:w-80'>
                        <ControlBar onSearch={setQuery} />
                    </div>
                </div>

                {/* Search & Filter */}

                {/* Grid Layout: Compact columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filtered.map((exam) => (
                        <ExamCard key={exam._id} exam={exam} />
                    ))}
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No exams match your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamList;