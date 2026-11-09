import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Calendar, IndianRupee, Phone, Mail } from 'lucide-react';

export const AddTenantModal = ({ isOpen, onClose }) => {
  const { data, activePropertyId, addTenant } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: activePropertyId,
    roomId: '',
    monthlyRent: 8000,
    deposit: 16000,
    joinedDate: new Date().toISOString().split('T')[0],
    leaseEnd: '2025-06-30'
  });

  if (!isOpen) return null;

  // Filter rooms for selected property that still have space
  const availableRooms = data.rooms.filter(r => r.propertyId === formData.propertyId);

  const handlePropertyChange = (propId) => {
    setFormData(prev => ({
      ...prev,
      propertyId: propId,
      roomId: ''
    }));
  };

  const handleRoomChange = (roomId) => {
    const selectedRoom = data.rooms.find(r => r.id === roomId);
    setFormData(prev => ({
      ...prev,
      roomId: roomId,
      monthlyRent: selectedRoom ? selectedRoom.rent : prev.monthlyRent,
      deposit: selectedRoom ? selectedRoom.rent * 2 : prev.deposit
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.roomId) {
      alert("Please enter tenant name and select an assigned room.");
      return;
    }

    addTenant(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold">Add & Assign New Tenant</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Batra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98111 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="vikram@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Property & Room assignment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Property</label>
              <select
                value={formData.propertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {data.properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Room</label>
              <select
                required
                value={formData.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Room</option>
                {availableRooms.map(r => (
                  <option 
                    key={r.id} 
                    value={r.id}
                    disabled={r.occupied >= r.capacity}
                  >
                    Room {r.roomNumber} ({r.occupied}/{r.capacity} beds occupied) — ₹{r.rent}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Joining / Move-in Date</label>
              <input
                type="date"
                required
                value={formData.joinedDate}
                onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Lease End Date</label>
              <input
                type="date"
                required
                value={formData.leaseEnd}
                onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Confirm & Assign
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
