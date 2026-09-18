// Supabase Client with Hybrid Mock Data Engine for Taana Baana
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock-taana-baana.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isRealSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('mock')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initial Mock Seed Data for Standalone Mode
const MOCK_ARTISANS = [
  {
    id: "artisan_1",
    full_name: "Devaki Amma",
    phone: "+91 98470 12345",
    preferred_language: "ml",
    craft_type: "Handloom Weaving & Sarees",
    region: "Chendamangalam, Kerala",
    bio: "Weaving Kasavu cotton sarees with traditional gold zari borders for over 38 years. Leader of the local weavers' collective.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    voice_intro_url: "mock-voice-1.mp3",
    created_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "artisan_2",
    full_name: "Ramnath Bishnoi",
    phone: "+91 94140 56789",
    preferred_language: "hi",
    craft_type: "Terracotta & Clay Pottery",
    region: "Molela, Rajasthan",
    bio: "Master terracotta sculptor specializing in hand-molded votive plaques and natural clay cooling vessels using organic mineral glazes.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    voice_intro_url: "mock-voice-2.mp3",
    created_at: "2026-02-14T11:30:00Z"
  },
  {
    id: "artisan_3",
    full_name: "Fatima Begum",
    phone: "+91 97920 88990",
    preferred_language: "hi",
    craft_type: "Chikan & Zari Embroidery",
    region: "Lucknow, Uttar Pradesh",
    bio: "Third-generation master of Lucknow Chikankari shadow embroidery and fine mukaish metal needlework.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    voice_intro_url: "mock-voice-3.mp3",
    created_at: "2026-03-01T09:15:00Z"
  }
];

const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    artisan_id: "artisan_1",
    title: "Chendamangalam Handwoven Kasavu Cotton Saree",
    description: "Pure organic unbleached cotton handwoven on traditional wooden pit looms with 100% pure zari gold border.",
    category: "Weaving",
    tags: ["Kasavu", "Handloom", "Saree", "Kerala", "Gold Zari", "Organic Cotton"],
    image_urls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ],
    material_cost: 1200,
    production_hours: 18,
    size: "6.2 meters (includes blouse piece)",
    quantity_available: 5,
    suggested_price_min: 3200,
    suggested_price_max: 4800,
    final_price: 3950,
    status: "published",
    created_at: "2026-03-10T14:00:00Z"
  },
  {
    id: "prod_2",
    artisan_id: "artisan_2",
    title: "Hand-Carved Molela Terracotta Water Matka",
    description: "Traditional terracotta clay pitcher sculpted by hand, fired with natural wood ash glaze for eco-friendly water cooling.",
    category: "Pottery",
    tags: ["Terracotta", "Clay", "Molela", "Pottery", "Eco-friendly", "Cooling"],
    image_urls: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
    ],
    material_cost: 350,
    production_hours: 6,
    size: "4 Liters capacity (12 in height)",
    quantity_available: 12,
    suggested_price_min: 1100,
    suggested_price_max: 1800,
    final_price: 1450,
    status: "published",
    created_at: "2026-03-12T09:30:00Z"
  },
  {
    id: "prod_3",
    artisan_id: "artisan_3",
    title: "Lucknow Chikankari Hand-Embroidered Georgette Kurta",
    description: "Exquisite hand-stitched Chikankari featuring Bakhiya (shadow work) and Phanda motifs on breathable georgette fabric.",
    category: "Embroidery",
    tags: ["Chikankari", "Lucknow", "Embroidery", "Georgette", "Handmade", "Kurta"],
    image_urls: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    material_cost: 950,
    production_hours: 24,
    size: "Medium / Large (Customizable)",
    quantity_available: 3,
    suggested_price_min: 2800,
    suggested_price_max: 4200,
    final_price: 3600,
    status: "published",
    created_at: "2026-03-14T16:20:00Z"
  },
  {
    id: "prod_4",
    artisan_id: "artisan_2",
    title: "Lost-Wax Dhokra Brass Tribal Musician Sculpture",
    description: "Handcrafted using 4,000-year-old lost-wax casting technique by Bastar tribal artisans using recycled bell metal.",
    category: "Metalwork",
    tags: ["Dhokra", "Brass", "Bastar", "Lost Wax", "Tribal Art", "Sculpture"],
    image_urls: [
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80"
    ],
    material_cost: 800,
    production_hours: 14,
    size: "10 in x 4 in x 4 in",
    quantity_available: 4,
    suggested_price_min: 2200,
    suggested_price_max: 3500,
    final_price: 2900,
    status: "published",
    created_at: "2026-03-15T11:00:00Z"
  }
];

