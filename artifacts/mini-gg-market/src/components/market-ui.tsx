import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, MapPin, Search, Star, Tag, Menu, X, Plus } from 'lucide-react';
import type { MarketSession } from '@/hooks/use-market-session';
type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  imageUrl: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  status: string;
  createdAt: string;
};

const palettes = [
  'from-[#e3d9ff] via-[#c8b9ff] to-[#8b7ee8]',
  'from-[#ffe0ba] via-[#f4b6a4] to-[#df6f62]',
  'from-[#d7eedc] via-[#a4d2bb] to-[#559a80]',
  'from-[#f6e9a8] via-[#f6c96d] to-[#e8974e]',
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2" data-testid="link-logo">
      <span className="relative flex size-9 items-center justify-center rounded-[13px] bg-[#6f62d7] text-[#fffaf0] shadow-[4px_4px_0_hsl(43_75%_62%)] transition-transform group-hover:-translate-y-0.5">
        <span className="font-display text-lg font-bold">m</span>
      </span>
      {!compact && <span className="font-display text-[1.05rem] font-bold tracking-[-.04em] text-[#252a43]">mini gg</span>}
    </Link>
  );
}

export function Header({ session }: { session?: MarketSession | null }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  return (
    <header className="relative z-30 border-b border-[#e7dfd0] bg-[#fffaf0]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <Link href="/market" className="text-sm font-semibold text-[#63677a] transition-colors hover:text-[#252a43]" data-testid="link-market">Browse</Link>
          <Link href="/orders" className="text-sm font-semibold text-[#63677a] transition-colors hover:text-[#252a43]" data-testid="link-orders">My orders</Link>
          {session?.isOwner && <Link href="/admin" className="text-sm font-semibold text-[#63677a] transition-colors hover:text-[#252a43]" data-testid="link-admin">Control center</Link>}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="hidden text-right sm:block"><span className="block text-xs font-bold text-[#252a43]" data-testid="text-user-name">{session.name}</span><span className="block text-[11px] text-[#888b97]">{session.isOwner ? 'Owner account' : 'Local shopper'}</span></span>
              <button onClick={() => setLocation('/sell')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#f47d61] px-4 text-sm font-bold text-[#fffaf0] shadow-[0_6px_14px_-8px_#f47d61] transition hover:-translate-y-0.5" data-testid="button-sell-header"><Plus size={16} strokeWidth={2.5} />Sell an item</button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-bold text-[#5f5c74] hover:text-[#252a43]" data-testid="link-sign-in">Sign in</Link>
              <Link href="/sign-up" className="inline-flex h-10 items-center rounded-xl bg-[#6f62d7] px-4 text-sm font-bold text-[#fffaf0] shadow-[0_6px_14px_-8px_#6f62d7] transition hover:-translate-y-0.5" data-testid="link-sign-up">Join Mini GG</Link>
            </>
          )}
        </div>
        <button className="rounded-xl p-2 text-[#252a43] md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="border-t border-[#e7dfd0] bg-[#fffaf0] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/market" onClick={() => setOpen(false)} className="text-sm font-bold" data-testid="link-mobile-market">Browse</Link>
            <Link href="/orders" onClick={() => setOpen(false)} className="text-sm font-bold" data-testid="link-mobile-orders">My orders</Link>
            {session?.isOwner && <Link href="/admin" onClick={() => setOpen(false)} className="text-sm font-bold" data-testid="link-mobile-admin">Control center</Link>}
            <Link href={session ? '/sell' : '/sign-in'} onClick={() => setOpen(false)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#f47d61] px-4 py-2 text-sm font-bold text-[#fffaf0]" data-testid="link-mobile-sell"><Plus size={16} />Sell an item</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function ProductArtwork({ product, className = '' }: { product: Product; className?: string }) {
  const palette = palettes[product.id % palettes.length];
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${palette} ${className}`}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <>
          <span className="absolute -right-8 -top-12 size-40 rounded-full border-[20px] border-[#fffaf0]/25" />
          <span className="absolute -bottom-10 -left-6 size-36 rounded-full bg-[#fffaf0]/20 blur-sm" />
          <span className="absolute bottom-5 left-5 max-w-[80%] font-display text-2xl font-bold leading-[.95] tracking-[-.06em] text-[#252a43]/80">{product.category}</span>
          <span className="absolute right-5 top-5 rounded-full bg-[#fffaf0]/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#252a43]/60">{product.condition}</span>
        </>
      )}
    </div>
  );
}

export function Rating({ value, count, light = false }: { value: number; count?: number; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${light ? 'text-[#fffaf0]' : 'text-[#5e6170]'}`} data-testid="text-rating">
      <Star size={14} fill="currentColor" className="text-[#e9a848]" />
      {value.toFixed(1)} {count !== undefined && <span className={`${light ? 'text-[#fffaf0]/60' : 'text-[#9999a2'} font-medium`}>({count})</span>}
    </span>
  );
}

export function ProductCard({ product, favorite, onFavorite }: { product: Product; favorite: boolean; onFavorite: () => void }) {
  const [, setLocation] = useLocation();
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e6decf] bg-[#fffaf0] paper-shadow transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_35px_-24px_hsl(226_24%_15%/.5)]" data-testid={`card-product-${product.id}`}>
      <div className="relative block w-full text-left" onClick={() => setLocation(`/product/${product.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setLocation(`/product/${product.id}`); }} data-testid={`button-product-${product.id}`}>
        <ProductArtwork product={product} className="aspect-[1.16]" />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffaf0]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#46495e]">{product.category}</span>
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-[#fffaf0]/85 text-[#6a647e] transition hover:scale-105">
          <button type="button" onClick={(event) => { event.stopPropagation(); onFavorite(); }} aria-label={favorite ? 'Remove favorite' : 'Save favorite'} data-testid={`button-favorite-${product.id}`}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-[#f47d61]' : ''} /></button>
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <Link href={`/product/${product.id}`} className="line-clamp-1 font-display text-[1.02rem] font-bold tracking-[-.03em] text-[#252a43] hover:text-[#6f62d7]" data-testid={`link-product-title-${product.id}`}>{product.title}</Link>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#858797]"><MapPin size={12} />{product.location}</p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="font-display text-xl font-bold tracking-[-.05em] text-[#252a43]" data-testid={`text-price-${product.id}`}>{product.price.toLocaleString('en-US')} <span className="font-sans text-xs font-bold tracking-normal text-[#7c7f8e]">UZS</span></span>
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
      </div>
    </article>
  );
}

export function SectionHeading({ eyebrow, title, detail }: { eyebrow?: string; title: string; detail?: string }) {
  return <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[.17em] text-[#f47d61]">{eyebrow}</p>}<h2 className="font-display text-3xl font-bold tracking-[-.055em] text-[#252a43] sm:text-4xl">{title}</h2></div>{detail && <p className="max-w-xs text-sm leading-6 text-[#777a88]">{detail}</p>}</div>;
}

export function SearchBar({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit?: () => void }) {
  return <form className="flex h-14 w-full items-center rounded-2xl border border-[#e7dfd0] bg-[#fffaf0] px-4 shadow-[0_10px_24px_-22px_hsl(226_24%_15%/.6)] transition focus-within:border-[#6f62d7] focus-within:ring-4 focus-within:ring-[#6f62d7]/10" onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}><Search size={19} className="mr-3 text-[#878899]" /><input value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#252a43] outline-none placeholder:text-[#9696a2]" placeholder="Search phones, furniture, little treasures..." aria-label="Search products" data-testid="input-search-products" /><button className="hidden rounded-xl bg-[#252a43] px-4 py-2 text-xs font-bold text-[#fffaf0] transition hover:bg-[#6f62d7] sm:block" type="submit" data-testid="button-submit-search">Search</button></form>;
}

export function AuthGate({ session, children }: { session: MarketSession | null; children: ReactNode }) {
  const [, setLocation] = useLocation();
  if (!session) {
    setLocation('/sign-in');
    return <div className="min-h-[40vh]" />;
  }
  return <>{children}</>;
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8cfbd] bg-[#fffaf0]/70 p-8 text-center"><span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#6f62d7]"><Tag size={23} /></span><h3 className="font-display text-xl font-bold text-[#252a43]">Nothing here yet</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#7c7e8b]">Try a wider search, or be the first person to bring this corner of Mini GG to life.</p>{onReset && <button onClick={onReset} className="mt-5 rounded-xl bg-[#252a43] px-4 py-2 text-sm font-bold text-[#fffaf0]" data-testid="button-reset-search">Clear search</button>}</div>;
}

export function Footer() {
  return <footer className="border-t border-[#e7dfd0] bg-[#f8f0e1]"><div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-sm text-[#777a88] sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-3"><Logo compact /><span className="border-l border-[#d7cdbb] pl-3">Good things, nearby.</span></div><div className="flex gap-5"><span>Safe deals</span><span>Real people</span><span>Tashkent → everywhere</span></div></div></footer>;
}