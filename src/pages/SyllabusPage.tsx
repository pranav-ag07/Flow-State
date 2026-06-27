import { useState, useEffect } from 'react';
import { Bank, Mosque, Flag, Globe, MapPin, GlobeHemisphereEast, Scales, Coins, Palette, Newspaper, PushPin, Calculator, Sigma, Brain } from '@phosphor-icons/react';

const historySyllabus = [
  {
    title: "PART 1 — ANCIENT INDIA", icon: <Bank size={28} color="#f7f4f0" />,
    description: "Ancient history covers the following chapters:",
    chapters: [
      { num: 1, title: "Prehistoric India", desc: "Stone Age (Paleolithic, Mesolithic, Neolithic, Chalcolithic), early human life, tools used." },
      { num: 2, title: "Indus Valley Civilization", desc: "Urban planning, trade, seals, script, major sites (Harappa, Mohenjo-Daro), decline." },
      { num: 3, title: "Vedic Age", desc: "Early vs Later Vedic period, Rigveda, society, political structure, rituals." },
      { num: 4, title: "Mahajanapadas", desc: "16 Mahajanapadas, rise of Magadha and Kosala, early Indian polity." },
      { num: 5, title: "Buddhism & Jainism", desc: "Founders (Gautam Buddha & Mahavira), teachings, Four Noble Truths, Buddhist Councils, spread of religion." },
      { num: 6, title: "Mauryan Empire", desc: "Chandragupta Maurya, Ashoka, Kalinga War, Dhamma policy, decline." },
      { num: 7, title: "Post-Mauryan Period", desc: "Sungas, Kushanas (Kanishka), Sangam Age in South India." },
      { num: 8, title: "Gupta Empire", desc: "Chandragupta I & II, Samudragupta (\"Napoleon of India\"), Golden Age of art/science/literature." },
      { num: 9, title: "Art, Architecture & Literature", desc: "Rock-cut temples, stupas, Nalanda University, Sanskrit literature, Charaka Samhita." }
    ]
  },
  {
    title: "PART 2 — MEDIEVAL INDIA", icon: <Mosque size={28} color="#f7f4f0" />,
    description: "Medieval Indian history covers the period between the 8th century and the 18th century, including different empires and kingdoms.",
    chapters: [
      { num: 10, title: "Early Medieval Period", desc: "Rajput kingdoms, Arab invasion (Muhammad bin Qasim), Tripartite struggle." },
      { num: 11, title: "Delhi Sultanate", desc: "Five dynasties (Slave, Khilji, Tughlaq, Sayyid, Lodi), important sultans (Iltutmish, Alauddin Khilji, Muhammad bin Tughlaq, Firuz Shah Tughlaq), administrative system." },
      { num: 12, title: "Vijayanagara & Bahmani Kingdoms", desc: "South Indian powers, Krishnadevaraya, cultural contributions." },
      { num: 13, title: "Bhakti & Sufi Movement", desc: "Key saints (Kabir, Mirabai, Ramananda, Tukaram), Sufi orders, social reform through religion." },
      { num: 14, title: "Mughal Empire", desc: "Babur to Aurangzeb (1526–1707), key battles (Panipat I, II, III), administration, Akbar's Din-i-Ilahi, art & architecture (Taj Mahal, Red Fort)." },
      { num: 15, title: "Maratha Empire", desc: "Shivaji, Peshwas, Maratha Confederacy, decline." },
      { num: 16, title: "Regional Kingdoms (post-Mughal)", desc: "Rise of Hyderabad, Awadh, Bengal Nawabs, Sikh Kingdom (Ranjit Singh)." }
    ]
  },
  {
    title: "PART 3 — MODERN INDIA", icon: <Flag size={28} color="#f7f4f0" />,
    description: "Modern History carries the highest weightage, especially covering the British period and the freedom struggle.",
    chapters: [
      { num: 17, title: "European Arrival in India", desc: "Portuguese, Dutch, French, British East India Company, major trading posts." },
      { num: 18, title: "British Expansion", desc: "Battles of Plassey (1757) & Buxar (1764), Subsidiary Alliance, Doctrine of Lapse, annexation of states." },
      { num: 19, title: "Governor-Generals & Viceroys", desc: "Warren Hastings, Cornwallis, Wellesley, Dalhousie, Curzon, Mountbatten — key policies of each." },
      { num: 20, title: "Revolt of 1857", desc: "Causes, key leaders (Mangal Pandey, Rani Laxmibai, Bahadur Shah Zafar), outcome, significance." },
      { num: 21, title: "Social & Religious Reform Movements", desc: "Raja Ram Mohan Roy (Brahmo Samaj), Dayanand Saraswati (Arya Samaj), Vivekananda (Ramakrishna Mission), Sati abolition, widow remarriage." },
      { num: 22, title: "Indian National Congress (INC)", desc: "Founding (1885), Moderates vs Extremists, major sessions and resolutions, Bal-Pal-Lal." },
      { num: 23, title: "Partition of Bengal & Swadeshi Movement (1905)", desc: "Curzon's partition, Swadeshi & Boycott, national awakening." },
      { num: 24, title: "Gandhian Era & Movements", desc: "Non-Cooperation Movement (1920), Civil Disobedience / Dandi March (1930), Quit India Movement (1942), role of Gandhi, Nehru, Patel, Bose." },
      { num: 25, title: "Revolutionary Movements", desc: "Bhagat Singh, Chandrashekhar Azad, Subhas Chandra Bose & INA, HSRA." },
      { num: 26, title: "Important Acts & Constitutional Developments", desc: "Regulating Act 1773, Charter Acts, Morley-Minto Reforms 1909, Montagu-Chelmsford Reforms 1919, Government of India Act 1935, Indian Independence Act 1947." },
      { num: 27, title: "Independence & Partition (1947)", desc: "Mountbatten Plan, partition of India & Pakistan, integration of princely states." }
    ]
  }
];

