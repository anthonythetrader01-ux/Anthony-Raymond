import React from 'react';
import { Package, ShieldCheck, Printer, ArrowRight, Truck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderHistoryView: React.FC = () => {
  const { orders, setActiveView } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Order History & Shipments
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track real-time carrier delivery status, cryptographic payment receipts, and dispatch notices.
          </p>
        </div>
        <button
          onClick={() => setActiveView('store')}
          className="px-4 py-2 bg-neutral-100 hover:bg-white text-neutral-900 rounded-lg text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          Browse Collection
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-neutral-900/60 rounded-2xl border border-neutral-800 p-8">
          <div className="w-14 h-14 rounded-full bg-neutral-800 mx-auto flex items-center justify-center text-neutral-500">
            <Package className="w-7 h-7 stroke-1" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-base font-semibold text-white">No orders placed yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Complete a secure checkout using card, Apple Pay, or Klarna to generate your first order with real-time inventory deduction.
            </p>
          </div>
          <button
            onClick={() => setActiveView('store')}
            className="px-5 py-2.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg space-y-5 p-6"
            >
              {/* Order Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-white font-mono font-bold text-xs">
                    AS
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-mono">{order.id}</div>
                    <div className="text-xs text-neutral-400">Placed on {order.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400">{order.status}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">Est. {order.estimatedDelivery}</div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Parcel Grid Station Pickup Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black border border-neutral-800 text-xs gap-2">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-medium flex items-center gap-1.5">
                      <span>Pickup Station:</span>
                      <strong className="text-emerald-400">{order.shipping.pickupStation}</strong>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Parcel Grid Waybill: <strong className="text-white">{order.trackingNumber}</strong>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right text-[11px] font-mono text-neutral-400">
                  SMS PIN sent to {order.shipping.phone}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.productName} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-neutral-800" 
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{item.productName}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold text-white tabular-nums">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial & Security Footer */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Paid via {order.payment.method.toUpperCase()} ({order.payment.transactionId})
                  </span>
                </div>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-neutral-400 text-xs">Total:</span>
                  <span className="text-base font-bold text-emerald-400 tabular-nums">
                    KSh {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
