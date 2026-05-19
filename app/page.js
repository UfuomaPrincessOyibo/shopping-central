"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import styles from "./page.module.css";

const BRANDS = [
  "All",
  "Ego",
  "GODDIVA",
  "H&M",
  "Mango",
  "ASOS",
  "M&S",
  "PLT",
  "& Other Stories",
  "Arket",
  "Whistles",
];

const VIBES = [
  { label: "Soft girl", short: "Soft", color: "blush" },
  { label: "Night out", short: "Party", color: "pink" },
  { label: "Work chic", short: "Office", color: "lilac" },
  { label: "Day vibes", short: "Casual", color: "sage" },
  { label: "Bohemian", short: "Boho", color: "cream" },
  { label: "Date night", short: "Date", color: "rose" },
  { label: "Editor's pick", short: "Edit", color: "blush" },
  { label: "Holiday", short: "Beach", color: "sage" },
];

const CARD_BACKGROUNDS = [
  "#f0e8df",
  "#e2d8cc",
  "#e8ddd0",
  "#d8e4e0",
  "#e8d8c4",
  "#e4dcd4",
  "#d8d4cc",
  "#ecdcd8",
];

const CART_ITEMS = [
  {
    id: 1,
    brand: "Ego",
    name: "Halterneck Cut Out Dress",
    price: "£28",
    bg: "linear-gradient(135deg,#e8d8c4,#c4a882)",
  },
  {
    id: 2,
    brand: "GODDIVA",
    name: "Sequin Cowl Neck Maxi",
    price: "£65",
    bg: "linear-gradient(135deg,#d4c4d8,#b8a8cc)",
  },
  {
    id: 3,
    brand: "Mango",
    name: "Linen Wide Leg Trousers",
    price: "£49",
    bg: "linear-gradient(135deg,#c8d4c4,#a8c0a0)",
  },
];

const OUTFIT_CARDS = [
  {
    brand: "Ego",
    price: "£28",
    bg: "linear-gradient(135deg,#e8d8c4,#c4a882)",
    tall: true,
  },
  {
    brand: "GODDIVA",
    price: "£65",
    bg: "linear-gradient(135deg,#d4c4d8,#b8a8cc)",
    tall: false,
  },
  {
    brand: "Mango",
    price: "£49",
    bg: "linear-gradient(135deg,#c4d4c8,#a8c4b0)",
    tall: false,
  },
];

const CAROUSEL_CARDS = [
  { brand: "Ego", price: "£22", bg: "linear-gradient(160deg,#f0e0d0,#d4b898)" },
  {
    brand: "GODDIVA",
    price: "£55",
    bg: "linear-gradient(160deg,#d8d0e8,#bbb0d4)",
  },
  {
    brand: "Mango",
    price: "£39",
    bg: "linear-gradient(160deg,#c8d8c8,#a8c4a8)",
  },
  { brand: "Ego", price: "£18", bg: "linear-gradient(160deg,#e8d0d0,#d4a8a8)" },
  {
    brand: "GODDIVA",
    price: "£72",
    bg: "linear-gradient(160deg,#d0d8e0,#a8b8c8)",
  },
  {
    brand: "Mango",
    price: "£44",
    bg: "linear-gradient(160deg,#e8e0c8,#d4c8a0)",
  },
];