const geographySyllabus = [
  {
    title: "PART 1 — PHYSICAL GEOGRAPHY", icon: <Globe size={28} color="#f7f4f0" />,
    description: "Physical geography covers the fundamental processes and features of the Earth.",
    chapters: [
      { num: 1, title: "Solar System & The Earth", desc: "Solar system basics, rotation & revolution of Earth, seasons, eclipses, latitude & longitude, time zones, International Date Line." },
      { num: 2, title: "Interior of the Earth", desc: "Layers — crust, mantle, outer core, inner core; lithosphere, hydrosphere, biosphere; plate tectonics and continental drift." },
      { num: 3, title: "Rocks & Soils", desc: "Types of rocks (igneous, sedimentary, metamorphic); types of soils (alluvial, black, red, laterite, desert, mountain soils)." },
      { num: 4, title: "Major Landforms", desc: "Mountains, plateaus, plains, and deserts — formation, types, and world examples. Glaciers, valleys, and coastal landforms." },
      { num: 5, title: "Atmosphere & Climate", desc: "Structure of atmosphere; pressure belts; types of winds (trade winds, westerlies, polar); monsoon mechanism; types of rainfall; climate zones of the world; cyclones (called typhoons in Pacific, hurricanes in Atlantic, willy-willy in Australia)." },
      { num: 6, title: "Earthquake & Volcano", desc: "Focus vs epicentre; seismic waves; Richter scale; Ring of Fire; types of volcanoes." },
      { num: 7, title: "Isolines & Maps (Cartography)", desc: "Isolines (isobar, isohyet, isotherm, contour); map projections; topographic maps; reading political and physical maps." },
      { num: 8, title: "Water Bodies & Oceanography", desc: "Oceans, seas, important straits and channels; ocean currents; tides; important lakes of the world; major world rivers." }
    ]
  },
  {
    title: "PART 2 — INDIAN GEOGRAPHY (Most Important)", icon: <MapPin size={28} color="#f7f4f0" />,
    description: "Detailed study of India's physical features, climate, drainage, and resources.",
    chapters: [
      { num: 9, title: "India — Size & Location", desc: "India is the seventh largest country by area (32,87,263 km²). It is surrounded by the Bay of Bengal in the east, the Arabian Sea in the west, and the Indian Ocean to the south. Standard meridian (82.5°E), Tropic of Cancer, border lengths with neighbouring countries." },
      { num: 10, title: "Physical Features of India", desc: "The major physical divisions are the Himalayan Mountains, Northern Plains, Peninsular Plateau, Indian Desert, Coastal Plains, and Islands. Aravalli (oldest range), Western & Eastern Ghats, Deccan Plateau." },
      { num: 11, title: "Drainage System of India", desc: "Himalayan Rivers are perennial (Indus, Ganga, Brahmaputra); Peninsular Rivers are seasonal and depend on rainfall (Narmada, Tapi, Godavari, Krishna, Kaveri). Important dams and lakes." },
      { num: 12, title: "Climate of India", desc: "Monsoon — onset, withdrawal, Southwest & Northeast monsoon; seasons in India; rainfall patterns; jet streams; El Niño effects on Indian monsoon." },
      { num: 13, title: "Natural Vegetation & Wildlife", desc: "Types of forests (tropical rainforest, deciduous, mangrove, alpine); biosphere reserves in India; important national parks and wildlife sanctuaries; Western Ghats as ecological hotspot." },
      { num: 14, title: "Agriculture in India", desc: "Two cropping seasons (Kharif & Rabi); major crops and their producing states; Green Revolution, White Revolution, Blue Revolution; important agricultural revolutions." },
      { num: 15, title: "Minerals & Resources", desc: "Top mineral-producing states; coal, iron ore, bauxite, petroleum, mica; major mines and their locations." },
      { num: 16, title: "Industries & Transportation", desc: "Major industries (iron & steel, cotton, jute, IT); important industrial regions; road, rail, waterway, and air transport networks; major ports." },
      { num: 17, title: "Population & Tribes", desc: "Population density, sex ratio, literacy rate, census data; urbanization; important tribes of India." }
    ]
  },
  {
    title: "PART 3 — WORLD & ECONOMIC GEOGRAPHY", icon: <GlobeHemisphereEast size={28} color="#f7f4f0" />,
    description: "World geography, economic regions, and environmental issues.",
    chapters: [
      { num: 18, title: "World: Countries, Capitals & Borders", desc: "Countries and capitals; boundary lines (McMahon Line, Durand Line, Radcliffe Line); continents and their features." },
      { num: 19, title: "World Continents & Oceans", desc: "Major mountain ranges (Rockies, Andes, Alps); world deserts and their locations (Sahara, Kalahari, Atacama, Thar, Great Victoria); major rivers (Amazon, Nile, Mississippi)." },
      { num: 20, title: "Economic Geography", desc: "Major agricultural and industrial regions of the world; important trade routes; global resource distribution." },
      { num: 21, title: "Environmental Geography", desc: "Environmental issues — deforestation, global warming, greenhouse effect, ozone depletion; natural hazards (floods, droughts, cyclones); conservation of resources; international agreements (Kyoto Protocol, Paris Agreement)." }
    ]
  }
];

