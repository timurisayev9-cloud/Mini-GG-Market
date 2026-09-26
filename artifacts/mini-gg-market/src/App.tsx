import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  ClerkProvider,
  Show,
  SignIn,
  SignUp,
  useClerk,
  useUser,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Heart,
  LayoutDashboard,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Trash2,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import {
  getGetDashboardSummaryQueryKey,
  getListProductsQueryKey,
  useCreateProduct,
  useCreateReview,
  useDeleteProduct,
  useGetDashboardSummary,
  useListProducts,
  useUpdateProduct,
} from "@workspace/api-client-react";
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation, useRoute } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const ownerEmail = "timurisayev9@gmail.com";

const categories = ["Barchasi", "Elektronika", "Transport", "Kiyim", "Uy va bog‘", "Xizmatlar"];
const fallbackImages = [
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value).replaceAll(",", " ") + " so‘m";
}

function StarRating({ value, interactive = false, onChange }: { value: number; interactive?: boolean; onChange?: (value: number) => void }) {
  return (
    <div className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={`star ${star <= Math.round(value) ? "filled" : ""} ${interactive ? "interactive" : ""}`}
          onClick={() => interactive && onChange?.(star)}
          aria-label={`${star} stars`}
        >
          <Star size={15} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="brand">
      <span className="brand-mark">gg</span>
      <span>mini <b>market</b></span>
    </Link>
  );
}

function GoogleButton({ label = "Google akkaunt bilan kirish" }: { label?: string }) {
  const { openSignIn } = useClerk();
  return (
    <button type="button" className="google-button" onClick={() => openSignIn()}>
      <span className="google-g">G</span>
      {label}
    </button>
  );
}

function PublicHome() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  return (
    <div className="public-page">
      <header className="public-nav container">
        <Logo />
        <nav className="public-links">
          <a href="#how">Qanday ishlaydi</a>
          <a href="#trust">Ishonch va xavfsizlik</a>
        </nav>
        <div className="nav-actions">
          <button className="link-button" onClick={() => setLocation("/sign-in")}>Kirish</button>
          <button className="button button-primary small" onClick={() => setLocation("/sign-up")}>Ro‘yxatdan o‘tish <ArrowRight size={16} /></button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> O‘zbekistondagi yangi bozor</div>
            <h1>Kerakli narsa.<br /><span>Yaxshi narxda.</span></h1>
            <p>Yaqin atrofdagi mahsulotlarni toping, o‘zingiznikini soting va har bir kelishuvni ishonch bilan yakunlang.</p>
            <div className="hero-search">
              <Search size={19} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setLocation(`/market${search ? `?q=${encodeURIComponent(search)}` : ""}`)} placeholder="Nima qidiryapsiz?" />
              <button className="button button-primary" onClick={() => setLocation(`/market${search ? `?q=${encodeURIComponent(search)}` : ""}`)}>Qidirish</button>
            </div>
            <div className="hero-meta"><span><ShieldCheck size={15} /> Tekshirilgan e’lonlar</span><span><UserRound size={15} /> 1,200+ foydalanuvchi</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-card hero-card-main">
              <img src={fallbackImages[0]} alt="PlayStation 5" />
              <div className="hero-card-info"><div><strong>PlayStation 5 Slim</strong><small>Yunusobod, Toshkent</small></div><strong>5.9 mln</strong></div>
            </div>
            <div className="float-pill pill-rating"><Star size={15} fill="currentColor" /> 4.9 reyting</div>
            <div className="float-pill pill-sold"><Check size={15} /> Sotildi</div>
          </div>
        </section>

        <section className="category-strip container">
          {[
            ["Elektronika", "⌁", "accent-blue"],
            ["Kiyim", "✦", "accent-pink"],
            ["Uy va bog‘", "⌂", "accent-yellow"],
            ["Transport", "◒", "accent-green"],
            ["Xizmatlar", "✳", "accent-purple"],
          ].map(([label, icon, color]) => (
            <button key={label} className="category-pill" onClick={() => setLocation(`/market?category=${encodeURIComponent(label)}`)}>
              <span className={`category-icon ${color}`}>{icon}</span><span>{label}</span><ArrowRight size={14} />
            </button>
          ))}
        </section>

        <section id="how" className="steps-section container">
          <div className="section-heading"><div><span className="eyebrow">Oddiy va tez</span><h2>Bozor siz uchun ishlaydi</h2></div><button className="text-arrow" onClick={() => setLocation("/market")}>Barcha e’lonlarni ko‘rish <ArrowRight size={17} /></button></div>
          <div className="steps-grid">
            {[["01", "Qidiring", "Kerakli mahsulotni topish uchun qidiruvdan foydalaning."], ["02", "Kelishing", "Sotuvchi bilan bog‘lanib, shartlarni kelishib oling."], ["03", "Oling", "Mahsulotingizni xavfsiz va qulay usulda oling."]].map(([number, title, text]) => (
              <div className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p><ArrowRight className="step-arrow" size={20} /></div>
            ))}
          </div>
        </section>

        <section id="trust" className="trust-section">
          <div className="container trust-inner"><div><span className="eyebrow light">Siz uchun yaratilgan</span><h2>Har bir xarid —<br />xotirjam xarid.</h2></div><div className="trust-points"><div><ShieldCheck /><span><b>Haqiqiy odamlar</b><small>Har bir profil jamoa tomonidan kuzatiladi.</small></span></div><div><Star /><span><b>Ochiq baholash</b><small>Mahsulotlar haqida boshqalarning fikrini biling.</small></span></div></div></div>
        </section>
      </main>
      <footer className="public-footer container"><Logo /><span>© 2026 mini gg market</span><span>Yaxshi topilmalar yaqin.</span></footer>
    </div>
  );
}

