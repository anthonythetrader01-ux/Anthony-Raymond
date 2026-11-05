import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Printer,
  Copy,
  Check,
  CreditCard,
  Building,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerShipping, PaymentDetails, Order } from '../types';

const PARCEL_GRID_STATIONS = [
  { city: 'Nairobi', name: 'Parcel Grid Westlands (Sarit Centre Hub)' },
  { city: 'Nairobi', name: 'Parcel Grid CBD (Imenti House, Tom Mboya St)' },
  { city: 'Nairobi', name: 'Parcel Grid Kilimani (Yaya Centre Station)' },
  { city: 'Nairobi', name: 'Parcel Grid Roysambu (TRM Mall Locker)' },
  { city: 'Nairobi', name: 'Parcel Grid South B (Capital Centre Agent)' },
  { city: 'Nairobi', name: 'Parcel Grid Karen (The Hub Karen Locker)' },
  { city: 'Nairobi', name: 'Parcel Grid Ngong Road (The Junction Mall)' },
  { city: 'Mombasa', name: 'Parcel Grid Mombasa (Nyali Centre Station)' },
  { city: 'Mombasa', name: 'Parcel Grid Mombasa CBD (Digo Road Agent)' },
  { city: 'Kisumu', name: 'Parcel Grid Kisumu (Mega City Hub)' },
  { city: 'Nakuru', name: 'Parcel Grid Nakuru (Westside Mall Agent)' },
  { city: 'Eldoret', name: 'Parcel Grid Eldoret (Rupa Mall Hub)' },
  { city: 'Thika', name: 'Parcel Grid Thika (Ananas Mall Station)' }
];

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    processOrder, 
    getCartSubtotal,
    setActiveView 
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'mpesa_stk_prompt' | 'confirmed'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Form State: Shipping (Parcel Grid Defaults)
  const [shipping, setShipping] = useState<CustomerShipping>({
    fullName: 'Brian Mwangi',
    email: 'brian.mwangi@gmail.com',
    phone: '0712 345 678',
    countyOrCity: 'Nairobi',
    pickupStation: 'Parcel Grid Westlands (Sarit Centre Hub)',
    shippingMethod: 'parcel_grid_station'
  });

  // Form State: Payment
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'mpesa_till' | 'card'>('mpesa_stk');
  const [mpesaNumber, setMpesaNumber] = useState('0712 345 678');
  const [manualMpesaCode, setManualMpesaCode] = useState('TK92M810XP');
  const [rawPin, setRawPin] = useState('1234');
  
  // Card fallback state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');

  if (!isCheckoutOpen) return null;

  const subtotal = getCartSubtotal();
  const isNairobi = (shipping.countyOrCity || '').toLowerCase().includes('nairobi');
  const shippingCost = subtotal >= 4000 ? 0 : (isNairobi ? 200 : 300);
  const total = subtotal + shippingCost;

  // Filter stations based on selected city
  const availableStations = PARCEL_GRID_STATIONS.filter(
    s => s.city.toLowerCase() === shipping.countyOrCity.toLowerCase()
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMpesaNumber(val);
    setShipping(prev => ({ ...prev, phone: val }));
  };

  const handleCityChange = (newCity: string) => {
    const stationsInCity = PARCEL_GRID_STATIONS.filter(
      s => s.city.toLowerCase() === newCity.toLowerCase()
    );
    setShipping(prev => ({
      ...prev,
      countyOrCity: newCity,
      pickupStation: stationsInCity[0]?.name || PARCEL_GRID_STATIONS[0].name
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.pickupStation) return;
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'mpesa_stk') {
      setStep('mpesa_stk_prompt');
    } else {
      executeOrderPlacement();
    }
  };

  const executeOrderPlacement = async () => {
    setIsProcessing(true);

    const mpesaCodeGenerated = 'TK' + Math.random().toString(36).substring(2, 8).toUpperCase() + 'KE';

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      mpesaPhoneNumber: paymentMethod === 'mpesa_stk' ? mpesaNumber : undefined,
      mpesaTransactionCode: paymentMethod === 'mpesa_stk' 
        ? mpesaCodeGenerated 
        : paymentMethod === 'mpesa_till' 
          ? manualMpesaCode 
          : undefined,
      tillNumber: paymentMethod === 'mpesa_till' ? '849201' : undefined,
      accountReference: 'LIMITLESS',
      transactionId: paymentMethod === 'card' 
        ? `FLW_${Math.random().toString(36).substring(2, 10).toUpperCase()}` 
        : mpesaCodeGenerated,
      isTokenized: true,
      securityHash: 'safaricom_daraja_' + Math.random().toString(36).substring(2, 8),
      receiptMessage: `${mpesaCodeGenerated} Confirmed. Ksh${total.toLocaleString()}.00 sent to LIMITLESS.`
    };

    try {
      const order = await processOrder(shipping, paymentDetails, 0);
      setCompletedOrder(order);
      setIsProcessing(false);
      setStep('confirmed');
    } catch {
      setIsProcessing(false);
    }
  };

  const copyTracking = () => {
    if (completedOrder?.trackingNumber) {
      navigator.clipboard.writeText(completedOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-neutral-950 border border-neutral-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Official LIMITLESS Logo */}
        <div className="px-6 py-4 bg-black border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/Official_Limitless_Logo_724589fb.png" 
              alt="LIMITLESS" 
              className="h-7 w-auto object-contain"
            />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 border-l border-neutral-800 pl-3">
              Checkout
            </span>
          </div>
          {step !== 'confirmed' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper */}
        {step !== 'confirmed' && (
          <div className="px-6 py-2.5 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'shipping' ? 'bg-white text-black font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}>
                1
              </span>
              <span className={step === 'shipping' ? 'text-white' : ''}>Parcel Grid Station</span>
            </div>
            <span className="text-neutral-800">———</span>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' || step === 'mpesa_stk_prompt' ? 'bg-emerald-400 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}>
                2
              </span>
              <span className={step === 'payment' || step === 'mpesa_stk_prompt' ? 'text-white' : ''}>
                M-PESA
              </span>
            </div>
            <span className="text-neutral-800">———</span>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-7 max-h-[82vh] overflow-y-auto">
          
          {/* STEP 1: PARCEL GRID PICKUP STATION */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white">Select Parcel Grid Pickup Station</h3>
                <p className="text-xs text-neutral-400">
                  Choose your nearest Parcel Grid station or locker for quick pickup.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-neutral-300">M-PESA Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shipping.phone}
                      onChange={handlePhoneChange}
                      placeholder="07XX XXX XXX"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-neutral-500">Parcel Grid pickup PIN sent here</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-neutral-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>

                {/* City & Station Selector */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-mono uppercase text-neutral-300">City / County</label>
                  <select
                    value={shipping.countyOrCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-500 cursor-pointer"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                    <option value="Thika">Thika</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nearest Parcel Grid Pickup Station</span>
                  </label>
                  <select
                    value={shipping.pickupStation}
                    onChange={(e) => setShipping({ ...shipping, pickupStation: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {availableStations.map((st) => (
                      <option key={st.name} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">Parcel Grid Station Pickup</div>
                    <div className="text-[11px] text-neutral-400">Available for collection within 24-48 hours</div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    {subtotal >= 4000 ? 'FREE' : `KSh ${shippingCost}`}
                  </span>
                </div>
              </div>

              {/* Bottom Submit */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-xs font-mono text-neutral-400">
                  Total: <strong className="text-white text-sm">KSh {total.toLocaleString()}</strong>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer shadow active:scale-98 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD (M-PESA) */}
          {step === 'payment' && (
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white">Pay with M-PESA</h3>
                <p className="text-xs text-neutral-400">
                  Instant Safaricom M-PESA payment for Parcel Grid dispatch.
                </p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-black rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa_stk')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'mpesa_stk' 
                      ? 'bg-emerald-500 text-black font-bold shadow' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>STK Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa_till')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'mpesa_till' 
                      ? 'bg-emerald-500 text-black font-bold shadow' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Till 849201</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card' 
                      ? 'bg-emerald-500 text-black font-bold shadow' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
              </div>

              {/* STK Push input */}
              {paymentMethod === 'mpesa_stk' && (
                <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-neutral-300">
                      Safaricom Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full bg-black border border-neutral-700 rounded-lg px-3.5 py-3 text-base text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    A prompt will appear on your phone asking you to enter your M-PESA PIN to pay <strong>KSh {total.toLocaleString()}</strong>.
                  </p>
                </div>
              )}

              {/* Manual Till */}
              {paymentMethod === 'mpesa_till' && (
                <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                  <div className="space-y-1 font-mono">
                    <div className="text-emerald-400 font-bold">1. Go to Lipa Na M-PESA &rarr; Buy Goods</div>
                    <div>2. Enter Till No: <strong className="text-white text-sm bg-neutral-800 px-2 py-0.5 rounded">849 201</strong></div>
                    <div>3. Enter Amount: <strong className="text-white">KSh {total.toLocaleString()}</strong></div>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 space-y-1">
                    <label className="font-mono text-neutral-300">Enter M-PESA Confirmation Code:</label>
                    <input
                      type="text"
                      required
                      value={manualMpesaCode}
                      onChange={(e) => setManualMpesaCode(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order total recap */}
              <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Pickup Station:</span>
                  <span className="text-white truncate max-w-[240px]">{shipping.pickupStation}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount:</span>
                  <span className="font-mono text-emerald-400 tabular-nums">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer shadow active:scale-98 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay KSh {total.toLocaleString()}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: M-PESA PHONE SIMULATION */}
          {step === 'mpesa_stk_prompt' && (
            <div className="py-4 space-y-5 text-center">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full text-xs font-mono border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  STK Push Sent to {mpesaNumber}
                </div>
                <h3 className="font-display text-xl font-bold text-white pt-2">
                  Enter your M-PESA PIN
                </h3>
              </div>

              {/* Realistic Safaricom Phone SIM Toolkit Frame */}
              <div className="max-w-xs mx-auto bg-neutral-900 border border-emerald-500/80 rounded-2xl p-5 shadow-2xl text-left space-y-3.5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-white">M-PESA SIM TOOLKIT</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Safaricom</span>
                </div>

                <div className="text-xs text-neutral-200 font-mono space-y-1 bg-black p-3 rounded-lg border border-neutral-800">
                  <div>Pay <strong className="text-emerald-400">KSh {total.toLocaleString()}.00</strong> to</div>
                  <div className="text-white font-bold">LIMITLESS</div>
                  <div className="text-[10px] text-neutral-500">Till 849201</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-neutral-400">M-PESA PIN:</div>
                  <input
                    type="password"
                    maxLength={4}
                    value={rawPin}
                    onChange={(e) => setRawPin(e.target.value)}
                    placeholder="••••"
                    className="w-full text-center font-mono text-xl tracking-widest bg-black border border-emerald-500/60 rounded-lg py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setStep('payment')}
                    className="py-2 px-3 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeOrderPlacement}
                    disabled={isProcessing}
                    className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono cursor-pointer transition-colors"
                  >
                    {isProcessing ? 'Confirming...' : 'Send PIN'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 'confirmed' && completedOrder && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Order Confirmed
                </h3>
                <p className="text-xs text-neutral-400">
                  M-PESA payment verified. Your drop will be dispatched to your selected Parcel Grid station.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-black border border-neutral-800 rounded-xl p-5 text-left space-y-3.5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-neutral-400">Order Ref</div>
                    <div className="font-mono text-sm font-bold text-white">{completedOrder.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">Pickup Status</div>
                    <div className="text-xs font-semibold text-emerald-400">{completedOrder.estimatedDelivery}</div>
                  </div>
                </div>

                {/* Parcel Grid Station Banner */}
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{completedOrder.shipping.pickupStation}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Parcel Grid Waybill: <strong className="text-white">{completedOrder.trackingNumber}</strong>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    You will receive an SMS at {completedOrder.shipping.phone} with your collection PIN once your package arrives.
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-mono uppercase text-neutral-400">Purchased Items</div>
                  {completedOrder.items.map((it) => (
                    <div key={it.cartItemId} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt={it.productName} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                        <div>
                          <div className="text-white font-medium truncate max-w-xs">{it.productName}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">Size {it.size} · Qty {it.quantity}</div>
                        </div>
                      </div>
                      <span className="font-mono text-white tabular-nums">KSh {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline text-sm">
                  <span className="text-neutral-400">Total Paid (M-PESA)</span>
                  <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                    KSh {completedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono rounded-lg border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveView('orders');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-extrabold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  View in My Orders
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
