import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  ProductVariant,
  CartItem, 
  InventoryActivity, 
  Order, 
  CustomerShipping, 
  PaymentDetails 
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  inventoryLogs: InventoryActivity[];
  cartReservationExpiry: number | null;
  remainingReservationSeconds: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isMerchantPortalOpen: boolean;
  setIsMerchantPortalOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  activeView: 'store' | 'merchant' | 'orders';
  setActiveView: (view: 'store' | 'merchant' | 'orders') => void;
  liveSimulationActive: boolean;
  setLiveSimulationActive: (active: boolean) => void;
  recentLiveEvent: { message: string; timestamp: number } | null;
  
  // Actions
  addToCart: (productId: string, size: string, color: string, qty?: number) => { success: boolean; message?: string };
  updateCartQuantity: (cartItemId: string, newQty: number) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  processOrder: (shipping: CustomerShipping, payment: PaymentDetails, promoDiscount?: number) => Promise<Order>;
  restockVariant: (sku: string, addAmount: number) => void;
  setVariantStock: (sku: string, newStock: number) => void;
  triggerLiveSimulationSale: () => void;
  getVariantAvailableStock: (productId: string, size: string, color: string) => number;
  getTotalCartItems: () => number;
  getCartSubtotal: () => number;
  addNewProduct: (product: Product) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  updateProductImage: (productId: string, imageUrl: string) => void;
  deleteProduct: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const RESERVATION_DURATION_MS = 10 * 60 * 1000; // 10 minutes hold

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products with local fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_products_v5');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_cart_v5');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_wishlist_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['prod-runner-01'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_orders_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryActivity[]>(() => {
    try {
      const saved = localStorage.getItem('limitless_inventory_logs_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'log-init-1',
        timestamp: Date.now() - 3600000 * 2,
        type: 'restock',
        productName: 'LIMITLESS Kinetic Arch Runner',
        sku: 'LMT-RUN-10',
        size: 'US 10 (EU 43)',
        change: 6,
        resultingStock: 1,
        note: 'Drop 03 warehouse intake · Nairobi Vault'
      },
      {
        id: 'log-init-2',
        timestamp: Date.now() - 3600000,
        type: 'sale',
        productName: 'LIMITLESS Heavyweight 500GSM Boxy Hoodie',
        sku: 'LMT-HD-CHR-M',
        size: 'M',
        change: -1,
        resultingStock: 3,
        note: 'M-PESA STK Order (Ref: SD93K81QX) · Nairobi Rider dispatch'
      }
    ];
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMerchantPortalOpen, setIsMerchantPortalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'merchant' | 'orders'>(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      if (hash.includes('master') || path.includes('/master') || hash.includes('merchant')) return 'merchant';
      if (hash.includes('order')) return 'orders';
    }
    return 'store';
  });

  useEffect(() => {
    const handleLocation = () => {
      if (typeof window === 'undefined') return;
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      if (hash.includes('master') || path.includes('/master') || hash.includes('merchant')) {
        setActiveView('merchant');
      } else if (hash.includes('order')) {
        setActiveView('orders');
      } else if (hash === '#/' || hash === '' || path === '/') {
        setActiveView('store');
      }
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  const handleSetActiveView = useCallback((view: 'store' | 'merchant' | 'orders') => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      if (view === 'merchant') {
        window.location.hash = 'master';
      } else if (view === 'orders') {
        window.location.hash = 'orders';
      } else {
        if (window.location.hash === '#master' || window.location.hash === '#orders') {
          history.pushState(null, '', window.location.pathname);
        }
      }
    }
  }, []);

  const [liveSimulationActive, setLiveSimulationActive] = useState(false);
  const [recentLiveEvent, setRecentLiveEvent] = useState<{ message: string; timestamp: number } | null>(null);

  // Reservation timer state
  const [cartReservationExpiry, setCartReservationExpiry] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('limitless_reservation_expiry');
      if (saved) {
        const exp = parseInt(saved, 10);
        if (exp > Date.now()) return exp;
      }
    } catch {}
    return null;
  });

  const [remainingReservationSeconds, setRemainingReservationSeconds] = useState<number>(0);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('limitless_products_v5', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_cart_v5', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_wishlist_v2', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_orders_v3', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('limitless_inventory_logs_v2', JSON.stringify(inventoryLogs));
    } catch {}
  }, [inventoryLogs]);

  // Reservation countdown ticker
  useEffect(() => {
    if (!cartReservationExpiry || cart.length === 0) {
      setRemainingReservationSeconds(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((cartReservationExpiry - Date.now()) / 1000));
      setRemainingReservationSeconds(diff);

      if (diff === 0 && cart.length > 0) {
        // Reservation expired! Return held reservations to general pool
        setProducts(prevProducts => {
          return prevProducts.map(p => {
            const updatedVariants = p.variants.map(v => {
              const cartMatches = cart.filter(c => c.sku === v.sku);
              const reservedByCart = cartMatches.reduce((acc, c) => acc + c.quantity, 0);
              return {
                ...v,
                reserved: Math.max(0, v.reserved - reservedByCart)
              };
            });
            return { ...p, variants: updatedVariants };
          });
        });

        // Add log
        setInventoryLogs(prev => [
          {
            id: `log-exp-${Date.now()}`,
            timestamp: Date.now(),
            type: 'release',
            productName: 'Cart Items',
            sku: 'ALL',
            size: '-',
            change: 0,
            resultingStock: 0,
            note: '10-minute cart hold expired. Inventory released to store.'
          },
          ...prev.slice(0, 49)
        ]);

        setRecentLiveEvent({
          message: 'Cart reservation expired. Items returned to active inventory.',
          timestamp: Date.now()
        });
        setCart([]);
        setCartReservationExpiry(null);
        localStorage.removeItem('atelier_reservation_expiry');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cartReservationExpiry, cart]);

  // Available stock calculation for a variant
  const getVariantAvailableStock = useCallback((productId: string, size: string, color: string): number => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return 0;
    const variant = prod.variants.find(v => v.size === size && v.color.toLowerCase().includes(color.toLowerCase()));
    if (!variant) return 0;
    return Math.max(0, variant.stock - variant.reserved);
  }, [products]);

  // Add to cart with live reservation hold
  const addToCart = useCallback((productId: string, size: string, color: string, qty: number = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found' };

    const variant = product.variants.find(
      v => v.size === size && v.color.toLowerCase().includes(color.toLowerCase())
    );
    if (!variant) return { success: false, message: 'Variant not found' };

    const available = variant.stock - variant.reserved;
    if (available < qty) {
      return { 
        success: false, 
        message: available <= 0 ? 'This size is currently sold out.' : `Only ${available} remaining in stock.` 
      };
    }

    // Reserve stock on product variant
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map(v => {
            if (v.sku !== variant.sku) return v;
            return {
              ...v,
              reserved: v.reserved + qty
            };
          })
        };
      });
    });

    const now = Date.now();
    const expiry = now + RESERVATION_DURATION_MS;
    setCartReservationExpiry(expiry);
    localStorage.setItem('atelier_reservation_expiry', expiry.toString());

    // Update Cart
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.sku === variant.sku);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
          reservedUntil: expiry
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${variant.sku}-${now}`,
          productId: product.id,
          productName: product.name,
          image: product.image,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex,
          sku: variant.sku,
          price: product.price,
          quantity: qty,
          reservedUntil: expiry
        };
        return [...prevCart, newItem];
      }
    });

    // Log reservation
    setInventoryLogs(prev => [
      {
        id: `log-res-${Date.now()}`,
        timestamp: Date.now(),
        type: 'reservation',
        productName: product.name,
        sku: variant.sku,
        size: variant.size,
        change: -qty,
        resultingStock: variant.stock - (variant.reserved + qty),
        note: `Held in customer cart (10-min reservation lock)`
      },
      ...prev.slice(0, 49)
    ]);

    setIsCartOpen(true);
    return { success: true };
  }, [products]);

  // Update Cart Quantity
  const updateCartQuantity = useCallback((cartItemId: string, newQty: number) => {
    const item = cart.find(c => c.cartItemId === cartItemId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return { success: true };
    }

    const delta = newQty - item.quantity;
    if (delta > 0) {
      // Need to reserve more
      const product = products.find(p => p.id === item.productId);
      const variant = product?.variants.find(v => v.sku === item.sku);
      if (!variant) return { success: false, message: 'Variant unavailable' };

      const available = variant.stock - variant.reserved;
      if (available < delta) {
        return { 
          success: false, 
          message: `Cannot add more. Only ${variant.stock - variant.reserved + item.quantity} total units available.` 
        };
      }

      // Reserve extra
      setProducts(prev => prev.map(p => {
        if (p.id !== item.productId) return p;
        return {
          ...p,
          variants: p.variants.map(v => v.sku === item.sku ? { ...v, reserved: v.reserved + delta } : v)
        };
      }));
    } else if (delta < 0) {
      // Release reservation
      const releaseAmount = Math.abs(delta);
      setProducts(prev => prev.map(p => {
        if (p.id !== item.productId) return p;
        return {
          ...p,
          variants: p.variants.map(v => v.sku === item.sku ? { ...v, reserved: Math.max(0, v.reserved - releaseAmount) } : v)
        };
      }));
    }

    setCart(prev => prev.map(c => c.cartItemId === cartItemId ? { ...c, quantity: newQty } : c));
    return { success: true };
  }, [cart, products]);

  // Remove from cart
  const removeFromCart = useCallback((cartItemId: string) => {
    const item = cart.find(c => c.cartItemId === cartItemId);
    if (!item) return;

    // Release reserved units
    setProducts(prev => prev.map(p => {
      if (p.id !== item.productId) return p;
      return {
        ...p,
        variants: p.variants.map(v => v.sku === item.sku ? { ...v, reserved: Math.max(0, v.reserved - item.quantity) } : v)
      };
    }));

    setInventoryLogs(prev => [
      {
        id: `log-rel-${Date.now()}`,
        timestamp: Date.now(),
        type: 'release',
        productName: item.productName,
        sku: item.sku,
        size: item.size,
        change: item.quantity,
        resultingStock: 0,
        note: `Customer removed item from cart · Reservation released`
      },
      ...prev.slice(0, 49)
    ]);

    setCart(prev => {
      const remaining = prev.filter(c => c.cartItemId !== cartItemId);
      if (remaining.length === 0) {
        setCartReservationExpiry(null);
        localStorage.removeItem('atelier_reservation_expiry');
      }
      return remaining;
    });
  }, [cart]);

  // Clear cart
  const clearCart = useCallback(() => {
    cart.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id !== item.productId) return p;
        return {
          ...p,
          variants: p.variants.map(v => v.sku === item.sku ? { ...v, reserved: Math.max(0, v.reserved - item.quantity) } : v)
        };
      }));
    });
    setCart([]);
    setCartReservationExpiry(null);
    localStorage.removeItem('atelier_reservation_expiry');
  }, [cart]);

  // Wishlist toggle
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  // Process secure payment & order
  const processOrder = useCallback(async (
    shipping: CustomerShipping, 
    payment: PaymentDetails, 
    promoDiscount: number = 0
  ): Promise<Order> => {
    // Simulate brief payment verification latency
    await new Promise(resolve => setTimeout(resolve, 1400));

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Parcel Grid station pickup: KSh 200 (Nairobi stations), KSh 300 (Upcountry stations), free over KSh 4,000
    const isNairobi = (shipping.countyOrCity || '').toLowerCase().includes('nairobi');
    const shippingCost = subtotal >= 4000 ? 0 : (isNairobi ? 200 : 300);
    const tax = 0;
    const total = Math.max(0, subtotal - promoDiscount + shippingCost);

    // Deduct stock and clear reservations
    setProducts(prev => {
      return prev.map(p => {
        const updatedVariants = p.variants.map(v => {
          const cartItem = cart.find(c => c.sku === v.sku);
          if (!cartItem) return v;
          const newStock = Math.max(0, v.stock - cartItem.quantity);
          const newReserved = Math.max(0, v.reserved - cartItem.quantity);
          return {
            ...v,
            stock: newStock,
            reserved: newReserved
          };
        });
        return { ...p, variants: updatedVariants };
      });
    });

    const paymentLabel = payment.method === 'mpesa_stk' 
      ? `M-PESA Express (${payment.mpesaTransactionCode || 'STK'})`
      : payment.method === 'mpesa_till'
        ? `M-PESA Till (${payment.mpesaTransactionCode})`
        : `Card (${payment.transactionId})`;

    const newLogs: InventoryActivity[] = cart.map(item => ({
      id: `log-sale-${Date.now()}-${item.sku}`,
      timestamp: Date.now(),
      type: 'sale',
      productName: item.productName,
      sku: item.sku,
      size: item.size,
      change: -item.quantity,
      resultingStock: 0,
      note: `Order paid via ${paymentLabel} · Parcel Grid: ${shipping.pickupStation}`
    }));
    setInventoryLogs(prev => [...newLogs, ...prev].slice(0, 50));

    // Create Order with Parcel Grid tracking & pickup code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `LMT-${randomSuffix}`;
    const tracking = `PG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      items: [...cart],
      shipping,
      payment,
      subtotal,
      shippingCost,
      discount: promoDiscount,
      tax,
      total,
      trackingNumber: tracking,
      status: 'Confirmed',
      estimatedDelivery: 'Ready for pickup in 24-48 hrs'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Clear cart and reservations
    setCart([]);
    setCartReservationExpiry(null);
    localStorage.removeItem('limitless_reservation_expiry');

    return newOrder;
  }, [cart]);

  // Merchant restock action
  const restockVariant = useCallback((sku: string, addAmount: number) => {
    let affectedProduct = '';
    let affectedSize = '';
    let newStockTotal = 0;

    setProducts(prev => prev.map(p => {
      const match = p.variants.find(v => v.sku === sku);
      if (!match) return p;
      affectedProduct = p.name;
      affectedSize = match.size;
      newStockTotal = match.stock + addAmount;
      return {
        ...p,
        variants: p.variants.map(v => v.sku === sku ? { ...v, stock: v.stock + addAmount } : v)
      };
    }));

    if (affectedProduct) {
      setInventoryLogs(prev => [
        {
          id: `log-rstk-${Date.now()}`,
          timestamp: Date.now(),
          type: 'restock',
          productName: affectedProduct,
          sku,
          size: affectedSize,
          change: addAmount,
          resultingStock: newStockTotal,
          note: `Nairobi vault intake (+${addAmount} units)`
        },
        ...prev.slice(0, 49)
      ]);

      setRecentLiveEvent({
        message: `Stock updated: ${affectedProduct} (${affectedSize}) +${addAmount} pairs added to vault.`,
        timestamp: Date.now()
      });
    }
  }, []);

  // Merchant direct stock set
  const setVariantStock = useCallback((sku: string, newStock: number) => {
    let affectedProduct = '';
    let affectedSize = '';
    let diff = 0;

    setProducts(prev => prev.map(p => {
      const match = p.variants.find(v => v.sku === sku);
      if (!match) return p;
      affectedProduct = p.name;
      affectedSize = match.size;
      diff = newStock - match.stock;
      return {
        ...p,
        variants: p.variants.map(v => v.sku === sku ? { ...v, stock: Math.max(0, newStock) } : v)
      };
    }));

    if (affectedProduct) {
      setInventoryLogs(prev => [
        {
          id: `log-adj-${Date.now()}`,
          timestamp: Date.now(),
          type: 'adjustment',
          productName: affectedProduct,
          sku,
          size: affectedSize,
          change: diff,
          resultingStock: newStock,
          note: `Stock count audit: ${newStock} units recorded`
        },
        ...prev.slice(0, 49)
      ]);
    }
  }, []);

  // Real-time simulated shopper purchase trigger
  const triggerLiveSimulationSale = useCallback(() => {
    // Pick a random product with available stock
    const inStockCandidates: { product: Product; variant: ProductVariant }[] = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock - v.reserved > 0) {
          inStockCandidates.push({ product: p, variant: v });
        }
      });
    });

    if (inStockCandidates.length === 0) return;

    const randomChoice = inStockCandidates[Math.floor(Math.random() * inStockCandidates.length)];
    const kenyanLocations = [
      'Westlands, Nairobi',
      'Kilimani, Nairobi',
      'Karen, Nairobi',
      'Roysambu (TRM), Nairobi',
      'Nairobi CBD',
      'Mombasa Town',
      'Kisumu City',
      'Eldoret Central',
      'Nakuru Town',
      'South B, Nairobi'
    ];
    const location = kenyanLocations[Math.floor(Math.random() * kenyanLocations.length)];

    // Deduct 1 stock
    setProducts(prev => prev.map(p => {
      if (p.id !== randomChoice.product.id) return p;
      return {
        ...p,
        variants: p.variants.map(v => {
          if (v.sku !== randomChoice.variant.sku) return v;
          return {
            ...v,
            stock: Math.max(0, v.stock - 1)
          };
        })
      };
    }));

    const remaining = randomChoice.variant.stock - 1;

    setInventoryLogs(prev => [
      {
        id: `log-sim-${Date.now()}`,
        timestamp: Date.now(),
        type: 'sale',
        productName: randomChoice.product.name,
        sku: randomChoice.variant.sku,
        size: randomChoice.variant.size,
        change: -1,
        resultingStock: remaining,
        note: `M-PESA checkout by shopper in ${location}`
      },
      ...prev.slice(0, 49)
    ]);

    setRecentLiveEvent({
      message: `Live Drop: Shopper in ${location} just copped ${randomChoice.product.name} (${randomChoice.variant.size}) · ${remaining} left in Kenya`,
      timestamp: Date.now()
    });
  }, [products]);

  // Periodic simulated live orders (every 40 seconds if active)
  useEffect(() => {
    if (!liveSimulationActive) return;
    const interval = setInterval(() => {
      triggerLiveSimulationSale();
    }, 38000);
    return () => clearInterval(interval);
  }, [liveSimulationActive, triggerLiveSimulationSale]);

  // Add new drop / product
  const addNewProduct = useCallback((newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setInventoryLogs(prev => [
      {
        id: `log-add-${Date.now()}`,
        timestamp: Date.now(),
        type: 'restock',
        productName: newProduct.name,
        sku: newProduct.variants[0]?.sku || 'NEW-DROP',
        size: 'All Sizes',
        change: newProduct.variants.reduce((a, b) => a + b.stock, 0),
        resultingStock: newProduct.variants.reduce((a, b) => a + b.stock, 0),
        note: `New product drop uploaded · KSh ${newProduct.price.toLocaleString()} · Parcel Grid ready`
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  // Update existing product price
  const updateProductPrice = useCallback((productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  }, []);

  // Update product image
  const updateProductImage = useCallback((productId: string, imageUrl: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: imageUrl, galleryImages: [imageUrl, ...(p.galleryImages || [])] } : p));
  }, []);

  // Delete a drop from the catalog
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setInventoryLogs(prev => [
      {
        id: `log-del-${Date.now()}`,
        timestamp: Date.now(),
        type: 'release',
        productName: `Product ID: ${productId}`,
        sku: 'DROP-REMOVED',
        size: '-',
        change: 0,
        resultingStock: 0,
        note: 'Drop removed from catalog via Master Portal'
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  const getTotalCartItems = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  const getCartSubtotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        inventoryLogs,
        cartReservationExpiry,
        remainingReservationSeconds,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isMerchantPortalOpen,
        setIsMerchantPortalOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        activeView,
        setActiveView: handleSetActiveView,
        liveSimulationActive,
        setLiveSimulationActive,
        recentLiveEvent,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        processOrder,
        restockVariant,
        setVariantStock,
        triggerLiveSimulationSale,
        getVariantAvailableStock,
        getTotalCartItems,
        getCartSubtotal,
        addNewProduct,
        updateProductPrice,
        updateProductImage,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
