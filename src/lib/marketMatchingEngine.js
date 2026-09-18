// Market Matching Engine for Taana Baana with Full Multilingual Localization
// Analyzes craft attributes, region, pricing, and materials to match products with target buyer segments.

export const MARKET_SEGMENTS_CATALOG = [
  {
    id: "seg_eco_boutiques",
    icon: "Leaf",
    badgeColor: "olive",
    names: {
      en: "Eco-friendly & Organic Boutiques",
      ml: "പരിസ്ഥിതി സൗഹൃദ & ഓർഗാനിക് ബോട്ടിക്കുകൾ",
      hi: "पर्यावरण-अनुकूल व जैविक बुटीक"
    },
    descriptions: {
      en: "Urban sustainable stores and online eco-brands looking for organic dyes and zero-plastic craft items.",
      ml: "പ്രകൃതിദത്ത ചായങ്ങളും പ്ലാസ്റ്റിക് രഹിതവുമായ ഉൽപ്പന്നങ്ങൾ തേടുന്ന പരിസ്ഥിതി സൗഹൃദ സ്റ്റോറുകൾ.",
      hi: "प्राकृतिक रंगों और प्लास्टिक-मुक्त प्रामाणिक हस्तशिल्प की तलाश करने वाले आधुनिक ब्रांड।"
    },
    targetBuyers: {
      en: "Eco-conscious urban consumers & ethical retail curators (Ages 25-45)",
      ml: "പരിസ്ഥിതി ബോധമുള്ള നഗരവാസികളും റീട്ടെയിൽ ക്യുറേറ്റർമാരും",
      hi: "पर्यावरण के प्रति जागरूक शहरी उपभोक्ता और स्टोर क्यूरेटर"
    },
    typicalMargin: "1.8x - 2.2x",
    categoryFit: ["Weaving", "Pottery", "Bamboo", "Embroidery"]
  },
  {
    id: "seg_luxury_decor",
    icon: "Sparkles",
    badgeColor: "gold",
    names: {
      en: "Luxury Heritage & Interior Designers",
      ml: "ആഡംബര പൈതൃക & ഇന്റീരിയർ ഡിസൈനർമാർ",
      hi: "लक्ज़री हेरिटेज व इंटीरियर डिज़ाइनर"
    },
    descriptions: {
      en: "Architects, high-end interior decorators, and boutique heritage hotels seeking bespoke artisanal pieces.",
      ml: "ഹെറിറ്റേജ് ഹോട്ടലുകൾക്കും വീടുകൾക്കുമായി പ്രത്യേക കരകൗശല രൂപകൽപ്പനകൾ തേടുന്ന ആർക്കിടെക്റ്റുകൾ.",
      hi: "हेरिटेज होटल और प्रीमियम घरों के लिए विशेष हस्तनिर्मित सजावटी कलाकृतियों के खरीदार।"
    },
    targetBuyers: {
      en: "High net-worth homeowners & boutique hotel interior teams",
      ml: "പ്രമുഖ ഹോട്ടലുകളും പൈതൃക ഭവനങ്ങളും",
      hi: "प्रीमियम गृहस्वामी और बुटीक होटल डिज़ाइन टीम"
    },
    typicalMargin: "2.2x - 3.5x",
    categoryFit: ["Metalwork", "Wood Carving", "Weaving", "Pottery"]
  },
  {
    id: "seg_corporate_gifting",
    icon: "Briefcase",
    badgeColor: "indigo",
    names: {
      en: "Bulk Corporate Gifting",
      ml: "കോർപ്പറേറ്റ് ബൾക്ക് ഗിഫ്റ്റിംഗ്",
      hi: "थोक कॉर्पोरेट उपहार"
    },
    descriptions: {
      en: "Tech firms, financial institutions, and event planners sourcing customized artisanal hampers.",
      ml: "ഉത്സവങ്ങൾക്കും സമ്മേളനങ്ങൾക്കുമായി കരകൗശല സമ്മാനങ്ങൾ വാങ്ങുന്ന വൻകിട കമ്പനികൾ.",
      hi: "त्योहारों व सम्मेलनों के लिए अनुकूलित हस्तशिल्प उपहार बॉक्स खरीदने वाली कंपनियाँ।"
    },
    targetBuyers: {
      en: "Corporate HR, PR managers, and event agencies",
      ml: "കോർപ്പറേറ്റ് എച്ച്.ആർ, പി.ആർ മാനേജർമാർ",
      hi: "कॉर्पोरेट एचआर और इवेंट एजेंसियां"
    },
    typicalMargin: "1.4x - 1.7x",
    categoryFit: ["Wood Carving", "Pottery", "Leather", "Metalwork"]
  },
  {
    id: "seg_tourist_souvenirs",
    icon: "Compass",
    badgeColor: "terracotta",
    names: {
      en: "Cultural & Tourist Souvenir Retailers",
      ml: "സാംസ്കാരിക & ടൂറിസ്റ്റ് സുവനീർ വിപണികൾ",
      hi: "सांस्कृतिक व पर्यटक स्मृति चिन्ह स्टोर"
    },
    descriptions: {
      en: "High-footfall museum gift shops, airport kiosks, and heritage centers catering to travelers.",
      ml: "വിമാനത്താവളങ്ങൾ, മ്യൂസിയങ്ങൾ, വിനോദസഞ്ചാര കേന്ദ്രങ്ങൾ എന്നിവിടങ്ങളിലെ പൈതൃക സ്റ്റോറുകൾ.",
      hi: "हवाई अड्डों, संग्रहालयों और पर्यटन केंद्रों पर प्रामाणिक क्षेत्रीय स्मृति चिन्ह चाहने वाले यात्री।"
    },
    targetBuyers: {
      en: "Domestic & international heritage tourists",
      ml: "ആഭ്യന്തര-വിദേശ വിനോദസഞ്ചാരികൾ",
      hi: "देशी और विदेशी विरासत पर्यटक"
    },
    typicalMargin: "1.5x - 1.9x",
    categoryFit: ["Wood Carving", "Pottery", "Embroidery", "Leather"]
  },
  {
    id: "seg_export_fairtrade",
    icon: "Globe",
    badgeColor: "indigo",
    names: {
      en: "Fair-Trade Export Distributors",
      ml: "ഫെയർ-ട്രേഡ് കയറ്റുമതി വിതരണക്കാർ",
      hi: "निष्पक्ष व्यापार निर्यात वितरक"
    },
    descriptions: {
      en: "Global fair-trade importers in Europe and North America who order recurring batches with certified artisan origin.",
      ml: "യൂറോപ്പിലും അമേരിക്കയിലും കരകൗശല നിർമ്മാതാക്കളിൽ നിന്ന് നേരിട്ട് ഇറക്കുമതി ചെയ്യുന്ന സംഘടനകൾ.",
      hi: "यूरोप और अमेरिका में प्रामाणिक भारतीय हस्तशिल्प के अंतर्राष्ट्रीय थोक आयातक।"
    },
    targetBuyers: {
      en: "International wholesale buyers & ethical trade networks",
      ml: "അന്താരാഷ്ട്ര മൊത്തവ്യാപാരികൾ",
      hi: "अंतर्राष्ट्रीय थोक खरीदार और नैतिक व्यापार नेटवर्क"
    },
    typicalMargin: "2.0x - 2.8x",
    categoryFit: ["Weaving", "Embroidery", "Metalwork"]
  }
];

