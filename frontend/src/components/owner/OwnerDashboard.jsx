import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatsCard } from '../common/StatsCard';
import { AddPropertyModal } from '../common/AddPropertyModal';
import { AddRoomModal } from '../common/AddRoomModal';
import { AddTenantModal } from '../common/AddTenantModal';
import { PublishNoticeModal } from '../common/PublishNoticeModal';
import { ComplaintActionModal } from '../common/ComplaintActionModal';
import { 
  Building2, 
  DoorOpen, 
  Users, 
  IndianRupee, 
  Wrench, 
  Megaphone, 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Receipt,
  FileText,
  Pin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OwnerDashboard = () => {
  const { 
    data, 
    activePropertyId, 
    setActivePropertyId, 
    removeTenant, 
    deleteNotice,
    setReceiptModalData,
    processPayment
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rooms' | 'tenants' | 'payments' | 'complaints' | 'notices'
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showPublishNotice, setShowPublishNotice] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected property
  const activeProperty = data.properties.find(p => p.id === activePropertyId) || data.properties[0];
  const propertyRooms = data.rooms.filter(r => r.propertyId === activePropertyId);

  // Live Occupancy Stats for Active Property
  const totalRooms = propertyRooms.length;
  const totalBeds = propertyRooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = propertyRooms.reduce((acc, r) => acc + r.occupied, 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupiedRoomsCount = propertyRooms.filter(r => r.occupied > 0).length;
  const availableRoomsCount = propertyRooms.filter(r => r.occupied < r.capacity).length;
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Rent Calculations for Active Property
  const propertyPayments = data.payments.filter(p => p.propertyId === activePropertyId);
  const totalRentExpected = propertyPayments.reduce((acc, p) => acc + p.amount, 0);
  const rentCollected = propertyPayments
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingRent = propertyPayments
    .filter(p => p.status === 'Pending')
    .reduce((acc, p) => acc + p.amount, 0);

  // Complaints for Active Property
  const propertyComplaints = data.complaints.filter(c => c.propertyId === activePropertyId);
  const pendingComplaintsCount = propertyComplaints.filter(c => c.status !== 'Resolved').length;

  // Notices for Active Property
  const propertyNotices = data.notices.filter(n => n.propertyId === activePropertyId || n.propertyId === 'all');

  // Tenants in Active Property
  const propertyTenants = data.users.filter(u => u.role === 'tenant' && u.propertyId === activePropertyId);

  // Pie chart data
  const pieData = [
    { name: 'Occupied Beds', value: occupiedBeds, color: '#3b82f6' },
    { name: 'Available Beds', value: availableBeds, color: '#e2e8f0' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Building2 className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Owner Dashboard • Multi-Property Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeProperty?.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              📍 {activeProperty?.location} • {activeProperty?.type}
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowAddTenant(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Add Tenant</span>
            </button>
            <button
              onClick={() => setShowAddRoom(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all border border-white/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
            <button
              onClick={() => setShowAddProperty(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-xs transition-all border border-white/10"
            >
              <Building2 className="w-4 h-4" />
              <span>New PG</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-medium">
          {[
            { id: 'overview', label: '📊 Overview & Analytics' },
            { id: 'rooms', label: `🚪 Rooms & Occupancy (${propertyRooms.length})` },
            { id: 'tenants', label: `👨🎓 Tenants Directory (${propertyTenants.length})` },
            { id: 'payments', label: `💰 Rent Ledger (${propertyPayments.length})` },
            { id: 'complaints', label: `🔧 Complaints & Tickets (${propertyComplaints.length})` },
            { id: 'notices', label: `📢 Notice Board (${propertyNotices.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Live Occupancy Metric Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Live Occupancy Summary
              </h2>
              <span className="text-xs text-brand-600 font-semibold">
                Updated Real-time
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Rooms"
                value={totalRooms}
                subtitle={`${totalBeds} total beds capacity`}
                icon={DoorOpen}
                color="blue"
              />
              <StatsCard
                title="Occupied Rooms"
                value={occupiedRoomsCount}
                subtitle={`${occupiedBeds} beds currently occupied`}
                icon={Users}
                color="indigo"
              />
              <StatsCard
                title="Available Rooms"
                value={availableRoomsCount}
                subtitle={`${availableBeds} beds ready for move-in`}
                icon={CheckCircle2}
                color="emerald"
              />
              <StatsCard
                title="Occupancy Rate"
                value={`${occupancyPercentage}%`}
                subtitle="Live property utilization"
                icon={TrendingUp}
                color={occupancyPercentage >= 80 ? "emerald" : "amber"}
                trend={occupancyPercentage >= 80 ? "High Demand" : "Beds Available"}
              />
            </div>
          </div>

          {/* Financials Metric Cards */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Monthly Rent Collection (Current Cycle)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Rent Expected"
                value={`₹${totalRentExpected.toLocaleString('en-IN')}`}
                subtitle="From all signed tenant leases"
                icon={IndianRupee}
                color="purple"
              />
              <StatsCard
                title="Rent Collected"
                value={`₹${rentCollected.toLocaleString('en-IN')}`}
                subtitle={`${Math.round((rentCollected / (totalRentExpected || 1)) * 100)}% collected so far`}
                icon={CheckCircle2}
                color="emerald"
              />
              <StatsCard
                title="Pending Rent"
                value={`₹${pendingRent.toLocaleString('en-IN')}`}
                subtitle="Awaiting tenant payment"
                icon={AlertTriangle}
                color="rose"
              />
            </div>
          </div>

          {/* Visual Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Monthly Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Revenue & Rent Trends</h3>
                  <p className="text-xs text-slate-500">Expected vs Actual Rent collected (Past 6 Months)</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
                  Fiscal Year 2024
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.analyticsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="expected" name="Expected Rent" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="collected" name="Collected Rent" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Radial / Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bed Allocation</h3>
                <p className="text-xs text-slate-500">Occupied vs Available beds ratio</p>
              </div>
              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-2xl font-black text-slate-800">{occupancyPercentage}%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Occupied</div>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-slate-600">Occupied Beds:</span>
                  </span>
                  <span className="font-bold text-slate-900">{occupiedBeds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="text-slate-600">Available Beds:</span>
                  </span>
                  <span className="font-bold text-slate-900">{availableBeds}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Inspection Row: Recent Complaints + Latest Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Urgent Complaints Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900">Active Complaints ({pendingComplaintsCount})</h3>
                </div>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {propertyComplaints.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50/60 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">{c.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Room #{c.roomNumber} • Raised by {c.tenantName}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                      c.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                      c.status === 'Assigned' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Notices Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-base font-bold text-slate-900">Broadcast Notices</h3>
                </div>
                <button
                  onClick={() => setShowPublishNotice(true)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish New</span>
                </button>
              </div>

              <div className="space-y-3">
                {propertyNotices.slice(0, 3).map(n => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {n.isPinned && <Pin className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />}
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: ROOMS & OCCUPANCY (Matches the table in the prompt) */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Room Inventory & Occupancy Tracker</h2>
              <p className="text-xs text-slate-500">Manage individual room capacity, occupancy status, and monthly rent</p>
            </div>
            <button
              onClick={() => setShowAddRoom(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Room</th>
                  <th className="py-3 px-6">Type & Amenities</th>
                  <th className="py-3 px-6 text-center">Capacity</th>
                  <th className="py-3 px-6 text-center">Occupied</th>
                  <th className="py-3 px-6">Monthly Rent</th>
                  <th className="py-3 px-6">Occupancy Status</th>
                  <th className="py-3 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {propertyRooms.map(r => {
                  const isFull = r.occupied >= r.capacity;
                  const isVacant = r.occupied === 0;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                        Room {r.roomNumber}
                        <span className="block text-[11px] font-normal text-slate-400">Floor {r.floor}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-700">{r.type}</div>
                        <div className="text-[11px] text-slate-400 space-x-2">
                          {r.hasAC && <span className="text-brand-600 font-medium">AC</span>}
                          {r.hasAttachedBath && <span>• Attached Bath</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700">
                        {r.capacity} beds
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-slate-900">{r.occupied}</span>
                        <span className="text-slate-400"> / {r.capacity}</span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{r.rent.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-400 block">per bed/month</span>
                      </td>
                      <td className="py-4 px-6">
                        {isFull ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Full (0 Vacant)
                          </span>
                        ) : isVacant ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Fully Available
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {r.capacity - r.occupied} Bed(s) Available
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isFull ? (
                          <button
                            onClick={() => setShowAddTenant(true)}
                            className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            + Assign Tenant
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No vacancy</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 3: TENANTS DIRECTORY */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tenants Roster & Leases</h2>
              <p className="text-xs text-slate-500">Track assigned rooms, joining date, lease tenure, and rent obligations</p>
            </div>
            <button
              onClick={() => setShowAddTenant(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <Users className="w-4 h-4" />
              <span>Add Tenant</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Tenant Name</th>
                  <th className="py-3 px-6">Assigned Room</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Monthly Rent</th>
                  <th className="py-3 px-6">Lease Tenure</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {propertyTenants.map(t => {
                  const room = data.rooms.find(r => r.id === t.roomId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="text-[11px] text-slate-400">ID: {t.id}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-brand-700">
                        Room {room ? room.roomNumber : 'N/A'}
                        <span className="block text-[11px] text-slate-400 font-normal">Floor {room?.floor || 1}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div>{t.phone}</div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{t.monthlyRent.toLocaleString('en-IN')}
                        <span className="block text-[10px] font-normal text-slate-400">Deposit: ₹{t.deposit}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div>Since: {t.joinedDate}</div>
                        <div className="text-[11px] text-slate-400">Ends: {t.leaseEnd}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Resident
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Vacate tenant ${t.name} and free up room bed?`)) {
                              removeTenant(t.id);
                            }
                          }}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Vacate / Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 4: RENT PAYMENTS LEDGER */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Rent Ledger & Payment Reconciliations</h2>
              <p className="text-xs text-slate-500">Track paid vs pending rent across all rooms with simulated transaction receipts</p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  paymentFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({propertyPayments.length})
              </button>
              <button
                onClick={() => setPaymentFilter('Paid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  paymentFilter === 'Paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setPaymentFilter('Pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  paymentFilter === 'Pending' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Tenant & Room</th>
                  <th className="py-3 px-6">Billing Month</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Due Date</th>
                  <th className="py-3 px-6">Payment Mode & Txn</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action / Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {propertyPayments
                  .filter(p => paymentFilter === 'all' || p.status === paymentFilter)
                  .map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{p.tenantName}</div>
                        <div className="text-[11px] text-brand-700 font-semibold">Room #{p.roomNumber}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-700">{p.month}</td>
                      <td className="py-4 px-6 font-black text-slate-900 text-sm">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{p.dueDate}</td>
                      <td className="py-4 px-6">
                        {p.status === 'Paid' ? (
                          <div>
                            <span className="font-bold text-slate-800">{p.paymentMethod}</span>
                            <span className="block font-mono text-[10px] text-slate-400">{p.transactionId}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not paid yet</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {p.status === 'Paid' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {p.status === 'Paid' ? (
                          <button
                            onClick={() => setReceiptModalData(p)}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              processPayment({
                                paymentId: p.id,
                                method: 'Cash',
                                transactionId: `TXN_CSH_${Date.now()}`,
                                notes: 'Marked paid by Owner (Cash handover)'
                              });
                            }}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                          >
                            <span>Mark Paid (Cash)</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 5: COMPLAINTS LIFECYCLE MANAGEMENT */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Maintenance & Complaints Management</h2>
              <p className="text-xs text-slate-500">Lifecycle tracker: Pending ➔ Assigned ➔ In Progress ➔ Resolved</p>
            </div>

            <div className="flex items-center space-x-2">
              {['all', 'Pending', 'Assigned', 'In Progress', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setComplaintFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    complaintFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyComplaints
              .filter(c => complaintFilter === 'all' || c.status === complaintFilter)
              .map(c => (
                <div
                  key={c.id}
                  className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80 hover:border-brand-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800 uppercase">
                          {c.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {c.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{c.title}</h4>
                      <p className="text-xs text-slate-500">
                        Room #{c.roomNumber} • Tenant: <span className="font-semibold text-slate-700">{c.tenantName}</span>
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'Assigned' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                    "{c.description}"
                  </p>

                  {/* Technician status bar */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <div className="text-slate-500">
                      {c.assignedTo ? (
                        <span className="text-slate-700 font-semibold">Assigned: {c.assignedTo}</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">⚠️ Unassigned</span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-xs shadow-xs"
                    >
                      Update / Assign
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* Tab 6: NOTICE BOARD */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Broadcasts & Notice Management</h2>
              <p className="text-xs text-slate-500">Publish property-wide notices for water cuts, gate timings, holidays, and rules</p>
            </div>

            <button
              onClick={() => setShowPublishNotice(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <Megaphone className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          </div>

          <div className="p-6 space-y-4">
            {propertyNotices.map(n => (
              <div
                key={n.id}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {n.isPinned && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800">
                        <Pin className="w-3 h-3 fill-brand-700" />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400">• Published on {n.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{n.content}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Audience: <span className="font-semibold text-slate-600">{n.propertyName}</span> • Author: {n.author}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm("Delete this notice?")) {
                      deleteNotice(n.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modals */}
      <AddPropertyModal isOpen={showAddProperty} onClose={() => setShowAddProperty(false)} />
      <AddRoomModal isOpen={showAddRoom} onClose={() => setShowAddRoom(false)} />
      <AddTenantModal isOpen={showAddTenant} onClose={() => setShowAddTenant(false)} />
      <PublishNoticeModal isOpen={showPublishNotice} onClose={() => setShowPublishNotice(false)} />
      {selectedComplaint && (
        <ComplaintActionModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

    </div>
  );
};
