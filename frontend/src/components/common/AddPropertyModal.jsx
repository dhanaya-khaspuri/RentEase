import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, MapPin, Hash, Phone, Image as ImageIcon } from 'lucide-react';

export const AddPropertyModal = ({ isOpen, onClose }) => {
  const { addProperty } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalRooms: 10,
    type: 'Co-living & Students',
    managerPhone: '+91 98765 00000',
    amenities: 'Wi-Fi, 3 Meals, Power Backup, CCTV, Housekeeping'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    addProperty({
      ...formData,
      amenities: formData.amenities.split(',').map(a => a.trim())
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold">Add New PG Property</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">PG / Property Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Skyline Luxury PG"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Location & City</label>
            <input
              type="text"
              required
              placeholder="e.g. Sector 14, Sonipat or South Campus, Delhi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Rooms</label>
              <input
                type="number"
                min={1}
                required
                value={formData.totalRooms}
                onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">PG Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Boys PG">Boys PG</option>
                <option value="Girls PG">Girls PG</option>
                <option value="Co-living & Students">Co-living & Students</option>
                <option value="Working Professionals">Working Professionals</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Manager Phone Number</label>
            <input
              type="text"
              value={formData.managerPhone}
              onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Amenities (Comma separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
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
              Save Property
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
