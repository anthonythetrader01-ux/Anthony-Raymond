import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Package, 
  Plus, 
  Search, 
  Check, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Truck,
  Smartphone,
  Trash2,
  Edit2,
  Save,
  X,
  Layers,
  BarChart3,
  Archive,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AddDropModal } from './AddDropModal';
import { Product } from '../types';

export const MerchantPortal: React.FC = () => {
  const { 
    products, 
    orders,
    inventoryLogs, 
    restockVariant, 
    setVariantStock,
    updateProductPrice,
    deleteProduct,
    setActiveView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'drops' | 'analytics' | 'inventory'>('drops');
  const [isAddDropOpen, setIsAddDropOpen] = useState(false);

  // Drop Manager state
  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(null);
  const [tempPriceInput, setTempPriceInput] = useState<number>(1800);
  const [dropSearch, setDropSearch] = useState('');
  const [selectedDropCategory, setSelectedDropCategory] = useState<string>('all');

  // Inventory Table state
  const [inventorySearch, setInventorySearch] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out' | 'instock'>('all');
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [restockSuccessSku, setRestockSuccessSku] = useState<string | null>(null);

  // Aggregate Metrics for Analytics Dashboard
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const completedMpesaOrders = useMemo(() => {
    return orders.filter(o => o.payment.method.startsWith('mpesa'));
  }, [orders]);

  const mpesaStkRevenue = useMemo(() => {
    return orders
      .filter(o => o.payment.method === 'mpesa_stk')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const mpesaTillRevenue = useMemo(() => {
    return orders
      .filter(o => o.payment.method === 'mpesa_till')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const activeParcelGridDispatches = useMemo(() => {
    return orders.filter(o => o.status === 'Dispatched' || o.status === 'Processing');
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Delivered');
  }, [orders]);

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Flatten all variants with parent product for Vault Inventory
  const allVariants = useMemo(() => {
    return products.flatMap(product => 
      product.variants.map(variant => ({
        ...variant,
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        available: Math.max(0, variant.stock - variant.reserved)
      }))
    );
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return allVariants.reduce((acc, v) => acc + v.stock, 0);
  }, [allVariants]);

  const totalReservedUnits = useMemo(() => {
    return allVariants.reduce((acc, v) => acc + v.reserved, 0);
  }, [allVariants]);

  const lowStockCount = useMemo(() => {
    return allVariants.filter(v => v.available > 0 && v.available <= 3).length;
  }, [allVariants]);

  const outOfStockCount = useMemo(() => {
    return allVariants.filter(v => v.available <= 0).length;
  }, [allVariants]);

  // Filtered drops in Drop Manager
  const filteredDrops = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(dropSearch.toLowerCase());
      if (!matchSearch) return false;
      if (selectedDropCategory !== 'all' && p.category !== selectedDropCategory) return false;
      return true;
    });
  }, [products, dropSearch, selectedDropCategory]);

  // Filtered variants in Vault Inventory
  const filteredVariants = useMemo(() => {
    return allVariants.filter(item => {
      const matchesSearch = 
        item.productName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.size.toLowerCase().includes(inventorySearch.toLowerCase());

      if (!matchesSearch) return false;
      if (filterStockStatus === 'low') return item.available > 0 && item.available <= 3;
      if (filterStockStatus === 'out') return item.available <= 0;
      if (filterStockStatus === 'instock') return item.available > 3;
      return true;
    });
  }, [allVariants, inventorySearch, filterStockStatus]);

  const handleQuickRestock = (sku: string, amount: number) => {
    restockVariant(sku, amount);
    setRestockSuccessSku(sku);
    setTimeout(() => setRestockSuccessSku(null), 1500);
  };

  const handleSaveStock = (sku: string) => {
    setVariantStock(sku, tempStockValue);
    setEditingSku(null);
  };

  const handleSavePrice = (productId: string) => {
    const validPrice = Math.min(2000, Math.max(1500, Number(tempPriceInput) || 1800));
    updateProductPrice(productId, validPrice);
    setEditingPriceProductId(null);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Top Master Header */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                LIMITLESS MASTER PORTAL (/master)
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                Authorized Session
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Streetwear Control & Drop Management Suite
            </h1>
            <p className="text-xs text-neutral-400 max-w-2xl font-mono">
              Manage product drops, edit pricing (KSh 1,500 – 2,000), monitor M-PESA revenues, track Parcel Grid dispatch waybills, and audit vault inventory counts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddDropOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Drop</span>
            </button>

            <button
              onClick={() => setActiveView('store')}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-lg text-xs font-mono uppercase tracking-wider border border-neutral-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>
          </div>
        </div>

        {/* Master Suite Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('drops')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'drops'
                ? 'bg-white text-black font-extrabold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Drop Manager & Upload Suite ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-black font-extrabold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sales & Analytics ({orders.length} Orders)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-black font-extrabold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Live Vault Inventory ({totalStockUnits} Units)</span>
          </button>
        </div>

        {/* TAB 1: DROP MANAGER & UPLOAD SUITE */}
        {activeTab === 'drops' && (
          <div className="space-y-6">
            
            {/* Drop Manager Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    value={dropSearch}
                    onChange={(e) => setDropSearch(e.target.value)}
                    placeholder="Search drops, names..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
                  />
                </div>

                <select
                  value={selectedDropCategory}
                  onChange={(e) => setSelectedDropCategory(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="clothing">Graphic Tees & Apparel</option>
                  <option value="shoes">Kicks & Street Footwear</option>
                </select>
              </div>

              <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                <span>Pricing Policy:</span>
                <span className="text-emerald-400 font-bold">KSh 1,500 – 2,000</span>
              </div>
            </div>

            {/* Drops Grid / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrops.map((product) => {
                const totalDropStock = product.variants.reduce((acc, v) => acc + (v.stock - v.reserved), 0);
                const isEditingThis = editingPriceProductId === product.id;

                return (
                  <div
                    key={product.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-neutral-700 transition-colors"
                  >
                    {/* Top Image & Info */}
                    <div>
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 border border-neutral-700">
                            {product.subcategory}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${product.name}" from catalog?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            title="Delete drop"
                            className="p-1.5 rounded-lg bg-black/80 text-neutral-400 hover:text-rose-400 hover:bg-black transition-colors cursor-pointer border border-neutral-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-white text-sm tracking-tight">{product.name}</h3>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{product.description}</p>
                        </div>

                        {/* Sizes & Stock Counts */}
                        <div className="space-y-1">
                          <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                            <span>Sizes in Vault:</span>
                            <span className="text-white font-bold">{totalDropStock} units available</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {product.variants.map((v) => (
                              <span
                                key={v.sku}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  v.stock > 0 
                                    ? 'bg-neutral-900 text-neutral-300 border-neutral-800' 
                                    : 'bg-rose-950/40 text-rose-400 border-rose-900/60'
                                }`}
                              >
                                {v.size}: <strong>{v.stock}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing Action Bar */}
                    <div className="p-4 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                      {isEditingThis ? (
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-xs font-mono text-neutral-400">KSh</span>
                          <input
                            type="number"
                            min={1500}
                            max={2000}
                            step={50}
                            value={tempPriceInput}
                            onChange={(e) => setTempPriceInput(Number(e.target.value))}
                            className="flex-1 bg-black border border-emerald-500 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(product.id)}
                            className="p-1.5 bg-emerald-500 text-black rounded hover:bg-emerald-400 cursor-pointer"
                            title="Save Price"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPriceProductId(null)}
                            className="p-1.5 bg-neutral-800 text-neutral-400 rounded hover:text-white cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="text-[10px] font-mono uppercase text-neutral-400">Current Price</div>
                            <div className="font-mono text-base font-bold text-emerald-400">
                              KSh {product.price.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setEditingPriceProductId(product.id);
                              setTempPriceInput(product.price);
                            }}
                            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-lg border border-neutral-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-neutral-400" />
                            <span>Modify Price</span>
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: SALES & ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>TOTAL SALES REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white tracking-tight">
                  KSh {totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Verified M-PESA settlements</span>
                </div>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>M-PESA TRANSACTIONS</span>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {completedMpesaOrders.length} Orders
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  STK Push: KSh {mpesaStkRevenue.toLocaleString()} · Till: KSh {mpesaTillRevenue.toLocaleString()}
                </div>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>PARCEL GRID DISPATCHES</span>
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white tracking-tight">
                  {activeParcelGridDispatches.length} Active
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {deliveredOrders.length} collected at station
                </div>
              </div>

              <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>AVERAGE ORDER VALUE</span>
                  <ShoppingBag className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-white tracking-tight">
                  KSh {averageOrderValue.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  Free pickup over KSh 4,000 threshold
                </div>
              </div>
            </div>

            {/* M-PESA & Parcel Grid Station Order Ledger */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white tracking-tight">
                    Verified Customer Orders & Parcel Grid Waybills
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Real-time transaction settlements via Safaricom M-PESA Express & Till 849201.
                  </p>
                </div>
                <span className="text-xs font-mono bg-neutral-900 px-3 py-1 rounded-lg text-emerald-400 border border-neutral-800">
                  {orders.length} Verified
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/60 font-mono text-neutral-400 border-b border-neutral-800 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">M-PESA Ref / Method</th>
                      <th className="py-3 px-4">Parcel Grid Pickup Hub</th>
                      <th className="py-3 px-4 text-right">Items & Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{ord.id}</div>
                          <div className="text-[10px] text-neutral-500">{ord.date}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-200 font-sans font-medium">{ord.shipping.fullName}</div>
                          <div className="text-[10px] text-neutral-500">{ord.shipping.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-emerald-400 font-bold">
                            {ord.payment.mpesaTransactionCode || ord.payment.transactionId}
                          </div>
                          <div className="text-[10px] text-neutral-500 uppercase">
                            {ord.payment.method === 'mpesa_stk' ? 'STK Push' : 'Till 849201'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="text-neutral-200 text-xs truncate max-w-xs">{ord.shipping.pickupStation}</div>
                          <div className="text-[10px] font-mono text-neutral-500">Waybill: {ord.trackingNumber}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-bold text-white tabular-nums">KSh {ord.total.toLocaleString()}</div>
                          <div className="text-[10px] text-neutral-500">
                            {ord.items.length} item(s) · Delivery KSh {ord.shippingCost}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] uppercase font-bold border ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : ord.status === 'Dispatched'
                                ? 'bg-sky-950 text-sky-400 border-sky-800'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LIVE VAULT INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* 4 Inventory Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>TOTAL STOCK UNITS</span>
                  <Package className="w-3.5 h-3.5 text-neutral-500" />
                </div>
                <div className="font-mono text-2xl font-bold text-white tabular-nums">
                  {totalStockUnits}
                </div>
                <div className="text-[11px] text-neutral-500">Across {allVariants.length} active SKUs</div>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>CART RESERVATIONS</span>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                  {totalReservedUnits}
                </div>
                <div className="text-[11px] text-neutral-500">Locked in 10-min shopper bags</div>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>LOW STOCK ALERTS</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                  {lowStockCount}
                </div>
                <div className="text-[11px] text-neutral-500">SKUs with ≤ 3 pairs remaining</div>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>DEPLETED SKUs</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <div className="font-mono text-2xl font-bold text-rose-500 tabular-nums">
                  {outOfStockCount}
                </div>
                <div className="text-[11px] text-neutral-500">Zero inventory remaining</div>
              </div>
            </div>

            {/* Main Inventory & Audit Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inventory Table (8 Cols) */}
              <div className="lg:col-span-8 bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
                
                {/* Search & Status Filters */}
                <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                    <input
                      type="text"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Filter by SKU, name, size..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto w-full sm:w-auto">
                    {(['all', 'instock', 'low', 'out'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStockStatus(status)}
                        className={`px-3 py-1 rounded-lg uppercase tracking-wider cursor-pointer transition-colors ${
                          filterStockStatus === status
                            ? 'bg-neutral-800 text-white font-semibold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {status === 'all' ? 'All' : status === 'instock' ? 'In Stock' : status === 'low' ? 'Low' : 'Out'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SKU Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900/60 font-mono text-neutral-400 border-b border-neutral-800 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">SKU & Item</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3 text-right">Physical</th>
                        <th className="py-2.5 px-3 text-right">Reserved</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 font-mono">
                      {filteredVariants.map((item) => {
                        const isEditing = editingSku === item.sku;
                        const isRestocked = restockSuccessSku === item.sku;

                        return (
                          <tr key={item.sku} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{item.sku}</div>
                              <div className="text-[11px] text-neutral-400 font-sans truncate max-w-xs">
                                {item.productName}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-mono text-neutral-200">{item.size}</span>
                            </td>

                            {/* Physical Stock */}
                            <td className="py-3 px-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    min={0}
                                    value={tempStockValue}
                                    onChange={(e) => setTempStockValue(Number(e.target.value))}
                                    className="w-16 bg-neutral-900 border border-emerald-500 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs focus:outline-none"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveStock(item.sku)}
                                    className="p-1 bg-emerald-500 text-black rounded hover:bg-emerald-400 cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingSku(item.sku);
                                    setTempStockValue(item.stock);
                                  }}
                                  title="Click to edit exact count"
                                  className="font-mono text-white hover:underline cursor-pointer tabular-nums"
                                >
                                  {item.stock}
                                </button>
                              )}
                            </td>

                            {/* Reserved */}
                            <td className="py-3 px-3 text-right">
                              <span className={`font-mono tabular-nums ${item.reserved > 0 ? 'text-amber-400 font-semibold' : 'text-neutral-500'}`}>
                                {item.reserved}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              {item.available <= 0 ? (
                                <span className="font-mono text-[11px] text-rose-400">Depleted</span>
                              ) : item.available <= 3 ? (
                                <span className="font-mono text-[11px] text-amber-400 font-medium">Low Stock</span>
                              ) : (
                                <span className="font-mono text-[11px] text-emerald-400">Healthy</span>
                              )}
                            </td>

                            {/* Quick Restock Actions */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isRestocked ? (
                                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Updated
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleQuickRestock(item.sku, 5)}
                                      title="Add 5 units"
                                      className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded text-[11px] font-mono border border-neutral-700 cursor-pointer"
                                    >
                                      +5
                                    </button>
                                    <button
                                      onClick={() => handleQuickRestock(item.sku, 15)}
                                      title="Add 15 units"
                                      className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white rounded text-[11px] font-mono border border-neutral-700 cursor-pointer"
                                    >
                                      +15
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Real-Time Audit Log (4 Cols) */}
              <div className="lg:col-span-4 bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-display text-sm font-bold text-white tracking-tight">Vault Audit Stream</h3>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-500">Live Feed</span>
                </div>

                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                  {inventoryLogs.length === 0 ? (
                    <div className="text-xs text-neutral-500 py-6 text-center">No inventory events logged yet.</div>
                  ) : (
                    inventoryLogs.map((log) => {
                      const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      const isSale = log.type === 'sale';
                      const isReservation = log.type === 'reservation';
                      const isRestock = log.type === 'restock';

                      return (
                        <div 
                          key={log.id} 
                          className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 space-y-1.5 transition-all"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-mono uppercase font-semibold ${
                              isSale 
                                ? 'text-rose-400' 
                                : isReservation 
                                  ? 'text-amber-400' 
                                  : isRestock 
                                    ? 'text-emerald-400' 
                                    : 'text-neutral-400'
                            }`}>
                              {log.type}
                            </span>
                            <span className="font-mono text-neutral-500 text-[10px] tabular-nums">{timeStr}</span>
                          </div>

                          <div className="text-xs text-white font-medium truncate">
                            {log.productName}
                          </div>

                          <p className="text-[11px] text-neutral-400 leading-tight">
                            {log.note}
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-900">
                            <span>SKU: {log.sku}</span>
                            <span>Change: {log.change > 0 ? `+${log.change}` : log.change}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Global Add Drop Modal */}
      <AddDropModal 
        isOpen={isAddDropOpen} 
        onClose={() => setIsAddDropOpen(false)} 
      />
    </div>
  );
};