function CartDrawer({ items, onClose, onRemove }: { items: any[]; onClose: () => void; onRemove: (id: number) => void }) {
  const [checkedOut, setCheckedOut] = useState(false);
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  return <div className="cart-overlay" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="cart-heading"><div><span className="eyebrow">Siz tanlaganlar</span><h2>Savat</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div>{checkedOut ? <div className="checkout-success"><span><Check size={24} /></span><h3>Buyurtma qabul qilindi</h3><p>Sotuvchi tez orada siz bilan bog‘lanadi. Xarid tarixini Buyurtmalar bo‘limidan ko‘rishingiz mumkin.</p><button className="button button-primary" onClick={onClose}>Davom etish</button></div> : items.length === 0 ? <div className="cart-empty"><ShoppingCart size={28} /><h3>Savatingiz bo‘sh</h3><p>Yoqtirgan mahsulotlaringizni shu yerga yig‘ing.</p></div> : <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><img src={item.imageUrl || fallbackImages[0]} alt="" /><div><b>{item.title}</b><small>{item.sellerName}</small><strong>{formatPrice(item.price)}</strong></div><button onClick={() => onRemove(item.id)} aria-label="Savatdan olib tashlash"><Trash2 size={15} /></button></div>)}</div><div className="cart-total"><span>Jami</span><strong>{formatPrice(total)}</strong></div><button className="button button-primary wide" onClick={() => setCheckedOut(true)}>Buyurtma berish <ArrowRight size={16} /></button><small className="cart-footnote">Buyurtmadan oldin sotuvchi bilan bog‘lanib, shartlarni kelishing.</small></>}</aside></div>;
}