const politySyllabus = [
  {
    title: "1. INDIAN POLITY & CONSTITUTION", icon: <Scales size={28} color="#f7f4f0" />,
    description: "Detailed study of the Indian Constitution, political system, and governance.",
    chapters: [
      { num: 1, title: "Making of the Constitution", desc: "Constituent Assembly, B.R. Ambedkar's role, dates of adoption (26 Nov 1949) & enforcement (26 Jan 1950), sources of Constitution from various countries." },
      { num: 2, title: "Preamble", desc: "\"We the People…\" — keywords (Sovereign, Socialist, Secular, Democratic, Republic), 42nd Amendment 1976 added Socialist & Secular." },
      { num: 3, title: "Salient Features of the Constitution", desc: "Longest written constitution, federal with unitary bias, parliamentary form, independent judiciary, single citizenship." },
      { num: 4, title: "Fundamental Rights (Articles 12–35)", desc: "Right to Equality (14–18), Right to Freedom (19–22), Right against Exploitation (23–24), Right to Religion (25–28), Cultural & Educational Rights (29–30), Right to Constitutional Remedies (32) — \"Heart & Soul\" of Constitution (Ambedkar)." },
      { num: 5, title: "Directive Principles & Fundamental Duties", desc: "DPSP — non-justiciable, borrowed from Ireland; 11 Fundamental Duties added by 42nd Amendment (Swaran Singh Committee)." },
      { num: 6, title: "Parliament", desc: "Lok Sabha (max 552 seats), Rajya Sabha (max 250 seats, 12 nominated); Sessions — Budget, Monsoon, Winter; Joint Sitting (Article 108); Speaker & Deputy Speaker; No-confidence motion; Money Bill vs Ordinary Bill." },
      { num: 7, title: "President & Vice President", desc: "President — Article 52–62; elected by Electoral College; powers (executive, legislative, judicial, emergency); Article 356 (President's Rule); Vice President — Chairman of Rajya Sabha (Article 63–71)." },
      { num: 8, title: "Prime Minister & Council of Ministers", desc: "Article 74–75; Cabinet vs Council of Ministers; collective responsibility; Article 356 vs Article 360." },
      { num: 9, title: "Judiciary", desc: "Supreme Court (Article 124–147); Chief Justice of India; High Courts (Article 214); subordinate courts; Writ jurisdiction — Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto; Judicial Review; PIL." },
      { num: 10, title: "State Government", desc: "Governor (Article 153); Chief Minister & Council of Ministers; State Legislature — Vidhan Sabha & Vidhan Parishad; states with bicameral legislature." },
      { num: 11, title: "Local Self Government", desc: "73rd Amendment — Panchayati Raj (3-tier: Gram Panchayat, Panchayat Samiti, Zila Parishad); 74th Amendment — Urban Local Bodies (Municipality, Municipal Corporation, Nagar Panchayat)." },
      { num: 12, title: "Emergency Provisions", desc: "National Emergency (Article 352), President's Rule (Article 356), Financial Emergency (Article 360); effects of each." },
      { num: 13, title: "Elections & Constitutional Bodies", desc: "Election Commission (Article 324); CAG (Article 148); UPSC (Article 315); Attorney General; Comptroller & Auditor General; Finance Commission." },
      { num: 14, title: "Important Articles & Amendments", desc: "Must-know articles: 14, 19, 21, 32, 44, 51A, 112, 123, 148, 170, 243, 280, 300A, 324, 352, 356, 360, 368. Key amendments: 42nd, 44th, 52nd, 61st, 73rd, 74th, 86th, 101st (GST), 103rd (EWS reservation)." },
      { num: 15, title: "Constitutional & Non-Constitutional Bodies", desc: "Constitutional — Election Commission, CAG, UPSC, Finance Commission. Non-Constitutional (statutory) — NHRC, CBI, CVC, NITI Aayog, Planning Commission (now dissolved)." }
    ]
  }
];

const economySyllabus = [
  {
    title: "2. INDIAN ECONOMY", icon: <Coins size={28} color="#f7f4f0" />,
    description: "Study of basic economic concepts, Indian economy, banking, taxation, and government schemes.",
    chapters: [
      { num: 1, title: "Basic Concepts", desc: "GDP, GNP, NDP, NNP; Per Capita Income; difference between Nominal & Real GDP; Fiscal Deficit, Revenue Deficit, Primary Deficit; Balance of Payments; inflation types (demand-pull, cost-push); CPI vs WPI." },
      { num: 2, title: "Planning in India", desc: "Five Year Plans (1st to 12th); NITI Aayog replaced Planning Commission in 2015; Atal Innovation Mission; objectives of planning — growth, modernisation, self-reliance, equity." },
      { num: 3, title: "Money & Banking", desc: "Functions of money; RBI (established 1935, nationalised 1949) — functions, monetary policy tools (Repo Rate, Reverse Repo, CRR, SLR, MSF); types of banks — commercial, cooperative, regional rural banks; NABARD, SIDBI, EXIM Bank; recent bank mergers." },
      { num: 4, title: "Union Budget & Taxation", desc: "Union Budget — presented by Finance Minister on 1st February; Direct taxes (Income Tax, Corporate Tax) vs Indirect taxes; GST (101st Amendment, 4 slabs — 5%, 12%, 18%, 28%); GST Council; Tax-GDP ratio." },
      { num: 5, title: "Agriculture", desc: "Contribution to GDP; Green Revolution (Norman Borlaug, M.S. Swaminathan); agricultural seasons (Kharif, Rabi, Zaid); MSP (Minimum Support Price); APMC; PM-KISAN, PM Fasal Bima Yojana; irrigation types." },
      { num: 6, title: "Industries & Sectors", desc: "Primary, Secondary, Tertiary sectors; Small Scale & Cottage Industries; Industrial Policy; Disinvestment; PSUs; major industries — steel, textile, IT, pharma; Make in India, Startup India." },
      { num: 7, title: "Poverty & Unemployment", desc: "Poverty Line; BPL; Tendulkar Committee; Rangarajan Committee; types of unemployment — seasonal, structural, frictional, disguised; MGNREGA." },
      { num: 8, title: "Government Schemes", desc: "PM Awas Yojana, Swachh Bharat Mission, Ayushman Bharat, Jan Dhan Yojana, Ujjwala Yojana, Digital India, Skill India, Beti Bachao Beti Padhao — implementing ministry, launch year, objective." },
      { num: 9, title: "International Economic Organisations", desc: "IMF (headquarters Washington D.C.); World Bank Group; WTO (replaced GATT, HQ Geneva); ADB (HQ Manila); BRICS; G20; SAARC; ASEAN; India's trade relations." },
      { num: 10, title: "Indian Financial Market", desc: "SEBI (regulator of capital markets); NSE & BSE; Sensex & Nifty; types of markets — money market, capital market; FDI vs FII; External Commercial Borrowing." }
    ]
  }
];

