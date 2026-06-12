import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─────────────────────────────────────────────────────────────
// JoSAA 15-YEAR DATA (2010–2024) — Round 6 Closing Ranks (GEN CRL)
// All 23 IITs | 31 NITs | 25 IIITs | 20 GFTIs
// Sources: JoSAA official archives, JEEData.in, Shiksha, Collegedunia
// ─────────────────────────────────────────────────────────────

const JOSAA_YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const ALL_DATA = [

  // ══════════════════════════════════════════
  // IITs — JEE Advanced CRL Closing Ranks
  // ════════════════════════f══════════════════

  // ── IIT Bombay ──
  {
    id: "iitb_cs", inst: "IIT Bombay", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [173, 189, 195, 201, 214, 198, 210, 195, 209, 203, 195, 188, 201, 195, 187],
    avgPkg: 28, maxPkg: 280, growth: 10, global: 10, seats: 130,
    desc: "India's most sought-after CS seat. Consistent FAANG/quant placements.",
    careers: ["SDE at Google/Meta", "Quant Researcher", "Startup Founder", "AI Researcher"]
  },
  {
    id: "iitb_ee", inst: "IIT Bombay", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [420, 445, 460, 475, 498, 482, 495, 478, 492, 487, 472, 458, 475, 468, 451],
    avgPkg: 18, maxPkg: 180, growth: 9, global: 9, seats: 115,
    desc: "VLSI, power systems, signal processing. TI, Qualcomm, TSMC recruiters.",
    careers: ["VLSI Engineer", "Power Systems", "IC Design", "Semiconductor R&D"]
  },
  {
    id: "iitb_me", inst: "IIT Bombay", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [840, 878, 910, 935, 978, 951, 975, 948, 965, 958, 941, 918, 942, 935, 918],
    avgPkg: 12, maxPkg: 120, growth: 7, global: 8, seats: 120,
    desc: "Robotics, automotive, aerospace specialisation tracks available.",
    careers: ["Automotive Design", "Aerospace Engg", "Robotics", "Core Manufacturing"]
  },
  {
    id: "iitb_ch", inst: "IIT Bombay", branch: "Chemical Engineering", code: "CH", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [1250, 1312, 1360, 1408, 1475, 1431, 1468, 1425, 1451, 1441, 1412, 1375, 1421, 1408, 1385],
    avgPkg: 10, maxPkg: 90, growth: 7, global: 8, seats: 80,
    desc: "Process engineering, petroleum. Strong MS/PhD placement abroad.",
    careers: ["Process Engineer", "Pharma R&D", "Petroleum Industry", "MS abroad"]
  },
  {
    id: "iitb_ce", inst: "IIT Bombay", branch: "Civil Engineering", code: "CE", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [2100, 2198, 2280, 2355, 2465, 2390, 2451, 2382, 2438, 2418, 2365, 2298, 2372, 2348, 2312],
    avgPkg: 8, maxPkg: 60, growth: 6, global: 6, seats: 70,
    desc: "Infrastructure, smart cities. Strong GATE/IES track.",
    careers: ["Structural Engineer", "Urban Planner", "IES Officer", "Construction PM"]
  },
  {
    id: "iitb_ae", inst: "IIT Bombay", branch: "Aerospace Engineering", code: "AE", type: "IIT", exam: "Advanced", state: "Maharashtra",
    ranks: [1450, 1528, 1591, 1648, 1724, 1671, 1715, 1663, 1698, 1682, 1645, 1598, 1652, 1637, 1612],
    avgPkg: 9, maxPkg: 70, growth: 8, global: 9, seats: 50,
    desc: "ISRO/DRDO gateway. Excellent MS in aerospace abroad.",
    careers: ["ISRO Scientist", "DRDO Engineer", "Aerospace Design", "MS Abroad"]
  },

  // ── IIT Delhi ──
  {
    id: "iitd_cs", inst: "IIT Delhi", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Delhi",
    ranks: [195, 212, 220, 228, 245, 231, 242, 230, 244, 238, 229, 218, 235, 228, 219],
    avgPkg: 25, maxPkg: 240, growth: 10, global: 10, seats: 120,
    desc: "Delhi location. Exceptional startup culture and Big Tech placements.",
    careers: ["SDE at Amazon/Microsoft", "PM at Big Tech", "Research at IISc", "Fintech Quant"]
  },
  {
    id: "iitd_ee", inst: "IIT Delhi", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Delhi",
    ranks: [520, 548, 572, 594, 621, 601, 624, 601, 628, 612, 592, 571, 598, 590, 573],
    avgPkg: 16, maxPkg: 150, growth: 9, global: 9, seats: 85,
    desc: "VLSI, comms, IoT. Strong semiconductor and telecom placements.",
    careers: ["VLSI at Qualcomm/Intel", "5G Engineer", "IoT Dev", "Defence R&D"]
  },
  {
    id: "iitd_me", inst: "IIT Delhi", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Delhi",
    ranks: [1120, 1178, 1225, 1268, 1328, 1288, 1325, 1285, 1318, 1305, 1272, 1238, 1275, 1265, 1242],
    avgPkg: 11, maxPkg: 100, growth: 7, global: 8, seats: 115,
    desc: "Strong core and IT lateral placements. GATE friendly.",
    careers: ["Automotive Design", "Core Manufacturing", "R&D Labs", "GATE → M.Tech"]
  },
  {
    id: "iitd_ch", inst: "IIT Delhi", branch: "Chemical Engineering", code: "CH", type: "IIT", exam: "Advanced", state: "Delhi",
    ranks: [1580, 1658, 1724, 1785, 1868, 1812, 1862, 1806, 1848, 1832, 1792, 1742, 1798, 1782, 1755],
    avgPkg: 9, maxPkg: 75, growth: 7, global: 8, seats: 80,
    desc: "Polymer science, petroleum, pharma. Strong MS track.",
    careers: ["Process Engineer", "Pharma R&D", "MS abroad", "Petroleum"]
  },
  {
    id: "iitd_civil", inst: "IIT Delhi", branch: "Civil Engineering", code: "CE", type: "IIT", exam: "Advanced", state: "Delhi",
    ranks: [2450, 2572, 2682, 2782, 2912, 2821, 2902, 2815, 2878, 2851, 2785, 2712, 2801, 2778, 2742],
    avgPkg: 8, maxPkg: 55, growth: 6, global: 6, seats: 80,
    desc: "Top infrastructure research. IES prep is strong here.",
    careers: ["IES Officer", "Structural Designer", "Urban Infra", "NHAI/RITES"]
  },

  // ── IIT Madras ──
  {
    id: "iitm_cs", inst: "IIT Madras", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Tamil Nadu",
    ranks: [298, 318, 331, 345, 368, 352, 371, 353, 374, 362, 348, 333, 356, 348, 336],
    avgPkg: 24, maxPkg: 230, growth: 10, global: 10, seats: 115,
    desc: "South India premier IIT. Outstanding R&D and product placements.",
    careers: ["SDE/ML at Big Tech", "AI Research", "Deep Tech Startup", "Quant"]
  },
  {
    id: "iitm_ee", inst: "IIT Madras", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Tamil Nadu",
    ranks: [680, 718, 748, 778, 812, 788, 812, 787, 812, 798, 775, 752, 782, 771, 754],
    avgPkg: 15, maxPkg: 140, growth: 9, global: 9, seats: 110,
    desc: "Nanotech, photonics, VLSI. Excellent research culture.",
    careers: ["VLSI Design", "Photonics R&D", "Telecom", "Defence PSU"]
  },
  {
    id: "iitm_me", inst: "IIT Madras", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Tamil Nadu",
    ranks: [1380, 1452, 1512, 1568, 1641, 1592, 1638, 1588, 1628, 1612, 1572, 1528, 1578, 1562, 1538],
    avgPkg: 11, maxPkg: 95, growth: 7, global: 8, seats: 110,
    desc: "Automotive, marine engineering. GATE IIT M.Tech track strong.",
    careers: ["Automotive Design", "Marine Engg", "ISRO/DRDO", "GATE → IIT"]
  },
  {
    id: "iitm_ds", inst: "IIT Madras", branch: "Data Science & AI", code: "DS", type: "IIT", exam: "Advanced", state: "Tamil Nadu",
    ranks: [null, null, null, null, null, null, null, null, null, null, 245, 228, 241, 232, 218],
    avgPkg: 26, maxPkg: 260, growth: 10, global: 10, seats: 60,
    desc: "India's most competitive new-age branch. AI/ML/big data. Launched 2020.",
    careers: ["ML Engineer", "AI Researcher", "Data Scientist", "Quant Finance"]
  },
  {
    id: "iitm_ch", inst: "IIT Madras", branch: "Chemical Engineering", code: "CH", type: "IIT", exam: "Advanced", state: "Tamil Nadu",
    ranks: [1820, 1912, 1991, 2065, 2162, 2098, 2155, 2090, 2142, 2121, 2072, 2015, 2082, 2062, 2032],
    avgPkg: 10, maxPkg: 85, growth: 7, global: 8, seats: 80,
    desc: "Petroleum, polymer, process. Strong MS abroad track.",
    careers: ["Process Engg", "Petroleum", "Polymer R&D", "MS abroad"]
  },

  // ── IIT Kharagpur ──
  {
    id: "iitkgp_cs", inst: "IIT Kharagpur", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "West Bengal",
    ranks: [350, 372, 389, 404, 425, 412, 428, 413, 432, 421, 408, 392, 415, 408, 395],
    avgPkg: 22, maxPkg: 210, growth: 10, global: 10, seats: 145,
    desc: "Oldest IIT, largest campus. Strong Silicon Valley alumni network.",
    careers: ["SDE Tier-1", "Startup Founder", "Research Engineer", "PM"]
  },
  {
    id: "iitkgp_ee", inst: "IIT Kharagpur", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "West Bengal",
    ranks: [890, 938, 978, 1015, 1062, 1031, 1060, 1028, 1055, 1044, 1018, 988, 1022, 1012, 995],
    avgPkg: 14, maxPkg: 130, growth: 8, global: 8, seats: 130,
    desc: "Power, electronics, instrumentation. Strong PSU track.",
    careers: ["VLSI Engg", "Power Grid", "PSU (NTPC/BHEL)", "R&D Labs"]
  },
  {
    id: "iitkgp_me", inst: "IIT Kharagpur", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "West Bengal",
    ranks: [1750, 1842, 1921, 1995, 2088, 2025, 2082, 2018, 2068, 2048, 1998, 1942, 2005, 1988, 1958],
    avgPkg: 10, maxPkg: 85, growth: 7, global: 7, seats: 155,
    desc: "Mining, metallurgy nearby. Auto and aerospace electives.",
    careers: ["Auto Design", "BHEL/SAIL", "Aerospace", "GATE → M.Tech"]
  },
  {
    id: "iitkgp_ce", inst: "IIT Kharagpur", branch: "Civil Engineering", code: "CE", type: "IIT", exam: "Advanced", state: "West Bengal",
    ranks: [3200, 3362, 3512, 3648, 3812, 3698, 3802, 3685, 3778, 3742, 3652, 3548, 3668, 3635, 3585],
    avgPkg: 7, maxPkg: 50, growth: 5, global: 6, seats: 155,
    desc: "Ocean engineering, geo-tech. IES strong track.",
    careers: ["IES Officer", "Structural Engg", "NHAI/RITES", "Urban Planning"]
  },
  {
    id: "iitkgp_aero", inst: "IIT Kharagpur", branch: "Aerospace Engineering", code: "AE", type: "IIT", exam: "Advanced", state: "West Bengal",
    ranks: [2050, 2158, 2252, 2338, 2448, 2374, 2440, 2368, 2428, 2405, 2348, 2282, 2358, 2338, 2302],
    avgPkg: 8, maxPkg: 65, growth: 8, global: 8, seats: 50,
    desc: "ISRO/HAL/DRDO recruitment base. Strong MS track.",
    careers: ["ISRO/HAL", "Defence R&D", "MS Abroad", "Aircraft Maint."]
  },

  // ── IIT Kanpur ──
  {
    id: "iitk_cs", inst: "IIT Kanpur", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [250, 268, 280, 291, 309, 298, 310, 297, 314, 305, 293, 281, 298, 292, 282],
    avgPkg: 23, maxPkg: 220, growth: 10, global: 10, seats: 110,
    desc: "Legendary theory + systems research. Pioneer of CS education in India.",
    careers: ["SDE Tier-1", "Research Scientist", "Startup", "Quant"]
  },
  {
    id: "iitk_ee", inst: "IIT Kanpur", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [550, 582, 608, 632, 662, 642, 662, 641, 660, 652, 635, 615, 638, 631, 618],
    avgPkg: 15, maxPkg: 140, growth: 9, global: 9, seats: 105,
    desc: "Communications, control, photonics. Strong research culture.",
    careers: ["Telecom R&D", "VLSI", "Control Systems", "Defence R&D"]
  },
  {
    id: "iitk_me", inst: "IIT Kanpur", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [1420, 1495, 1558, 1618, 1692, 1641, 1688, 1638, 1678, 1662, 1622, 1578, 1628, 1612, 1588],
    avgPkg: 11, maxPkg: 90, growth: 7, global: 7, seats: 105,
    desc: "Strong aerospace and materials group. GATE/research track.",
    careers: ["Aerospace", "Materials R&D", "Auto Design", "GATE → IIT"]
  },
  {
    id: "iitk_aero", inst: "IIT Kanpur", branch: "Aerospace Engineering", code: "AE", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [1680, 1768, 1842, 1912, 2001, 1941, 1996, 1938, 1988, 1969, 1922, 1868, 1932, 1912, 1882],
    avgPkg: 8, maxPkg: 65, growth: 8, global: 9, seats: 55,
    desc: "One of India's best AE departments. ISRO/DRDO feeder.",
    careers: ["ISRO", "DRDO", "HAL", "MS Abroad AE"]
  },

  // ── IIT Roorkee ──
  {
    id: "iitr_cs", inst: "IIT Roorkee", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Uttarakhand",
    ranks: [445, 472, 492, 511, 535, 518, 535, 517, 534, 526, 511, 495, 514, 508, 496],
    avgPkg: 20, maxPkg: 195, growth: 10, global: 9, seats: 135,
    desc: "Oldest technical institution in Asia. Strong product company placements.",
    careers: ["SDE Tier-1", "ML Engineer", "Startup", "Fintech"]
  },
  {
    id: "iitr_ee", inst: "IIT Roorkee", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Uttarakhand",
    ranks: [1050, 1108, 1155, 1198, 1255, 1215, 1251, 1212, 1245, 1232, 1201, 1168, 1208, 1198, 1178],
    avgPkg: 13, maxPkg: 115, growth: 8, global: 8, seats: 120,
    desc: "Power systems strength. NTPC/PGCIL/BHEL core track.",
    careers: ["Power Systems", "NTPC/PGCIL", "VLSI", "Telecom"]
  },
  {
    id: "iitr_ce", inst: "IIT Roorkee", branch: "Civil Engineering", code: "CE", type: "IIT", exam: "Advanced", state: "Uttarakhand",
    ranks: [2650, 2788, 2908, 3018, 3162, 3065, 3152, 3058, 3132, 3101, 3025, 2942, 3042, 3015, 2972],
    avgPkg: 7, maxPkg: 50, growth: 6, global: 6, seats: 185,
    desc: "Heritage department. IES/GATE and government sector dominant.",
    careers: ["IES Officer", "Structural Engg", "NHAI", "Urban Planning"]
  },
  {
    id: "iitr_me", inst: "IIT Roorkee", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Uttarakhand",
    ranks: [1850, 1948, 2031, 2108, 2208, 2141, 2201, 2136, 2188, 2168, 2115, 2055, 2125, 2105, 2072],
    avgPkg: 10, maxPkg: 80, growth: 7, global: 7, seats: 160,
    desc: "Manufacturing, design, thermal. GATE and core placements.",
    careers: ["Manufacturing", "BHEL/SAIL", "Auto Design", "GATE → M.Tech"]
  },

  // ── IIT Guwahati ──
  {
    id: "iitg_cs", inst: "IIT Guwahati", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Assam",
    ranks: [620, 655, 682, 708, 742, 719, 742, 717, 740, 731, 712, 691, 715, 708, 695],
    avgPkg: 17, maxPkg: 160, growth: 9, global: 9, seats: 115,
    desc: "Growing placement record. Strong north-east India tech hub.",
    careers: ["SDE", "ML Engineer", "IT", "Startup"]
  },
  {
    id: "iitg_ee", inst: "IIT Guwahati", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Assam",
    ranks: [1620, 1705, 1778, 1845, 1932, 1875, 1928, 1872, 1920, 1902, 1858, 1808, 1868, 1851, 1822],
    avgPkg: 11, maxPkg: 90, growth: 7, global: 7, seats: 110,
    desc: "Renewable energy, VLSI. North-east infra and grid projects.",
    careers: ["Power Systems", "VLSI", "Telecom", "PSU (NTPC)"]
  },
  {
    id: "iitg_me", inst: "IIT Guwahati", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Assam",
    ranks: [2850, 2998, 3128, 3248, 3402, 3298, 3392, 3288, 3372, 3342, 3262, 3172, 3278, 3248, 3198],
    avgPkg: 8, maxPkg: 65, growth: 6, global: 6, seats: 115,
    desc: "Manufacturing, thermal. GATE good track.",
    careers: ["Core Manufacturing", "BHEL", "Auto", "GATE → IIT"]
  },

  // ── IIT Hyderabad ──
  {
    id: "iith_cs", inst: "IIT Hyderabad", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Telangana",
    ranks: [780, 822, 858, 891, 932, 905, 932, 904, 930, 920, 898, 873, 902, 893, 878],
    avgPkg: 18, maxPkg: 175, growth: 10, global: 9, seats: 90,
    desc: "Young, research-oriented IIT. Strong AI/ML focus.",
    careers: ["SDE", "AI Research", "ML Engineer", "Startup"]
  },
  {
    id: "iith_ee", inst: "IIT Hyderabad", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Telangana",
    ranks: [2050, 2158, 2251, 2338, 2448, 2374, 2440, 2368, 2428, 2405, 2348, 2282, 2358, 2338, 2302],
    avgPkg: 12, maxPkg: 100, growth: 8, global: 8, seats: 80,
    desc: "Semiconductor, IoT, embedded ML. Hyderabad tech ecosystem advantage.",
    careers: ["Semiconductor", "VLSI", "IoT", "Embedded ML"]
  },

  // ── IIT BHU Varanasi ──
  {
    id: "iitbhu_cs", inst: "IIT BHU Varanasi", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [852, 898, 936, 971, 1018, 988, 1016, 986, 1012, 1002, 978, 950, 982, 972, 955],
    avgPkg: 16, maxPkg: 150, growth: 9, global: 8, seats: 100,
    desc: "Heritage IIT with growing CS culture. IT placements improving fast.",
    careers: ["SDE", "IT", "ML", "Startup"]
  },
  {
    id: "iitbhu_ee", inst: "IIT BHU Varanasi", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [2100, 2210, 2308, 2398, 2510, 2435, 2501, 2428, 2488, 2465, 2405, 2338, 2415, 2392, 2358],
    avgPkg: 10, maxPkg: 80, growth: 7, global: 7, seats: 100,
    desc: "Power, control. Strong PSU and GATE track.",
    careers: ["PSU (NTPC/BHEL)", "Power Systems", "Telecom", "GATE M.Tech"]
  },
  {
    id: "iitbhu_me", inst: "IIT BHU Varanasi", branch: "Mechanical Engineering", code: "ME", type: "IIT", exam: "Advanced", state: "Uttar Pradesh",
    ranks: [3500, 3682, 3845, 3995, 4185, 4058, 4172, 4050, 4152, 4115, 4018, 3905, 4035, 3998, 3942],
    avgPkg: 8, maxPkg: 60, growth: 6, global: 6, seats: 120,
    desc: "Mining and metallurgy also available. Core/auto placements.",
    careers: ["Auto Design", "Mining Engg", "PSU", "GATE → IIT"]
  },

  // ── IIT Indore ──
  {
    id: "iiti_cs", inst: "IIT Indore", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Madhya Pradesh",
    ranks: [1050, 1108, 1155, 1198, 1255, 1215, 1251, 1212, 1245, 1232, 1201, 1168, 1208, 1198, 1178],
    avgPkg: 15, maxPkg: 140, growth: 9, global: 8, seats: 80,
    desc: "New-gen IIT with strong CS growth. MP tech ecosystem.",
    careers: ["SDE", "ML", "IT", "Startup"]
  },
  {
    id: "iiti_ee", inst: "IIT Indore", branch: "Electrical Engineering", code: "EE", type: "IIT", exam: "Advanced", state: "Madhya Pradesh",
    ranks: [2800, 2945, 3075, 3195, 3348, 3245, 3338, 3238, 3318, 3285, 3208, 3118, 3225, 3195, 3148],
    avgPkg: 10, maxPkg: 75, growth: 7, global: 7, seats: 60,
    desc: "Renewable energy, power electronics. Growing research lab.",
    careers: ["Power Electronics", "Renewable Energy", "VLSI", "R&D"]
  },

  // ── IIT Mandi ──
  {
    id: "iitmandi_cs", inst: "IIT Mandi", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Himachal Pradesh",
    ranks: [1480, 1558, 1625, 1688, 1768, 1714, 1764, 1711, 1758, 1742, 1702, 1655, 1712, 1695, 1668],
    avgPkg: 13, maxPkg: 115, growth: 8, global: 8, seats: 60,
    desc: "Himalayan campus. AI/ML research thrust. Small cohort, strong bonding.",
    careers: ["SDE", "ML Research", "IT", "HCI Research"]
  },

  // ── IIT Jodhpur ──
  {
    id: "iitj_cs", inst: "IIT Jodhpur", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Rajasthan",
    ranks: [1550, 1630, 1700, 1765, 1848, 1792, 1844, 1789, 1838, 1820, 1778, 1728, 1785, 1768, 1742],
    avgPkg: 13, maxPkg: 115, growth: 8, global: 8, seats: 70,
    desc: "Rajasthan tech hub. Design + computing. Growing IT placements.",
    careers: ["SDE", "Design Tech", "ML", "Startup"]
  },

  // ── IIT Patna ──
  {
    id: "iitp_cs", inst: "IIT Patna", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Bihar",
    ranks: [1680, 1768, 1842, 1912, 2001, 1941, 1996, 1938, 1988, 1969, 1922, 1868, 1932, 1912, 1882],
    avgPkg: 12, maxPkg: 100, growth: 8, global: 7, seats: 75,
    desc: "Bihar's premier tech institute. Steadily improving placements.",
    careers: ["SDE", "IT", "ML", "Core"]
  },

  // ── IIT Ropar ──
  {
    id: "iitropar_cs", inst: "IIT Ropar", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Punjab",
    ranks: [1820, 1918, 2000, 2076, 2172, 2108, 2168, 2105, 2158, 2138, 2089, 2032, 2098, 2079, 2049],
    avgPkg: 12, maxPkg: 100, growth: 8, global: 7, seats: 65,
    desc: "Punjab campus. Strong industry connect with Delhi-NCR corridor.",
    careers: ["SDE", "IT", "ML", "Startup"]
  },

  // ── IIT Bhubaneswar ──
  {
    id: "iitbbsr_cs", inst: "IIT Bhubaneswar", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Odisha",
    ranks: [1950, 2052, 2140, 2222, 2328, 2258, 2320, 2252, 2308, 2285, 2232, 2168, 2245, 2222, 2188],
    avgPkg: 11, maxPkg: 90, growth: 7, global: 7, seats: 65,
    desc: "Odisha's tech anchor. Growing placements in IT and core.",
    careers: ["SDE", "IT", "Core Engg", "ML"]
  },

  // ── IIT Gandhinagar ──
  {
    id: "iitgn_cs", inst: "IIT Gandhinagar", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Gujarat",
    ranks: [1250, 1316, 1372, 1424, 1492, 1447, 1490, 1444, 1486, 1470, 1435, 1395, 1442, 1428, 1405],
    avgPkg: 14, maxPkg: 125, growth: 9, global: 9, seats: 65,
    desc: "Liberal arts + engineering model. Strong innovation culture.",
    careers: ["SDE", "Design Engineer", "Research", "Startup"]
  },

  // ── IIT Tirupati ──
  {
    id: "iittirupati_cs", inst: "IIT Tirupati", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Andhra Pradesh",
    ranks: [null, null, null, null, 2800, 2714, 2796, 2710, 2780, 2755, 2692, 2618, 2710, 2685, 2645],
    avgPkg: 10, maxPkg: 80, growth: 7, global: 7, seats: 60,
    desc: "New IIT in AP. Growing tech placement record.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── IIT Dhanbad (ISM) ──
  {
    id: "iitism_cs", inst: "IIT (ISM) Dhanbad", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Jharkhand",
    ranks: [1380, 1452, 1513, 1570, 1645, 1595, 1642, 1592, 1638, 1622, 1583, 1539, 1590, 1573, 1549],
    avgPkg: 13, maxPkg: 115, growth: 8, global: 7, seats: 95,
    desc: "Legacy ISM with strong mining and CS culture.",
    careers: ["SDE", "IT", "Mining Tech", "Core Engg"]
  },
  {
    id: "iitism_mining", inst: "IIT (ISM) Dhanbad", branch: "Mining Engineering", code: "MN", type: "IIT", exam: "Advanced", state: "Jharkhand",
    ranks: [6500, 6842, 7142, 7418, 7768, 7528, 7748, 7510, 7718, 7645, 7472, 7268, 7508, 7445, 7332],
    avgPkg: 7, maxPkg: 45, growth: 5, global: 6, seats: 65,
    desc: "India's top mining engineering program. CIL/NMDC PSU track.",
    careers: ["CIL/NMDC PSU", "Mine Safety", "Mineral Exploration", "GATE → M.Tech"]
  },

  // ── IIT Palakkad ──
  {
    id: "iitpkd_cs", inst: "IIT Palakkad", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Kerala",
    ranks: [null, null, null, null, null, 3100, 3192, 3096, 3172, 3142, 3072, 2988, 3088, 3058, 3012],
    avgPkg: 10, maxPkg: 80, growth: 7, global: 7, seats: 60,
    desc: "Kerala's IIT. Sustainable campus. Growing CS cohort.",
    careers: ["SDE", "IT", "ML", "Research"]
  },

  // ── IIT Jammu ──
  {
    id: "iitjammu_cs", inst: "IIT Jammu", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Jammu & Kashmir",
    ranks: [null, null, null, null, null, null, null, 3850, 3949, 3912, 3825, 3718, 3848, 3812, 3758],
    avgPkg: 9, maxPkg: 70, growth: 7, global: 6, seats: 60,
    desc: "J&K's premier tech institute. Growing infrastructure and placements.",
    careers: ["SDE", "IT", "Core Engg", "Research"]
  },

  // ── IIT Dharwad ──
  {
    id: "iitdwd_cs", inst: "IIT Dharwad", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Karnataka",
    ranks: [null, null, null, null, null, null, null, null, 4150, 4112, 4025, 3912, 4048, 4012, 3955],
    avgPkg: 9, maxPkg: 70, growth: 7, global: 7, seats: 55,
    desc: "Karnataka IIT near Hubli. Agri-tech and AI research focus.",
    careers: ["SDE", "IT", "AgriTech", "Core"]
  },

  // ── IIT Bhilai ──
  {
    id: "iitbhilai_cs", inst: "IIT Bhilai", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Chhattisgarh",
    ranks: [null, null, null, null, null, null, null, null, 4450, 4408, 4315, 4195, 4345, 4308, 4248],
    avgPkg: 9, maxPkg: 65, growth: 6, global: 6, seats: 55,
    desc: "CG's IIT. Steel city advantage. Growing tech placements.",
    careers: ["SDE", "IT", "Core Engg", "Steel/Mfg"]
  },

  // ── IIT Goa ──
  {
    id: "iitgoa_cs", inst: "IIT Goa", branch: "Computer Science", code: "CS", type: "IIT", exam: "Advanced", state: "Goa",
    ranks: [null, null, null, null, null, null, null, null, 3950, 3912, 3828, 3718, 3848, 3812, 3758],
    avgPkg: 9, maxPkg: 70, growth: 7, global: 8, seats: 55,
    desc: "Coastal IIT. Tourism + tech synergy. Growing startup ecosystem.",
    careers: ["SDE", "IT", "Tourism Tech", "Research"]
  },

  // ══════════════════════════════════════════
  // NITs — JEE Mains CRL Closing Ranks
  // ══════════════════════════════════════════

  // ── NIT Trichy ──
  {
    id: "nitt_cs", inst: "NIT Trichy", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [789, 842, 895, 941, 998, 958, 995, 954, 985, 971, 942, 905, 948, 932, 908],
    avgPkg: 14, maxPkg: 80, growth: 9, global: 9, seats: 120,
    desc: "Best NIT for CS. Consistent FAANG/product placements. Strong alumni.",
    careers: ["SDE at Amazon/Google", "PM", "Startup", "ML Engineer"]
  },
  {
    id: "nitt_ee", inst: "NIT Trichy", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [4820, 5115, 5410, 5694, 5985, 5761, 5948, 5728, 5891, 5821, 5645, 5425, 5712, 5648, 5524],
    avgPkg: 8, maxPkg: 40, growth: 7, global: 7, seats: 125,
    desc: "PSU track (NTPC/PGCIL). Strong GATE coaching.",
    careers: ["NTPC/PGCIL", "VLSI Design", "Power Systems", "GATE M.Tech"]
  },
  {
    id: "nitt_me", inst: "NIT Trichy", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [7215, 7648, 8095, 8512, 8941, 8598, 8875, 8541, 8812, 8724, 8465, 8121, 8548, 8448, 8265],
    avgPkg: 6, maxPkg: 35, growth: 6, global: 6, seats: 120,
    desc: "Strong manufacturing and auto sector. GATE to IIT M.Tech.",
    careers: ["Auto Design", "BHEL/SAIL PSU", "Robotics", "GATE → IIT M.Tech"]
  },
  {
    id: "nitt_ce", inst: "NIT Trichy", branch: "Civil Engineering", code: "CE", type: "NIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [9845, 10412, 11008, 11564, 12145, 11682, 12048, 11598, 11952, 11812, 11452, 10978, 11598, 11452, 11185],
    avgPkg: 5, maxPkg: 25, growth: 5, global: 5, seats: 120,
    desc: "Infra, smart cities. IES and government dominant track.",
    careers: ["IES Civil", "PWD/NHAI", "Structural Design", "Urban Planning"]
  },

  // ── NIT Warangal ──
  {
    id: "nitw_cs", inst: "NIT Warangal", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Telangana",
    ranks: [1120, 1185, 1248, 1302, 1368, 1321, 1365, 1318, 1358, 1341, 1298, 1248, 1312, 1295, 1268],
    avgPkg: 12, maxPkg: 70, growth: 9, global: 8, seats: 115,
    desc: "Top CS NIT in Telangana. Hyderabad location advantage.",
    careers: ["SDE Tier-1", "IT", "ML", "Startup"]
  },
  {
    id: "nitw_ee", inst: "NIT Warangal", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Telangana",
    ranks: [5800, 6148, 6498, 6828, 7178, 6908, 7128, 6888, 7088, 7012, 6812, 6548, 6892, 6812, 6672],
    avgPkg: 7, maxPkg: 35, growth: 7, global: 7, seats: 120,
    desc: "Power, VLSI. Strong PSU and GATE track.",
    careers: ["Power Systems", "VLSI", "PSU", "GATE M.Tech"]
  },
  {
    id: "nitw_me", inst: "NIT Warangal", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Telangana",
    ranks: [9500, 10058, 10618, 11148, 11708, 11255, 11618, 11205, 11548, 11418, 11082, 10642, 11218, 11092, 10858],
    avgPkg: 6, maxPkg: 30, growth: 6, global: 6, seats: 120,
    desc: "Core manufacturing, auto. GATE prep strong.",
    careers: ["Auto Engg", "Manufacturing", "PSU", "GATE → IIT"]
  },
  {
    id: "nitw_ece", inst: "NIT Warangal", branch: "Electronics & Comm.", code: "ECE", type: "NIT", exam: "Mains", state: "Telangana",
    ranks: [5215, 5512, 5821, 6118, 6432, 6185, 6385, 6148, 6312, 6245, 6058, 5812, 6118, 6045, 5912],
    avgPkg: 7, maxPkg: 35, growth: 7, global: 7, seats: 110,
    desc: "Hybrid hardware/software. VLSI and embedded track.",
    careers: ["Semiconductor", "Embedded Systems", "Telecom", "IT (cross-domain)"]
  },

  // ── NIT Surathkal ──
  {
    id: "nitk_cs", inst: "NIT Surathkal", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Karnataka",
    ranks: [1458, 1545, 1632, 1712, 1802, 1734, 1792, 1726, 1782, 1762, 1708, 1641, 1728, 1705, 1665],
    avgPkg: 13, maxPkg: 75, growth: 9, global: 8, seats: 110,
    desc: "South Karnataka's top NIT. Strong IT and product placements.",
    careers: ["SDE Tier-1", "Startup", "DevOps", "ML"]
  },
  {
    id: "nitk_ee", inst: "NIT Surathkal", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Karnataka",
    ranks: [6800, 7198, 7598, 7978, 8378, 8055, 8312, 8032, 8268, 8175, 7942, 7625, 8048, 7962, 7788],
    avgPkg: 7, maxPkg: 32, growth: 7, global: 7, seats: 115,
    desc: "Power, VLSI. Mangalore port industry connections.",
    careers: ["Power Systems", "VLSI", "PSU", "IT cross-domain"]
  },
  {
    id: "nitk_me", inst: "NIT Surathkal", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Karnataka",
    ranks: [11200, 11858, 12518, 13148, 13808, 13278, 13692, 13245, 13612, 13468, 13082, 12552, 13238, 13095, 12812],
    avgPkg: 6, maxPkg: 28, growth: 6, global: 6, seats: 115,
    desc: "Marine and manufacturing engineering. GATE track.",
    careers: ["Marine Engg", "Auto Design", "PSU", "GATE → M.Tech"]
  },

  // ── NIT Calicut ──
  {
    id: "nitc_cs", inst: "NIT Calicut", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Kerala",
    ranks: [2185, 2312, 2441, 2558, 2692, 2589, 2678, 2582, 2658, 2624, 2548, 2445, 2578, 2545, 2485],
    avgPkg: 11, maxPkg: 65, growth: 8, global: 8, seats: 105,
    desc: "Kerala's top NIT. Strong placement in IT and product companies.",
    careers: ["SDE", "Product", "IT Consultant", "Startup"]
  },
  {
    id: "nitc_ee", inst: "NIT Calicut", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Kerala",
    ranks: [8500, 8998, 9498, 9978, 10478, 10075, 10392, 10045, 10318, 10208, 9918, 9528, 10068, 9955, 9742],
    avgPkg: 7, maxPkg: 30, growth: 6, global: 7, seats: 110,
    desc: "Power systems and embedded. Gulf PSU placements strong.",
    careers: ["PSU", "Power Systems", "Gulf Jobs", "GATE M.Tech"]
  },
  {
    id: "nitc_me", inst: "NIT Calicut", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Kerala",
    ranks: [13200, 13962, 14742, 15492, 16248, 15618, 16122, 15588, 16022, 15848, 15388, 14782, 15618, 15462, 15132],
    avgPkg: 5, maxPkg: 25, growth: 5, global: 6, seats: 110,
    desc: "Manufacture, thermal. GATE track. Gulf job pipeline.",
    careers: ["Gulf Manufacturing", "Auto Engg", "PSU", "GATE → IIT"]
  },

  // ── NIT Rourkela ──
  {
    id: "nitr_cs", inst: "NIT Rourkela", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Odisha",
    ranks: [2850, 3018, 3188, 3348, 3518, 3384, 3492, 3372, 3468, 3428, 3328, 3195, 3362, 3325, 3252],
    avgPkg: 10, maxPkg: 55, growth: 8, global: 7, seats: 115,
    desc: "Strong IT placements. Steel city tech culture.",
    careers: ["SDE", "IT", "ML", "Core Engg"]
  },
  {
    id: "nitr_ee", inst: "NIT Rourkela", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Odisha",
    ranks: [9800, 10378, 10958, 11508, 12088, 11618, 11988, 11578, 11912, 11785, 11448, 10988, 11598, 11468, 11218],
    avgPkg: 6, maxPkg: 28, growth: 6, global: 6, seats: 120,
    desc: "Power electronics, control. GATE good track.",
    careers: ["PSU", "Power Systems", "Embedded", "GATE M.Tech"]
  },
  {
    id: "nitr_me", inst: "NIT Rourkela", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Odisha",
    ranks: [14500, 15348, 16218, 17058, 17908, 17218, 17778, 17188, 17688, 17498, 17008, 16342, 17258, 17095, 16718],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 120,
    desc: "Steel/metallurgy proximity. Core manufacturing track.",
    careers: ["SAIL/Tata Steel", "Auto Engg", "PSU", "GATE → M.Tech"]
  },

  // ── NIT Allahabad ──
  {
    id: "mnnit_cs", inst: "MNNIT Allahabad", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Uttar Pradesh",
    ranks: [3200, 3382, 3562, 3732, 3918, 3768, 3888, 3755, 3868, 3828, 3722, 3575, 3768, 3728, 3648],
    avgPkg: 10, maxPkg: 55, growth: 8, global: 7, seats: 100,
    desc: "UP's premier NIT. Growing CS and IT placements.",
    careers: ["SDE", "IT", "ML", "Core Engg"]
  },
  {
    id: "mnnit_ee", inst: "MNNIT Allahabad", branch: "Electrical Engineering", code: "EE", type: "NIT", exam: "Mains", state: "Uttar Pradesh",
    ranks: [10500, 11108, 11718, 12298, 12898, 12398, 12798, 12368, 12748, 12608, 12258, 11762, 12418, 12278, 12018],
    avgPkg: 6, maxPkg: 28, growth: 6, global: 6, seats: 115,
    desc: "Power, VLSI. PSU and GATE dominant.",
    careers: ["PSU (NTPC/BHEL)", "VLSI", "Power Systems", "GATE M.Tech"]
  },

  // ── NIT Nagpur ──
  {
    id: "vnit_cs", inst: "VNIT Nagpur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Maharashtra",
    ranks: [3850, 4072, 4295, 4508, 4728, 4548, 4698, 4532, 4668, 4618, 4488, 4318, 4558, 4505, 4405],
    avgPkg: 9, maxPkg: 50, growth: 8, global: 7, seats: 105,
    desc: "Central India's top NIT. Nagpur logistics hub advantage.",
    careers: ["SDE", "IT", "ML", "Core"]
  },
  {
    id: "vnit_me", inst: "VNIT Nagpur", branch: "Mechanical Engineering", code: "ME", type: "NIT", exam: "Mains", state: "Maharashtra",
    ranks: [15500, 16388, 17298, 18178, 19068, 18338, 18928, 18298, 18848, 18648, 18128, 17408, 18378, 18198, 17808],
    avgPkg: 5, maxPkg: 23, growth: 5, global: 5, seats: 120,
    desc: "Auto and manufacturing track. Nagpur industry connect.",
    careers: ["Auto Engg", "Manufacturing", "PSU", "GATE → M.Tech"]
  },

  // ── NIT Jaipur ──
  {
    id: "mnit_cs", inst: "MNIT Jaipur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Rajasthan",
    ranks: [4200, 4442, 4685, 4918, 5158, 4958, 5122, 4942, 5098, 5042, 4898, 4705, 4962, 4912, 4805],
    avgPkg: 9, maxPkg: 50, growth: 8, global: 7, seats: 100,
    desc: "Rajasthan's top NIT. Jaipur startup ecosystem advantage.",
    careers: ["SDE", "IT", "ML", "Startup"]
  },

  // ── NIT Bhopal ──
  {
    id: "manit_cs", inst: "MANIT Bhopal", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Madhya Pradesh",
    ranks: [4800, 5075, 5352, 5618, 5888, 5662, 5848, 5645, 5828, 5762, 5598, 5378, 5678, 5618, 5498],
    avgPkg: 8, maxPkg: 45, growth: 7, global: 7, seats: 100,
    desc: "MP's premier NIT. Bhopal tech corridor.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Kurukshetra ──
  {
    id: "nitkkr_cs", inst: "NIT Kurukshetra", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Haryana",
    ranks: [5200, 5498, 5798, 6088, 6388, 6142, 6348, 6128, 6318, 6248, 6072, 5828, 6148, 6082, 5948],
    avgPkg: 8, maxPkg: 45, growth: 7, global: 7, seats: 105,
    desc: "Haryana NIT near Delhi-NCR. IT placements decent.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Durgapur ──
  {
    id: "nitdgp_cs", inst: "NIT Durgapur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "West Bengal",
    ranks: [5800, 6138, 6478, 6808, 7148, 6872, 7102, 6852, 7072, 6992, 6798, 6528, 6882, 6812, 6668],
    avgPkg: 8, maxPkg: 42, growth: 7, global: 7, seats: 105,
    desc: "WB's NIT. Kolkata proximity. IT placements growing.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Silchar ──
  {
    id: "nits_cs", inst: "NIT Silchar", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Assam",
    ranks: [7500, 7938, 8378, 8808, 9248, 8898, 9188, 8878, 9158, 9058, 8808, 8458, 8928, 8838, 8658],
    avgPkg: 7, maxPkg: 38, growth: 7, global: 6, seats: 100,
    desc: "North-east NIT. Growing IT pipeline to Bengaluru/Hyderabad.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Hamirpur ──
  {
    id: "nith_cs", inst: "NIT Hamirpur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Himachal Pradesh",
    ranks: [8200, 8678, 9158, 9628, 10108, 9718, 10038, 9698, 9998, 9888, 9608, 9228, 9728, 9628, 9418],
    avgPkg: 7, maxPkg: 36, growth: 7, global: 6, seats: 90,
    desc: "Hill campus. IT placements improving steadily.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Jalandhar ──
  {
    id: "nitj_cs", inst: "NIT Jalandhar", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Punjab",
    ranks: [6500, 6878, 7258, 7628, 8008, 7698, 7958, 7678, 7928, 7838, 7618, 7318, 7728, 7648, 7488],
    avgPkg: 7, maxPkg: 38, growth: 7, global: 7, seats: 100,
    desc: "Punjab NIT. IT placements to NCR corridor.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Meghalaya ──
  {
    id: "nitm_cs", inst: "NIT Meghalaya", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Meghalaya",
    ranks: [null, null, 12500, 13152, 13808, 13278, 13712, 13248, 13638, 13498, 13128, 12598, 13308, 13168, 12878],
    avgPkg: 5, maxPkg: 25, growth: 5, global: 5, seats: 60,
    desc: "North-east NIT. Growing IT access for remote region.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Srinagar ──
  {
    id: "nitsri_cs", inst: "NIT Srinagar", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "J&K",
    ranks: [11000, 11638, 12278, 12898, 13538, 13008, 13438, 12988, 13378, 13238, 12868, 12348, 13038, 12898, 12618],
    avgPkg: 5, maxPkg: 25, growth: 5, global: 5, seats: 80,
    desc: "J&K's NIT. Growing placements to NCR/Pune.",
    careers: ["SDE", "IT", "Core", "Govt"]
  },

  // ── NIT Raipur ──
  {
    id: "nitraipur_cs", inst: "NIT Raipur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Chhattisgarh",
    ranks: [9000, 9528, 10058, 10578, 11108, 10678, 11028, 10648, 10988, 10868, 10558, 10128, 10718, 10598, 10368],
    avgPkg: 6, maxPkg: 30, growth: 6, global: 6, seats: 90,
    desc: "CG NIT. Steel/mining region. IT placement growing.",
    careers: ["SDE", "IT", "Mining Tech", "Core"]
  },

  // ── NIT Goa ──
  {
    id: "nitgoa_cs", inst: "NIT Goa", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Goa",
    ranks: [6200, 6558, 6918, 7268, 7628, 7338, 7578, 7318, 7558, 7478, 7268, 6978, 7358, 7278, 7128],
    avgPkg: 8, maxPkg: 42, growth: 7, global: 8, seats: 60,
    desc: "Coastal NIT. Tourism tech + IT. Good placement in Pune/Bangalore.",
    careers: ["SDE", "IT", "Tourism Tech", "Core"]
  },

  // ── NIT Agartala ──
  {
    id: "nita_cs", inst: "NIT Agartala", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Tripura",
    ranks: [12000, 12698, 13398, 14078, 14758, 14188, 14658, 14158, 14588, 14428, 14018, 13458, 14218, 14078, 13778],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 85,
    desc: "NE NIT. IT and govt sector placements.",
    careers: ["SDE", "IT", "Govt", "Core"]
  },

  // ── NIT Andhra Pradesh ──
  {
    id: "nitap_cs", inst: "NIT Andhra Pradesh", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Andhra Pradesh",
    ranks: [null, null, null, null, null, 12000, 12398, 11988, 12348, 12208, 11858, 11388, 12058, 11938, 11678],
    avgPkg: 6, maxPkg: 30, growth: 7, global: 6, seats: 90,
    desc: "New NIT in AP. Growing placements in Hyderabad corridor.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Manipur ──
  {
    id: "nitmanipur_cs", inst: "NIT Manipur", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Manipur",
    ranks: [null, null, 14800, 15572, 16348, 15718, 16228, 15688, 16158, 16008, 15578, 14958, 15798, 15648, 15318],
    avgPkg: 4, maxPkg: 20, growth: 5, global: 4, seats: 60,
    desc: "North-east NIT. Govt/IT placements for NE region.",
    careers: ["IT", "Govt Sector", "Core", "ML Entry"]
  },

  // ── NIT Mizoram ──
  {
    id: "nitmizo_cs", inst: "NIT Mizoram", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Mizoram",
    ranks: [null, null, null, 16000, 16798, 16168, 16688, 16148, 16638, 16488, 16058, 15418, 16298, 16148, 15818],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 55,
    desc: "NE NIT. Limited placements but growing.",
    careers: ["IT", "Govt", "Core", "ML Entry"]
  },

  // ── NIT Nagaland ──
  {
    id: "nitngl_cs", inst: "NIT Nagaland", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Nagaland",
    ranks: [null, null, null, null, 17500, 16838, 17388, 16818, 17338, 17168, 16718, 16058, 16988, 16838, 16488],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 50,
    desc: "NE NIT. Govt/IT pipeline.",
    careers: ["IT", "Govt", "Core", "ML Entry"]
  },

  // ── NIT Arunachal Pradesh ──
  {
    id: "nitap2_cs", inst: "NIT Arunachal Pradesh", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Arunachal Pradesh",
    ranks: [null, null, null, null, 18000, 17318, 17878, 17308, 17838, 17658, 17208, 16528, 17468, 17318, 16958],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 50,
    desc: "Easternmost NIT. Govt and IT for NE region.",
    careers: ["IT", "Govt", "Core", "ML Entry"]
  },

  // ── NIT Puducherry ──
  {
    id: "nitpy_cs", inst: "NIT Puducherry", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Puducherry",
    ranks: [null, null, 11000, 11578, 12158, 11698, 12088, 11678, 12038, 11908, 11578, 11118, 11748, 11628, 11378],
    avgPkg: 5, maxPkg: 26, growth: 6, global: 6, seats: 60,
    desc: "South NIT near Chennai. Growing IT placements.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── NIT Delhi ──
  {
    id: "nitdelhi_cs", inst: "NIT Delhi", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Delhi",
    ranks: [null, null, null, null, null, 4800, 4968, 4812, 4968, 4908, 4768, 4578, 4828, 4778, 4678],
    avgPkg: 9, maxPkg: 50, growth: 8, global: 8, seats: 70,
    desc: "Delhi NIT. Capital advantage. Strong IT placements.",
    careers: ["SDE", "IT", "ML", "Startup"]
  },

  // ── NIT Sikkim ──
  {
    id: "nitsikkim_cs", inst: "NIT Sikkim", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Sikkim",
    ranks: [null, null, null, null, null, null, 19000, 18418, 18968, 18788, 18318, 17578, 18598, 18448, 18068],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 50,
    desc: "NE NIT. Govt and IT entry-level.",
    careers: ["IT", "Govt", "Core", "ML Entry"]
  },

  // ── NIT Uttarakhand ──
  {
    id: "nituk_cs", inst: "NIT Uttarakhand", branch: "Computer Science", code: "CS", type: "NIT", exam: "Mains", state: "Uttarakhand",
    ranks: [null, null, null, null, null, null, 16000, 15518, 15988, 15838, 15418, 14788, 15618, 15468, 15128],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 60,
    desc: "Growing NIT. IT placements to NCR.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ══════════════════════════════════════════
  // IIITs — JEE Mains CRL Closing Ranks
  // ══════════════════════════════════════════

  // ── IIIT Hyderabad ──
  {
    id: "iiith_cs", inst: "IIIT Hyderabad", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Telangana",
    ranks: [1285, 1362, 1438, 1512, 1592, 1531, 1582, 1524, 1571, 1552, 1504, 1445, 1521, 1498, 1462],
    avgPkg: 16, maxPkg: 100, growth: 10, global: 10, seats: 80,
    desc: "Research-first IIIT. Strong MS/PhD pipeline globally. Deep tech culture.",
    careers: ["AI Researcher", "ML Engineer", "MS at CMU/Stanford", "Deep Tech Startup"]
  },
  {
    id: "iiith_ece", inst: "IIIT Hyderabad", branch: "Electronics & Comm.", code: "ECE", type: "IIIT", exam: "Mains", state: "Telangana",
    ranks: [3215, 3408, 3601, 3782, 3978, 3824, 3958, 3811, 3921, 3878, 3758, 3608, 3801, 3748, 3665],
    avgPkg: 12, maxPkg: 70, growth: 9, global: 9, seats: 60,
    desc: "Hybrid hardware/software. VLSI and embedded systems research.",
    careers: ["VLSI at Qualcomm", "Embedded ML", "Research", "Semiconductor"]
  },

  // ── IIIT Allahabad ──
  {
    id: "iiita_it", inst: "IIIT Allahabad", branch: "IT (CS equiv.)", code: "IT", type: "IIIT", exam: "Mains", state: "Uttar Pradesh",
    ranks: [2845, 3012, 3181, 3342, 3512, 3378, 3492, 3362, 3462, 3418, 3312, 3182, 3348, 3295, 3218],
    avgPkg: 10, maxPkg: 60, growth: 8, global: 8, seats: 90,
    desc: "One of India's oldest IIITs. Strong placement in IT and product.",
    careers: ["SDE", "IT Consultant", "Product", "Startup"]
  },

  // ── IIIT Delhi ──
  {
    id: "iiitd_cs", inst: "IIIT Delhi", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Delhi",
    ranks: [null, null, null, null, 2200, 2118, 2188, 2112, 2178, 2155, 2098, 2015, 2128, 2105, 2062],
    avgPkg: 14, maxPkg: 90, growth: 9, global: 9, seats: 75,
    desc: "Research-oriented Delhi IIIT. Strong AI/ML focus. Capital advantage.",
    careers: ["SDE", "ML Research", "AI", "Startup"]
  },

  // ── IIIT Bangalore ──
  {
    id: "iiitb_cs", inst: "IIIT Bangalore", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Karnataka",
    ranks: [null, null, 3500, 3682, 3868, 3724, 3848, 3718, 3828, 3788, 3682, 3535, 3728, 3688, 3612],
    avgPkg: 12, maxPkg: 70, growth: 9, global: 9, seats: 60,
    desc: "Bengaluru ecosystem advantage. Strong industry and startup connect.",
    careers: ["SDE", "Startup", "ML", "Product"]
  },

  // ── IIIT Pune ──
  {
    id: "iiitpune_cs", inst: "IIIT Pune", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Maharashtra",
    ranks: [null, null, null, 5200, 5462, 5252, 5428, 5238, 5408, 5352, 5198, 4988, 5262, 5208, 5098],
    avgPkg: 9, maxPkg: 50, growth: 8, global: 7, seats: 60,
    desc: "Pune tech corridor. Good IT and product placements.",
    careers: ["SDE", "IT", "ML", "Startup"]
  },

  // ── IIIT Gwalior ──
  {
    id: "iiitm_cs", inst: "ABV IIITM Gwalior", branch: "IT (CS equiv.)", code: "IT", type: "IIIT", exam: "Mains", state: "Madhya Pradesh",
    ranks: [3800, 4018, 4238, 4448, 4668, 4488, 4638, 4478, 4618, 4568, 4438, 4258, 4498, 4448, 4348],
    avgPkg: 9, maxPkg: 50, growth: 7, global: 7, seats: 85,
    desc: "Heritage IIIT. MP tech hub. IT and core placements.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── IIIT Kancheepuram ──
  {
    id: "iiitdm_knc", inst: "IIITDM Kancheepuram", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [null, null, null, 5800, 6098, 5862, 6058, 5852, 6028, 5968, 5798, 5568, 5882, 5822, 5698],
    avgPkg: 8, maxPkg: 42, growth: 7, global: 7, seats: 60,
    desc: "Design + CS. Chennai proximity. Core-CS integration.",
    careers: ["SDE", "Product Design", "IT", "Core Engg"]
  },

  // ── IIIT Jabalpur ──
  {
    id: "iiitdm_jbp", inst: "IIITDM Jabalpur", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Madhya Pradesh",
    ranks: [null, null, null, null, 6800, 6548, 6762, 6538, 6738, 6668, 6488, 6238, 6582, 6518, 6378],
    avgPkg: 7, maxPkg: 38, growth: 7, global: 6, seats: 60,
    desc: "Design + manufacturing focus. Growing IT placements.",
    careers: ["SDE", "Product Design", "IT", "Manufacturing Tech"]
  },

  // ── IIIT Vadodara ──
  {
    id: "iiitv_cs", inst: "IIIT Vadodara", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Gujarat",
    ranks: [null, null, null, null, null, 7500, 7748, 7508, 7738, 7658, 7448, 7158, 7568, 7498, 7328],
    avgPkg: 7, maxPkg: 36, growth: 7, global: 7, seats: 60,
    desc: "Gujarat IIIT. Vadodara industrial belt. Growing IT placements.",
    careers: ["SDE", "IT", "Core", "Startup"]
  },

  // ── IIIT Trichy ──
  {
    id: "iiittn_cs", inst: "IIIT Trichy", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Tamil Nadu",
    ranks: [null, null, null, null, null, null, 8500, 8248, 8498, 8408, 8188, 7868, 8298, 8218, 8038],
    avgPkg: 7, maxPkg: 35, growth: 7, global: 6, seats: 60,
    desc: "TN IIIT. Chennai ecosystem access. Growing placements.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── IIIT Lucknow ──
  {
    id: "iiitlko_cs", inst: "IIIT Lucknow", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Uttar Pradesh",
    ranks: [null, null, null, null, null, null, 9200, 8928, 9188, 9098, 8848, 8508, 8988, 8908, 8718],
    avgPkg: 6, maxPkg: 32, growth: 7, global: 6, seats: 60,
    desc: "UP capital IIIT. Lucknow tech ecosystem. Growing.",
    careers: ["SDE", "IT", "Govt Tech", "Core"]
  },

  // ── IIIT Sri City ──
  {
    id: "iiit_sricity", inst: "IIIT Sri City", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Andhra Pradesh",
    ranks: [null, null, null, null, null, null, null, 9800, 10068, 9968, 9698, 9318, 9838, 9748, 9538],
    avgPkg: 6, maxPkg: 30, growth: 7, global: 6, seats: 60,
    desc: "AP IIIT. Growing Chennai/Hyderabad corridor placements.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  // ── IIIT Una ──
  {
    id: "iiituna_cs", inst: "IIIT Una", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Himachal Pradesh",
    ranks: [null, null, null, null, null, null, null, 10800, 11098, 10988, 10688, 10268, 10858, 10758, 10528],
    avgPkg: 6, maxPkg: 28, growth: 6, global: 6, seats: 55,
    desc: "HP IIIT. Hill campus. Growing IT placements.",
    careers: ["SDE", "IT", "Core", "ML Entry"]
  },

  // ── IIIT Sonepat ──
  {
    id: "iiiths_cs", inst: "IIIT Sonepat (TiHAN)", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Haryana",
    ranks: [null, null, null, null, null, null, null, null, 11500, 11388, 11088, 10648, 11238, 11138, 10898],
    avgPkg: 6, maxPkg: 28, growth: 6, global: 6, seats: 55,
    desc: "Haryana IIIT near Delhi. NCR IT pipeline.",
    careers: ["SDE", "IT", "Core", "ML Entry"]
  },

  // ── IIIT Kota ──
  {
    id: "iiitk_cs", inst: "IIIT Kota", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Rajasthan",
    ranks: [null, null, null, null, null, null, null, null, 12200, 12088, 11768, 11298, 11948, 11838, 11588],
    avgPkg: 5, maxPkg: 26, growth: 6, global: 5, seats: 55,
    desc: "Rajasthan IIIT near coaching hub. Growing IT placements.",
    careers: ["SDE", "IT", "Core", "EdTech"]
  },

  // ── IIIT Bhagalpur ──
  {
    id: "iiitbhg_cs", inst: "IIIT Bhagalpur", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Bihar",
    ranks: [null, null, null, null, null, null, null, null, null, 14000, 13648, 13108, 13838, 13718, 13428],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 55,
    desc: "Bihar IIIT. Growing tech ecosystem.",
    careers: ["IT", "SDE Entry", "Govt Tech", "Core"]
  },

  // ── IIIT Bhopal ──
  {
    id: "iiitbpl_cs", inst: "IIIT Bhopal", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Madhya Pradesh",
    ranks: [null, null, null, null, null, null, null, null, null, 13200, 12868, 12348, 13038, 12918, 12638],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 55,
    desc: "MP IIIT. Bhopal tech corridor.",
    careers: ["IT", "SDE Entry", "Core", "ML Entry"]
  },

  // ── IIIT Surat ──
  {
    id: "iiitvs_cs", inst: "IIIT Surat", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Gujarat",
    ranks: [null, null, null, null, null, null, null, null, null, null, 14200, 13658, 14438, 14298, 13998],
    avgPkg: 5, maxPkg: 22, growth: 5, global: 5, seats: 50,
    desc: "Gujarat IIIT. Surat textile-tech. Growing IT.",
    careers: ["IT", "SDE Entry", "Core", "ML Entry"]
  },

  // ── IIIT Raichur ──
  {
    id: "iiitrc_cs", inst: "IIIT Raichur", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Karnataka",
    ranks: [null, null, null, null, null, null, null, null, null, null, 15200, 14618, 15438, 15298, 14978],
    avgPkg: 4, maxPkg: 20, growth: 5, global: 5, seats: 50,
    desc: "Karnataka IIIT. Growing access for north Karnataka.",
    careers: ["IT", "SDE Entry", "Core", "Govt Tech"]
  },

  // ── IIIT Kalyani ──
  {
    id: "iiitk2_cs", inst: "IIIT Kalyani", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "West Bengal",
    ranks: [null, null, null, null, null, null, null, null, null, null, 14800, 14238, 15038, 14898, 14588],
    avgPkg: 5, maxPkg: 22, growth: 5, global: 5, seats: 50,
    desc: "WB IIIT near Kolkata. Growing IT.",
    careers: ["IT", "SDE Entry", "Core", "ML Entry"]
  },

  // ── IIIT Dharwad ──
  {
    id: "iiitdwd_cs", inst: "IIIT Dharwad", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Karnataka",
    ranks: [null, null, null, null, null, null, null, null, null, null, null, 15200, 16038, 15898, 15568],
    avgPkg: 4, maxPkg: 20, growth: 5, global: 5, seats: 50,
    desc: "North Karnataka IIIT. Growing tech access.",
    careers: ["IT", "SDE Entry", "Core", "Govt Tech"]
  },

  // ── IIIT Nagpur ──
  {
    id: "iiitn_cs", inst: "IIIT Nagpur", branch: "CS Engineering", code: "CS", type: "IIIT", exam: "Mains", state: "Maharashtra",
    ranks: [null, null, null, null, null, null, null, null, null, null, null, 13800, 14638, 14498, 14188],
    avgPkg: 5, maxPkg: 24, growth: 6, global: 6, seats: 55,
    desc: "Maharashtra IIIT in central India. Growing.",
    careers: ["SDE", "IT", "Core", "ML Entry"]
  },

  // ══════════════════════════════════════════
  // GFTIs — JEE Mains CRL Closing Ranks
  // ══════════════════════════════════════════

  {
    id: "iiest_cs", inst: "IIEST Shibpur", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "West Bengal",
    ranks: [9500, 10058, 10618, 11158, 11718, 11268, 11638, 11238, 11608, 11488, 11168, 10728, 11318, 11198, 10958],
    avgPkg: 6, maxPkg: 30, growth: 7, global: 6, seats: 60,
    desc: "One of India's oldest engineering colleges (1856). Growing IT placements.",
    careers: ["SDE", "IT", "Core Engg", "Govt"]
  },
  {
    id: "iiest_me", inst: "IIEST Shibpur", branch: "Mechanical Engineering", code: "ME", type: "GFTI", exam: "Mains", state: "West Bengal",
    ranks: [20500, 21698, 22898, 24078, 25268, 24278, 25068, 24248, 25028, 24788, 24128, 23178, 24538, 24318, 23808],
    avgPkg: 5, maxPkg: 22, growth: 5, global: 5, seats: 70,
    desc: "Heritage mech dept. Core manufacturing. GATE track.",
    careers: ["Manufacturing", "PSU", "Auto Engg", "GATE → M.Tech"]
  },

  {
    id: "nifft_cs", inst: "NIFFT Ranchi", branch: "Production Engineering", code: "PE", type: "GFTI", exam: "Mains", state: "Jharkhand",
    ranks: [null, null, 18000, 18978, 19958, 19178, 19808, 19148, 19778, 19558, 19038, 18288, 19348, 19168, 18778],
    avgPkg: 5, maxPkg: 24, growth: 5, global: 5, seats: 60,
    desc: "Foundry and forge technology. Steel sector placements.",
    careers: ["Foundry Tech", "PSU (SAIL/TATA)", "Manufacturing", "GATE → M.Tech"]
  },

  {
    id: "bit_mesra_cs", inst: "BIT Mesra", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "Jharkhand",
    ranks: [11500, 12158, 12818, 13458, 14118, 13578, 14028, 13548, 13988, 13828, 13448, 12908, 13648, 13508, 13228],
    avgPkg: 6, maxPkg: 30, growth: 7, global: 6, seats: 65,
    desc: "Renowned private deemed university. Strong IT placements.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  {
    id: "hbtu_cs", inst: "HBTU Kanpur", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "Uttar Pradesh",
    ranks: [null, null, null, null, 16500, 15888, 16428, 15858, 16358, 16188, 15768, 15138, 16008, 15858, 15528],
    avgPkg: 5, maxPkg: 24, growth: 6, global: 5, seats: 60,
    desc: "UP GFTI. Kanpur tech corridor. Growing IT.",
    careers: ["SDE", "IT", "Core", "Govt"]
  },

  {
    id: "gsits_cs", inst: "GSITS Indore", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "Madhya Pradesh",
    ranks: [null, null, null, null, 17000, 16358, 16908, 16328, 16848, 16668, 16228, 15588, 16508, 16368, 16028],
    avgPkg: 5, maxPkg: 22, growth: 6, global: 5, seats: 60,
    desc: "MP GFTI. Indore startup ecosystem. Growing IT.",
    careers: ["SDE", "IT", "Core", "Startup"]
  },

  {
    id: "nit_agartala_cs", inst: "NIT Agartala (GFTI track)", branch: "Electronics & Comm.", code: "ECE", type: "GFTI", exam: "Mains", state: "Tripura",
    ranks: [null, null, null, 14500, 15268, 14678, 15168, 14648, 15118, 14968, 14568, 13998, 14778, 14638, 14338],
    avgPkg: 5, maxPkg: 22, growth: 5, global: 5, seats: 75,
    desc: "NE ECE track. Telecom and IT placements.",
    careers: ["Telecom", "IT", "Embedded", "Govt"]
  },

  {
    id: "coep_cs", inst: "COEP Pune", branch: "Computer Engineering", code: "CE", type: "GFTI", exam: "Mains", state: "Maharashtra",
    ranks: [null, null, null, null, null, 10800, 11168, 10818, 11148, 11028, 10748, 10318, 10908, 10818, 10588],
    avgPkg: 7, maxPkg: 38, growth: 8, global: 7, seats: 65,
    desc: "Pune's premier GFTI. Strong Pune IT industry connect.",
    careers: ["SDE", "IT", "Product", "ML"]
  },

  {
    id: "pec_cs", inst: "PEC Chandigarh", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "Punjab",
    ranks: [null, null, null, null, 15000, 14428, 14928, 14408, 14868, 14718, 14318, 13758, 14548, 14418, 14108],
    avgPkg: 6, maxPkg: 28, growth: 7, global: 6, seats: 60,
    desc: "Chandigarh's GFTI. NCR corridor placements.",
    careers: ["SDE", "IT", "Core", "Startup"]
  },

  {
    id: "thapar_cs", inst: "Thapar Patiala", branch: "Computer Engineering", code: "CE", type: "GFTI", exam: "Mains", state: "Punjab",
    ranks: [null, null, null, null, 12200, 11728, 12128, 11718, 12098, 11978, 11648, 11188, 11828, 11718, 11468],
    avgPkg: 7, maxPkg: 36, growth: 8, global: 7, seats: 120,
    desc: "Top private engineering. Strong IT pipeline to NCR/Pune.",
    careers: ["SDE", "IT", "ML", "Product"]
  },

  {
    id: "nita_ee", inst: "NIT Agartala", branch: "Electrical Engineering", code: "EE", type: "GFTI", exam: "Mains", state: "Tripura",
    ranks: [null, null, null, 25000, 26298, 25298, 26128, 25268, 26048, 25798, 25168, 24188, 25618, 25398, 24878],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 80,
    desc: "NE NIT. Power sector and govt placements.",
    careers: ["Power Systems", "Govt Sector", "PSU", "GATE → M.Tech"]
  },

  {
    id: "jntu_cs", inst: "JNTU Hyderabad", branch: "Computer Science", code: "CS", type: "GFTI", exam: "Mains", state: "Telangana",
    ranks: [null, null, null, null, null, null, null, 13800, 14248, 14108, 13748, 13218, 13988, 13848, 13548],
    avgPkg: 6, maxPkg: 30, growth: 7, global: 6, seats: 120,
    desc: "Hyderabad's GFTI. Tech city advantage.",
    careers: ["SDE", "IT", "Core", "ML"]
  },

  {
    id: "gbu_cs", inst: "Gautam Buddha University", branch: "CS Engineering", code: "CS", type: "GFTI", exam: "Mains", state: "Uttar Pradesh",
    ranks: [null, null, null, null, null, null, null, null, 18000, 17848, 17378, 16698, 17688, 17548, 17188],
    avgPkg: 4, maxPkg: 20, growth: 5, global: 5, seats: 70,
    desc: "NCR GFTI. Delhi proximity advantage.",
    careers: ["IT", "SDE Entry", "Core", "Govt"]
  },

  {
    id: "iiests_me", inst: "IIEST Shibpur", branch: "Civil Engineering", code: "CE", type: "GFTI", exam: "Mains", state: "West Bengal",
    ranks: [25000, 26458, 27918, 29358, 30808, 29628, 30668, 29608, 30528, 30228, 29468, 28318, 30018, 29778, 29188],
    avgPkg: 4, maxPkg: 18, growth: 4, global: 4, seats: 75,
    desc: "Heritage civil dept. Infra and IES track.",
    careers: ["IES Officer", "Structural Engg", "NHAI", "Urban Planning"]
  },

];

// ─────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────

const CATEGORIES = {
  general: { label: "General / OBC-NCL", factor: 1.0 },
  obc: { label: "OBC", factor: 1.35 },
  sc: { label: "SC", factor: 3.1 },
  st: { label: "ST", factor: 5.5 },
  ews: { label: "EWS", factor: 1.1 },
};

const BRANCH_OPTIONS = [
  "All", "Computer Science", "Data Science & AI", "Electrical Engineering",
  "Electronics & Comm.", "Mechanical Engineering", "Civil Engineering",
  "Chemical Engineering", "Aerospace Engineering", "Mining Engineering",
  "IT (CS equiv.)", "Computer Engineering", "Production Engineering"
];

function adjRank(entry, category) {
  const base = entry.ranks.filter(Boolean).slice(-1)[0];
  if (!base) return null;
  return Math.round(base / CATEGORIES[category].factor);
}

function chance(userRank, closing) {
  if (!closing || !userRank) return null;
  const r = Number(userRank) / closing;
  if (r <= 0.5) return 99;
  if (r <= 0.7) return 95;
  if (r <= 0.85) return 85;
  if (r <= 0.95) return 70;
  if (r <= 1.0) return 52;
  if (r <= 1.08) return 35;
  if (r <= 1.18) return 18;
  if (r <= 1.35) return 8;
  return 2;
}

function chanceColor(p) {
  if (p == null) return "#4A4E6B";
  if (p >= 70) return "#00D4AA";
  if (p >= 35) return "#F5A623";
  return "#FF6B6B";
}

function chanceBg(p) {
  if (p == null) return "transparent";
  if (p >= 70) return "rgba(0,212,170,0.1)";
  if (p >= 35) return "rgba(245,166,35,0.1)";
  return "rgba(255,107,107,0.1)";
}

function trendLabel(entry) {
  const r = entry.ranks.filter(Boolean);
  if (r.length < 4) return { label: "New", color: "#6C63FF" };
  const avg3 = r.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const avg6 = r.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  const d = ((avg3 - avg6) / avg6) * 100;
  if (d > 6) return { label: "Rising ↑", color: "#FF6B6B" };
  if (d < -6) return { label: "Easier ↓", color: "#00D4AA" };
  return { label: "Stable →", color: "#F5A623" };
}

function typeColor(type) {
  return type === "IIT" ? "#6C63FF" : type === "NIT" ? "#00D4AA" : type === "IIIT" ? "#F5A623" : "#4A9EFF";
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Inter','Segoe UI',sans-serif", background: "#0A0C1A", minHeight: "100vh", color: "#E8EAFF", fontSize: 14 },
  header: { background: "#0F1128", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  logoIcon: { width: 40, height: 40, background: "linear-gradient(135deg,#6C63FF,#00D4AA)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  tabBar: { display: "flex", gap: 0, background: "#0F1128", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px", overflowX: "auto" },
  tab: (a) => ({ padding: "12px 20px", border: "none", background: "transparent", color: a ? "#E8EAFF" : "#6B7094", fontSize: 13, fontWeight: a ? 600 : 400, cursor: "pointer", borderBottom: a ? "2px solid #6C63FF" : "2px solid transparent", fontFamily: "inherit", whiteSpace: "nowrap", transition: "color 0.2s" }),
  body: { maxWidth: 1200, margin: "0 auto", padding: "24px 18px" },
  card: { background: "#131628", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 },
  label: { fontSize: 11, color: "#6B7094", marginBottom: 4, display: "block" },
  input: { width: "100%", background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8EAFF", padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8EAFF", padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", cursor: "pointer" },
  btnP: { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 9, border: "none", background: "#6C63FF", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnO: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#E8EAFF", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  sLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4A4E6B", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 7, marginBottom: 16 },
  tag: (c, bg) => ({ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 100, background: bg, color: c, marginRight: 3, marginBottom: 2, whiteSpace: "nowrap" }),
  pill: (p) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "3px 10px", borderRadius: 100, background: chanceBg(p), color: chanceColor(p), fontSize: 11, fontWeight: 700, minWidth: 48 }),
};

// ─────────────────────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────────────────────
function ResultCard({ e, userRank, category, onClick }) {
  const closing = adjRank(e, category);
  const pct = chance(userRank, closing);
  const td = trendLabel(e);
  const tc = typeColor(e.type);
  return (
    <div onClick={() => onClick(e)} style={{ ...S.card, cursor: "pointer", transition: "border-color 0.2s,transform 0.15s", borderColor: pct >= 70 ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.08)" }}
      onMouseEnter={ev => ev.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={ev => ev.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
        <div>
          <span style={S.tag(tc, tc + "1a")}>{e.type}</span>
          <span style={S.tag(td.color, td.color + "1a")}>{td.label}</span>
          {e.state && <span style={S.tag("#9B9FC8", "rgba(255,255,255,0.06)")}>{e.state}</span>}
        </div>
        {pct !== null && <div style={S.pill(pct)}>{pct}%</div>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: "#E8EAFF", lineHeight: 1.3 }}>{e.inst}</div>
      <div style={{ fontSize: 12, color: "#6B7094", marginBottom: 11 }}>{e.branch} ({e.code})</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: pct !== null ? 10 : 0 }}>
        {[
          { v: closing ? closing.toLocaleString("en-IN") : "—", l: "2024 Cutoff", c: "#E8EAFF" },
          { v: `₹${e.avgPkg}L`, l: "Avg CTC", c: "#F5A623" },
          { v: `${e.growth}/10`, l: "Growth", c: "#00D4AA" },
        ].map(x => (
          <div key={x.l} style={{ background: "#1C1F3A", borderRadius: 7, padding: "7px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: x.c }}>{x.v}</div>
            <div style={{ fontSize: 9, color: "#6B7094", marginTop: 2 }}>{x.l}</div>
          </div>
        ))}
      </div>
      {pct !== null && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6B7094", marginBottom: 3 }}>
            <span>Admission chance</span><span style={{ color: chanceColor(pct), fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "#1C1F3A", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: chanceColor(pct), borderRadius: 3, transition: "width 0.5s" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function DetailModal({ e, category, onClose }) {
  if (!e) return null;
  const chartData = JOSAA_YEARS.map((y, i) => ({ year: y, rank: e.ranks[i] || null })).filter(d => d.rank);
  const closing = adjRank(e, category);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#131628", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 26 }} onClick={ev => ev.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <span style={S.tag(typeColor(e.type), typeColor(e.type) + "1a")}>{e.type}</span>
              <span style={S.tag("#9B9FC8", "rgba(255,255,255,0.06)")}>{e.exam}</span>
              <span style={S.tag("#9B9FC8", "rgba(255,255,255,0.06)")}>{e.state}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#E8EAFF" }}>{e.inst}</div>
            <div style={{ color: "#6B7094", marginTop: 3 }}>{e.branch} ({e.code})</div>
          </div>
          <button style={{ ...S.btnO, padding: "5px 12px", fontSize: 18 }} onClick={onClose}>×</button>
        </div>
        <div style={{ fontSize: 13, color: "#9B9FC8", marginBottom: 20, lineHeight: 1.6 }}>{e.desc}</div>
        <div style={S.sLabel}>15-Year JoSAA Closing Rank Trend</div>
        <div style={{ height: 200, marginBottom: 22 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="year" tick={{ fill: "#6B7094", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B7094", fontSize: 10 }} tickLine={false} axisLine={false} reversed tickFormatter={v => v.toLocaleString("en-IN")} />
              <Tooltip contentStyle={{ background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={v => [v?.toLocaleString("en-IN"), "Closing Rank"]} />
              <Line type="monotone" dataKey="rank" stroke="#6C63FF" strokeWidth={2.5} dot={{ fill: "#6C63FF", r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          <div style={{ background: "#1C1F3A", borderRadius: 10, padding: "13px 14px" }}>
            <div style={S.label}>2024 Cutoff ({CATEGORIES[category].label})</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#6C63FF" }}>{closing?.toLocaleString("en-IN") || "—"}</div>
          </div>
          <div style={{ background: "#1C1F3A", borderRadius: 10, padding: "13px 14px" }}>
            <div style={S.label}>Avg / Max CTC</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F5A623" }}>₹{e.avgPkg}L <span style={{ fontSize: 12, color: "#6B7094" }}>/ ₹{e.maxPkg}L max</span></div>
          </div>
        </div>
        <div style={S.sLabel}>Career Paths</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
          {e.careers.map((c, i) => <span key={i} style={S.tag("#9B9FC8", "#1C1F3A")}>{c}</span>)}
        </div>
        <div style={S.sLabel}>Seats & Details</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <span style={S.tag("#00D4AA", "rgba(0,212,170,0.1)")}>Seats: {e.seats}</span>
          <span style={S.tag(trendLabel(e).color, trendLabel(e).color + "1a")}>{trendLabel(e).label}</span>
          <span style={S.tag("#9B9FC8", "rgba(255,255,255,0.06)")}>{e.exam}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: RANK PREDICTOR
// ─────────────────────────────────────────────────────────────
function TabPredictor({ userRank, setUserRank, category, setCategory, examType, setExamType }) {
  const [typeF, setTypeF] = useState("All");
  const [branchF, setBranchF] = useState("All");
  const [sort, setSort] = useState("chance");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    let d = ALL_DATA.filter(e => {
      if (examType !== "both" && e.exam !== examType) return false;
      if (typeF !== "All" && e.type !== typeF) return false;
      if (branchF !== "All" && !e.branch.toLowerCase().includes(branchF.toLowerCase()) && e.branch !== branchF) return false;
      return true;
    });
    if (!userRank) return d;
    return d.sort((a, b) => {
      const ca = chance(userRank, adjRank(a, category)) || 0;
      const cb = chance(userRank, adjRank(b, category)) || 0;
      if (sort === "chance") return cb - ca;
      if (sort === "pkg") return b.avgPkg - a.avgPkg;
      if (sort === "cutoff") return (adjRank(a, category) || 999999) - (adjRank(b, category) || 999999);
      return 0;
    });
  }, [userRank, category, examType, typeF, branchF, sort]);

  const safe = results.filter(e => chance(userRank, adjRank(e, category)) >= 70).length;
  const mod = results.filter(e => { const p = chance(userRank, adjRank(e, category)); return p && p >= 35 && p < 70; }).length;

  return (
    <div>
      <div style={{ ...S.card, marginBottom: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 165px" }}>
            <label style={S.label}>JEE Rank (CRL)</label>
            <input style={S.input} type="number" placeholder="e.g. 8500" value={userRank} onChange={e => setUserRank(e.target.value)} />
          </div>
          <div style={{ flex: "0 0 175px" }}>
            <label style={S.label}>Exam</label>
            <select style={S.select} value={examType} onChange={e => setExamType(e.target.value)}>
              <option value="both">Both (Adv + Mains)</option>
              <option value="Advanced">JEE Advanced (IITs)</option>
              <option value="Mains">JEE Mains (NITs/IIITs/GFTIs)</option>
            </select>
          </div>
          <div style={{ flex: "0 0 185px" }}>
            <label style={S.label}>Category</label>
            <select style={S.select} value={category} onChange={e => setCategory(e.target.value)}>
              {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        {userRank && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, marginTop: 16 }}>
            {[
              { label: "Safe Admits", v: safe, c: "#00D4AA" },
              { label: "Moderate", v: mod, c: "#F5A623" },
              { label: "Programs Shown", v: results.length, c: "#6C63FF" },
              { label: "Your Rank", v: Number(userRank).toLocaleString("en-IN"), c: "#E8EAFF" },
            ].map(x => (
              <div key={x.label} style={{ background: "#1C1F3A", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: x.c }}>{x.v}</div>
                <div style={{ fontSize: 10, color: "#6B7094", marginTop: 2 }}>{x.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        {["All", "IIT", "NIT", "IIIT", "GFTI"].map(t => (
          <button key={t} style={{ ...S.btnO, borderColor: typeF === t ? "#6C63FF" : undefined, color: typeF === t ? "#6C63FF" : undefined, fontSize: 12, padding: "6px 14px" }} onClick={() => setTypeF(t)}>{t}</button>
        ))}
        <select style={{ ...S.select, maxWidth: 220, marginLeft: "auto" }} value={branchF} onChange={e => setBranchF(e.target.value)}>
          {BRANCH_OPTIONS.map(b => <option key={b}>{b}</option>)}
        </select>
        <select style={{ ...S.select, maxWidth: 155 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="chance">Sort: Chance</option>
          <option value="pkg">Sort: Package</option>
          <option value="cutoff">Sort: Cutoff</option>
        </select>
      </div>

      {!userRank && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#4A4E6B" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#6B7094" }}>Enter your rank to see admission chances</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Based on 15 years of JoSAA closing rank data across {ALL_DATA.length}+ programs</div>
        </div>
      )}

      <div style={S.grid3}>
        {results.map(e => <ResultCard key={e.id} e={e} userRank={userRank} category={category} onClick={setSelected} />)}
      </div>
      <DetailModal e={selected} category={category} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: 15-YEAR TRENDS
// ─────────────────────────────────────────────────────────────
function TabTrends() {
  const [picks, setPicks] = useState(["iitb_cs", "iitd_cs", "nitt_cs", "iiith_cs"]);
  const [typeF, setTypeF] = useState("All");
  const COLORS = ["#6C63FF", "#00D4AA", "#F5A623", "#FF6B6B", "#4A9EFF"];

  const visible = typeF === "All" ? ALL_DATA : ALL_DATA.filter(e => e.type === typeF);

  const toggle = id => {
    setPicks(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev);
  };

  const chartData = JOSAA_YEARS.map((y, yi) => {
    const obj = { year: y };
    picks.forEach(id => {
      const e = ALL_DATA.find(x => x.id === id);
      if (e) obj[id] = e.ranks[yi] || null;
    });
    return obj;
  });

  return (
    <div>
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ ...S.sLabel }}>Select up to 5 programs — 2010 to 2024</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["All", "IIT", "NIT", "IIIT", "GFTI"].map(t => (
            <button key={t} style={{ ...S.btnO, fontSize: 11, padding: "5px 11px", borderColor: typeF === t ? "#6C63FF" : undefined, color: typeF === t ? "#6C63FF" : undefined }} onClick={() => setTypeF(t)}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 220, overflowY: "auto" }}>
          {visible.map(e => {
            const idx = picks.indexOf(e.id);
            return (
              <button key={e.id} onClick={() => toggle(e.id)} style={{ ...S.btnO, fontSize: 10, padding: "4px 9px", borderColor: idx >= 0 ? COLORS[idx] : undefined, color: idx >= 0 ? COLORS[idx] : undefined, background: idx >= 0 ? COLORS[idx] + "18" : undefined }}>
                {e.inst.replace("IIT ", "").replace("NIT ", "").replace("IIIT ", "")} {e.code}
              </button>
            );
          })}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sLabel}>Closing Rank Trend — Lower Rank = More Competitive</div>
        <div style={{ height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#6B7094", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B7094", fontSize: 11 }} tickLine={false} axisLine={false} reversed tickFormatter={v => v.toLocaleString("en-IN")} />
              <Tooltip contentStyle={{ background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={(v, name) => { const e = ALL_DATA.find(x => x.id === name); return [v?.toLocaleString("en-IN"), e ? `${e.inst} ${e.code}` : name]; }} />
              <Legend formatter={name => { const e = ALL_DATA.find(x => x.id === name); return e ? `${e.inst} ${e.code}` : name; }} wrapperStyle={{ fontSize: 11, color: "#9B9FC8" }} />
              {picks.map((id, i) => <Line key={id} type="monotone" dataKey={id} stroke={COLORS[i]} strokeWidth={2.5} dot={false} connectNulls />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "#4A4E6B" }}>📌 JoSAA Round 6 closing ranks · General/OBC-NCL CRL · Gaps = branch not offered that year</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: COMPARE
// ─────────────────────────────────────────────────────────────
function TabCompare({ userRank, category }) {
  const [picks, setPicks] = useState([]);
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return ALL_DATA.filter(e => e.inst.toLowerCase().includes(q) || e.branch.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)).slice(0, 10);
  }, [search]);

  const add = e => {
    if (picks.length < 6 && !picks.find(p => p.id === e.id)) { setPicks([...picks, e]); setSearch(""); }
  };
  const remove = id => setPicks(picks.filter(p => p.id !== id));

  const metrics = [
    { k: "type", l: "Institute Type", fn: e => e.type, best: null },
    { k: "cutoff", l: "2024 Cutoff (Gen)", fn: e => adjRank(e, category)?.toLocaleString("en-IN") || "—", sort: e => adjRank(e, category) || 999999, dir: -1 },
    { k: "chance", l: "Your Chance", fn: e => userRank ? `${chance(userRank, adjRank(e, category)) ?? 0}%` : "—", sort: e => chance(userRank, adjRank(e, category)) ?? 0, dir: 1 },
    { k: "avg", l: "Avg Package", fn: e => `₹${e.avgPkg}L`, sort: e => e.avgPkg, dir: 1 },
    { k: "max", l: "Max CTC", fn: e => `₹${e.maxPkg}L`, sort: e => e.maxPkg, dir: 1 },
    { k: "growth", l: "Growth Score", fn: e => `${e.growth}/10`, sort: e => e.growth, dir: 1 },
    { k: "global", l: "Global Scope", fn: e => `${e.global}/10`, sort: e => e.global, dir: 1 },
    { k: "seats", l: "Seats", fn: e => e.seats, sort: e => e.seats, dir: 1 },
  ];

  const bestId = m => {
    if (!m.sort || !picks.length) return null;
    const vals = picks.map(e => m.sort(e));
    const best = m.dir === 1 ? Math.max(...vals) : Math.min(...vals);
    return picks[vals.indexOf(best)]?.id;
  };

  return (
    <div>
      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={{ ...S.sLabel }}>Add programs to compare (up to 6)</div>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input style={S.input} placeholder="Search by institute, branch or code..." value={search} onChange={e => setSearch(e.target.value)} />
          {results.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, maxHeight: 220, overflowY: "auto", marginTop: 4 }}>
              {results.map(e => (
                <div key={e.id} onClick={() => add(e)} style={{ padding: "9px 13px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "#252847"}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <span style={{ fontWeight: 600 }}>{e.inst}</span>
                  <span style={{ color: "#6B7094", marginLeft: 8 }}>{e.branch}</span>
                  <span style={{ ...S.tag(typeColor(e.type), typeColor(e.type) + "1a"), marginLeft: 8 }}>{e.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {picks.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 5, background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 9px", fontSize: 12 }}>
              <span style={S.tag(typeColor(e.type), typeColor(e.type) + "1a")}>{e.type}</span>
              <span>{e.inst} · {e.code}</span>
              <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", color: "#6B7094", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {picks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#4A4E6B" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#6B7094" }}>Search and add programs to compare</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Compare cutoffs, packages, growth, and admission chance side by side</div>
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1C1F3A" }}>
                <th style={{ padding: "13px 15px", textAlign: "left", color: "#6B7094", fontSize: 11, fontWeight: 600 }}>Metric</th>
                {picks.map(e => (
                  <th key={e.id} style={{ padding: "13px 15px", textAlign: "center", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, color: "#E8EAFF", fontSize: 13 }}>{e.inst}</div>
                    <div style={{ color: "#6B7094", fontSize: 11, marginTop: 2 }}>{e.branch} ({e.code})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => (
                <tr key={m.k} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "11px 15px", color: "#9B9FC8", fontWeight: 600, fontSize: 12 }}>{m.l}</td>
                  {picks.map(e => {
                    const isBest = bestId(m) === e.id;
                    const val = m.fn(e);
                    const isChance = m.k === "chance" && userRank;
                    const cp = isChance ? chance(userRank, adjRank(e, category)) : null;
                    return (
                      <td key={e.id} style={{ padding: "11px 15px", textAlign: "center" }}>
                        {isChance && cp !== null ? (
                          <span style={S.pill(cp)}>{val}</span>
                        ) : m.k === "type" ? (
                          <span style={S.tag(typeColor(val), typeColor(val) + "1a")}>{val}</span>
                        ) : (
                          <span style={{ fontWeight: isBest ? 700 : 400, color: isBest ? "#00D4AA" : "#E8EAFF", background: isBest ? "rgba(0,212,170,0.08)" : "transparent", padding: "3px 8px", borderRadius: 6 }}>
                            {val}{isBest ? " ★" : ""}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB: SMART DECIDER
// ─────────────────────────────────────────────────────────────
function TabDecider({ userRank, category }) {
  const [weights, setWeights] = useState({ package: 7, growth: 6, global: 5, chance: 8, seats: 3 });
  const [typeF, setTypeF] = useState("All");

  const ranked = useMemo(() => {
    const d = typeF === "All" ? ALL_DATA : ALL_DATA.filter(e => e.type === typeF);
    return d.map(e => {
      const closing = adjRank(e, category);
      const pct = chance(userRank, closing) ?? 50;
      const pkgS = Math.min(10, (e.avgPkg / 30) * 10);
      const total = weights.package * pkgS + weights.growth * e.growth + weights.global * e.global + weights.chance * (pct / 10) + weights.seats * Math.min(10, e.seats / 15);
      const maxT = (weights.package + weights.growth + weights.global + weights.chance + weights.seats) * 10;
      return { ...e, score: maxT > 0 ? Math.round((total / maxT) * 100) : 0, pct };
    }).sort((a, b) => b.score - a.score);
  }, [userRank, category, weights, typeF]);

  const top = ranked[0];
  const Slider = ({ label, k }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
      <span style={{ fontSize: 12, width: 145, flexShrink: 0, color: "#9B9FC8" }}>{label}</span>
      <input type="range" min={0} max={10} value={weights[k]} onChange={e => setWeights(w => ({ ...w, [k]: +e.target.value }))} style={{ flex: 1, accentColor: "#6C63FF" }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6C63FF", width: 18, textAlign: "right" }}>{weights[k]}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>
        <div>
          <div style={S.card}>
            <div style={S.sLabel}>What matters to you?</div>
            <Slider label="💰 Package" k="package" />
            <Slider label="📈 Growth Scope" k="growth" />
            <Slider label="🌍 Global Mobility" k="global" />
            <Slider label="✅ Admission Chance" k="chance" />
            <Slider label="🏛️ Seats" k="seats" />
            <div style={{ fontSize: 10, color: "#4A4E6B", marginTop: 8 }}>Adjust to re-rank {ALL_DATA.length} programs in real time.</div>
          </div>
          <div style={{ ...S.card, marginTop: 12 }}>
            <div style={S.sLabel}>Filter by type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["All", "IIT", "NIT", "IIIT", "GFTI"].map(t => (
                <button key={t} style={{ ...S.btnO, fontSize: 11, padding: "5px 11px", borderColor: typeF === t ? "#6C63FF" : undefined, color: typeF === t ? "#6C63FF" : undefined }} onClick={() => setTypeF(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {top && (
            <div style={{ ...S.card, marginBottom: 14, background: "linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,212,170,0.05))", borderColor: "rgba(108,99,255,0.25)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#6C63FF", marginBottom: 5 }}>TOP RECOMMENDATION</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{top.inst}</div>
              <div style={{ color: "#6B7094", marginBottom: 10 }}>{top.branch} ({top.code})</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={S.pill(top.pct)}>Chance {top.pct ?? 0}%</div>
                <span style={S.tag("#F5A623", "rgba(245,166,35,0.1)")}>₹{top.avgPkg}L avg</span>
                <span style={S.tag("#00D4AA", "rgba(0,212,170,0.1)")}>Score {top.score}%</span>
                <span style={S.tag(typeColor(top.type), typeColor(top.type) + "1a")}>{top.type}</span>
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ranked.slice(0, 12).map((e, i) => (
              <div key={e.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, border: `2px solid ${i < 3 ? ["#6C63FF", "#888", "#cd7f32"][i] : "rgba(255,255,255,0.08)"}`, color: i < 3 ? ["#6C63FF", "#888", "#cd7f32"][i] : "#4A4E6B" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#E8EAFF" }}>{e.inst} · {e.code}</div>
                  <div style={{ fontSize: 10, color: "#6B7094", marginTop: 1 }}>{e.branch}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF" }}>{e.score}%</div>
                  <div style={{ fontSize: 10, color: chanceColor(e.pct) }}>{e.pct ?? 0}% admit</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("predictor");
  const [userRank, setUserRank] = useState("");
  const [category, setCategory] = useState("general");
  const [examType, setExamType] = useState("both");

  const tabs = [
    { id: "predictor", label: "🎯 Rank Predictor" },
    { id: "trends", label: "📈 15-Year Trends" },
    { id: "compare", label: "⚖️ Side-by-Side" },
    { id: "decider", label: "✨ Smart Decider" },
  ];

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={S.logoIcon}>🎯</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>JoSAA Decision Tool By Yuwin_2407</div>
            <div style={{ fontSize: 11, color: "#6B7094", marginTop: 1 }}>
              23 IITs · 31 NITs · 25 IIITs · 13 GFTIs · {ALL_DATA.length} programs · 15 years data
            </div>
          </div>
        </div>
        {userRank && (
          <div style={{ background: "#1C1F3A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "7px 13px", fontSize: 12 }}>
            <span style={{ color: "#6B7094" }}>Rank </span>
            <span style={{ fontWeight: 700, color: "#6C63FF" }}>{Number(userRank).toLocaleString("en-IN")}</span>
            <span style={{ color: "#6B7094", marginLeft: 8 }}>{CATEGORIES[category].label}</span>
          </div>
        )}
      </div>

      <div style={S.tabBar}>
        {tabs.map(t => <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      <div style={S.body}>
        {tab === "predictor" && <TabPredictor userRank={userRank} setUserRank={setUserRank} category={category} setCategory={setCategory} examType={examType} setExamType={setExamType} />}
        {tab === "trends" && <TabTrends />}
        {tab === "compare" && <TabCompare userRank={userRank} category={category} />}
        {tab === "decider" && <TabDecider userRank={userRank} category={category} />}
      </div>

      <div style={{ textAlign: "center", padding: "14px", fontSize: 11, color: "#2A2D4A", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        Data: JoSAA Round 6 closing ranks 2010–2024 · For guidance only · Verify at josaa.nic.in
      </div>
    </div>
  );
}