function Shell({ children, cartCount, onOpenCart, cartItems = [], onRemoveFromCart = () => {} }: { children: React.ReactNode; cartCount: number; onOpenCart: () => void; cartItems?: any[]; onRemoveFromCart?: (id: number) => void }) {
  const [location, setLocation] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ownerEmail;
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner"><Logo /><div className="desktop-search" onClick={() => setLocation("/market")}><Search size={18} /><span>Mahsulot, kategoriya yoki joylashuv qidiring</span><kbd>⌘ K</kbd></div><div className="header-actions"><button className="icon-button notification"><Bell size={19} /><i /></button><button className="cart-button" onClick={onOpenCart}><ShoppingCart size={19} /><span>Savat</span>{cartCount > 0 && <b>{cartCount}</b>}</button><div className="profile-menu"><span className="avatar">{(user?.firstName?.[0] || "T")[0]}</span><span className="profile-name">{user?.firstName || "Mehmon"}</span><ChevronDown size={14} /><div className="profile-popover"><strong>{user?.fullName || "Foydalanuvchi"}</strong><small>{user?.primaryEmailAddress?.emailAddress}</small><button onClick={() => signOut({ redirectUrl: basePath || "/" })}>Chiqish</button></div></div></div></div>
      </header>
      <div className="mobile-header-actions container"><button onClick={() => setLocation("/market")}><Search size={17} /> Qidirish</button><button onClick={onOpenCart}><ShoppingCart size={17} /> Savat {cartCount > 0 && `(${cartCount})`}</button></div>
      <div className="app-body container"><aside className="side-nav"><button className={location === "/market" ? "active" : ""} onClick={() => setLocation("/market")}><Store size={18} /> E’lonlar</button><button className={location === "/orders" ? "active" : ""} onClick={() => setLocation("/orders")}><Package size={18} /> Buyurtmalar</button><button className={location === "/sell" ? "active" : ""} onClick={() => setLocation("/sell")}><Plus size={18} /> E’lon berish</button><div className="side-divider" />{isAdmin && <button className={location === "/admin" ? "active admin-link" : "admin-link"} onClick={() => setLocation("/admin")}><LayoutDashboard size={18} /> Admin panel</button>}<div className="side-bottom"><button><SlidersHorizontal size={18} /> Sozlamalar</button><small>mini gg market<br />v1.0.0</small></div></aside><main className="content">{children}</main></div>
      {cartItems.length > 0 && <div className="cart-count-mobile">{cartItems.length}</div>}
    </div>
  );
}

function ProductCard({ product, onAdd, onOpen }: { product: any; onAdd: () => void; onOpen: () => void }) {
  return <article className="product-card" onClick={onOpen}><div className="product-image-wrap"><img src={product.imageUrl || fallbackImages[product.id % fallbackImages.length]} alt={product.title} /><button className="heart-button" onClick={(event) => event.stopPropagation()}><Heart size={18} /></button><span className="condition-badge">{product.condition}</span></div><div className="product-content"><div className="product-title-row"><h3>{product.title}</h3><button className="mini-cart" onClick={(event) => { event.stopPropagation(); onAdd(); }}><ShoppingCart size={16} /></button></div><strong className="product-price">{formatPrice(product.price)}</strong><div className="product-location"><span>{product.location}</span><span className="product-rating"><Star size={13} fill="currentColor" /> {product.rating || "Yangi"}</span></div><div className="seller-line"><span className="seller-avatar">{product.sellerName?.[0] || "M"}</span>{product.sellerName}<span className="verified-dot"><Check size={10} /></span></div></div></article>;
}

function MarketPage({ onAdd, onOpenProduct }: { onAdd: (product: any) => void; onOpenProduct: (product: any) => void }) {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "Barchasi");
  const { data: products = [], isLoading } = useListProducts({ q: search || undefined, category: category !== "Barchasi" ? category : undefined });
  return <div className="market-page"><div className="page-intro"><div><span className="eyebrow">Bozorni kashf eting</span><h1>Yaxshi topilmalar</h1><p>Bugun siz uchun tanlangan mahsulotlar</p></div><Link href="/sell" className="button button-primary"><Plus size={17} /> E’lon berish</Link></div><div className="market-toolbar"><div className="market-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mahsulot qidiring..." /><kbd>/</kbd></div><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div>{isLoading ? <div className="empty-state"><div className="loader" />Yuklanmoqda...</div> : <div className="product-grid">{products.map((product: any) => <ProductCard key={product.id} product={product} onAdd={() => onAdd(product)} onOpen={() => onOpenProduct(product)} />)}</div>}{!isLoading && products.length === 0 && <div className="empty-state"><ShoppingBag size={30} /><h3>Hech narsa topilmadi</h3><p>Boshqa so‘z yoki kategoriya bilan qidirib ko‘ring.</p></div>}</div>;
}

function SellPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const createProduct = useCreateProduct({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); setLocation("/market"); } } });
  const [form, setForm] = useState({ title: "", price: "", category: "Elektronika", condition: "Yaxshi", location: "Toshkent", imageUrl: "", sellerName: user?.fullName || "Yangi sotuvchi" });
  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="form-page"><button className="back-link" onClick={() => setLocation("/market")}>← E’lonlarga qaytish</button><div className="form-heading"><div><span className="eyebrow">Sotishni boshlang</span><h1>Yangi e’lon yarating</h1><p>Mahsulotingiz haqida aniq ma’lumot bering.</p></div><div className="form-tip"><Sparkles size={16} /><span><b>Yaxshi surat</b><small>e’lonni 2× ko‘proq ko‘rsatadi</small></span></div></div><form className="listing-form" onSubmit={(event) => { event.preventDefault(); createProduct.mutate({ data: { ...form, price: Number(form.price), imageUrl: form.imageUrl || fallbackImages[0] } }); }}><label>Mahsulot nomi<input required value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="Masalan: iPhone 15 Pro Max" /></label><div className="two-fields"><label>Narxi (so‘m)<input required type="number" min="0" value={form.price} onChange={(event) => set("price", event.target.value)} placeholder="0" /></label><label>Kategoriya<select value={form.category} onChange={(event) => set("category", event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="two-fields"><label>Holati<select value={form.condition} onChange={(event) => set("condition", event.target.value)}><option>Yangi</option><option>Yaxshi</option><option>Ishlatilgan</option></select></label><label>Joylashuv<input required value={form.location} onChange={(event) => set("location", event.target.value)} /></label></div><label>Surat havolasi <span className="optional">ixtiyoriy</span><input value={form.imageUrl} onChange={(event) => set("imageUrl", event.target.value)} placeholder="https://..." /></label><div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setLocation("/market")}>Bekor qilish</button><button className="button button-primary" disabled={createProduct.isPending}>{createProduct.isPending ? "Saqlanmoqda..." : "E’lonni joylash"} <ArrowRight size={16} /></button></div></form></div>;
}

function ProductDetail({ product, onAdd }: { product: any; onAdd: (product: any) => void }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createReview = useCreateReview({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }) } });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  return <div className="detail-page"><button className="back-link" onClick={() => setLocation("/market")}>← E’lonlarga qaytish</button><div className="detail-grid"><div className="detail-image"><img src={product.imageUrl || fallbackImages[0]} alt={product.title} /><span className="condition-badge">{product.condition}</span></div><div className="detail-info"><span className="eyebrow">{product.category} · {product.location}</span><h1>{product.title}</h1><div className="detail-rating"><StarRating value={product.rating || 0} /><b>{product.rating || "Yangi"}</b><span>({product.reviewCount || 0} ta baho)</span></div><div className="detail-price">{formatPrice(product.price)}</div><div className="seller-panel"><span className="seller-avatar large">{product.sellerName?.[0] || "M"}</span><div><b>{product.sellerName}</b><small><span className="verified-dot"><Check size={10} /></span> Tasdiqlangan sotuvchi</small></div><button className="button button-soft">Bog‘lanish</button></div><button className="button button-primary wide" onClick={() => onAdd(product)}><ShoppingCart size={18} /> Savatga qo‘shish</button><div className="detail-note"><ShieldCheck size={18} /><span><b>Xavfsiz xarid</b><small>Sotuvchi bilan uchrashishdan oldin mahsulotni tekshiring.</small></span></div></div></div><div className="review-box"><div><span className="eyebrow">Jamoa fikri</span><h2>Mahsulotni baholang</h2><p>Bu mahsulot haqida fikringizni boshqalar bilan ulashing.</p></div><form onSubmit={(event) => { event.preventDefault(); if (!rating) return; createReview.mutate({ id: product.id, data: { rating, comment, authorName: "Mini GG foydalanuvchisi" } }); setComment(""); setRating(0); }}><div className="review-stars"><span>Sizning bahoyingiz</span><StarRating value={rating} interactive onChange={setRating} /></div><div className="review-input"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Fikringizni yozing..." /><button className="button button-dark" disabled={!rating || createReview.isPending}>Yuborish</button></div></form></div></div>;
}