const artAndCultureSyllabus = [
  {
    title: "4. ART & CULTURE", icon: <Palette size={28} color="#f7f4f0" />,
    description: "Detailed study of Indian art forms, heritage, and cultural traditions.",
    chapters: [
      { num: 1, title: "Classical Dance Forms", desc: "Bharatanatyam (Tamil Nadu), Kathak (UP/Rajasthan), Kathakali (Kerala), Kuchipudi (Andhra Pradesh), Odissi (Odisha), Manipuri (Manipur), Mohiniyattam (Kerala), Sattriya (Assam) — 8 classical dances under Sangeet Natak Akademi." },
      { num: 2, title: "Folk Dances", desc: "Bhangra/Giddha (Punjab), Garba/Dandiya (Gujarat), Lavani (Maharashtra), Bihu (Assam), Chhau (Jharkhand/WB/Odisha), Rouf (J&K), Ghoomar (Rajasthan), Yakshagana (Karnataka)." },
      { num: 3, title: "Classical Music", desc: "Hindustani (North India) — ragas; Carnatic (South India); important instruments — Sitar, Tabla, Veena, Mridangam, Sarod, Santoor; Gharanas." },
      { num: 4, title: "Paintings", desc: "Madhubani (Bihar), Warli (Maharashtra), Pattachitra (Odisha), Kalamkari (Andhra Pradesh), Tanjore (Tamil Nadu), Miniature Paintings (Rajasthan/Mughal era), Phad (Rajasthan)." },
      { num: 5, title: "Architecture & Monuments", desc: "Rock-cut architecture (Ajanta, Ellora, Elephanta); Dravidian vs Nagara style temples; Mughal architecture (Taj Mahal, Red Fort, Qutub Minar); Colonial architecture; UNESCO World Heritage Sites in India (42 sites as of 2024)." },
      { num: 6, title: "Important Fairs & Festivals", desc: "Pushkar Fair (Rajasthan), Kumbh Mela (4 locations), Hornbill Festival (Nagaland), Onam (Kerala), Pongal (Tamil Nadu), Durga Puja (WB), Hemis Festival (Ladakh)." },
      { num: 7, title: "Languages & Literature", desc: "8th Schedule — 22 scheduled languages; Classical language status (Sanskrit, Tamil, Telugu, Kannada, Malayalam, Odia); Sahitya Akademi; important ancient texts — Vedas, Upanishads, Arthashastra, Mahabharata, Ramayana." },
      { num: 8, title: "Religions & Philosophies", desc: "Origin of Buddhism, Jainism, Sikhism in India; major pilgrimages; religious architecture; syncretic traditions." }
    ]
  }
];

const staticGKSyllabus = [
  {
    title: "5. CURRENT AFFAIRS & STATIC GK", icon: <Newspaper size={28} color="#f7f4f0" />,
    description: "Important national/international affairs, static general knowledge, and recent events.",
    chapters: [
      { num: 1, title: "National & International Affairs", desc: "Recent summits, bilateral agreements, India's foreign policy; important UN resolutions; major global events from last 6–9 months." },
      { num: 2, title: "Sports", desc: "Recent winners of major tournaments — Cricket (World Cup, IPL), Football (FIFA, ISL), Tennis (Grand Slams), Olympics, Commonwealth Games, Asian Games; Arjuna Award, Khel Ratna, Dronacharya Award winners." },
      { num: 3, title: "Awards & Honours", desc: "Bharat Ratna, Padma Vibhushan/Bhushan/Shri — recent awardees; Nobel Prize winners (latest year — all categories); Booker Prize, Pulitzer, Ramon Magsaysay; National Film Awards; Dadasaheb Phalke Award." },
      { num: 4, title: "Books & Authors", desc: "Recent important books and their authors; classic Indian literary works; biographies of important personalities." },
      { num: 5, title: "Important Appointments", desc: "Recent — President, Vice President, Chief Justice of India, RBI Governor, CEOs of major PSUs, UN Secretary General, heads of IMF/World Bank, service chiefs (Army, Navy, Air Force)." },
      { num: 6, title: "Government Schemes & Policies", desc: "Recently launched central government schemes — ministry, objective, launch year, beneficiaries; important policy changes." },
      { num: 7, title: "Static GK — India", desc: "First in India (first President, PM, woman IPS, woman pilot etc.); largest/smallest/highest in India; national symbols (animal, bird, flower, tree, river, emblem, sport); important dams, power plants, nuclear reactors; major passes (Banihal, Rohtang, Zoji La, Nathu La); India's neighbours and border details." },
      { num: 8, title: "Static GK — World", desc: "Largest/smallest countries by area & population; highest mountains, longest rivers, biggest deserts, largest oceans; important international borders; headquarters of major organisations (UN — New York, WHO — Geneva, NATO — Brussels, WTO — Geneva, IMF/World Bank — Washington D.C., INTERPOL — Lyon)." },
      { num: 9, title: "Science & Technology (Current)", desc: "Recent space missions — ISRO (Chandrayaan, Gaganyaan, Aditya-L1); defence technologies; AI & digital developments; important inventions & discoveries in news." },
      { num: 10, title: "Important Days & Events", desc: "National & International days with their themes — Republic Day (26 Jan), Independence Day (15 Aug), World Environment Day (5 June), World Health Day (7 April) etc.; important historical dates." }
    ]
  }
];

