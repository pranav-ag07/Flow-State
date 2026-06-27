const fs = require('fs');
let content = fs.readFileSync('/home/pranav-sharma/Flow State/src/pages/SyllabusPage.tsx', 'utf-8');

content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { Bank, Mosque, Flag, Globe, MapPin, GlobeHemisphereEast, Scales, Coins, Palette, Newspaper, PushPin, Calculator, Sigma, Brain } from '@phosphor-icons/react';");

content = content.replace('title: "🏛️ PART 1 — ANCIENT INDIA"', 'title: "PART 1 — ANCIENT INDIA", icon: <Bank size={28} color="#f7f4f0" />');
content = content.replace('title: "🕌 PART 2 — MEDIEVAL INDIA"', 'title: "PART 2 — MEDIEVAL INDIA", icon: <Mosque size={28} color="#f7f4f0" />');
content = content.replace('title: "🇮🇳 PART 3 — MODERN INDIA"', 'title: "PART 3 — MODERN INDIA", icon: <Flag size={28} color="#f7f4f0" />');

content = content.replace('title: "🌐 PART 1 — PHYSICAL GEOGRAPHY"', 'title: "PART 1 — PHYSICAL GEOGRAPHY", icon: <Globe size={28} color="#f7f4f0" />');
content = content.replace('title: "🇮🇳 PART 2 — INDIAN GEOGRAPHY (Most Important)"', 'title: "PART 2 — INDIAN GEOGRAPHY (Most Important)", icon: <MapPin size={28} color="#f7f4f0" />');
content = content.replace('title: "🌏 PART 3 — WORLD & ECONOMIC GEOGRAPHY"', 'title: "PART 3 — WORLD & ECONOMIC GEOGRAPHY", icon: <GlobeHemisphereEast size={28} color="#f7f4f0" />');

content = content.replace('title: "⚖️ 1. INDIAN POLITY & CONSTITUTION"', 'title: "1. INDIAN POLITY & CONSTITUTION", icon: <Scales size={28} color="#f7f4f0" />');
content = content.replace('title: "💰 2. INDIAN ECONOMY"', 'title: "2. INDIAN ECONOMY", icon: <Coins size={28} color="#f7f4f0" />');

content = content.replace('title: "🎨 4. ART & CULTURE"', 'title: "4. ART & CULTURE", icon: <Palette size={28} color="#f7f4f0" />');
content = content.replace('title: "📰 5. CURRENT AFFAIRS & STATIC GK"', 'title: "5. CURRENT AFFAIRS & STATIC GK", icon: <Newspaper size={28} color="#f7f4f0" />');

content = content.replace('title: "📌 PART 1 — GRAMMAR"', 'title: "PART 1 — GRAMMAR", icon: <PushPin size={28} color="#f7f4f0" />');
content = content.replace('title: "📌 PART 2 — VOCABULARY"', 'title: "PART 2 — VOCABULARY", icon: <PushPin size={28} color="#f7f4f0" />');
content = content.replace('title: "📌 PART 3 — COMPREHENSION & READING SKILLS"', 'title: "PART 3 — COMPREHENSION & READING SKILLS", icon: <PushPin size={28} color="#f7f4f0" />');

content = content.replace('title: "📌 PART 1 — ARITHMETIC"', 'title: "PART 1 — ARITHMETIC", icon: <Calculator size={28} color="#f7f4f0" />');
content = content.replace('title: "📌 PART 2 — ADVANCED MATHS"', 'title: "PART 2 — ADVANCED MATHS", icon: <Sigma size={28} color="#f7f4f0" />');

content = content.replace('title: "📌 PART 1 — VERBAL REASONING"', 'title: "PART 1 — VERBAL REASONING", icon: <Brain size={28} color="#f7f4f0" />');
content = content.replace('title: "📌 PART 2 — NON-VERBAL REASONING"', 'title: "PART 2 — NON-VERBAL REASONING", icon: <Brain size={28} color="#f7f4f0" />');

content = content.replace(
  "<h2 style={{ fontSize: '1.5rem', marginTop: 0, color: '#f7f4f0' }}>{part.title}</h2>",
  "<h2 style={{ fontSize: '1.5rem', marginTop: 0, color: '#f7f4f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>\n                {part.icon} {part.title}\n              </h2>"
);

fs.writeFileSync('/home/pranav-sharma/Flow State/src/pages/SyllabusPage.tsx', content);