function OrdersPage() {
  return <div className="empty-page"><div className="empty-icon"><Package size={27} /></div><span className="eyebrow">Sizning tarixingiz</span><h1>Buyurtmalar</h1><p>Hali buyurtmalaringiz yo‘q. Yaxshi topilmalar shu yerda ko‘rinadi.</p><Link href="/market" className="button button-primary">Mahsulotlarni ko‘rish <ArrowRight size={16} /></Link></div>;
}

function AdminPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ownerEmail;
  const { data: summary } = useGetDashboardSummary();
  const { data: products = [] } = useListProducts();
  const deleteProduct = useDeleteProduct({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }); } } });
  const updateProduct = useUpdateProduct({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }) } });
  if (!isAdmin) return <Redirect to="/market" />;
  const statItems: Array<{ label: string; value: number; Icon: typeof Package; color: string }> = [
    { label: "E’lonlar", value: summary?.totalProducts || 0, Icon: Package, color: "accent-blue" },
    { label: "Faol e’lonlar", value: summary?.activeListings || 0, Icon: TrendingUp, color: "accent-green" },
    { label: "Foydalanuvchilar", value: summary?.totalUsers || 0, Icon: UserRound, color: "accent-purple" },
    { label: "O‘rtacha baho", value: summary?.averageRating || 0, Icon: Star, color: "accent-yellow" },
  ];
  return <div className="admin-page"><div className="admin-welcome"><div><span className="eyebrow">Boshqaruv markazi</span><h1>Xush kelibsiz, Tim</h1><p>Mini GG Market bugungi holati.</p></div><button className="button button-dark"><Bell size={16} /> Bildirishnomalar</button></div><div className="stats-grid">{statItems.map(({ label, value, Icon, color }) => <div className="stat-card" key={label}><span className={`stat-icon ${color}`}><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong></div><span className="stat-trend">+12%</span></div>)}</div><div className="admin-panel-card"><div className="panel-header"><div><h2>Mahsulotlar nazorati</h2><p>Barcha e’lonlarni ko‘ring va boshqaring.</p></div><Link href="/sell" className="button button-primary small"><Plus size={15} /> Yangi e’lon</Link></div><div className="admin-table-wrap"><table><thead><tr><th>Mahsulot</th><th>Sotuvchi</th><th>Narx</th><th>Holat</th><th>Amallar</th></tr></thead><tbody>{products.map((product: any) => <tr key={product.id}><td><div className="table-product"><img src={product.imageUrl} alt="" /><span><b>{product.title}</b><small>{product.category}</small></span></div></td><td>{product.sellerName}</td><td><b>{formatPrice(product.price)}</b></td><td><button className={`status-pill ${product.status === "active" ? "active" : "paused"}`} onClick={() => updateProduct.mutate({ id: product.id, data: { status: product.status === "active" ? "paused" : "active" } })}><i />{product.status === "active" ? "Faol" : "To‘xtatilgan"}</button></td><td><div className="table-actions"><button title="Tahrirlash"><Pencil size={16} /></button><button title="O‘chirish" className="danger" onClick={() => deleteProduct.mutate({ id: product.id })}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></div></div>;
}

function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  return <div className="auth-page"><div className="auth-aside"><Logo /><div><span className="eyebrow light">mini gg market</span><h1>Yaxshi topilma<br /><em>yaqinda.</em></h1><p>Mahsulot toping, soting va o‘zingizga mos bozorni yarating.</p></div><div className="auth-quote"><Star size={16} fill="currentColor" /> <span>“Eng yaxshi mahsulotni mini gg marketdan topdim.”<small>— Madina, Toshkent</small></span></div></div><div className="auth-card-wrap"><div className="auth-mobile-logo"><Logo /></div>{mode === "sign-in" ? <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /> : <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />}</div></div>;
}