const englishSyllabus = [
  {
    title: "PART 1 — GRAMMAR", icon: <PushPin size={28} color="#f7f4f0" />,
    description: "Core grammar rules and applications for the exam.",
    chapters: [
      { num: 1, title: "Parts of Speech", desc: "Nouns (types — common, proper, abstract, collective); Pronouns (personal, reflexive, relative, interrogative); Adjectives (degrees of comparison); Verbs (transitive, intransitive, auxiliary, modal); Adverbs; Prepositions; Conjunctions; Interjections. Questions test correct usage in sentences." },
      { num: 2, title: "Tenses", desc: "Present (Simple, Continuous, Perfect, Perfect Continuous); Past (Simple, Continuous, Perfect, Perfect Continuous); Future (Simple, Continuous, Perfect). Key rules — when to use each tense, signal words (yesterday, since, for, already, just, yet, still, by the time)." },
      { num: 3, title: "Subject-Verb Agreement", desc: "Singular/plural subject matching with verb; special cases — collective nouns, indefinite pronouns (each, every, neither, either = singular), compound subjects joined by and/or/nor; \"Neither…nor / Either…or\" rules." },
      { num: 4, title: "Articles (A, An, The)", desc: "Rules for definite (The) vs indefinite (A/An) articles; zero article usage; exceptions — names of countries, rivers, mountain ranges, newspapers, musical instruments; \"A historic\" vs \"An historic\" type confusions." },
      { num: 5, title: "Prepositions", desc: "Common prepositions — in/on/at (time & place); between/among; since/for; by/until; beside/besides; into/in to; Common errors with verb-preposition pairs (agree with, afraid of, depend on, differ from, consist of etc.)." },
      { num: 6, title: "Active & Passive Voice", desc: "Rules for converting Active to Passive and vice versa across all tenses; passive voice of modals (can, could, should, must, may, might); passive with verbs having two objects; impersonal passive." },
      { num: 7, title: "Direct & Indirect Speech (Narration)", desc: "Rules of changing tense in reported speech; changes in pronouns, time/place expressions (now→then, here→there, today→that day, tomorrow→the next day); reporting commands, questions, exclamations, requests; assertive vs interrogative sentences in indirect speech." },
      { num: 8, title: "Spotting Errors", desc: "Identifying grammatical errors in a sentence (underlined parts or the whole sentence); errors in subject-verb agreement, tense usage, articles, prepositions, pronouns, comparison, word order, conjunctions. 3–4 questions expected in Tier 1; more in Tier 2." },
      { num: 9, title: "Sentence Improvement / Correction", desc: "A sentence is given with an underlined portion; choose the grammatically correct alternative. Tests all grammar rules together. Requires understanding of correct sentence structure." },
      { num: 10, title: "Fill in the Blanks", desc: "Single or double blanks to be filled with correct word/phrase; tests grammar (correct tense/article/preposition) as well as vocabulary (correct word meaning). 2–3 questions expected." },
      { num: 11, title: "Sentence Rearrangement (Para Jumbles)", desc: "4–6 sentences given in jumbled order; arrange to form a meaningful paragraph. Key: find the opening sentence (introduces topic), linking sentences (connectors — however, therefore, moreover), and concluding sentence." },
      { num: 12, title: "Shuffling of Sentence Parts", desc: "A sentence is broken into 4 parts (P, Q, R, S) placed between two fixed parts (1 and 6); arrange P, Q, R, S to form a correct sentence. Tests understanding of sentence construction and word order." }
    ]
  },
  {
    title: "PART 2 — VOCABULARY", icon: <PushPin size={28} color="#f7f4f0" />,
    description: "Vocabulary building, synonyms, antonyms, and common word usages.",
    chapters: [
      { num: 13, title: "Synonyms", desc: "Word given → choose the word closest in meaning. 2–3 questions in Tier 1. Level: moderate to difficult. Common tested words — Aberration, Benevolent, Candid, Dearth, Eloquent, Fervent, Gregarious, Harbinger, Imbibe, Jubilant, Kindle, Lament, Meticulous, Notorious, Ominous, Placid, Quaint, Resilient, Serene, Tenacious, Ubiquitous, Vivacious, Wary, Zealous." },
      { num: 14, title: "Antonyms", desc: "Word given → choose the word opposite in meaning. 2–3 questions in Tier 1. Common tested words — Amiable↔Hostile, Benign↔Malignant, Conceal↔Reveal, Diligent↔Lazy, Ephemeral↔Permanent, Frugal↔Extravagant, Genuine↔Spurious, Humble↔Arrogant, Inert↔Active, Jovial↔Gloomy." },
      { num: 15, title: "Spelling Correction", desc: "A set of words is given; identify the correctly/incorrectly spelled word. Common errors — Accommodate, Acquaintance, Conscientious, Exaggerate, Embarrass, Harass, Millennium, Necessary, Occurrence, Perseverance, Receive, Recommend, Separate, Supersede, Withhold. 1–2 questions expected." },
      { num: 16, title: "Idioms & Phrases", desc: "An idiom/phrase is given → choose its correct meaning; or a sentence uses an idiom and you identify it. Common idioms — \"Bite the bullet\" (endure pain), \"Hit the nail on the head\" (exactly correct), \"Beat around the bush\" (avoid the main topic), \"Burn the midnight oil\" (work late), \"Costs an arm and a leg\" (very expensive), \"Pull someone's leg\" (joke), \"Let the cat out of the bag\" (reveal a secret), \"Once in a blue moon\" (rarely). 1–2 questions guaranteed in each exam." },
      { num: 17, title: "One Word Substitution", desc: "A long phrase/definition is given → choose the single word that best replaces it. Common examples: Omnivore (eats both plants and animals), Omniscient (knows everything), Omnipotent (all-powerful), Misanthrope (hates mankind), Philanderer (flirts with women), Insolvent (cannot pay debts), Plagiarism (copying others' work), Nostalgia (longing for the past), Loquacious (very talkative), Eloquent (speaks fluently and effectively), Incognito (hiding identity), Posthumous (after death), Ephemeral (lasting for a very short time). 1–2 questions expected." }
    ]
  },
  {
    title: "PART 3 — COMPREHENSION & READING SKILLS", icon: <PushPin size={28} color="#f7f4f0" />,
    description: "Reading comprehension, cloze tests, and passage completion.",
    chapters: [
      { num: 18, title: "Reading Comprehension (RC)", desc: "A passage of 150–300 words (Tier 1) or 300–500 words (Tier 2) is given; 4–5 questions follow. Questions test: direct information from passage, inference, vocabulary in context (meaning of a word as used in passage), main idea/title of passage, author's tone/attitude. RC alone accounts for 12–15 questions in Tier 2. Tip: read questions first, then locate answers in the passage." },
      { num: 19, title: "Cloze Test", desc: "A passage of 150–200 words with 5–10 blanks; each blank has 4 options. Tests both grammar and vocabulary in context. Strategy: read the full passage first to understand the theme, then fill blanks based on flow/meaning/grammar. 5–10 questions asked in a single set." },
      { num: 20, title: "Passage Completion / Para Completion", desc: "A paragraph is given with the last sentence missing; choose the most appropriate concluding sentence from the options. Tests logical flow and understanding of the passage's main idea." }
    ]
  }
];

