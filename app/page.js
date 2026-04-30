"use client";

import { useState } from "react";
import styles from "./page.module.css";

const BRANDS = [
  "All",
  "Zara",
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

const PRODUCTS = [
  {
    brand: "Zara",
    name: "Linen wide-leg trousers",
    price: "£49.99",
    bg: "#f0e8df",
    isNew: true,
  },
  {
    brand: "Mango",
    name: "Oversized wool blazer",
    price: "£89.99",
    bg: "#e2d8cc",
    isNew: false,
  },
  {
    brand: "H&M",
    name: "Ribbed knit midi dress",
    price: "£34.99",
    bg: "#e8ddd0",
    isNew: true,
  },
  {
    brand: "ASOS",
    name: "Satin slip skirt",
    price: "£28.00",
    bg: "#d8e4e0",
    isNew: false,
  },
  {
    brand: "& Other Stories",
    name: "Leather crossbody bag",
    price: "£115.00",
    bg: "#e8d8c4",
    isNew: false,
  },
  {
    brand: "M&S",
    name: "Pure cotton shirt dress",
    price: "£45.00",
    bg: "#e4dcd4",
    isNew: true,
  },
  {
    brand: "Arket",
    name: "Merino wool crewneck",
    price: "£79.00",
    bg: "#d8d4cc",
    isNew: false,
  },
  {
    brand: "Whistles",
    name: "Floral bias-cut midi",
    price: "£95.00",
    bg: "#ecdcd8",
    isNew: true,
  },
];

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("All");
  const [saved, setSaved] = useState([]);

  const toggleSave = (index) => {
    setSaved((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filtered =
    activeBrand === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.brand === activeBrand);

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
          <span className={styles.logoDot} /> ShoppingCentral
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
            <span className={styles.heroTagDot} />
            <span>The UK&apos;s first multi-brand basket</span>
          </div>
          <h1 className={styles.heroTitle}>
            Your <em>whole</em> wardrobe.
            <br />
            <span className={styles.underline}>One</span> checkout.
          </h1>
          <p className={styles.heroSub}>
            Shop Zara, Mango, H&amp;M, ASOS and 40+ brands all in one place.
            Save items, mix looks, and check out.
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
            <div className={styles.heroVisualInner}>SC</div>
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
            placeholder="Search across Zara, Mango, H&M, ASOS and more..."
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
          {filtered.length * 31} pieces across 40 brands
        </span>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((p, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardImg} style={{ background: p.bg }}>
              <div className={styles.overlay} />
              <span className={styles.cardBrandTag}>{p.brand}</span>
              <button
                className={styles.cardHeart}
                onClick={() => toggleSave(i)}
              >
                {saved.includes(i) ? "♥" : "♡"}
              </button>
              {p.isNew && <span className={styles.cardNew}>New in</span>}
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardName}>{p.name}</div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>{p.price}</div>
                <button className={styles.cardAdd}>+ Save</button>
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
