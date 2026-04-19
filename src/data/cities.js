// Colorado cities data with wellness, recovery, outdoor recreation, and safety scores
// Scores are COMPUTED from raw metrics defined in metrics.js
// See metrics.js for formulas, data sources, and raw numbers

import { computeScores, rawMetrics } from "./metrics";

const citiesRaw = [
  {
    id: 1,
    name: "Boulder",
    region: "Front Range",
    population: "105,000",
    elevation: "5,430 ft",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop"],
    summary: "A wellness mecca with world-class outdoor access, vibrant health-conscious community, and strong recovery support network.",
    costOfLiving: "Very High",
    medianRent: "$2,100",
    medianHome: "$850,000",
    vibe: "Health-conscious, educated, active, progressive",
  },
  {
    id: 2,
    name: "Colorado Springs",
    region: "Front Range",
    population: "488,000",
    elevation: "6,035 ft",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1456318019777-ccdc4d5b2396?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=600&h=400&fit=crop"],
    summary: "Affordable outdoor paradise with a growing wellness scene, strong military/veteran recovery community, and Garden of the Gods at your doorstep.",
    costOfLiving: "Moderate",
    medianRent: "$1,500",
    medianHome: "$450,000",
    vibe: "Military-friendly, outdoorsy, growing, family-oriented",
  },
  {
    id: 3,
    name: "Fort Collins",
    region: "Northern Front Range",
    population: "170,000",
    elevation: "5,003 ft",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop"],
    summary: "College-town energy with excellent bike culture, growing wellness community, and easy access to Rocky Mountain National Park.",
    costOfLiving: "High",
    medianRent: "$1,700",
    medianHome: "$550,000",
    vibe: "Bike-friendly, college-town, craft culture, community-oriented",
  },
  {
    id: 4,
    name: "Denver: Capitol Hill",
    region: "Denver Metro",
    population: "~30,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&fit=crop"],
    summary: "Denver's recovery hub. Highest concentration of AA/NA meetings, most walkable neighborhood (Walk Score 94), and dense wellness infrastructure. Crime is a trade-off.",
    costOfLiving: "High",
    medianRent: "$1,643",
    medianHome: "$475,000",
    vibe: "Young, eclectic, LGBTQ-friendly, walkable, nightlife-heavy",
  },
  {
    id: 9,
    name: "Denver: Highland/LoHi",
    region: "Denver Metro",
    population: "~20,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop"],
    summary: "Upscale-casual neighborhood with strong health food scene, boutique fitness, and Platte River trail access. Safer feel than most Denver neighborhoods.",
    costOfLiving: "High",
    medianRent: "$1,961",
    medianHome: "$650,000",
    vibe: "Upscale-casual, young professionals, brunch culture, walkable",
  },
  {
    id: 10,
    name: "Denver: Wash Park",
    region: "Denver Metro",
    population: "~15,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop"],
    summary: "Denver's safest and most outdoor-focused neighborhood. A 165-acre park as your backyard, South Pearl Street health food scene, and strong community feel.",
    costOfLiving: "Very High",
    medianRent: "$2,115",
    medianHome: "$750,000",
    vibe: "Active, established, community-oriented, outdoor-focused",
  },
  {
    id: 11,
    name: "Denver: RiNo",
    region: "Denver Metro",
    population: "~10,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1554072675-66db59dba46f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop"],
    summary: "Denver's arts district with murals, creative energy, and river trail access. Growing wellness scene but breweries still outnumber gyms. Gentrifying rapidly.",
    costOfLiving: "High",
    medianRent: "$2,076",
    medianHome: "$550,000",
    vibe: "Artsy, creative, murals, breweries, gentrifying rapidly",
  },
  {
    id: 12,
    name: "Denver: Baker/SoBo",
    region: "Denver Metro",
    population: "~12,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop"],
    summary: "Artsy South Broadway corridor with growing wellness options, good transit, and Platte River trail access. Grittier charm with vintage shops and diverse dining.",
    costOfLiving: "High",
    medianRent: "$1,989",
    medianHome: "$525,000",
    vibe: "Artsy, eclectic, dive bars meets new restaurants, vintage",
  },
  {
    id: 13,
    name: "Denver: Downtown",
    region: "Denver Metro",
    population: "~25,000",
    elevation: "5,280 ft",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"],
    summary: "Urban core with best transit access (Union Station), corporate wellness options, and proximity to everything. Highest crime and most impersonal feel.",
    costOfLiving: "Very High",
    medianRent: "$2,100",
    medianHome: "$500,000",
    vibe: "Urban core, corporate, tourists, nightlife, impersonal",
  },
  {
    id: 5,
    name: "Durango",
    region: "Southwest",
    population: "19,000",
    elevation: "6,512 ft",
    image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop"],
    summary: "Small mountain town with a tight-knit wellness community, incredible outdoor recreation, and a surprisingly strong recovery network for its size.",
    costOfLiving: "Moderate-High",
    medianRent: "$1,600",
    medianHome: "$625,000",
    vibe: "Mountain town, adventurous, close-knit, laid-back",
  },
  {
    id: 6,
    name: "Steamboat Springs",
    region: "Northwest",
    population: "13,000",
    elevation: "6,732 ft",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop"],
    summary: "Ski-town charm with natural hot springs, outdoor lifestyle year-round, and a small but growing wellness scene.",
    costOfLiving: "High",
    medianRent: "$1,900",
    medianHome: "$750,000",
    vibe: "Ski-town, ranching heritage, relaxed, outdoor-focused",
  },
  {
    id: 7,
    name: "Salida",
    region: "Central Mountains",
    population: "6,000",
    elevation: "7,083 ft",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=400&fit=crop"],
    summary: "Artsy mountain town with hot springs, incredible Arkansas River access, and a growing wellness community that punches above its weight.",
    costOfLiving: "Moderate",
    medianRent: "$1,400",
    medianHome: "$500,000",
    vibe: "Artsy, river-town, creative, small but mighty",
  },
  {
    id: 8,
    name: "Carbondale",
    region: "Roaring Fork Valley",
    population: "7,500",
    elevation: "6,181 ft",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop"],
    summary: "The wellness heart of the Roaring Fork Valley. Strong yoga, meditation, and health food culture with Aspen-level outdoor access at lower cost.",
    costOfLiving: "High",
    medianRent: "$1,800",
    medianHome: "$700,000",
    vibe: "Wellness-focused, artsy, community-driven, Aspen alternative",
  },
  {
    id: 14,
    name: "Westminster, MD",
    region: "Maryland",
    population: "20,000",
    elevation: "804 ft",
    image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1461695008884-244cb4543d74?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&h=400&fit=crop"],
    summary: "Small-town county seat with a walkable historic downtown, solid recovery infrastructure for its size, and access to Carroll County trails. A baseline comparison from the East Coast.",
    costOfLiving: "Moderate-High",
    medianRent: "$1,500",
    medianHome: "$435,000",
    vibe: "Small-town, historic downtown, conservative-leaning, community-oriented",
  },
  {
    id: 15,
    name: "Boise",
    region: "Idaho",
    population: "235,000",
    elevation: "2,730 ft",
    image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop"],
    summary: "Fast-growing high-desert city blending outdoor culture with a rising tech/startup scene. Affordable by western standards with Bogus Basin skiing 30 minutes away.",
    costOfLiving: "Moderate",
    medianRent: "$1,670",
    medianHome: "$474,000",
    vibe: "Outdoor-focused, tech-growing, family-friendly, high-desert",
  },
  {
    id: 16,
    name: "Asheville",
    region: "North Carolina",
    population: "95,000",
    elevation: "2,134 ft",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&h=400&fit=crop"],
    summary: "Creative mountain town with deep arts, food, and wellness culture in the Blue Ridge. One of the strongest recovery communities among small US cities.",
    costOfLiving: "Moderate",
    medianRent: "$1,682",
    medianHome: "$478,000",
    vibe: "Creative, wellness-rooted, arts-driven, Blue Ridge mountain culture",
  },
  {
    id: 17,
    name: "Bend",
    region: "Oregon",
    population: "102,000",
    elevation: "3,625 ft",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&h=400&fit=crop"],
    summary: "Outdoor-obsessed resort town east of the Cascades with world-class skiing, craft breweries, 225+ trails, and the #4 remote work city in the US.",
    costOfLiving: "High",
    medianRent: "$1,920",
    medianHome: "$679,000",
    vibe: "Outdoor-obsessed, craft beer, remote-work hub, Cascade mountain life",
  },
  {
    id: 18,
    name: "Sedona",
    region: "Arizona",
    population: "9,800",
    elevation: "4,350 ft",
    image: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1502786129293-79981df4e689?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop"],
    summary: "Spiritual wellness mecca among red rock formations. Highest remote work rate (35%), exceptional meditation/yoga scene, and 278 sunshine days. Small but intentional community.",
    costOfLiving: "High",
    medianRent: "$1,700",
    medianHome: "$932,000",
    vibe: "Spiritual, red-rock beauty, wellness destination, remote-work friendly",
  },
  {
    id: 19,
    name: "Santa Fe",
    region: "New Mexico",
    population: "92,000",
    elevation: "6,998 ft",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop"],
    summary: "Culturally rich state capital with 400+ years of heritage, thriving arts, 300 sunshine days, and exceptional air quality. Strongest integrative health scene outside Boulder.",
    costOfLiving: "Moderate-High",
    medianRent: "$1,650",
    medianHome: "$635,000",
    vibe: "Cultural arts capital, spiritual, historic, 400-year heritage blend",
  },
  {
    id: 20,
    name: "Baltimore: Canton",
    region: "Baltimore",
    population: "~2,000",
    elevation: "30 ft",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=600&h=400&fit=crop"],
    summary: "Waterfront neighborhood popular with young professionals. Walkable rowhomes, O'Donnell Square dining, Canton Waterfront Park, and Johns Hopkins Hospital minutes away.",
    costOfLiving: "Moderate",
    medianRent: "$1,900",
    medianHome: "$371,000",
    vibe: "Young professional, waterfront, walkable rowhomes, community-oriented",
  },
  {
    id: 21,
    name: "Baltimore: Fells Point",
    region: "Baltimore",
    population: "~4,200",
    elevation: "30 ft",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop"],
    summary: "Historic waterfront district with cobblestone streets, vibrant nightlife, year-round farmer's market, Walk Score 96, and Johns Hopkins essentially next door.",
    costOfLiving: "Moderate",
    medianRent: "$2,195",
    medianHome: "$310,000",
    vibe: "Historic waterfront, cobblestone charm, nightlife, maritime heritage",
  },
  {
    id: 22,
    name: "DC: Dupont / Adams Morgan",
    region: "Washington DC",
    population: "~27,000",
    elevation: "220 ft",
    image: "https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop"],
    summary: "Cosmopolitan hub with Walk Score 98, FRESHFARM year-round market, Dupont Circle Club recovery hub, 57% remote work rate, and the highest density of therapists in the region.",
    costOfLiving: "Very High",
    medianRent: "$2,500",
    medianHome: "$520,000",
    vibe: "Cosmopolitan, LGBTQ+-friendly, embassy row, walkable nightlife",
  },
  {
    id: 23,
    name: "DC: Georgetown",
    region: "Washington DC",
    population: "~10,000",
    elevation: "100 ft",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=600&h=400&fit=crop"],
    summary: "Historic affluent village with cobblestone streets, C&O Canal towpath, Potomac waterfront, Georgetown University energy, and the best outdoor trail access in DC.",
    costOfLiving: "Very High",
    medianRent: "$2,650",
    medianHome: "$1,700,000",
    vibe: "Historic, affluent, cobblestone, waterfront, university energy",
  },
  {
    id: 24,
    name: "DC: Columbia Hts / Petworth",
    region: "Washington DC",
    population: "~43,000",
    elevation: "300 ft",
    image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=600&h=400&fit=crop"],
    summary: "DC's most affordable diverse neighborhoods with Walk Score 96, year-round farmer's market, Ethiopian/Latin food scene, Rock Creek Park access, and rowhouse charm.",
    costOfLiving: "High",
    medianRent: "$1,950",
    medianHome: "$670,000",
    vibe: "Diverse, Ethiopian/Latin food, rowhouse charm, up-and-coming",
  },
  {
    id: 25,
    name: "Tampa: Hyde Park/SoHo",
    region: "Tampa",
    population: "~11,600",
    elevation: "20 ft",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1456318019777-ccdc4d5b2396?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600&h=400&fit=crop"],
    summary: "Upscale tree-lined historic district with Bayshore Blvd running path, Hyde Park Village boutique shopping, and dense SoHo restaurant/nightlife strip. Perfect for affluent career-focused singles who want walkable luxury.",
    costOfLiving: "High",
    medianRent: "$2,272",
    medianHome: "$625,000",
    vibe: "Upscale, walkable, Bayshore runs, boutique shopping, young professional",
  },
  {
    id: 26,
    name: "Tampa: Channelside",
    region: "Tampa",
    population: "~4,900",
    elevation: "15 ft",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop"],
    summary: "Sleek modern high-rise waterfront living with Water Street's wellness-focused developments (Life Time Athletic, cold-plunge spas), Riverwalk access, and Amalie Arena right there. Tampa's most built-for-wellness neighborhood.",
    costOfLiving: "High",
    medianRent: "$2,348",
    medianHome: "$625,000",
    vibe: "Modern high-rise, waterfront wellness, Amalie Arena walkable, no-car living",
  },
  {
    id: 27,
    name: "Tampa: Downtown",
    region: "Tampa",
    population: "~3,510",
    elevation: "15 ft",
    image: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop"],
    summary: "Urban high-rise living with direct Riverwalk access, walk-to-work convenience for career-focused singles, and Tampa Downtown Partnership's free weekly fitness programming at Curtis Hixon Park.",
    costOfLiving: "High",
    medianRent: "$2,178",
    medianHome: "$550,000",
    vibe: "Walk-to-work, Riverwalk central, high-rise urban, career-focused",
  },
  {
    id: 28,
    name: "Tampa: Seminole Heights",
    region: "Tampa",
    population: "~16,855",
    elevation: "30 ft",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"],
    summary: "Eclectic historic bungalow district with indie breweries, craft coffee, bike culture, and Run The Heights running club. Ideal for authentic young professionals who want community over luxury at a lower price.",
    costOfLiving: "Moderate",
    medianRent: "$1,620",
    medianHome: "$400,000",
    vibe: "Craft beer, bike culture, indie eclectic, authentic young professional",
  },
  {
    id: 29,
    name: "Austin: Zilker/Barton Hills",
    region: "Austin",
    population: "~11,400",
    elevation: "530 ft",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&h=400&fit=crop"],
    summary: "Outdoor paradise with Barton Creek Greenbelt, Zilker Park (ACL Festival), Barton Springs, and 10-mile Butler Hike-and-Bike Trail. Peak pick for fit young pros who treat the Greenbelt as their gym.",
    costOfLiving: "Very High",
    medianRent: "$1,972",
    medianHome: "$975,000",
    vibe: "Outdoor-obsessed, greenbelt living, Barton Springs social, peak fit young pro",
  },
  {
    id: 30,
    name: "Austin: East Austin",
    region: "Austin",
    population: "~25,000",
    elevation: "475 ft",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1502786129293-79981df4e689?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"],
    summary: "Austin's creative energy capital. Walkable hipster hub with the best food/nightlife scene, loaded with fitness studios and craft coffee. Highest remote work rate in the city.",
    costOfLiving: "High",
    medianRent: "$1,800",
    medianHome: "$645,000",
    vibe: "Creative, walkable, best nightlife, craft coffee, young pro energy capital",
  },
  {
    id: 31,
    name: "Austin: South Congress",
    region: "Austin",
    population: "~15,000",
    elevation: "480 ft",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop"],
    summary: "Iconic Austin main street with 82 Walk Score, direct Lady Bird Lake and Town Lake Trail access, boutique fitness hub, and the highest density of young singles in the city (median age 34).",
    costOfLiving: "Very High",
    medianRent: "$1,950",
    medianHome: "$840,800",
    vibe: "Iconic walkable, SoCo shopping, Town Lake runs, highest young single density",
  },
  {
    id: 32,
    name: "Austin: Mueller",
    region: "Austin",
    population: "~7,900",
    elevation: "625 ft",
    image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop"],
    summary: "Master-planned walkable community with 140 acres of parks, 12 miles of trails, H-E-B and Orangetheory on-site, and one of Austin's biggest farmers markets. Built for active lifestyles.",
    costOfLiving: "High",
    medianRent: "$2,100",
    medianHome: "$900,000",
    vibe: "Master-planned, built-for-active-life, 12 miles of trails, Orangetheory walkable",
  },
  {
    id: 33,
    name: "Alexandria, VA",
    region: "DC Metro",
    population: "160,000",
    elevation: "39 ft",
    image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop"],
    summary: "Historic-meets-modern waterfront city with walkable Old Town charm, Mount Vernon Trail running, Metro access to DC, and a strong 30-something professional scene.",
    costOfLiving: "Very High",
    medianRent: "$2,500",
    medianHome: "$590,000",
    vibe: "Historic waterfront, Old Town charm, Metro-accessible, professional singles",
  },
  {
    id: 34,
    name: "Arlington, VA",
    region: "DC Metro",
    population: "240,000",
    elevation: "200 ft",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1554072675-66db59dba46f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&h=400&fit=crop"],
    summary: "Dense urban career-driven playground for young professionals. Metro-connected, highest-income county in the US, non-stop rooftop/fitness culture with 80+ gyms and 25 intramural leagues.",
    costOfLiving: "Very High",
    medianRent: "$2,790",
    medianHome: "$698,000",
    vibe: "Dense urban, career-driven, Metro-connected, rooftop bars, fitness obsessed",
  },
  {
    id: 35,
    name: "Frederick, MD",
    region: "Maryland",
    population: "88,000",
    elevation: "302 ft",
    image: "https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop"],
    summary: "Historic downtown with craft breweries, trailheads at your doorstep, and growing young-professional scene. MARC rail to DC, Catoctin Mountain access, and 4 ski resorts within 2 hours.",
    costOfLiving: "Moderate-High",
    medianRent: "$1,928",
    medianHome: "$435,000",
    vibe: "Craft brewery scene, historic downtown, trailheads at your door, MARC to DC",
  },
  { id: 36, name: "Nashville: The Gulch", region: "Nashville", population: "~712,000", elevation: "597 ft", image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444084316824-dc26d6657664?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop"], summary: "Music City's walkable luxury district with Vanderbilt psychiatry, 200+ AA meetings/week, 3,000 concerts/year, and a nonstop to BWI for $70. The Gulch/SoBro corridor is Nashville's fitness and nightlife hub for young professionals.", costOfLiving: "Moderate", medianRent: "$1,671", medianHome: "$450,000", vibe: "Music City luxury, walkable, Vanderbilt access, young pro influx" },
  { id: 37, name: "Nashville: East Nashville", region: "Nashville", population: "~712,000", elevation: "597 ft", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1461301214746-1e109215d6d3?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1461695008884-244cb4543d74?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop"], summary: "Nashville's creative-class hub with indie coffee shops, East Nasty running club, and a rapidly gentrifying food scene. More affordable than The Gulch with authentic neighborhood feel.", costOfLiving: "Moderate", medianRent: "$1,550", medianHome: "$425,000", vibe: "Creative, indie, East Nasty running club, gentrifying, authentic" },
  { id: 38, name: "Charleston: Downtown", region: "Charleston", population: "~162,000", elevation: "20 ft", image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop"], summary: "Walker's Paradise (Walk Score 97) with MUSC academic psychiatry (tier 3), cobblestone charm, Spoleto festival, and a 1h50m nonstop to BWI for $67. The most walkable city on this entire list.", costOfLiving: "High", medianRent: "$1,852", medianHome: "$493,000", vibe: "Historic coastal charm, Walk Score 97, culinary capital, MUSC access" },
  { id: 39, name: "Charleston: Park Circle", region: "Charleston", population: "~162,000", elevation: "20 ft", image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&h=400&fit=crop"], summary: "North Charleston's up-and-coming walkable neighborhood with craft breweries, more affordable rent, and MUSC still accessible. Growing young professional community with community garden culture.", costOfLiving: "Moderate", medianRent: "$1,550", medianHome: "$350,000", vibe: "Up-and-coming, affordable Charleston, craft breweries, community gardens" },
  { id: 40, name: "Raleigh: Downtown", region: "Raleigh-Durham", population: "~482,000", elevation: "315 ft", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop"], summary: "Research Triangle's polished state capital with Duke + UNC psychiatry (tier 3), Walk Score 88, NC State Farmers Market year-round, and an absurd 1h20m nonstop to BWI for $59. Best affordability-to-quality ratio on the list.", costOfLiving: "Moderate", medianRent: "$1,374", medianHome: "$426,000", vibe: "Tech hub, state capital polish, Duke/UNC access, incredible value" },
  { id: 41, name: "Durham: Bull City", region: "Raleigh-Durham", population: "~296,000", elevation: "404 ft", image: "https://images.unsplash.com/photo-1554072675-66db59dba46f?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1502786129293-79981df4e689?w=600&h=400&fit=crop"], summary: "Duke University's artsy, progressive foodie town. Durham's COL index of 98.8 is BELOW national average with Duke Hospital next door. The cheapest city on this list with a tier 3 academic medical center.", costOfLiving: "Moderate", medianRent: "$1,200", medianHome: "$350,000", vibe: "Duke University town, artsy foodie, progressive, below-average cost" },
  { id: 42, name: "SLC: Downtown/Sugar House", region: "Salt Lake City", population: "~226,000", elevation: "4,226 ft", image: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=600&h=400&fit=crop"], summary: "8 ski resorts within an hour, 300+ AA meetings/week, Walk Score 87, and 2 million acres of public land. The ultimate outdoor-meets-urban lifestyle with a growing tech scene and NBA/MLS entertainment.", costOfLiving: "High", medianRent: "$1,500", medianHome: "$570,000", vibe: "Ski-city hybrid, 8 resorts in 1 hour, tech boom, outdoor obsessed" },
  { id: 43, name: "SLC: 9th & 9th", region: "Salt Lake City", population: "~226,000", elevation: "4,226 ft", image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=400&fit=crop"], summary: "Salt Lake's indie village neighborhood with boutique shops, Walk Score 72, and direct trail access to the Wasatch foothills. Safer and more residential than downtown with the same ski access.", costOfLiving: "High", medianRent: "$1,450", medianHome: "$580,000", vibe: "Indie village, Wasatch foothills, boutique walkable, ski-town residential" },
  { id: 44, name: "Scottsdale: Old Town", region: "Phoenix-Scottsdale", population: "~247,000", elevation: "1,257 ft", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1519302959554-a75be0afc82a?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop"], summary: "299 sunshine days, Walk Score 81, 500+ AA meetings/week, Mayo Clinic access, 6 pro sports teams, and the largest recovery meeting network on this list. Old Town is Arizona's fitness and nightlife capital.", costOfLiving: "Very High", medianRent: "$2,461", medianHome: "$978,000", vibe: "Resort fitness culture, 299 sunshine days, Mayo Clinic, nightlife capital" },
  { id: 45, name: "Phoenix: Arcadia", region: "Phoenix-Scottsdale", population: "~1,600,000", elevation: "1,100 ft", image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop"], summary: "Phoenix's most desirable residential neighborhood with Camelback Mountain hiking, farm-to-table dining on the Arcadia food corridor, and much more affordable than Scottsdale with the same metro access.", costOfLiving: "Moderate", medianRent: "$1,776", medianHome: "$450,000", vibe: "Camelback Mountain, food corridor, residential luxury, affordable Scottsdale alt" },
  { id: 46, name: "Minneapolis: Uptown/Lakes", region: "Minneapolis", population: "~425,000", elevation: "830 ft", image: "https://images.unsplash.com/photo-1565118531796-763e5082d113?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1554072675-66db59dba46f?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=600&h=400&fit=crop"], summary: "Walk Score 93, Chain of Lakes paradise, 6 pro sports teams, 400+ AA meetings/week, U of Minnesota tier 3 psychiatry, and the highest insurance acceptance rate on this list (75%). The healthiest cold-weather city in America.", costOfLiving: "Moderate", medianRent: "$1,600", medianHome: "$316,000", vibe: "Lake life, healthiest cold city, progressive, four-season active" },
  { id: 47, name: "Minneapolis: North Loop", region: "Minneapolis", population: "~425,000", elevation: "830 ft", image: "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=600&h=400&fit=crop", gallery: ["https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=600&h=400&fit=crop"], summary: "Minneapolis's warehouse-turned-loft district with Walk Score 90, First Avenue music venue, craft breweries, and Target Field walkable. The urban counterpart to Uptown's lake lifestyle.", costOfLiving: "Moderate", medianRent: "$1,693", medianHome: "$387,000", vibe: "Warehouse lofts, First Avenue, brewery district, walkable urban" },
];

export const categories = [
  { key: "affordability", label: "Affordability", icon: "💰", color: "#81C784" },
  { key: "airQuality", label: "Air Quality", icon: "🌬️", color: "#80DEEA" },
  { key: "climate", label: "Climate & Weather", icon: "☀️", color: "#FFD54F" },
  { key: "safety", label: "Crime", icon: "🛡️", color: "#AB47BC" },
  { key: "dating", label: "Dating Scene", icon: "💘", color: "#E91E63" },
  { key: "events", label: "Events & Entertainment", icon: "🎤", color: "#F06292" },
  { key: "gyms", label: "Gyms & Fitness", icon: "💪", color: "#FF6B6B" },
  { key: "healthWellness", label: "Health & Wellness", icon: "💚", color: "#4ECB71" },
  { key: "socialCommunity", label: "Healthy Social & Community", icon: "🤝", color: "#42A5F5" },
  { key: "jobMarket", label: "Job Market & Remote Work", icon: "💻", color: "#CE93D8" },
  { key: "meditation", label: "Meditation & Mindfulness", icon: "🧘", color: "#00C9A7" },
  { key: "mentalHealth", label: "Mental Health & Therapy", icon: "🧠", color: "#7E57C2" },
  { key: "nutrition", label: "Nutrition & Health Food", icon: "🥗", color: "#FFA726" },
  { key: "outdoorRec", label: "Outdoor Recreation", icon: "🏔️", color: "#66BB6A" },
  { key: "recovery", label: "Recovery Support", icon: "🫂", color: "#6C63FF" },
  { key: "walkability", label: "Walkability", icon: "🚶", color: "#26C6DA" },
  { key: "youngAdults", label: "Young Adult Density", icon: "🎓", color: "#FFB74D" },
];

// ============================================================
// DYNAMIC DETAIL GENERATION
// ============================================================
// Every city's `details` object is fully generated from its raw metrics.
// This keeps cities.js small (just id, name, region, pop, image, summary, vibe,
// cost fields) and lets us strip out ~1,500 lines of hardcoded strings.
// Update the functions below to change any detail text for every city at once.

const fmt = (n) => n.toLocaleString();

function detailsRecovery(m) {
  return [
    `~${fmt(m.weeklyAA)} weekly AA meetings within 15 miles`,
    `~${fmt(m.weeklyNA)} weekly NA meetings within 15 miles`,
    m.weeklyAA >= 500 ? "Huge recovery network - meetings at nearly every hour" :
      m.weeklyAA >= 150 ? "Strong recovery network with daily meeting options" :
      m.weeklyAA >= 50 ? "Active recovery community with solid meeting coverage" :
      m.weeklyAA >= 20 ? "Smaller but accessible recovery community" :
      "Limited local meetings - you may need to travel",
    m.weeklyNA >= 30 ? "Deep NA presence in addition to AA" :
      m.weeklyNA >= 10 ? "Reasonable NA access alongside AA" :
      "NA is thin - AA is the primary option",
  ];
}

function detailsMeditation(m) {
  return [
    `${m.yogaStudios} yoga studios in the area`,
    `${m.meditationCenters} dedicated meditation centers`,
    m.yogaStudios >= 40 ? "Yoga is a core part of the local culture" :
      m.yogaStudios >= 15 ? "Strong yoga and mindfulness scene" :
      m.yogaStudios >= 6 ? "Reasonable yoga options" :
      "Limited dedicated yoga offerings",
    m.meditationCenters >= 5 ? "Multiple contemplative traditions represented" :
      m.meditationCenters >= 2 ? "Established meditation community" :
      "Meditation mostly happens inside yoga studios",
  ];
}

function detailsHealthWellness(m) {
  const hospitalLabel =
    m.hospitalScore >= 3 ? "Major hospital systems (trauma center, specialty care)" :
    m.hospitalScore >= 2 ? "Regional hospital with full services" :
    "Limited hospital access - nearest major hospital is a drive";
  return [
    hospitalLabel,
    `~${m.integrativePractitioners} integrative/holistic health practitioners`,
    m.integrativePractitioners >= 40 ? "Nationally notable integrative health scene" :
      m.integrativePractitioners >= 20 ? "Strong alternative/integrative options" :
      m.integrativePractitioners >= 10 ? "Moderate integrative health presence" :
      "Integrative health is thin - mostly conventional medicine",
    "Mental health is scored separately",
  ];
}

function detailsMentalHealth(m) {
  const tierLabel =
    m.academicTier >= 3 ? "Top-tier academic psychiatry program (Johns Hopkins / Harvard caliber)" :
    m.academicTier >= 2 ? "Strong regional psychiatry residency and academic anchor" :
    m.academicTier >= 1 ? "Regional medical school psychiatry presence" :
    "No local academic psychiatry program";
  const therapistLabel =
    m.therapistsPer10k >= 40 ? "Very high therapist density" :
    m.therapistsPer10k >= 20 ? "Strong therapist supply" :
    m.therapistsPer10k >= 10 ? "Moderate therapist supply" :
    "Limited local therapists (teletherapy helps bridge gap)";
  const insuranceLabel =
    m.insuranceAcceptancePct >= 65 ? "Good insurance acceptance - many in-network options" :
    m.insuranceAcceptancePct >= 55 ? "Moderate insurance acceptance" :
    m.insuranceAcceptancePct >= 45 ? "Cash-heavy market - insurance options are limited" :
    "Mostly cash-only - expect $150-250/session out of pocket";
  return [
    `${m.therapistsPer10k}/10k therapists, ${m.psychiatristsPer10k}/10k psychiatrists`,
    tierLabel,
    therapistLabel,
    `${m.acceptingNewPatientsPct}% accepting new patients, ${m.insuranceAcceptancePct}% accept insurance`,
    insuranceLabel,
  ];
}

function detailsGyms(m) {
  return [
    `${m.gymsTotal} gyms, fitness studios, and rec centers in metro`,
    `${m.gymsPer10k.toFixed(1)} gyms per 10,000 residents`,
    m.gymsPer10k >= 3 ? "Excellent per-capita fitness density" :
      m.gymsPer10k >= 2 ? "Solid variety of fitness options" :
      m.gymsPer10k >= 1.5 ? "Adequate fitness options" :
      "Fitness options are more limited than average",
    m.gymsTotal >= 80 ? "Full spectrum: big-box chains, boutique studios, climbing, CrossFit" :
      m.gymsTotal >= 30 ? "Good mix of chains and boutique studios" :
      m.gymsTotal >= 10 ? "Basic chains plus some boutique options" :
      "Limited to a few basic gyms",
  ];
}

function detailsNutrition(m) {
  const marketLabel =
    m.yearRoundMarket ? "Year-round farmer's market" :
    m.seasonalMarket ? "Seasonal farmer's market (typically May-October)" :
    "No regular farmer's market";
  return [
    `${m.healthStores} natural/organic grocery stores`,
    `${m.healthStoresPer10k.toFixed(2)} health stores per 10k residents`,
    marketLabel,
    m.healthStores >= 10 ? "Strong health food scene - Whole Foods, co-ops, specialty shops" :
      m.healthStores >= 5 ? "Good health food variety" :
      m.healthStores >= 2 ? "Basic natural grocery options" :
      "Limited - mostly conventional grocery",
  ];
}

function detailsYoungAdults(m) {
  const count = Math.round((m.metroPop || 0) * (m.pctAge25_34 / 100));
  return [
    `${m.pctAge25_34}% of metro population is aged 25-34`,
    `~${fmt(count)} estimated 25-34 year-olds in metro`,
    m.pctAge25_34 >= 22 ? "Dominant young-professional demographic - huge peer density" :
      m.pctAge25_34 >= 18 ? "Strong young-adult presence - plenty of peers" :
      m.pctAge25_34 >= 14 ? "Moderate young-adult density" :
      m.pctAge25_34 >= 10 ? "Thin young-adult scene - older median demographic" :
      "Very few peers in your age range - retiree-heavy or family-heavy",
    m.pctAge25_34 >= 18
      ? "Expect nightlife, rec sports, and dating scenes built around this demographic"
      : "Social scene likely oriented toward families, retirees, or a broader age mix",
  ];
}

function detailsSocialCommunity(m) {
  return [
    `~${m.intramuralLeagues || 0} intramural sports leagues (kickball, volleyball, soccer, etc.)`,
    `~${m.runningClubs || 0} running clubs and groups`,
    m.outdoorGroupsScore === 3 ? "Abundant outdoor and wellness groups" :
      m.outdoorGroupsScore === 2 ? "Moderate outdoor and wellness groups" :
      "Limited outdoor and wellness groups",
    (m.intramuralLeagues || 0) >= 15 ? "Excellent for meeting active young professionals" :
      (m.intramuralLeagues || 0) >= 8 ? "Great intramural and social sports options" :
      (m.intramuralLeagues || 0) >= 3 ? "Decent local league options" :
      "Small but active community - fewer organized leagues",
  ];
}

function detailsWalkability(m) {
  const ws = m.walkScore;
  const classification =
    ws >= 90 ? "Walker's Paradise - walk to almost everything" :
    ws >= 70 ? "Very Walkable - most errands on foot" :
    ws >= 50 ? "Somewhat Walkable - some errands on foot" :
    ws >= 25 ? "Car-Dependent - most errands require a car" :
    "Very Car-Dependent - almost all errands require a car";
  return [
    `Walk Score: ${ws}/100`,
    classification,
    ws >= 70 ? "No car needed for daily life" :
      ws >= 50 ? "Car helpful but not essential" :
      "Car essential",
    "Source: WalkScore.com",
  ];
}

function detailsOutdoorRec(m) {
  return [
    `~${m.trailCount} AllTrails trails in the area`,
    `${m.skiResortsWithin1hr} ski resort${m.skiResortsWithin1hr === 1 ? "" : "s"} within 1 hour`,
    `~${fmt(m.publicLandAcres)} acres of nearby public land`,
    m.publicLandAcres >= 1000000 ? "Massive public land access - millions of acres nearby" :
      m.publicLandAcres >= 100000 ? "Excellent public land access" :
      m.publicLandAcres >= 10000 ? "Solid access to parks and open space" :
      "Limited nearby public land - mostly urban parks",
    m.trailCount >= 200 ? "Trail hub - hundreds of options for every skill level" :
      m.trailCount >= 100 ? "Strong trail network" :
      m.trailCount >= 50 ? "Good trail selection" :
      "Basic trail access - limited nearby options",
  ];
}

function detailsSafety(m) {
  return [
    `Violent crime: ${m.violentPer1k} per 1,000 residents`,
    `Property crime: ${m.propertyPer1k} per 1,000 residents`,
    m.violentPer1k <= 2 ? "Very low violent crime - among the safest options" :
      m.violentPer1k <= 4 ? "Low violent crime" :
      m.violentPer1k <= 7 ? "Moderate violent crime - typical urban levels" :
      m.violentPer1k <= 12 ? "Elevated violent crime - neighborhood matters" :
      "High violent crime - significant awareness needed",
    m.propertyPer1k <= 15 ? "Very low property crime" :
      m.propertyPer1k <= 30 ? "Moderate property crime - standard urban awareness" :
      m.propertyPer1k <= 60 ? "Elevated property crime - lock your car" :
      "High property crime - car break-ins and bike theft common",
  ];
}

function detailsClimate(m) {
  return [
    `${m.sunshineDays} days of sunshine per year`,
    `Summer highs average ${m.avgHighSummer}°F (July)`,
    `Winter lows average ${m.avgLowWinter}°F (January)`,
    `${m.annualSnowfall}" annual snowfall`,
    m.annualSnowfall > 100 ? "Heavy snow - great for skiing, cold winters" :
      m.annualSnowfall > 50 ? "Moderate snow with four-season climate" :
      m.annualSnowfall > 10 ? "Light snow most winters" :
      "Virtually no snow - mild winters",
  ];
}

function detailsAffordability(m) {
  return [
    `Cost-of-living index: ${m.costIndex} (national average = 100)`,
    `Median rent: $${fmt(m.medianRentNumeric)}/month`,
    m.costIndex > 140 ? "Significantly above national average - expensive" :
      m.costIndex > 125 ? "Well above national average" :
      m.costIndex > 110 ? "Moderately above national average" :
      m.costIndex > 100 ? "Slightly above national average" :
      "Near or below national average",
    m.medianRentNumeric > 2200 ? "Rent is very high - budget carefully" :
      m.medianRentNumeric > 1800 ? "Rent is high" :
      m.medianRentNumeric > 1400 ? "Rent is moderate for the region" :
      "Rent is relatively affordable",
  ];
}

function detailsAirQuality(m) {
  return [
    `Median AQI: ${m.aqiMedian}`,
    `~${m.goodAQIDays} "Good" air quality days per year (AQI < 50)`,
    m.aqiMedian < 30 ? "Excellent air quality year-round" :
      m.aqiMedian < 45 ? "Generally good air quality" :
      m.aqiMedian < 55 ? "Moderate air quality - occasional haze" :
      "Air quality can be poor; wildfire smoke possible in summer",
    "Source: EPA AirData annual summary (2023)",
  ];
}

function detailsJobMarket(m) {
  return [
    `Unemployment rate: ${m.unemploymentRate}%`,
    `Remote work adoption: ~${m.remoteWorkPct}% of workforce`,
    `Median household income: $${fmt(m.medianIncome)}`,
    m.remoteWorkPct >= 30 ? "Strong remote work culture" :
      m.remoteWorkPct >= 20 ? "Growing remote work presence" :
      "Limited remote work compared to larger metros",
    "Sources: BLS, Census ACS, FRED",
  ];
}

function detailsEvents(m) {
  return [
    `${m.proTeams} major pro sports teams (MLB/NFL/NBA/NHL/MLS)`,
    `${m.largeVenues} large concert venues (>5K capacity)`,
    `~${m.annualConcerts} major touring concerts per year`,
    `${m.musicFestivals} annual music festivals`,
    m.proTeams >= 4 ? "Major league sports city with huge entertainment calendar" :
      m.proTeams >= 2 ? "Multiple pro sports teams and strong venue access" :
      m.proTeams >= 1 ? "One pro team plus solid live music scene" :
      m.largeVenues >= 2 ? "No pro teams but strong live music and college scene" :
      "Intimate venues and festival-driven scene",
  ];
}

function detailsDating(m) {
  const ratio = m.femaleMaleRatio;
  const women100Men = Math.round(ratio * 100);
  const femaleShare = ratio / (1 + ratio);
  const poolSize = Math.round(
    m.metroPop * (m.pctAge25_34 / 100) * (m.singlesPct25_34 / 100) * femaleShare
  );
  return [
    `Estimated pool: ~${fmt(poolSize)} single women ages 25-34 in metro`,
    `Gender ratio: ${women100Men} women per 100 men (ages 25-34)`,
    `${m.singlesPct25_34}% of 25-34 year-olds are single, ${m.pctAge25_34}% of population is 25-34`,
    poolSize >= 30000 ? "Huge dating pool - options abound" :
      poolSize >= 10000 ? "Large dating pool" :
      poolSize >= 3000 ? "Moderate dating pool" :
      poolSize >= 1000 ? "Small dating pool - you'll see familiar faces" :
      "Very small dating pool - expect limited local options",
    ratio >= 1.05 ? "Female-skewed - favorable odds for straight men" :
      ratio >= 0.98 ? "Near-balanced gender ratio" :
      ratio >= 0.93 ? "Slightly male-skewed - more competition" :
      "Significantly male-skewed - tough odds for straight men",
  ];
}

// Dispatch table - each category key maps to a function that produces its detail array
const detailGenerators = {
  recovery: detailsRecovery,
  meditation: detailsMeditation,
  healthWellness: detailsHealthWellness,
  mentalHealth: detailsMentalHealth,
  gyms: detailsGyms,
  nutrition: detailsNutrition,
  socialCommunity: detailsSocialCommunity,
  walkability: detailsWalkability,
  youngAdults: detailsYoungAdults,
  outdoorRec: detailsOutdoorRec,
  safety: detailsSafety,
  climate: detailsClimate,
  affordability: detailsAffordability,
  airQuality: detailsAirQuality,
  jobMarket: detailsJobMarket,
  events: detailsEvents,
  dating: detailsDating,
};

function generateAllDetails(cityId) {
  const m = rawMetrics[cityId];
  if (!m) return {};
  const details = {};
  for (const [key, fn] of Object.entries(detailGenerators)) {
    if (m[key]) {
      details[key] = fn(m[key]);
    }
  }
  return details;
}

// Compute scores from raw metrics and generate all detail text dynamically.
// citiesRaw holds only static metadata (name, region, image, summary, vibe, cost)
// — scores and details are 100% derived from rawMetrics in metrics.js.
const cities = citiesRaw.map((city) => ({
  ...city,
  scores: computeScores(city.id),
  details: generateAllDetails(city.id),
}));

export default cities;
