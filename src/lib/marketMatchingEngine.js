// Market Matching Engine for Taana Baana
// Analyzes craft attributes, region, pricing, and materials to match products with target buyer segments.

export const MARKET_SEGMENTS_CATALOG = [
  {
    id: "seg_eco_boutiques",
    name: "Eco-friendly & Organic Boutiques",
    icon: "Leaf",
    badgeColor: "olive",
    description: "Urban sustainable stores and online eco-brands in Mumbai, Bengaluru, and Berlin looking for organic dyes and zero-plastic craft items.",
    targetBuyer: "Eco-conscious urban consumers & ethical retail curators (Ages 25-45)",
    typicalMargin: "1.8x - 2.2x",
    categoryFit: ["Weaving", "Pottery", "Bamboo", "Embroidery"]
  },
  {
    id: "seg_luxury_decor",
    name: "Luxury Heritage & Interior Designers",
    icon: "Sparkles",
    badgeColor: "gold",
    description: "Architects, high-end interior decorators, and boutique heritage hotels in Delhi, Jaipur, and Dubai seeking bespoke, large-format artisanal pieces.",
    targetBuyer: "High net-worth homeowners, boutique hotel interior teams",
    typicalMargin: "2.2x - 3.5x",
    categoryFit: ["Metalwork", "Wood Carving", "Weaving", "Pottery"]
  },
  {
    id: "seg_corporate_gifting",
    name: "Bulk Corporate Gifting",
    icon: "Briefcase",
    badgeColor: "indigo",
    description: "Tech firms, financial institutions, and event planners sourcing 50-500 unit customized artisanal gift hampers for festivals (Diwali, New Year) and conferences.",
    targetBuyer: "Corporate HR, PR managers, and event agencies",
    typicalMargin: "1.4x - 1.7x",
    categoryFit: ["Wood Carving", "Pottery", "Leather", "Metalwork"]
  },
  {
    id: "seg_tourist_souvenirs",
    name: "Cultural & Tourist Souvenir Retailers",
    icon: "Compass",
    badgeColor: "terracotta",
    description: "High-footfall museum gift shops, airport handicraft kiosks, and heritage center stores catering to travelers looking for authentic regional keepsakes.",
    targetBuyer: "Domestic & international heritage tourists",
    typicalMargin: "1.5x - 1.9x",
    categoryFit: ["Wood Carving", "Pottery", "Embroidery", "Leather"]
  },
  {
    id: "seg_export_fairtrade",
    name: "Fair-Trade Export Distributors",
    icon: "Globe",
    badgeColor: "indigo",
    description: "Global fair-trade importers in Europe and North America who order recurring batches with certified artisan origin and fair wage compliance.",
    targetBuyer: "International wholesale buyers & ethical trade networks",
    typicalMargin: "2.0x - 2.8x",
    categoryFit: ["Weaving", "Embroidery", "Metalwork"]
  }
];

/**
 * Calculates market matches for a given product
 * @param {Object} product - Product details (category, price, region, material_cost, production_hours, tags)
 * @returns {Array} Ranked list of matched market segments with score & AI rationale
 */
export function analyzeMarketMatches(product) {
  const {
    category = "Weaving",
    final_price = 1500,
    region = "Kerala",
    material_cost = 400,
    production_hours = 8,
    tags = []
  } = product || {};

  const matches = MARKET_SEGMENTS_CATALOG.map(segment => {
    let score = 0.50; // base score
    let rationaleParts = [];

    // 1. Category fit score (+0.25)
    if (segment.categoryFit.includes(category)) {
      score += 0.25;
      rationaleParts.push(`High affinity for ${category} crafts.`);
    } else {
      score += 0.08;
    }

    // 2. Price Bracket alignment
    const price = Number(final_price) || 1200;
    if (segment.id === "seg_luxury_decor") {
      if (price >= 3000) {
        score += 0.20;
        rationaleParts.push("Price point (₹" + price + ") matches premium luxury interior budget.");
      } else {
        score += 0.05;
        rationaleParts.push("Could be bundled into multi-piece luxury accent sets.");
      }
    } else if (segment.id === "seg_corporate_gifting") {
      if (price >= 500 && price <= 2500) {
        score += 0.20;
        rationaleParts.push("Ideal corporate gifting price band (₹500 - ₹2,500/unit).");
      }
    } else if (segment.id === "seg_eco_boutiques") {
      if (tags.some(t => t.toLowerCase().includes('organic') || t.toLowerCase().includes('natural') || t.toLowerCase().includes('handspun') || t.toLowerCase().includes('cotton'))) {
        score += 0.18;
        rationaleParts.push("Natural materials and hand-crafted provenance strongly resonate with eco-shoppers.");
      } else {
        score += 0.12;
      }
    } else if (segment.id === "seg_tourist_souvenirs") {
      if (region.includes('Kerala') || region.includes('Rajasthan') || region.includes('Kashmir') || region.includes('Gujarat')) {
        score += 0.18;
        rationaleParts.push(`Strong tourist demand for authentic regional craft from ${region}.`);
      }
    } else if (segment.id === "seg_export_fairtrade") {
      if (production_hours >= 6) {
        score += 0.18;
        rationaleParts.push(`Intricate handwork (${production_hours} hrs crafting time) meets fair-trade export standards.`);
      }
    }

    // 3. Heuristic polish & caps
    score = Math.min(0.98, Math.max(0.62, Number(score.toFixed(2))));

    // Actionable advice for artisan
    let actionTip = "";
    if (segment.id === "seg_corporate_gifting") {
      actionTip = "Offer 10% discount for orders above 25 units.";
    } else if (segment.id === "seg_luxury_decor") {
      actionTip = "Highlight natural dyes & include artisan signature tag.";
    } else if (segment.id === "seg_eco_boutiques") {
      actionTip = "Include photo of raw eco-friendly raw materials.";
    } else if (segment.id === "seg_tourist_souvenirs") {
      actionTip = "Package with compact gift box & regional history card.";
    } else {
      actionTip = "Provide yarn/material authenticity certificate.";
    }

    return {
      ...segment,
      matchScore: score,
      matchPercentage: Math.round(score * 100),
      reasoning: rationaleParts.join(" ") || "Craft pattern and region align well with buyer demographics.",
      actionTip
    };
  });

  // Sort by highest match score first
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
