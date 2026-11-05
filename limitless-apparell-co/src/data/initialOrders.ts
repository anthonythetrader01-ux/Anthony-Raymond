import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LMT-8492',
    date: 'Today, 2:14 PM',
    timestamp: Date.now() - 3600000 * 2,
    items: [
      {
        cartItemId: 'item-8492-1',
        productId: 'prod-tee-boys-dont-cry',
        productName: "Boys Don't Cry Graphic Heavyweight Tee",
        image: '/assets/aistudio/BOYS_DONT_CRY_eae38144.jpg',
        size: 'L',
        color: 'Washed Black',
        colorHex: '#141416',
        sku: 'LMT-BDC-BLK-L',
        price: 1800,
        quantity: 1,
        reservedUntil: 0
      },
      {
        cartItemId: 'item-8492-2',
        productId: 'prod-tee-make-money',
        productName: 'Make Money Not Friends Boxy Tee',
        image: '/assets/aistudio/MAKE_MONEY_NOT_FRIENDS_33a1ad51.jpg',
        size: 'M',
        color: 'Pitch Black',
        colorHex: '#111113',
        sku: 'LMT-MMF-BLK-M',
        price: 1850,
        quantity: 1,
        reservedUntil: 0
      }
    ],
    shipping: {
      fullName: 'Brian Mwangi',
      email: 'brian.mwangi@gmail.com',
      phone: '0712 849 201',
      countyOrCity: 'Nairobi',
      pickupStation: 'Parcel Grid Westlands (Sarit Centre Hub)',
      shippingMethod: 'parcel_grid_station'
    },
    payment: {
      method: 'mpesa_stk',
      mpesaPhoneNumber: '0712 849 201',
      mpesaTransactionCode: 'SJD82K91XP',
      accountReference: 'LIMITLESS',
      transactionId: 'SJD82K91XP',
      isTokenized: true,
      securityHash: 'daraja_stk_sec_8492',
      receiptMessage: 'SJD82K91XP Confirmed. Ksh3,850.00 sent to LIMITLESS.'
    },
    subtotal: 3650,
    shippingCost: 200,
    discount: 0,
    tax: 0,
    total: 3850,
    trackingNumber: 'PG-NBO-8492',
    status: 'Dispatched',
    estimatedDelivery: 'Ready for pickup at Sarit Centre Hub'
  },
  {
    id: 'LMT-7214',
    date: 'Today, 11:30 AM',
    timestamp: Date.now() - 3600000 * 5,
    items: [
      {
        cartItemId: 'item-7214-1',
        productId: 'prod-tee-travis-scott',
        productName: 'Travis Scott Utopia FE!N Tour Tee',
        image: '/assets/aistudio/TRAVIS_SCOTT_92913eda.jpg',
        size: 'XL',
        color: 'Vintage Black',
        colorHex: '#1c1c1f',
        sku: 'LMT-TSU-XL',
        price: 2000,
        quantity: 1,
        reservedUntil: 0
      },
      {
        cartItemId: 'item-7214-2',
        productId: 'prod-cargos-03',
        productName: 'Multi-Pocket Tactical Cargo Pants',
        image: '/src/assets/images/hero_minimal_fashion_1793890976343.jpg',
        size: 'Size 32 (M)',
        color: 'Pitch Black',
        colorHex: '#121214',
        sku: 'LMT-CRG-BLK-32',
        price: 1950,
        quantity: 1,
        reservedUntil: 0
      }
    ],
    shipping: {
      fullName: 'Faith Chebet',
      email: 'fchebet@outlook.com',
      phone: '0723 551 890',
      countyOrCity: 'Eldoret',
      pickupStation: 'Parcel Grid Eldoret (Rupa Mall Hub)',
      shippingMethod: 'parcel_grid_station'
    },
    payment: {
      method: 'mpesa_till',
      tillNumber: '849201',
      mpesaTransactionCode: 'SKL1903PX',
      accountReference: 'LIMITLESS',
      transactionId: 'SKL1903PX',
      isTokenized: true,
      securityHash: 'daraja_till_sec_7214',
      receiptMessage: 'SKL1903PX Confirmed. Ksh3,950.00 sent to Till 849201.'
    },
    subtotal: 3950,
    shippingCost: 0, // Free over 4000
    discount: 0,
    tax: 0,
    total: 3950,
    trackingNumber: 'PG-ELD-7214',
    status: 'Processing',
    estimatedDelivery: 'Dispatched to Rupa Mall Hub Eldoret'
  },
  {
    id: 'LMT-6931',
    date: 'Yesterday, 6:45 PM',
    timestamp: Date.now() - 3600000 * 20,
    items: [
      {
        cartItemId: 'item-6931-1',
        productId: 'prod-tee-money-motive',
        productName: 'Money Is The Motive Graffiti Wash Tee',
        image: '/assets/aistudio/MONEY_shirt_60caab9e.jpg',
        size: 'M',
        color: 'Bone Cream',
        colorHex: '#ede5d8',
        sku: 'LMT-MOT-CRM-M',
        price: 1900,
        quantity: 1,
        reservedUntil: 0
      }
    ],
    shipping: {
      fullName: 'Kevin Otieno',
      email: 'kevin.otieno@gmail.com',
      phone: '0701 442 198',
      countyOrCity: 'Nairobi',
      pickupStation: 'Parcel Grid CBD (Imenti House, Tom Mboya St)',
      shippingMethod: 'parcel_grid_station'
    },
    payment: {
      method: 'mpesa_stk',
      mpesaPhoneNumber: '0701 442 198',
      mpesaTransactionCode: 'SGR489110K',
      accountReference: 'LIMITLESS',
      transactionId: 'SGR489110K',
      isTokenized: true,
      securityHash: 'daraja_stk_sec_6931',
      receiptMessage: 'SGR489110K Confirmed. Ksh2,100.00 sent to LIMITLESS.'
    },
    subtotal: 1900,
    shippingCost: 200,
    discount: 0,
    tax: 0,
    total: 2100,
    trackingNumber: 'PG-NBO-6931',
    status: 'Delivered',
    estimatedDelivery: 'Collected at Imenti House'
  },
  {
    id: 'LMT-5502',
    date: 'Yesterday, 3:10 PM',
    timestamp: Date.now() - 3600000 * 24,
    items: [
      {
        cartItemId: 'item-5502-1',
        productId: 'prod-tee-system-not-found',
        productName: 'System Not Found Target Grunge Tee',
        image: '/assets/aistudio/SYSTEM_NOT_FOUND_138f3226.jpg',
        size: 'L',
        color: 'Washed Charcoal',
        colorHex: '#1a1a1d',
        sku: 'LMT-SNF-BLK-L',
        price: 1800,
        quantity: 1,
        reservedUntil: 0
      },
      {
        cartItemId: 'item-5502-2',
        productId: 'prod-wallabee-01',
        productName: 'Clarks Wallabees Bandana Edition',
        image: '/src/assets/images/shoe_architectural_sneaker_1793890977057.jpg',
        size: 'EU 42 (US 9)',
        color: 'Maple Suede',
        colorHex: '#c29b6f',
        sku: 'LMT-WAL-42',
        price: 2000,
        quantity: 1,
        reservedUntil: 0
      }
    ],
    shipping: {
      fullName: 'Amina Hassan',
      email: 'amina.h@gmail.com',
      phone: '0740 998 123',
      countyOrCity: 'Mombasa',
      pickupStation: 'Parcel Grid Mombasa (Nyali Centre Station)',
      shippingMethod: 'parcel_grid_station'
    },
    payment: {
      method: 'mpesa_stk',
      mpesaPhoneNumber: '0740 998 123',
      mpesaTransactionCode: 'SFA93108PX',
      accountReference: 'LIMITLESS',
      transactionId: 'SFA93108PX',
      isTokenized: true,
      securityHash: 'daraja_stk_sec_5502',
      receiptMessage: 'SFA93108PX Confirmed. Ksh3,800.00 sent to LIMITLESS.'
    },
    subtotal: 3800,
    shippingCost: 300,
    discount: 0,
    tax: 0,
    total: 4100,
    trackingNumber: 'PG-MSA-5502',
    status: 'Dispatched',
    estimatedDelivery: 'In transit to Nyali Centre Station'
  },
  {
    id: 'LMT-4190',
    date: 'Nov 3, 2026',
    timestamp: Date.now() - 3600000 * 48,
    items: [
      {
        cartItemId: 'item-4190-1',
        productId: 'prod-tee-brand-society',
        productName: 'Brand Society Cyber Graphic Tee',
        image: '/assets/aistudio/BRAND_SOCIETY_d2912401.jpg',
        size: 'M',
        color: 'Jet Black',
        colorHex: '#121215',
        sku: 'LMT-BRS-BLK-M',
        price: 1750,
        quantity: 1,
        reservedUntil: 0
      }
    ],
    shipping: {
      fullName: 'Dennis Kiprono',
      email: 'dkiprono@gmail.com',
      phone: '0718 203 944',
      countyOrCity: 'Nakuru',
      pickupStation: 'Parcel Grid Nakuru (Westside Mall Agent)',
      shippingMethod: 'parcel_grid_station'
    },
    payment: {
      method: 'mpesa_till',
      tillNumber: '849201',
      mpesaTransactionCode: 'SEB29011X',
      accountReference: 'LIMITLESS',
      transactionId: 'SEB29011X',
      isTokenized: true,
      securityHash: 'daraja_till_sec_4190',
      receiptMessage: 'SEB29011X Confirmed. Ksh2,050.00 sent to Till 849201.'
    },
    subtotal: 1750,
    shippingCost: 300,
    discount: 0,
    tax: 0,
    total: 2050,
    trackingNumber: 'PG-NAK-4190',
    status: 'Delivered',
    estimatedDelivery: 'Collected at Westside Mall'
  }
];
