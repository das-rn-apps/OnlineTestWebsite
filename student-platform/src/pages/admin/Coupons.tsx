import React, { useEffect, useState } from 'react';
import adminCouponService, { Coupon, CreateCouponDTO } from '../../services/admin/coupon.service';
import { Plus, Trash2, X } from 'lucide-react';

const AdminCoupons: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateCouponDTO>({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await adminCouponService.getAllCoupons({ limit: 50 });
            setCoupons(response.data);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await adminCouponService.deleteCoupon(id);
            fetchCoupons();
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminCouponService.createCoupon(formData);
            setShowModal(false);
            fetchCoupons();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                    <p className="text-gray-500">Create discount codes for students.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Coupon
                </button>
            </div>

            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Code</th>
                            <th className="px-6 py-3">Discount</th>
                            <th className="px-6 py-3">Usage</th>
                            <th className="px-6 py-3">Validity</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                        ) : coupons.length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center">No coupons found</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-bold text-indigo-700">{coupon.code}</td>
                                    <td className="px-6 py-4">
                                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' INR'} OFF
                                    </td>
                                    <td className="px-6 py-4">{coupon.usageCount} / {coupon.maxUsage || '∞'}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {new Date(coupon.validFrom).toLocaleDateString()} - <br />
                                        {new Date(coupon.validUntil).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="text-gray-400 hover:text-red-600"
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

            {/* Create Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create Coupon</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Code</label>
                                    <input type="text" required className="input mt-1 block w-full border rounded p-2"
                                        value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select className="input mt-1 block w-full border rounded p-2"
                                        value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Amount</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Value</label>
                                    <input type="number" required className="input mt-1 block w-full border rounded p-2"
                                        value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Max Usage</label>
                                    <input type="number" className="input mt-1 block w-full border rounded p-2"
                                        value={formData.maxUsage || ''} onChange={e => setFormData({ ...formData, maxUsage: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Valid From</label>
                                    <input type="date" required className="input mt-1 block w-full border rounded p-2"
                                        value={formData.validFrom} onChange={e => setFormData({ ...formData, validFrom: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Valid Until</label>
                                    <input type="date" required className="input mt-1 block w-full border rounded p-2"
                                        value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea className="input mt-1 block w-full border rounded p-2" rows={2}
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white rounded py-2">Create Coupon</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
