"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState(null);

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

        const fetches = activeBrands.map((brand) =>
          supabase
            .from("products")
            .select("*")
            .eq("brand", brand)
            .eq("in_stock", true)
            .not("image_url", "is", null)
            .neq("image_url", "")
            .limit(100)
            .order("id", { ascending: Math.random() > 0.5 }),
        );

        const results = await Promise.all(fetches);
        results.forEach(({ data }) => {
          if (data) allProducts.push(...data);
        });

        // Shuffle to mix brands
        allProducts = allProducts.sort(() => Math.random() - 0.5);
      }

      // Deduplicate by product name only (not image URL)
      const seen = new Set();
      const unique = allProducts
        .filter((p) => {
          // Strip size from name e.g. "... Women's Size UK 8" → "... Women's"
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

  const toggleSave = (id) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <main>
      {/* Ticker */}
      <div className={styles.ticker}>
        {[
          "Shop 40+ brands",
          "One basket, one delivery",
          "Free price drop alerts",
          "New arrivals daily",
        ].map((t, i) => (
          <span key={i}>✦ {t}</span>
        ))}
      </div>

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
            <span className={styles.heroTagDot} /> The UK&apos;s first
            multi-brand basket
          </div>
          <h1 className={styles.heroTitle}>
            Your <em>whole</em> wardrobe.
            <br />
            <span className={styles.underline}>One</span> checkout.
          </h1>
          <p className={styles.heroSub}>
            Shop Ego, Mango, H&amp;M, ASOS and 40+ brands all in one place. Save
            items, mix looks, and check out once — with one delivery.
          </p>
          <div className={styles.heroPills}>
            <span className={`${styles.pill} ${styles.pillBlush}`}>
              ✦ No more tabs
            </span>
            <span className={`${styles.pill} ${styles.pillLilac}`}>
              ✦ One delivery fee
            </span>
            <span className={`${styles.pill} ${styles.pillSage}`}>
              ✦ Price drop alerts
            </span>
          </div>
          <div className={styles.heroCta}>
            <button className={styles.btnPrimary}>Start shopping</button>
            <button className={styles.btnGhost}>See how it works</button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroVisual}>
            <div className={styles.heroVisualInner}>mc</div>
            <div className={styles.heroBadge}>
              <div className={styles.heroBadgeNum}>40+</div>
              <div className={styles.heroBadgeLabel}>Brands in one place</div>
            </div>
            <div className={styles.heroBadge2}>✦ One basket always</div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className={styles.searchWrap}>
        <div className={styles.searchInner}>
          <input
            className={styles.searchInput}
            placeholder="Search across Ego, Mango, H&M, ASOS and more..."
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
            No products found for this brand yet.
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
                {(p.aw_image_url || p.image_url) && (
                  <img
                    src={p.merchant_image_url || p.aw_image_url || p.image_url}
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
                <span className={styles.cardBrandTag}>
                  {p.brand || p.merchant_name}
                </span>
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
            Save pieces from any brand to your wishlist and we&apos;ll tell you
            the moment the price changes. Free, always.
          </p>
        </div>
        <button className={styles.bannerBtn}>Create your wishlist ✦</button>
      </div>
    </main>
  );
}