function OutfitGrid({ products = [] }) {
  const items = products.slice(0, 3);
  if (items.length === 0) return <div className={styles.outfitGrid} />;
  return (
    <div className={styles.outfitGrid}>
      {items.map((p, i) => (
        <div
          key={i}
          className={`${styles.outfitCard} ${i === 0 ? styles.outfitCardTall : ""}`}
          style={{ background: CARD_BACKGROUNDS[i] }}
        >
          <img
            src={p.image_url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className={styles.outfitBrand}>{p.brand}</span>
          <span className={styles.outfitPrice}>
            £{parseFloat(p.price).toFixed(0)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CartAnimation({ products = [] }) {
  const [visible, setVisible] = useState([]);
  const items = products.slice(0, 3);
  useEffect(() => {
    setVisible([]);
    items.forEach((_, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), i * 400 + 200);
    });
  }, [products]);
  return (
    <div className={styles.cartViz}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`${styles.cartItem} ${visible.includes(i) ? styles.cartItemVisible : ""}`}
        >
          <img
            src={item.image_url}
            alt=""
            className={styles.cartItemImg}
            style={{ objectFit: "cover" }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className={styles.cartItemInfo}>
            <div className={styles.cartItemBrand}>{item.brand}</div>
            <div className={styles.cartItemName}>Added to basket</div>
          </div>
          <div className={styles.cartItemPrice}>
            £{parseFloat(item.price).toFixed(0)}
          </div>
        </div>
      ))}
      <div
        className={`${styles.cartTotal} ${visible.length === items.length ? styles.cartTotalVisible : ""}`}
      >
        <div>
          <div className={styles.cartTotalLabel}>
            Total — {items.length} brands
          </div>
          <div className={styles.cartTotalBrands}>
            {items.map((p) => p.brand).join(" · ")}
          </div>
        </div>
        <div className={styles.cartTotalAmount}>
          £{items.reduce((s, p) => s + parseFloat(p.price || 0), 0).toFixed(0)}
        </div>
      </div>
    </div>
  );
}

function Carousel({ products = [] }) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (products.length === 0) return;
    const t = setInterval(
      () => setPos((p) => (p + 1) % Math.max(1, products.length - 1)),
      1400,
    );
    return () => clearInterval(t);
  }, [products]);
  return (
    <div className={styles.carouselViz}>
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${pos * 138}px)` }}
      >
        {products.map((c, i) => (
          <div
            key={i}
            className={styles.carouselCard}
            style={{
              background: CARD_BACKGROUNDS[i % CARD_BACKGROUNDS.length],
            }}
          >
            <img
              src={c.image_url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
              onError={(e) => (e.target.style.display = "none")}
            />
            <span className={styles.carouselBrand}>{c.brand}</span>
            <span className={styles.carouselPrice}>
              £{parseFloat(c.price).toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const VIZZES = ["outfit", "cart", "carousel"];
const VIZ_LABELS = {
  outfit: "Outfit grid",
  cart: "Live basket",
  carousel: "New in",
};

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState(null);
  const [activeViz, setActiveViz] = useState("outfit");
  const vizCycleRef = useRef(null);
  const [heroProducts, setHeroProducts] = useState([]);

  useEffect(() => {
    async function fetchHeroProducts() {
      // Fetch from each brand separately to guarantee a mix
      const brands = ["Ego", "GODDIVA"];
      const results = await Promise.all(
        brands.map((brand) =>
          supabase
            .from("products")
            .select("image_url, brand, price, product_url, name")
            .eq("brand", brand)
            .eq("in_stock", true)
            .not("image_url", "is", null)
            .neq("image_url", "")
            .limit(50)
            .order("id", { ascending: Math.random() > 0.5 }),
        ),
      );

      // Take 3 from each brand, deduplicate by image_url
      let pool = [];
      results.forEach(({ data }) => {
        if (!data) return;
        const seen = new Set();
        const unique = data
          .filter((p) => {
            if (seen.has(p.image_url)) return false;
            seen.add(p.image_url);
            return true;
          })
          .slice(0, 3);
        pool.push(...unique);
      });

      results.forEach(({ data, error }) => {
        console.log("brand fetch:", data?.length, "error:", error);
      });
      // Shuffle so brands alternate
      pool = pool.sort(() => Math.random() - 0.5);
      setHeroProducts(pool);
    }
    fetchHeroProducts();
  }, []);

  // Auto-cycle vizzes
  useEffect(() => {
    vizCycleRef.current = setInterval(() => {
      setActiveViz((v) => {
        const i = VIZZES.indexOf(v);
        return VIZZES[(i + 1) % VIZZES.length];
      });
    }, 3500);
    return () => clearInterval(vizCycleRef.current);
  }, []);

  const handleVizTab = (viz) => {
    clearInterval(vizCycleRef.current);
    setActiveViz(viz);
  };

  useEffect(() => {
    fetchProducts();
  }, [activeBrand]);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      let allProducts = [];
      if (activeBrand !== "All") {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("brand", activeBrand)
          .eq("in_stock", true)
          .not("image_url", "is", null)
          .neq("image_url", "")
          .limit(200);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        allProducts = data || [];
      } else {
        const activeBrands = ["Ego", "GODDIVA"];
        const results = await Promise.all(
          activeBrands.map((brand) =>
            supabase
              .from("products")
              .select("*")
              .eq("brand", brand)
              .eq("in_stock", true)
              .not("image_url", "is", null)
              .neq("image_url", "")
              .limit(100)
              .order("id", { ascending: Math.random() > 0.5 }),
          ),
        );
        results.forEach(({ data }) => {
          if (data) allProducts.push(...data);
        });
        allProducts = allProducts.sort(() => Math.random() - 0.5);
      }
      const seen = new Set();
      const unique = allProducts
        .filter((p) => {
          const key = (p.product_name || p.name || "")
            .replace(/,?\s*(Women's\s*)?Size\s+UK\s+\d+/i, "")
            .trim()
            .toLowerCase();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 24);
      setProducts(unique);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const toggleSave = (id) =>
    setSaved((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  return (
    <main>
      {/* Ticker */}
      <div className={styles.ticker}>
        {[
          "Shop 40+ brands",
          "Free price drop alerts",
          "New arrivals daily",
        ].map((t, i) => (
          <span key={i}>✦ {t}</span>
        ))}
      </div>
      {/* One basket, one delivery', */}
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoDot} /> mallcntrl
        </div>
        <div className={styles.navLinks}>
          {["Discover", "Brands", "Trending", "Sales"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className={styles.navRight}>
          <button className={styles.navIcon}>♡</button>
          <button className={styles.navIcon}>🛍</button>
          <button className={styles.navBtn}>Join free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroTag}>
            <span className={styles.heroTagDot} /> UK&apos;s first multi-brand
            basket
          </div>
          <h1 className={styles.heroTitle}>
            Your <em>whole</em> wardrobe.
            <br />
            One location.
          </h1>
          <p className={styles.heroSub}>
            Shop Ego, GODDIVA, Mango, ASOS and 40+ brands — one place, one
            delivery.
          </p>
          <div className={styles.heroPills}>
            <span className={`${styles.pill} ${styles.pillBlush}`}>
              ✦ No more tabs
            </span>
            <span className={`${styles.pill} ${styles.pillLilac}`}>
              ✦ One place
            </span>
            <span className={`${styles.pill} ${styles.pillSage}`}>
              ✦ Price alerts
            </span>
          </div>
          <div className={styles.heroCta}>
            <button className={styles.btnPrimary}>Start shopping</button>
            <button className={styles.btnGhost}>See how it works</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.vizTabs}>
            {VIZZES.map((v) => (
              <button
                key={v}
                className={`${styles.vizTab} ${activeViz === v ? styles.vizTabActive : ""}`}
                onClick={() => handleVizTab(v)}
              >
                {VIZ_LABELS[v]}
              </button>
            ))}
          </div>
          {activeViz === "outfit" && <OutfitGrid products={heroProducts} />}
          {activeViz === "cart" && (
            <CartAnimation key={Date.now()} products={heroProducts} />
          )}
          {activeViz === "carousel" && <Carousel products={heroProducts} />}
        </div>
      </section>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNum}>40+</div>
          <div className={styles.statLabel}>Brands</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>1</div>
          <div className={styles.statLabel}>Checkout</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>27k+</div>
          <div className={styles.statLabel}>Products</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>£0</div>
          <div className={styles.statLabel}>To join</div>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <div className={styles.searchInner}>
          <input
            className={styles.searchInput}
            placeholder="Search across Ego, GODDIVA, Mango, ASOS and more..."
          />
          <button className={styles.searchBtn}>Search all brands ✦</button>
        </div>
      </div>

      {/* Brands */}
      <div className={styles.brandsSection}>
        <span className={styles.brandsLabel}>Brands</span>
        {BRANDS.map((b) => (
          <button
            key={b}
            className={`${styles.brandChip} ${activeBrand === b ? styles.brandChipActive : ""}`}
            onClick={() => setActiveBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Vibes */}
      <div className={styles.vibes}>
        {VIBES.map((v) => (
          <div key={v.label} className={styles.vibe}>
            <div className={`${styles.vibeCircle} ${styles["vc_" + v.color]}`}>
              {v.short}
            </div>
            <span className={styles.vibeLabel}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {[
          "New in",
          "Under £30",
          "Under £60",
          "Dresses",
          "Tops",
          "Trousers",
          "Outerwear",
        ].map((f) => (
          <button key={f} className={styles.filterPill}>
            {f}
          </button>
        ))}
        <span className={styles.count}>
          {loading ? "..." : `${products.length} pieces loaded`}
        </span>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {loading && (
          <div
            style={{
              gridColumn: "1/-1",
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            Loading products...
          </div>
        )}
        {error && (
          <div
            style={{
              gridColumn: "1/-1",
              padding: "40px",
              textAlign: "center",
              color: "var(--terracotta)",
            }}
          >
            Error: {error}
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div
            style={{
              gridColumn: "1/-1",
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            No products found.
          </div>
        )}
        {!loading &&
          products.map((p, i) => (
            <div
              key={p.id}
              className={styles.card}
              onClick={() => window.open(p.product_url, "_blank")}
            >
              <div
                className={styles.cardImg}
                style={{
                  background: CARD_BACKGROUNDS[i % CARD_BACKGROUNDS.length],
                }}
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.product_name || p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className={styles.overlay} />
                <span className={styles.cardBrandTag}>{p.brand}</span>
                <button
                  className={styles.cardHeart}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(p.id);
                  }}
                >
                  {saved.includes(p.id) ? "♥" : "♡"}
                </button>
                {p.is_new && <span className={styles.cardNew}>New in</span>}
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardName}>
                  {p.product_name || p.name}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>
                    £{parseFloat(p.price || 0).toFixed(2)}
                  </div>
                  <button
                    className={styles.cardAdd}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(p.product_url, "_blank");
                    }}
                  >
                    View ✦
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Banner */}
      <div className={styles.banner}>
        <div>
          <h3 className={styles.bannerTitle}>Never miss a price drop again.</h3>
          <p className={styles.bannerSub}>
            Save pieces from any brand and get price drop alerts. Free, always.
          </p>
        </div>
        <button className={styles.bannerBtn}>Create your wishlist ✦</button>
      </div>
    </main>
  );
}
