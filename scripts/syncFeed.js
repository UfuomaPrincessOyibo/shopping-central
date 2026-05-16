require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const https = require("https");
const zlib = require("zlib");
const { unzipSync } = require("zlib");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Add each approved brand feed URL here as you get approved
const FEEDS = [
  { brand: "Ego", url: process.env.AWIN_FEED_EGO },
  // { brand: 'Brand2', url: process.env.AWIN_FEED_BRAND2 },
  // { brand: 'ASOS', url: process.env.AWIN_FEED_ASOS },  ← uncomment as you get approved
];

function fetchFeed(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchFeed(res.headers.location).then(resolve).catch(reject);
      }

      // Collect raw buffer first
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        try {
          // Try unzip (zip format)
          const decompressed = unzipSync(buffer);
          resolve(decompressed.toString("utf8"));
        } catch (e) {
          // Try gunzip as fallback
          try {
            const decompressed = zlib.gunzipSync(buffer);
            resolve(decompressed.toString("utf8"));
          } catch (e2) {
            // Return raw if neither works
            resolve(buffer.toString("utf8"));
          }
        }
      });
      res.on("error", reject);
    });
  });
}

async function debug() {
  console.log("Fetching Ego feed...");
  const raw = await fetchFeed(process.env.AWIN_FEED_EGO);
  // Print just the first 500 characters so we can see the format
  console.log("Feed preview:");
  console.log(raw.substring(0, 500));
}

debug();

function parseFeed(csv, brand) {
  const lines = csv.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/"/g, "").toLowerCase());

  return lines
    .slice(1)
    .map((line) => {
      // Handle commas inside quoted fields
      const values = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else current += char;
      }
      values.push(current.trim());

      const row = {};
      headers.forEach((h, i) => (row[h] = (values[i] || "").replace(/"/g, "")));

      return {
        brand: brand,
        name: row["product_name"] || row["name"] || row["title"],
        price: parseFloat(
          row["search_price"] || row["price"] || row["rrp"] || 0,
        ),
        currency: "GBP",
        image_url:
          row["aw_image_url"] || row["image_url"] || row["merchant_image_url"],
        product_url:
          row["aw_deep_link"] || row["deep_link"] || row["product_url"],
        category:
          row["category_name"] || row["merchant_category"] || row["category"],
        is_new: row["is_new"] === "1" || false,
        in_stock: row["in_stock"] !== "0",
      };
    })
    .filter((p) => p.name && p.price > 0 && p.product_url);
}

async function syncBrand({ brand, url }) {
  if (!url) {
    console.log(`⚠️  Skipping ${brand} — no feed URL set in .env.local`);
    return;
  }

  console.log(`\n📦 Syncing ${brand}...`);

  try {
    const raw = await fetchFeed(url);
    const products = parseFeed(raw, brand);
    console.log(`   Found ${products.length} products`);

    if (products.length === 0) {
      console.log(`   ⚠️  No products parsed — check feed format`);
      return;
    }

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const { error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "product_url", ignoreDuplicates: false });

      if (error) {
        console.error(`   ❌ Batch error:`, error.message);
      } else {
        inserted += batch.length;
      }
    }
    console.log(`   ✅ Synced ${inserted} products from ${brand}`);
  } catch (err) {
    console.error(`   ❌ Failed to sync ${brand}:`, err.message);
  }
}

async function syncAll() {
  console.log("🚀 Starting feed sync...");
  console.log(`   Syncing ${FEEDS.length} brand(s)\n`);

  for (const feed of FEEDS) {
    await syncBrand(feed);
  }

  console.log("\n✨ All feeds synced!");
  console.log("   Check your Supabase products table to verify.");
}

syncAll();
