import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Clock, Wrench, CheckCheck, UserCheck } from 'lucide-react';

export const ComplaintActionModal = ({ complaint, isOpen, onClose }) => {
  const { updateComplaintStatus } = useApp();
  const [status, setStatus] = useState(complaint?.status || 'Pending');
  const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || 'Ramesh (Plumber)');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateComplaintStatus(complaint.id, status, assignedTo, resolutionNotes);
    onClose();
  };

  const steps = [
    { key: 'Pending', label: '1. Pending' },
    { key: 'Assigned', label: '2. Assigned' },
    { key: 'In Progress', label: '3. In Progress' },
    { key: 'Resolved', label: '4. Resolved' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Ticket Action</span>
            <h3 className="text-base font-bold">Update Complaint #{complaint.id.replace('cmp_', '')}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Issue Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1">
            <div className="font-bold text-slate-800">{complaint.title}</div>
            <div className="text-slate-500">
              Tenant: {complaint.tenantName} • Room #{complaint.roomNumber} ({complaint.category})
            </div>
            <div className="text-slate-600 italic mt-1">"{complaint.description}"</div>
          </div>

          {/* Lifecycle Stepper Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Ticket Lifecycle Status</label>
            <div className="grid grid-cols-2 gap-2">
              {steps.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStatus(s.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                    status === s.key
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs ring-1 ring-brand-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Assign Staff / Technician</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Ramesh Kumar (Plumber - +91 9811122233)"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Resolution Work Log / Notes</label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. New washer fitted, water pressure verified by tenant..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
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
              Update Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