function AppRoutes() {
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const addToCart = (item: any) => setCart((current) => current.some((product) => product.id === item.id) ? current : [...current, item]);
  const [location] = useLocation();
  return <><Switch><Route path="/sign-in/*?" component={() => <AuthPage mode="sign-in" />} /><Route path="/sign-up/*?" component={() => <AuthPage mode="sign-up" />} /><Route path="/"><PublicHome /></Route><Route path="/market"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}>{product ? <ProductDetail product={product} onAdd={addToCart} /> : <MarketPage onAdd={addToCart} onOpenProduct={setProduct} />}</Shell></Route><Route path="/sell"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><SellPage /></Shell></Route><Route path="/product/:id"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}>{product ? <ProductDetail product={product} onAdd={addToCart} /> : <MarketPage onAdd={addToCart} onOpenProduct={setProduct} />}</Shell></Route><Route path="/orders"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><OrdersPage /></Shell></Route><Route path="/admin"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><AdminPage /></Shell></Route><Route><Redirect to={location.startsWith("/market") ? "/market" : "/"} /></Route></Switch>{cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} />}</>;
}

function ClerkRoutes() {
  const [, setLocation] = useLocation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={{ theme: shadcn, cssLayerName: "clerk", options: { logoImageUrl: `${window.location.origin}${basePath}/logo.svg`, logoLinkUrl: basePath || "/" }, variables: { colorPrimary: "#ef5b43", colorForeground: "#1d2327", colorMutedForeground: "#6b746f", colorBackground: "#fffaf3", colorInput: "#fffdf9", colorInputForeground: "#1d2327", colorNeutral: "#dce2dc", fontFamily: "DM Sans", borderRadius: "0.8rem" } }} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} routerPush={(to) => setLocation(to.replace(basePath, "") || "/")} routerReplace={(to) => setLocation(to.replace(basePath, "") || "/")} localization={{ signIn: { start: { title: "Xush kelibsiz", subtitle: "Mini GG Market hisobingizga kiring" } }, signUp: { start: { title: "Hisob yarating", subtitle: "Yaxshi topilmalarni birga kashf etamiz" } } }}><QueryClientProvider client={queryClient}><Show when="signed-in"><AuthenticatedRoutes /></Show><Show when="signed-out"><AppRoutes /></Show></QueryClientProvider></ClerkProvider>;
}

function AuthenticatedRoutes() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const addToCart = (item: any) => setCart((current) => current.some((product) => product.id === item.id) ? current : [...current, item]);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  return <><Switch><Route path="/"><Redirect to={email === ownerEmail ? "/admin" : "/market"} /></Route><Route path="/market"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}>{product ? <ProductDetail product={product} onAdd={addToCart} /> : <MarketPage onAdd={addToCart} onOpenProduct={setProduct} />}</Shell></Route><Route path="/sell"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><SellPage /></Shell></Route><Route path="/product/:id"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}>{product ? <ProductDetail product={product} onAdd={addToCart} /> : <MarketPage onAdd={addToCart} onOpenProduct={setProduct} />}</Shell></Route><Route path="/orders"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><OrdersPage /></Shell></Route><Route path="/admin"><Shell cartCount={cart.length} onOpenCart={() => setCartOpen(true)} cartItems={cart} onRemoveFromCart={(id) => setCart((current) => current.filter((item) => item.id !== id))}><AdminPage /></Shell></Route><Route><Redirect to="/market" /></Route></Switch>{cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} />}</>;
}

function App() {
  return <ErrorBoundary><TooltipProvider><WouterRouter base={basePath}><ClerkRoutes /></WouterRouter><Toaster /></TooltipProvider></ErrorBoundary>;
}

export default App;