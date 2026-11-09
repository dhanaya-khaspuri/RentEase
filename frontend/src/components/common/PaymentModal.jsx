import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Receipt,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PaymentModal = () => {
  const { paymentModalData, setPaymentModalData, processPayment, setReceiptModalData } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // 'UPI' | 'Card' | 'Cash'
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('tenant@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cashNotes, setCashNotes] = useState('Handed cash directly to building manager');

  if (!paymentModalData) return null;

  const { payment, tenant } = paymentModalData;
  const amount = payment.amount || 8000;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const completed = processPayment({
        paymentId: payment.id,
        method: selectedMethod,
        transactionId: `TXN_${selectedMethod}_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        notes: selectedMethod === 'Cash' ? cashNotes : `Paid via ${selectedMethod}`
      });

      // Close payment modal and open official receipt
      setPaymentModalData(null);
      if (completed) {
        setReceiptModalData(completed);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                Simulated Gateway
              </span>
              <span className="text-xs text-brand-200">256-Bit SSL Mock</span>
            </div>
            <h3 className="text-xl font-bold mt-1">Pay Rent — {payment.month}</h3>
            <p className="text-xs text-brand-200/90">{payment.propertyName} • Room #{payment.roomNumber}</p>
          </div>
          <button
            onClick={() => setPaymentModalData(null)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="bg-brand-50/60 px-6 py-4 border-b border-brand-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Payable Amount</span>
            <div className="text-2xl font-black text-slate-900">
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Base Rent: ₹{(amount * 0.85).toFixed(0)}</div>
            <div>Maintenance: ₹{(amount * 0.15).toFixed(0)}</div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  selectedMethod === 'UPI'
                    ? 'border-brand-600 bg-brand-50/60 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Card')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  selectedMethod === 'Card'
                    ? 'border-brand-600 bg-brand-50/60 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Debit / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('Cash')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  selectedMethod === 'Cash'
                    ? 'border-brand-600 bg-brand-50/60 text-brand-700 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Cash at Desk</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {selectedMethod === 'UPI' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Scan QR Code via any UPI App</div>
                  <div className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                  Zero Extra Fee
                </span>
              </div>

              {/* QR Mock */}
              <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-white relative group cursor-pointer">
                  <div className="w-full h-full border-2 border-dashed border-white/60 rounded flex items-center justify-center text-[10px] text-center font-mono p-1">
                    [QR_UPI_{amount}]
                  </div>
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <div className="font-semibold text-slate-800">VPA: rentease.pg@icici</div>
                  <div className="text-[11px]">Payee: {payment.propertyName}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">✓ Verified Merchant</div>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Or enter UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="yourname@okhdfcbank"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'Card' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Valid Thru</label>
                  <input
                    type="text"
                    defaultValue="08/28"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">CVV</label>
                  <input
                    type="password"
                    defaultValue="874"
                    maxLength={3}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'Cash' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-[11px] font-medium text-slate-600 block">
                Cash Payment Details / Manager Handover Note
              </label>
              <textarea
                rows={3}
                value={cashNotes}
                onChange={(e) => setCashNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Paid in cash to manager Ramesh Kumar on 5th Nov..."
              />
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                Note: Cash payments generate a verified receipt with stamp automatically recorded in the owner ledger.
              </p>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Payment Gateway...</span>
              </>
            ) : (
              <>
                <span>Complete Payment of ₹{amount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Simulated Mock Flow • Generates Instant Receipt & Txn ID</span>
          </div>
        </div>

      </div>
    </div>
  );
};
