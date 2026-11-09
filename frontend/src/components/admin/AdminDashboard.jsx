import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatsCard } from '../common/StatsCard';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  DoorOpen, 
  IndianRupee, 
  Wrench, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Search,
  Filter,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';

export const AdminDashboard = () => {
  const { data, toggleUserStatus, setReceiptModalData } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'properties' | 'complaints'
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Platform Metrics
  const totalProperties = data.properties.length;
  const totalRooms = data.rooms.length;
  const totalBeds = data.rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = data.rooms.reduce((acc, r) => acc + r.occupied, 0);
  const totalUsers = data.users.length;
  const totalTenants = data.users.filter(u => u.role === 'tenant').length;
  const totalOwners = data.users.filter(u => u.role === 'owner').length;
  
  const platformRevenue = data.payments
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const activeComplaints = data.complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              RentEase Central Command
            </h1>
            <p className="text-purple-200/80 text-xs sm:text-sm mt-1 max-w-xl">
              Platform-wide visibility over PG owners, tenant onboarding, property health, and complaint resolution.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/10">
              System Health: 100% Operational
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-medium">
          {[
            { id: 'overview', label: '📊 Platform Metrics & System Health' },
            { id: 'users', label: `👥 User Management (${data.users.length})` },
            { id: 'properties', label: `🏢 Properties Directory (${data.properties.length})` },
            { id: 'complaints', label: `🔧 Platform-wide Complaints (${data.complaints.length})` }
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

      {/* Tab 1: PLATFORM METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Properties"
              value={totalProperties}
              subtitle="Registered PG facilities"
              icon={Building2}
              color="purple"
            />
            <StatsCard
              title="Total Rooms / Beds"
              value={`${totalRooms} / ${totalBeds}`}
              subtitle={`${occupiedBeds} beds occupied (${Math.round((occupiedBeds/totalBeds)*100)}%)`}
              icon={DoorOpen}
              color="blue"
            />
            <StatsCard
              title="Platform Users"
              value={totalUsers}
              subtitle={`${totalOwners} Owners • ${totalTenants} Tenants`}
              icon={Users}
              color="indigo"
            />
            <StatsCard
              title="Platform Rent Volume"
              value={`₹${platformRevenue.toLocaleString('en-IN')}`}
              subtitle="Total transacted via RentEase"
              icon={IndianRupee}
              color="emerald"
            />
          </div>

          {/* Quick Monitoring Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Properties Audit */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Properties Oversight</h3>
              <div className="space-y-3">
                {data.properties.map(p => {
                  const pRooms = data.rooms.filter(r => r.propertyId === p.id);
                  const pOcc = pRooms.reduce((acc, r) => acc + r.occupied, 0);
                  const pCap = pRooms.reduce((acc, r) => acc + r.capacity, 0);
                  return (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.location}</div>
                        <div className="text-[11px] text-brand-700 font-medium mt-1">
                          Owner: Rahul Verma • Phone: {p.managerPhone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800">{pOcc} / {pCap} Beds</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Active
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Complaints Heatmap */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Platform Ticket Health</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900">Unresolved Tickets</div>
                    <div className="text-[11px] text-amber-700">Currently awaiting action or technician dispatch</div>
                  </div>
                  <div className="text-2xl font-black text-amber-900">{activeComplaints}</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-900">Resolved Complaints</div>
                    <div className="text-[11px] text-emerald-700">Successfully closed with tenant satisfaction</div>
                  </div>
                  <div className="text-2xl font-black text-emerald-900">
                    {data.complaints.filter(c => c.status === 'Resolved').length}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: USER MANAGEMENT (Block / Unblock) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Management & Access Control</h2>
              <p className="text-xs text-slate-500">Block or unblock users platform-wide and inspect roles</p>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              {['all', 'tenant', 'owner', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    userRoleFilter === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Contact Info</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users
                  .filter(u => userRoleFilter === 'all' || u.role === userRoleFilter)
                  .map(u => {
                    const isBlocked = u.status === 'blocked';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400">ID: {u.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'owner' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          <div>{u.email}</div>
                          <div className="text-[11px] text-slate-400">{u.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          {isBlocked ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                              <Ban className="w-3 h-3" />
                              <span>Blocked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isBlocked
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {isBlocked ? 'Unblock User' : 'Block User'}
                            </button>
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

      {/* Tab 3: PROPERTIES DIRECTORY */}
      {activeTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.properties.map(p => {
            const pRooms = data.rooms.filter(r => r.propertyId === p.id);
            const pTenants = data.users.filter(u => u.propertyId === p.id);
            const pOcc = pRooms.reduce((acc, r) => acc + r.occupied, 0);
            const pCap = pRooms.reduce((acc, r) => acc + r.capacity, 0);
            return (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      {p.type}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.location}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl text-center text-xs">
                  <div>
                    <div className="text-slate-400">Total Rooms</div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{pRooms.length}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Beds Occupied</div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{pOcc} / {pCap}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Tenants</div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{pTenants.length}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <div className="font-bold text-slate-800 mb-1">Key Amenities:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.amenities.map(a => (
                      <span key={a} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: PLATFORM COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Platform-wide Complaint Audit</h2>
            <p className="text-xs text-slate-500">Supervise owner response times and technician assignments across all PG properties</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Ticket & Category</th>
                  <th className="py-3 px-6">PG Property</th>
                  <th className="py-3 px-6">Tenant & Room</th>
                  <th className="py-3 px-6">Priority</th>
                  <th className="py-3 px-6">Assigned Technician</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.complaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{c.category}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{c.propertyName}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <div>{c.tenantName}</div>
                      <div className="text-[11px] text-slate-400">Room #{c.roomNumber}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {c.assignedTo || <span className="text-amber-600 italic">Unassigned</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        c.status === 'Assigned' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
