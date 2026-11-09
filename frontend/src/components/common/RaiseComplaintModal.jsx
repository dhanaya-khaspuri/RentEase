import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertCircle, Wrench, Wifi, Zap, Utensils, Sparkles, ShieldAlert } from 'lucide-react';

export const RaiseComplaintModal = ({ isOpen, onClose }) => {
  const { data, raiseComplaint, activePropertyId } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
    roomNumber: '101'
  });

  if (!isOpen) return null;

  const categories = [
    { label: 'Plumbing', icon: Wrench },
    { label: 'Electrical', icon: Zap },
    { label: 'Wi-Fi / Internet', icon: Wifi },
    { label: 'Housekeeping', icon: Sparkles },
    { label: 'Food / Mess', icon: Utensils },
    { label: 'Security / Other', icon: ShieldAlert }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    raiseComplaint({
      ...formData,
      propertyId: activePropertyId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Raise a Maintenance Complaint</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Category Chips */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Issue Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.label })}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/80 text-brand-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Wash basin tap leaking water"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Low">Low (General)</option>
                <option value="Medium">Medium (Affecting daily routine)</option>
                <option value="High">High (Urgent resolution needed)</option>
                <option value="Urgent">Emergency (Leak/Spark/Safety)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Room No.</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description of Problem</label>
            <textarea
              rows={3}
              required
              placeholder="Provide exact details so the repair technician comes with the right tools..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
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
              Submit Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
