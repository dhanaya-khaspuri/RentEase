import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  User, 
  Receipt as ReceiptIcon,
  Share2
} from 'lucide-react';

export const ReceiptModal = () => {
  const { receiptModalData, setReceiptModalData } = useApp();

  if (!receiptModalData) return null;

  const payment = receiptModalData;
  const invoiceNumber = `RE-INV-${payment.id.replace(/[^0-9a-zA-Z]/g, '').slice(-8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 transform transition-all">
        
        {/* Top actions bar */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ReceiptIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
              Official Digital Rent Receipt
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setReceiptModalData(null)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-y-6 print:p-0">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">RentEase</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Digital PG & Tenant Management</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-800">{payment.propertyName}</div>
                <div>Room #{payment.roomNumber} • Managed via RentEase Platform</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>PAYMENT VERIFIED</span>
              </div>
              <div className="text-xs font-mono text-slate-500">Invoice: {invoiceNumber}</div>
              <div className="text-xs text-slate-500">Date: {payment.paymentDate || 'Just now'}</div>
            </div>
          </div>

          {/* Tenant & Payment Meta Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Billed To (Tenant)</span>
              <div className="font-bold text-slate-900 text-sm">{payment.tenantName}</div>
              <div className="text-slate-600">Room #{payment.roomNumber}</div>
              <div className="text-slate-500">Month: {payment.month}</div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Transaction Details</span>
              <div className="font-semibold text-slate-800">
                Mode: <span className="font-bold text-brand-700">{payment.paymentMethod || 'Online'}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-600 truncate">
                Txn: {payment.transactionId || 'TXN_SIMULATED_2024'}
              </div>
              <div className="text-slate-500 text-[11px] truncate">
                Status: Completed & Reconciled
              </div>
            </div>
          </div>

          {/* Itemized Breakup */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-medium">Room Accommodation Rent (Room #{payment.roomNumber})</td>
                  <td className="py-3 px-4 text-slate-500">{payment.month}</td>
                  <td className="py-3 px-4 text-right font-medium">₹{(payment.amount * 0.85).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Amenities & Utilities (Wi-Fi, Water, Power Backup)</td>
                  <td className="py-3 px-4 text-slate-500">{payment.month}</td>
                  <td className="py-3 px-4 text-right font-medium">₹{(payment.amount * 0.15).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                    Total Amount Paid:
                  </td>
                  <td className="py-3 px-4 text-right text-base font-extrabold text-brand-700">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Signature seal */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>System generated receipt • No physical signature required</span>
            </div>
            <div className="text-right">
              <span className="font-serif italic text-slate-600 text-xs font-semibold">Rahul Verma</span>
              <div className="text-[10px] text-slate-400">Authorized PG Signatory</div>
            </div>
          </div>

        </div>

        {/* Bottom dismiss */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setReceiptModalData(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
};
