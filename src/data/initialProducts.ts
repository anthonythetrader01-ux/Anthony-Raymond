import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-tee-boys-dont-cry',
    name: "Boys Don't Cry Graphic Heavyweight Tee",
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 1800,
    originalPrice: 2200,
    description: 'Black oversized streetwear tee featuring high-density "BOYS DON\'T CRY" gothic drip typography with monochrome portrait graphics. Heavyweight 260GSM combed cotton, drop shoulder boxy silhouette.',
    details: [
      '260GSM ultra-dense combed cotton',
      'Distressed "BOYS DON\'T CRY" gothic screen print',
      'Drop-shoulder boxy Gen Z cut',
      'Pre-shrunk vintage wash with ribbed collar'
    ],
    materials: '100% Combed Heavy Cotton.',
    care: 'Machine wash cold inside out. Hang dry in shade.',
    fit: 'Relaxed oversized boxy fit. Order true to size for signature drape.',
    image: '/assets/aistudio/BOYS_DONT_CRY_eae38144.jpg',
    galleryImages: [
      '/assets/aistudio/BOYS_DONT_CRY_eae38144.jpg'
    ],
    badge: "Boys Don't Cry · KSh 1,800",
    rating: 5.0,
    reviewsCount: 142,
    variants: [
      { sku: 'LMT-BDC-BLK-S', size: 'S', color: 'Washed Black', colorHex: '#141416', stock: 6, reserved: 0 },
      { sku: 'LMT-BDC-BLK-M', size: 'M', color: 'Washed Black', colorHex: '#141416', stock: 4, reserved: 0 },
      { sku: 'LMT-BDC-BLK-L', size: 'L', color: 'Washed Black', colorHex: '#141416', stock: 5, reserved: 0 },
      { sku: 'LMT-BDC-BLK-XL', size: 'XL', color: 'Washed Black', colorHex: '#141416', stock: 3, reserved: 0 },
    ]
  },
  {
    id: 'prod-tee-make-money',
    name: 'Make Money Not Friends Boxy Tee',
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 1850,
    originalPrice: 2300,
    description: 'Bold grunge typographic statement tee with heavy distressed stencil print across the chest, woven sleeve tag and collar ribbing. Premium heavyweight breathable cotton built for daily Nairobi wear.',
    details: [
      'Heavy distressed stencil typographic print',
      'Signature orange woven label on sleeve and collar',
      'Wide boxy chest with cropped hem drape',
      'Durable twin-needle hem and sleeve stitching'
    ],
    materials: '100% Premium Heavy Cotton.',
    care: 'Wash cold with darks. Do not iron over graphic print.',
    fit: 'Boxy streetwear cut. Fits slightly oversized.',
    image: '/assets/aistudio/MAKE_MONEY_NOT_FRIENDS_33a1ad51.jpg',
    galleryImages: [
      '/assets/aistudio/MAKE_MONEY_NOT_FRIENDS_33a1ad51.jpg'
    ],
    badge: 'Bestseller · KSh 1,850',
    rating: 4.9,
    reviewsCount: 168,
    variants: [
      { sku: 'LMT-MMF-BLK-S', size: 'S', color: 'Pitch Black', colorHex: '#111113', stock: 5, reserved: 0 },
      { sku: 'LMT-MMF-BLK-M', size: 'M', color: 'Pitch Black', colorHex: '#111113', stock: 3, reserved: 0 },
      { sku: 'LMT-MMF-BLK-L', size: 'L', color: 'Pitch Black', colorHex: '#111113', stock: 7, reserved: 0 },
      { sku: 'LMT-MMF-BLK-XL', size: 'XL', color: 'Pitch Black', colorHex: '#111113', stock: 2, reserved: 0 },
    ]
  },
  {
    id: 'prod-tee-travis-scott',
    name: 'Travis Scott Utopia FE!N Tour Tee',
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 2000,
    originalPrice: 2500,
    description: 'Dual-side concert graphic tee featuring front scratch "FE!N" logo print and full back Travis Scott Utopia stadium performance artwork. Boxy drop-shoulder cut, vintage mineral wash.',
    details: [
      'Front chest scratched FE!N typography',
      'Full-back high-resolution Utopia stadium poster graphic',
      'Mineral acid-wash heavy jersey fabric',
      'Reinforced crewneck collar that keeps its shape'
    ],
    materials: '100% Acid-Washed Cotton Jersey (250GSM).',
    care: 'Turn inside out and wash on cold delicate cycle.',
    fit: 'Gen Z drop-shoulder vintage band tee silhouette.',
    image: '/assets/aistudio/TRAVIS_SCOTT_92913eda.jpg',
    galleryImages: [
      '/assets/aistudio/TRAVIS_SCOTT_92913eda.jpg'
    ],
    badge: 'Dual-Sided Drop · KSh 2,000',
    rating: 5.0,
    reviewsCount: 215,
    variants: [
      { sku: 'LMT-TSU-S', size: 'S', color: 'Vintage Black', colorHex: '#1c1c1f', stock: 4, reserved: 0 },
      { sku: 'LMT-TSU-M', size: 'M', color: 'Vintage Black', colorHex: '#1c1c1f', stock: 2, reserved: 0 },
      { sku: 'LMT-TSU-L', size: 'L', color: 'Vintage Black', colorHex: '#1c1c1f', stock: 6, reserved: 0 },
      { sku: 'LMT-TSU-XL', size: 'XL', color: 'Vintage Black', colorHex: '#1c1c1f', stock: 3, reserved: 0 },
    ]
  },
  {
    id: 'prod-tee-brand-society',
    name: 'Brand Society Cyber Graphic Tee',
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 1750,
    originalPrice: 2200,
    description: 'Statement cyber-streetwear tee with bold back-print typography "BRAND SOCIETY" layered with yellow abstract graffiti scripting and sleeve emblems. Premium 250GSM structure.',
    details: [
      'Large back statement typographic screen print with yellow script overlay',
      'Dual sleeve custom emblem details',
      'Mock rib-knit crew neckline',
      'Relaxed wide boxy drape'
    ],
    materials: '100% Combed Cotton Heavyweight.',
    care: 'Machine wash cold. Do not tumble dry.',
    fit: 'Oversized streetwear boxy fit.',
    image: '/assets/aistudio/BRAND_SOCIETY_d2912401.jpg',
    galleryImages: [
      '/assets/aistudio/BRAND_SOCIETY_d2912401.jpg'
    ],
    badge: 'Cyber Drop · KSh 1,750',
    rating: 4.8,
    reviewsCount: 94,
    variants: [
      { sku: 'LMT-BRS-BLK-S', size: 'S', color: 'Jet Black', colorHex: '#121215', stock: 5, reserved: 0 },
      { sku: 'LMT-BRS-BLK-M', size: 'M', color: 'Jet Black', colorHex: '#121215', stock: 4, reserved: 0 },
      { sku: 'LMT-BRS-BLK-L', size: 'L', color: 'Jet Black', colorHex: '#121215', stock: 3, reserved: 0 },
      { sku: 'LMT-BRS-BLK-XL', size: 'XL', color: 'Jet Black', colorHex: '#121215', stock: 4, reserved: 0 },
    ]
  },
  {
    id: 'prod-tee-system-not-found',
    name: 'System Not Found Target Grunge Tee',
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 1800,
    originalPrice: 2200,
    description: 'Distressed cyber-grunge tee sporting high-contrast "SYSTEM NOT FOUND" textured stencil typography with bright crimson target reticles. Thick mock neck collar and heavy boxy drape.',
    details: [
      'High-contrast textured grunge typography',
      'Dual crimson crosshair target screen accents',
      'Nape star logo insignia',
      'Heavyweight 260GSM cotton jersey'
    ],
    materials: '100% Heavy Cotton Jersey.',
    care: 'Wash cold inside out. Hang dry.',
    fit: 'Boxy streetwear silhouette with clean drape.',
    image: '/assets/aistudio/SYSTEM_NOT_FOUND_138f3226.jpg',
    galleryImages: [
      '/assets/aistudio/SYSTEM_NOT_FOUND_138f3226.jpg'
    ],
    badge: 'Target Stencil · KSh 1,800',
    rating: 4.9,
    reviewsCount: 110,
    variants: [
      { sku: 'LMT-SNF-BLK-S', size: 'S', color: 'Washed Charcoal', colorHex: '#1a1a1d', stock: 4, reserved: 0 },
      { sku: 'LMT-SNF-BLK-M', size: 'M', color: 'Washed Charcoal', colorHex: '#1a1a1d', stock: 3, reserved: 0 },
      { sku: 'LMT-SNF-BLK-L', size: 'L', color: 'Washed Charcoal', colorHex: '#1a1a1d', stock: 5, reserved: 0 },
      { sku: 'LMT-SNF-BLK-XL', size: 'XL', color: 'Washed Charcoal', colorHex: '#1a1a1d', stock: 2, reserved: 0 },
    ]
  },
  {
    id: 'prod-tee-money-motive',
    name: 'Money Is The Motive Graffiti Wash Tee',
    category: 'clothing',
    subcategory: 'Graphic Tees',
    gender: 'unisex',
    price: 1900,
    originalPrice: 2400,
    description: 'Vintage bone cream oversized heavyweight tee featuring bold collegiate "MONEY IS THE MOTIVE" typography layered with hand-sprayed crimson dollar tag accents across the back.',
    details: [
      'Vintage bone / cream garment pigment wash',
      'Collegiate bold black serif lettering with red spray tag overlay',
      'Dense 260GSM French cotton handfeel',
      'Dropped shoulder cut with ribbed collar'
    ],
    materials: '100% Pigment-Dyed Heavy Cotton.',
    care: 'Cold wash with light colors. Do not bleach.',
    fit: 'Oversized vintage wash cut. True to streetwear size.',
    image: '/assets/aistudio/MONEY_shirt_60caab9e.jpg',
    galleryImages: [
      '/assets/aistudio/MONEY_shirt_60caab9e.jpg'
    ],
    badge: 'Bone Wash · KSh 1,900',
    rating: 5.0,
    reviewsCount: 133,
    variants: [
      { sku: 'LMT-MOT-CRM-S', size: 'S', color: 'Bone Cream', colorHex: '#ede5d8', stock: 5, reserved: 0 },
      { sku: 'LMT-MOT-CRM-M', size: 'M', color: 'Bone Cream', colorHex: '#ede5d8', stock: 4, reserved: 0 },
      { sku: 'LMT-MOT-CRM-L', size: 'L', color: 'Bone Cream', colorHex: '#ede5d8', stock: 6, reserved: 0 },
      { sku: 'LMT-MOT-CRM-XL', size: 'XL', color: 'Bone Cream', colorHex: '#ede5d8', stock: 3, reserved: 0 },
    ]
  },
  {
    id: 'prod-cargos-03',
    name: 'Multi-Pocket Tactical Cargo Pants',
    category: 'clothing',
    subcategory: 'Cargo Pants & Bottoms',
    gender: 'unisex',
    price: 1950,
    originalPrice: 2500,
    description: 'Heavy cotton twill tactical cargo pants. Fitted with 6 utility 3D snap-flap pockets, relaxed wide leg with ankle bungee toggles to switch between puddle stacks and jogger cuffs.',
    details: [
      '6 heavy-duty utility cargo flap pockets',
      'Ankle bungee drawcords for stacked sneaker styling',
      'Reinforced seat and knee panels',
      'Comfort waistband with belt loops'
    ],
    materials: '100% Heavy Cotton Canvas Twill.',
    care: 'Wash cold with dark colors. Do not bleach.',
    fit: 'Baggy wide-leg fit with adjustable ankle cinch.',
    image: '/src/assets/images/hero_minimal_fashion_1793890976343.jpg',
    galleryImages: [
      '/src/assets/images/hero_minimal_fashion_1793890976343.jpg'
    ],
    badge: 'Steal · KSh 1,950',
    rating: 4.9,
    reviewsCount: 147,
    variants: [
      { sku: 'LMT-CRG-BLK-30', size: 'Size 30 (S)', color: 'Pitch Black', colorHex: '#121214', stock: 6, reserved: 0 },
      { sku: 'LMT-CRG-BLK-32', size: 'Size 32 (M)', color: 'Pitch Black', colorHex: '#121214', stock: 3, reserved: 0 },
      { sku: 'LMT-CRG-BLK-34', size: 'Size 34 (L)', color: 'Pitch Black', colorHex: '#121214', stock: 5, reserved: 0 },
      { sku: 'LMT-CRG-GRY-32', size: 'Size 32 (M)', color: 'Stone Grey', colorHex: '#4d5057', stock: 3, reserved: 0 },
    ]
  },
  {
    id: 'prod-wallabee-01',
    name: 'Clarks Wallabees Bandana Edition',
    category: 'shoes',
    subcategory: 'Street Footwear',
    gender: 'unisex',
    price: 2000,
    originalPrice: 2500,
    description: 'Iconic Clarks Wallabees silhouette customized with bandana paisley printed suede panels. Authentic crepe rubber sole, moccasin toe stitching, and double tonal lace tags. High-demand vintage drip.',
    details: [
      'Genuine brushed suede with laser bandana graphic',
      'Original natural plantation crepe sole',
      'Dual branded suede fob hangtags',
      'True Kenyan Gen Z streetwear staple'
    ],
    materials: 'Upper: 100% Suede Leather. Sole: 100% Natural Crepe Rubber.',
    care: 'Clean with dedicated suede eraser and crepe brush.',
    fit: 'Generous fit. We recommend ordering half a size down.',
    image: '/src/assets/images/shoe_architectural_sneaker_1793890977057.jpg',
    galleryImages: [
      '/src/assets/images/shoe_architectural_sneaker_1793890977057.jpg'
    ],
    badge: 'Street Kicks · KSh 2,000',
    rating: 5.0,
    reviewsCount: 112,
    variants: [
      { sku: 'LMT-WAL-40', size: 'EU 40 (US 7)', color: 'Maple Suede', colorHex: '#c29b6f', stock: 4, reserved: 0 },
      { sku: 'LMT-WAL-41', size: 'EU 41 (US 8)', color: 'Maple Suede', colorHex: '#c29b6f', stock: 3, reserved: 0 },
      { sku: 'LMT-WAL-42', size: 'EU 42 (US 9)', color: 'Maple Suede', colorHex: '#c29b6f', stock: 2, reserved: 0 },
      { sku: 'LMT-WAL-43', size: 'EU 43 (US 10)', color: 'Maple Suede', colorHex: '#c29b6f', stock: 5, reserved: 0 },
      { sku: 'LMT-WAL-44', size: 'EU 44 (US 11)', color: 'Maple Suede', colorHex: '#c29b6f', stock: 2, reserved: 0 },
    ]
  }
];