const MOCK_ORDERS = [
  {
    id: "ord_101",
    product_id: "prod_1",
    artisan_id: "artisan_1",
    customer_name: "Anita Roy",
    customer_contact: "+91 98201 11223",
    customer_email: "anita.roy@example.com",
    quantity: 2,
    notes: "Interested in bulk order for boutique in South Mumbai.",
    status: "pending",
    created_at: "2026-03-16T10:15:00Z"
  },
  {
    id: "ord_102",
    product_id: "prod_2",
    artisan_id: "artisan_2",
    customer_name: "EcoLiving Store",
    customer_contact: "+91 99000 44556",
    customer_email: "procurement@ecoliving.in",
    quantity: 10,
    notes: "Requesting corporate Diwali hamper quotation.",
    status: "confirmed",
    created_at: "2026-03-17T14:30:00Z"
  }
];

// LocalStorage helpers for mock persistence across browser reloads
const STORAGE_KEYS = {
  ARTISANS: 'taana_baana_artisans',
  PRODUCTS: 'taana_baana_products',
  ORDERS: 'taana_baana_orders',
  VIEWS: 'taana_baana_views'
};

function getLocalData(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocalData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

// Data Access Layer API
export const api = {
  async getArtisans() {
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase.from('artisans').select('*');
      if (!error && data?.length) return data;
    }
    return getLocalData(STORAGE_KEYS.ARTISANS, MOCK_ARTISANS);
  },

  async getArtisanById(id) {
    const list = await this.getArtisans();
    return list.find(a => a.id === id) || list[0];
  },

  async getProducts(filters = {}) {
    if (isRealSupabaseConfigured) {
      let query = supabase.from('products').select('*');
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.category) query = query.eq('category', filters.category);
      const { data, error } = await query;
      if (!error && data?.length) return data;
    }
    
    let items = getLocalData(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
    if (filters.status) {
      items = items.filter(p => p.status === filters.status);
    }
    if (filters.category && filters.category !== 'All Crafts') {
      items = items.filter(p => p.category === filters.category);
    }
    if (filters.region && filters.region !== 'All Regions') {
      const artisans = await this.getArtisans();
      const artisanMap = new Map(artisans.map(a => [a.id, a.region]));
      items = items.filter(p => (artisanMap.get(p.artisan_id) || '').includes(filters.region));
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      items = items.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.tags?.some(t => t.toLowerCase().includes(term))
      );
    }
    return items;
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || products[0];
  },

  async addProduct(productData) {
    const newProduct = {
      id: "prod_" + Date.now(),
      status: "published",
      created_at: new Date().toISOString(),
      ...productData
    };
    
    if (isRealSupabaseConfigured) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (!error && data?.[0]) return data[0];
    }

    const current = getLocalData(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
    const updated = [newProduct, ...current];
    setLocalData(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  },

  async addOrderInquiry(orderData) {
    const newOrder = {
      id: "ord_" + Date.now(),
      status: "pending",
      created_at: new Date().toISOString(),
      ...orderData
    };

    if (isRealSupabaseConfigured) {
      const { data } = await supabase.from('orders').insert([newOrder]).select();
      if (data?.[0]) return data[0];
    }

    const current = getLocalData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    setLocalData(STORAGE_KEYS.ORDERS, [newOrder, ...current]);
    return newOrder;
  },

  async getOrders(artisanId) {
    if (isRealSupabaseConfigured) {
      const { data } = await supabase.from('orders').select('*').eq('artisan_id', artisanId);
      if (data) return data;
    }
    const current = getLocalData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
    return artisanId ? current.filter(o => o.artisan_id === artisanId) : current;
  },

  async recordProductView(productId) {
    const views = getLocalData(STORAGE_KEYS.VIEWS, []);
    views.push({ id: "view_" + Date.now(), product_id: productId, viewed_at: new Date().toISOString() });
    setLocalData(STORAGE_KEYS.VIEWS, views);
  }
};