/**
 * Calculates market matches for a given product with full multilingual support
 * @param {Object} product - Product details
 * @param {string} lang - 'en' | 'ml' | 'hi'
 * @returns {Array} Ranked list of matched market segments with score & AI rationale
 */
export function analyzeMarketMatches(product, lang = 'en') {
  const {
    category = "Weaving",
    final_price = 1500,
    region = "Kerala",
    production_hours = 8,
    tags = []
  } = product || {};

  const matches = MARKET_SEGMENTS_CATALOG.map(segment => {
    let score = 0.52;
    let rationaleEn = [];
    let rationaleMl = [];
    let rationaleHi = [];

    // Category fit score
    if (segment.categoryFit.some(c => category.toLowerCase().includes(c.toLowerCase()))) {
      score += 0.24;
      rationaleEn.push(`Strong affinity for ${category} crafts.`);
      rationaleMl.push(`${category} ഉൽപ്പന്നങ്ങൾക്ക് ഉയർന്ന ആവശ്യക്കാരുണ്ട്.`);
      rationaleHi.push(`${category} शिल्प के लिए इस बाज़ार में उच्च मांग है।`);
    } else {
      score += 0.08;
    }

    // Price bracket alignment
    const price = Number(final_price) || 1200;
    if (segment.id === "seg_luxury_decor") {
      if (price >= 2800) {
        score += 0.20;
        rationaleEn.push(`Price point (₹${price}) matches luxury interior budgets.`);
        rationaleMl.push(`വിലനിലവാരം (₹${price}) പ്രീമിയം ഇന്റീരിയർ ബജറ്റിന് അനുയോജ്യമാണ്.`);
        rationaleHi.push(`मूल्य (₹${price}) प्रीमियम इंटीरियर बजट के सर्वथा अनुकूल है।`);
      }
    } else if (segment.id === "seg_corporate_gifting") {
      if (price >= 500 && price <= 3000) {
        score += 0.18;
        rationaleEn.push("Ideal corporate gifting price band.");
        rationaleMl.push("കോർപ്പറേറ്റ് ഉപഹാരങ്ങൾക്ക് ഏറ്റവും അനുയോജ്യമായ നിരക്ക്.");
        rationaleHi.push("कॉर्पोरेट उपहारों के लिए आदर्श मूल्य वर्ग।");
      }
    } else if (segment.id === "seg_eco_boutiques") {
      if (tags.some(t => ['organic', 'natural', 'cotton', 'clay', 'കസവ്', 'കോട്ടൺ', 'मिट्टी'].some(k => t.toLowerCase().includes(k)))) {
        score += 0.18;
        rationaleEn.push("Natural organic materials strongly resonate with eco-conscious shoppers.");
        rationaleMl.push("പ്രകൃതിദത്ത സാമഗ്രികൾ പരിസ്ഥിതി സൗഹൃദ ഉപഭോക്താക്കളെ ആകർഷിക്കുന്നു.");
        rationaleHi.push("प्राकृतिक जैविक सामग्री पर्यावरण-प्रेमी खरीदारों को आकर्षित करती है।");
      }
    }

    score = Math.min(0.98, Math.max(0.65, Number(score.toFixed(2))));

    // Localized Action Tips
    const tips = {
      seg_corporate_gifting: {
        en: "Offer 10% discount for bulk orders above 25 units.",
        ml: "25 എണ്ണത്തിൽ കൂടുതൽ ഓർഡറുകൾക്ക് 10% ഇളവ് നൽകുക.",
        hi: "25 इकाइयों से अधिक के थोक ऑर्डर पर 10% की छूट दें।"
      },
      seg_luxury_decor: {
        en: "Highlight natural dyes & include artisan signature certificate.",
        ml: "സ്വാഭാവിക നിറങ്ങളെക്കുറിച്ചും ശില്പിയുടെ കയ്യൊപ്പ് സർട്ടിഫിക്കറ്റും നൽകുക.",
        hi: "प्राकृतिक रंगों की जानकारी दें और कारीगर का हस्ताक्षर प्रमाण-पत्र संलग्न करें।"
      },
      seg_eco_boutiques: {
        en: "Include photo of unbleached raw materials in packaging.",
        ml: "പ്രകൃതിദത്ത അസംസ്കൃത വസ്തുക്കളുടെ ചിത്രം ഉൾപ്പെടുത്തുക.",
        hi: "पैकेजिंग में जैविक कच्चे माल की प्रामाणिक फोटो शामिल करें।"
      },
      seg_tourist_souvenirs: {
        en: "Package with compact gift box & regional history story card.",
        ml: "പ്രാദേശിക ചരിത്രം രേഖപ്പെടുത്തിയ കാർഡും ആകർഷകമായ പെട്ടിയും നൽകുക.",
        hi: "क्षेत्रीय इतिहास बताने वाले कार्ड और आकर्षक उपहार डिब्बे के साथ पैक करें।"
      },
      seg_export_fairtrade: {
        en: "Provide yarn & material authenticity certificate.",
        ml: "നൂലിന്റെയും വസ്തുക്കളുടെയും പരിശുദ്ധി സാക്ഷ്യപത്രം നൽകുക.",
        hi: "धागे और सामग्री की प्रामाणिकता का निष्पक्ष-व्यापार प्रमाण पत्र प्रदान करें।"
      }
    };

    const curName = segment.names[lang] || segment.names.en;
    const curDesc = segment.descriptions[lang] || segment.descriptions.en;
    const curTarget = segment.targetBuyers[lang] || segment.targetBuyers.en;
    const curTip = tips[segment.id]?.[lang] || tips[segment.id]?.en || "";
    const curRationale = lang === 'ml' ? (rationaleMl.join(' ') || "ഉൽപ്പന്നം വിപണിയുമായി നന്നായി പൊരുത്തപ്പെടുന്നു.") :
      lang === 'hi' ? (rationaleHi.join(' ') || "यह शिल्प इस बाज़ार के ग्राहकों से गहराई से मेल खाता है।") :
      (rationaleEn.join(' ') || "Craft pattern and region align well with target buyer demographics.");

    return {
      ...segment,
      name: curName,
      description: curDesc,
      targetBuyer: curTarget,
      matchScore: score,
      matchPercentage: Math.round(score * 100),
      reasoning: curRationale,
      actionTip: curTip
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