const mathsSyllabus = [
  {
    title: "PART 1 — ARITHMETIC", icon: <Calculator size={28} color="#f7f4f0" />,
    description: "Basic Maths — expect 15–18 questions from this section in Tier 1.",
    chapters: [
      { num: 1, title: "Number System", desc: "Whole numbers, integers, fractions, decimals; LCM & HCF (formulae, word problems); divisibility rules (2, 3, 4, 5, 6, 8, 9, 11); prime & composite numbers; unit digit problems; number patterns; rational & irrational numbers; surds & indices." },
      { num: 2, title: "Simplification & Approximation", desc: "BODMAS rule; simplification of complex expressions involving fractions, decimals, and exponents; approximation to nearest whole number; percentage-based approximation tricks." },
      { num: 3, title: "Percentage", desc: "Percentage formula; percentage increase/decrease; successive percentage change; percentage to fraction conversions; population & depreciation problems; percentage error." },
      { num: 4, title: "Ratio & Proportion", desc: "Simple ratio, compound ratio, duplicate/triplicate ratio; direct & inverse proportion; fourth proportional, mean proportional, third proportional; problems on partnership; comparison of ratios." },
      { num: 5, title: "Average", desc: "Average = Sum/Count; weighted average; problems on age average; average speed; when one element is added/removed; moving average problems." },
      { num: 6, title: "Simple Interest (SI) & Compound Interest (CI)", desc: "SI = PRT/100; CI formula; difference between CI & SI for 2 & 3 years; half-yearly/quarterly compounding; effective rate of interest; population growth." },
      { num: 7, title: "Profit, Loss & Discount", desc: "Profit% and Loss%; successive discount formula; single equivalent discount; marked price, selling price, cost price relationships; false weight problems." },
      { num: 8, title: "Time, Work & Wages", desc: "Work done = Efficiency × Time; combined efficiency; work & wages; pipes & cisterns (filling + emptying pipes); negative work concept." },
      { num: 9, title: "Time, Speed & Distance", desc: "Speed = Distance/Time; relative speed; average speed; train problems; boat & stream; circular track problems." },
      { num: 10, title: "Mixtures & Alligation", desc: "Alligation rule; mixing two solutions of different concentrations; replacement problems; mean price concept." },
      { num: 11, title: "Square Root & Cube Root", desc: "Perfect squares and perfect cubes; finding square root by prime factorisation & long division; cube root of numbers; simplification using roots." },
      { num: 12, title: "Age Problems", desc: "Present/past/future age; ratio-based age problems; sum/difference of ages; typical SSC-pattern age questions." }
    ]
  },
  {
    title: "PART 2 — ADVANCED MATHS", icon: <Sigma size={28} color="#f7f4f0" />,
    description: "Expect 7–10 questions from advanced maths in Tier 1, and more in Tier 2.",
    chapters: [
      { num: 13, title: "Algebra", desc: "Key identities; factorisation of polynomials; linear equations in one & two variables; quadratic equations; value substitution problems." },
      { num: 14, title: "Geometry", desc: "Lines & Angles; Triangles (properties, congruence, similarity, centres); Quadrilaterals (properties); Circles (tangent properties, chord properties)." },
      { num: 15, title: "Mensuration", desc: "2D Figures (Rectangle, Square, Triangle, Circle, Trapezium, Rhombus); 3D Figures (Cube, Cuboid, Cylinder, Cone, Sphere, Hemisphere)." },
      { num: 16, title: "Trigonometry", desc: "Basic ratios; standard values; key identities; complementary angles; heights & distances." },
      { num: 17, title: "Statistics & Data Interpretation", desc: "Statistics (Mean, Median, Mode, Range); Data Interpretation (Bar graphs, Line graphs, Pie charts, Tables, Mixed graphs)." },
      { num: 18, title: "Probability", desc: "Basic probability; complementary events; mutually exclusive events; addition rule; independent events; problems on coins, dice, cards, balls." },
      { num: 19, title: "Permutation & Combination", desc: "Fundamental counting principle; factorial notation; arrangement vs selection problems; circular permutation." }
    ]
  }
];

