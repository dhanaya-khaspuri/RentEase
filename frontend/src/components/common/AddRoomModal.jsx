import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, DoorOpen, IndianRupee, Users } from 'lucide-react';

export const AddRoomModal = ({ isOpen, onClose }) => {
  const { data, activePropertyId, addRoom } = useApp();
  const [formData, setFormData] = useState({
    propertyId: activePropertyId,
    roomNumber: '',
    floor: 1,
    capacity: 2,
    rent: 8000,
    type: 'Double Sharing',
    hasAC: true,
    hasAttachedBath: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roomNumber) return;

    addRoom({
      ...formData,
      propertyId: formData.propertyId || activePropertyId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DoorOpen className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold">Add Room to Property</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Property</label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {data.properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.location.split(',')[0]})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Room Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 104 or A-201"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Floor</label>
              <input
                type="number"
                min={0}
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Capacity (Beds)</label>
              <select
                value={formData.capacity}
                onChange={(e) => {
                  const cap = Number(e.target.value);
                  const typeLabel = cap === 1 ? 'Single Deluxe' : cap === 2 ? 'Double Sharing' : cap === 3 ? 'Triple Sharing' : 'Four Sharing';
                  setFormData({ ...formData, capacity: cap, type: typeLabel });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={1}>1 (Single Room)</option>
                <option value={2}>2 (Double Sharing)</option>
                <option value={3}>3 (Triple Sharing)</option>
                <option value={4}>4 (Four Sharing)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Rent per Bed (₹)</label>
              <input
                type="number"
                step={500}
                required
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-6">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasAC}
                onChange={(e) => setFormData({ ...formData, hasAC: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Air Conditioned (AC)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasAttachedBath}
                onChange={(e) => setFormData({ ...formData, hasAttachedBath: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Attached Washroom</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
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
              Add Room
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