const reasoningSyllabus = [
  {
    title: "PART 1 — VERBAL REASONING", icon: <Brain size={28} color="#f7f4f0" />,
    description: "Logical thinking and daily practice.",
    chapters: [
      { num: 1, title: "Analogy", desc: "A relationship is established between two words/numbers/letters → find the same relationship in a new pair. Semantic, Number, and Letter Analogy." },
      { num: 2, title: "Classification (Odd One Out)", desc: "Four items are given; identify the one that does NOT belong to the group. Semantic, Number, and Letter Classification." },
      { num: 3, title: "Series", desc: "Find the missing or next term in a sequence. Number Series, Letter Series, Alpha-Numeric Series." },
      { num: 4, title: "Coding-Decoding", desc: "A word is coded in a certain way → decode/encode another word. Letter Shifting, Reverse Alphabet Coding, Number Coding, Symbol Coding." },
      { num: 5, title: "Blood Relations", desc: "Determine family relationships based on given information. Single-person introduction, coded blood relations, pointing/generation puzzle." },
      { num: 6, title: "Direction Sense Test", desc: "A person moves in various directions → find the final position, distance, or direction from start." },
      { num: 7, title: "Order & Ranking", desc: "Determine the position/rank of a person in a row or group." },
      { num: 8, title: "Mathematical Operations", desc: "Standard mathematical symbols are replaced by other symbols or words → solve the expression." },
      { num: 9, title: "Syllogism", desc: "Two or more statements are given → determine which conclusions logically follow." },
      { num: 10, title: "Venn Diagrams", desc: "Relationship Diagram and Data-based Venn Diagram." },
      { num: 11, title: "Statement & Conclusions / Assumptions / Arguments", desc: "A statement is given → judge which conclusion/assumption/argument logically follows." },
      { num: 12, title: "Word Building & Arrangements", desc: "Word Formation, Meaningful Word from Jumbled Letters, Alphabetical Order, Logical Order." },
      { num: 13, title: "Number Puzzles & Arithmetic Reasoning", desc: "Missing number in a table, matrix, or triangle; simple arithmetic word puzzles." },
      { num: 14, title: "Alphabet Test", desc: "Position of Letters, Letter Gap, Reverse Alphabet." },
      { num: 15, title: "Missing Number / Matrix", desc: "Grid given with one cell missing → find the pattern and fill the blank." }
    ]
  },
  {
    title: "PART 2 — NON-VERBAL REASONING", icon: <Brain size={28} color="#f7f4f0" />,
    description: "Image/figure-based and require strong spatial ability.",
    chapters: [
      { num: 16, title: "Mirror Images", desc: "A figure or letter/number is shown → identify its correct mirror image (left-right flip)." },
      { num: 17, title: "Water Images", desc: "A figure is reflected in water → top and bottom are interchanged." },
      { num: 18, title: "Paper Folding & Cutting", desc: "A square paper is folded and punched → when unfolded, where will holes appear?" },
      { num: 19, title: "Embedded Figures", desc: "Identify which larger figure contains the small hidden figure." },
      { num: 20, title: "Figure Completion / Pattern Completion", desc: "Identify the missing figure that follows the pattern in a matrix." },
      { num: 21, title: "Figural Series", desc: "Identify the next figure in the series based on the pattern of change." },
      { num: 22, title: "Counting of Figures", desc: "Count the number of triangles, squares, rectangles, or other shapes." },
      { num: 23, title: "Cube & Dice", desc: "When a flat net is folded into a cube, or dice from different angles." },
      { num: 24, title: "Dot Situation / Figure Classification", desc: "Identify option with same dot placement pattern, or classify figures by visual property." }
    ]
  }
];

export default function SyllabusPage() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('syllabus_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('syllabus_progress', JSON.stringify(progress));
  }, [progress]);

  const toggleProgress = (topic: string, chNum: number, label: string) => {
    const key = `${topic}_ch_${chNum}_${label}`;
    setProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const subjects = ['GS', 'Maths', 'English', 'Reasoning'];
  const gsTopics = ['History', 'Geography', 'Polity', 'Economy', 'Art and culture', 'Static GK'];

  const renderSyllabus = (title: string, syllabusData: any[]) => {
    return (
      <div style={{ padding: '2rem', paddingBottom: '100px', color: '#e0e0e0', height: '100%', overflowY: 'auto' }}>
        <style>{`
          .ch-tooltip {
            position: relative;
            display: inline-flex;
            cursor: help;
          }
          .ch-tooltip:hover {
            z-index: 10;
          }
          .ch-tooltip .ch-tooltip-text {
            visibility: hidden;
            width: 320px;
            background-color: #1a1a1a;
            color: #e0e0e0;
            text-align: left;
            border-radius: 8px;
            padding: 12px 16px;
            position: absolute;
            z-index: 100;
            top: 130%;
            left: 0;
            opacity: 0;
            transition: opacity 0.2s, visibility 0.2s;
            font-size: 0.85rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.8);
            border: 1px solid rgba(255,255,255,0.1);
            line-height: 1.5;
          }
          .ch-tooltip:hover .ch-tooltip-text {
            visibility: visible;
            opacity: 1;
          }
          .ch-tooltip .ch-tooltip-text::after {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 10px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #1a1a1a transparent;
          }
          .custom-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            background-color: transparent;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }
          .custom-checkbox:checked {
            background-color: #4CAF50;
            border-color: #4CAF50;
          }
          .custom-checkbox:checked::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 1px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTopic(null)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#e0e0e0', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>{title} Syllabus</h1>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {syllabusData.map((part, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginTop: 0, color: '#f7f4f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {part.icon} {part.title}
              </h2>
              <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{part.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {part.chapters.map((ch: any, j: number) => (
                  <div key={j} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderBottom: j < part.chapters.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    gap: '2rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                      <div className="ch-tooltip">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <div className="ch-tooltip-text">
                          <strong style={{ display: 'block', marginBottom: '6px', color: '#fff' }}>Chapter {ch.num}</strong>
                          {ch.desc}
                        </div>
                      </div>
                      <span style={{ fontSize: '1.05rem', color: '#e0e0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ch.title}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {['Studied', '1st revision', '2nd revision', '100+ Question Practiced'].map(lbl => (
                        <label key={lbl} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          fontSize: '0.85rem', 
                          color: '#aaa', 
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={progress[`${title}_ch_${ch.num}_${lbl}`] || false}
                            onChange={() => toggleProgress(title, ch.num, lbl)}
                          />
                          {lbl}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (activeTopic === 'History') return renderSyllabus('History', historySyllabus);
  if (activeTopic === 'Geography') return renderSyllabus('Geography', geographySyllabus);
  if (activeTopic === 'Polity') return renderSyllabus('Polity', politySyllabus);
  if (activeTopic === 'Economy') return renderSyllabus('Economy', economySyllabus);
  if (activeTopic === 'Art and culture') return renderSyllabus('Art and Culture', artAndCultureSyllabus);
  if (activeTopic === 'Static GK') return renderSyllabus('Static GK', staticGKSyllabus);
  if (activeTopic === 'English') return renderSyllabus('English', englishSyllabus);
  if (activeTopic === 'Maths') return renderSyllabus('Maths', mathsSyllabus);
  if (activeTopic === 'Reasoning') return renderSyllabus('Reasoning', reasoningSyllabus);

  if (activeSubject === 'GS') {
    return (
      <div style={{ padding: '2rem', color: '#e0e0e0', height: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <button 
            onClick={() => setActiveSubject(null)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#e0e0e0', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>GS</h1>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {gsTopics.map(topic => (
            <div 
              key={topic} 
              onClick={() => setActiveTopic(topic)}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s, background 0.2s',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: '500'
              }}
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
    );
  }

  let studiedCount = 0;
  let rev1Count = 0;
  let rev2Count = 0;
  let q100Count = 0;

  Object.entries(progress).forEach(([key, val]) => {
    if (val) {
      if (key.endsWith('_Studied')) studiedCount++;
      else if (key.endsWith('_1st revision')) rev1Count++;
      else if (key.endsWith('_2nd revision')) rev2Count++;
      else if (key.endsWith('_100+ Question Practiced')) q100Count++;
    }
  });

  const totalChapters = [historySyllabus, geographySyllabus, politySyllabus, economySyllabus, artAndCultureSyllabus, staticGKSyllabus, englishSyllabus, mathsSyllabus, reasoningSyllabus].reduce((acc, syllabus) => 
    acc + syllabus.reduce((acc2, part) => acc2 + (part.chapters?.length || 0), 0)
  , 0);

  const overallCompletionPercentage = totalChapters > 0 ? Math.round(((studiedCount + rev1Count + rev2Count + q100Count) / (totalChapters * 4)) * 100) : 0;

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0', height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>Syllabus Dashboard</h1>
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f7f4f0' }}>Subjects</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {subjects.map(subject => (
          <div 
            key={subject} 
            onClick={() => {
              if (subject === 'GS') setActiveSubject('GS');
              else setActiveTopic(subject);
            }}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s, background 0.2s',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}
          >
            {subject}
          </div>
        ))}
      </div>

      {/* Stats Dashboard */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#aaa', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Progress</h2>
          <div style={{ fontSize: '1.5rem', color: '#4CAF50', fontWeight: 'bold' }}>{overallCompletionPercentage}%</div>
        </div>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ width: `${overallCompletionPercentage}%`, height: '100%', backgroundColor: '#4CAF50', transition: 'width 0.5s ease' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Syllabus Covered', count: studiedCount, total: totalChapters, color: '#3b82f6' },
            { label: '1st Revision', count: rev1Count, total: totalChapters, color: '#8b5cf6' },
            { label: '2nd Revision', count: rev2Count, total: totalChapters, color: '#ec4899' },
            { label: '100+ Qs Practiced', count: q100Count, total: totalChapters, color: '#f59e0b' }
          ].map(stat => {
            const pct = stat.total > 0 ? Math.round((stat.count / stat.total) * 100) : 0;
            return (
            <div key={stat.label} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderTop: `3px solid ${stat.color}`,
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.2rem' }}>
                  {stat.count}<span style={{ fontSize: '1rem', color: '#aaa', fontWeight: 'normal' }}> / {stat.total}</span>
                </div>
                <div style={{ color: stat.color, fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>{pct}%</div>
              </div>
              <div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: stat.color, transition: 'width 0.5s ease' }}></div>
                </div>
                <div style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
