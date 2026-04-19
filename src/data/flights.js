// Flight data from each city to Baltimore (BWI)
// Coordinates used for drawing flight paths on the US map
// Prices and times are typical economy one-way, booked 2-4 weeks out

export const destination = {
  airport: "BWI",
  name: "Baltimore-Washington International",
  lat: 39.1754,
  lon: -76.6685,
};

// Maps cityId -> flight info
export const cityFlights = {
  // Boulder
  1: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Colorado Springs
  2: { airportCode: "COS", airportName: "Colorado Springs Airport", nonstop: true, flightTime: "3h 50m", flightTimeHours: 3.83, avgCostUsd: 140, distanceMiles: 1500, lat: 38.8058, lon: -104.7010, notes: "Limited nonstop via Southwest; otherwise connect via DEN" },
  // Fort Collins (uses DEN)
  3: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Fort Collins drives to DEN (~1h)" },
  // Denver: Capitol Hill
  4: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Durango
  5: { airportCode: "DRO", airportName: "Durango-La Plata County", nonstop: false, flightTime: "5h 37m", flightTimeHours: 5.62, avgCostUsd: 220, distanceMiles: 1720, lat: 37.1515, lon: -107.7538, notes: "Connects via DFW or DEN" },
  // Steamboat Springs
  6: { airportCode: "HDN", airportName: "Yampa Valley Regional", nonstop: false, flightTime: "5h 30m", flightTimeHours: 5.5, avgCostUsd: 190, distanceMiles: 1610, lat: 40.4814, lon: -107.2177, notes: "Connecting via DEN; seasonal service" },
  // Salida (uses COS)
  7: { airportCode: "COS", airportName: "Colorado Springs Airport", nonstop: true, flightTime: "3h 50m", flightTimeHours: 3.83, avgCostUsd: 140, distanceMiles: 1500, lat: 38.8058, lon: -104.7010, notes: "Salida drives to COS or DEN" },
  // Carbondale
  8: { airportCode: "ASE", airportName: "Aspen-Pitkin County", nonstop: false, flightTime: "4h 48m", flightTimeHours: 4.8, avgCostUsd: 215, distanceMiles: 1613, lat: 39.2232, lon: -106.8687, notes: "No nonstop; connects via DEN" },
  // Denver: Highland/LoHi
  9: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Denver: Wash Park
  10: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Denver: RiNo
  11: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Denver: Baker/SoBo
  12: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Denver: Downtown
  13: { airportCode: "DEN", airportName: "Denver International", nonstop: true, flightTime: "3h 30m", flightTimeHours: 3.5, avgCostUsd: 130, distanceMiles: 1487, lat: 39.8493, lon: -104.6738, notes: "Nonstop via United and Southwest" },
  // Westminster, MD
  14: { airportCode: "BWI", airportName: "BWI (local)", nonstop: null, flightTime: "Drive 30m", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 30, lat: 39.1754, lon: -76.6685, notes: "No flight needed - drive to family" },
  // Boise
  15: { airportCode: "BOI", airportName: "Boise Airport", nonstop: false, flightTime: "5h 57m", flightTimeHours: 5.95, avgCostUsd: 160, distanceMiles: 2059, lat: 43.5644, lon: -116.2228, notes: "Connects via DEN or SEA; no nonstop" },
  // Asheville
  16: { airportCode: "AVL", airportName: "Asheville Regional", nonstop: true, flightTime: "1h 40m", flightTimeHours: 1.67, avgCostUsd: 90, distanceMiles: 410, lat: 35.4362, lon: -82.5418, notes: "Nonstop on Allegiant (limited)" },
  // Bend
  17: { airportCode: "RDM", airportName: "Roberts Field (Redmond)", nonstop: false, flightTime: "6h 30m", flightTimeHours: 6.5, avgCostUsd: 180, distanceMiles: 2300, lat: 44.2541, lon: -121.1500, notes: "Connects via SEA/DEN/SLC" },
  // Sedona (uses PHX)
  18: { airportCode: "PHX", airportName: "Phoenix Sky Harbor", nonstop: true, flightTime: "4h 10m", flightTimeHours: 4.17, avgCostUsd: 105, distanceMiles: 1996, lat: 33.4352, lon: -112.0102, notes: "PHX is ~2h drive from Sedona" },
  // Santa Fe (uses ABQ for nonstop)
  19: { airportCode: "ABQ", airportName: "Albuquerque International", nonstop: true, flightTime: "3h 44m", flightTimeHours: 3.73, avgCostUsd: 140, distanceMiles: 1670, lat: 35.0375, lon: -106.6055, notes: "ABQ offers nonstop Southwest (~1h from Santa Fe)" },
  // Canton
  20: { airportCode: "BWI", airportName: "BWI (local)", nonstop: null, flightTime: "Walk/Drive 15m", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 10, lat: 39.1754, lon: -76.6685, notes: "Already in Baltimore" },
  // Fells Point
  21: { airportCode: "BWI", airportName: "BWI (local)", nonstop: null, flightTime: "Walk/Drive 15m", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 10, lat: 39.1754, lon: -76.6685, notes: "Already in Baltimore" },
  // DC: Dupont/Adams Morgan
  22: { airportCode: "DCA", airportName: "Reagan National", nonstop: null, flightTime: "Drive 1h", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 38, lat: 38.8513, lon: -77.0360, notes: "DC is ~1h drive to BWI; no flight needed" },
  // DC: Georgetown
  23: { airportCode: "DCA", airportName: "Reagan National", nonstop: null, flightTime: "Drive 1h", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 42, lat: 38.8513, lon: -77.0360, notes: "DC is ~1h drive to BWI; no flight needed" },
  // DC: Columbia Heights/Petworth
  24: { airportCode: "DCA", airportName: "Reagan National", nonstop: null, flightTime: "Drive 1h", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 35, lat: 38.8513, lon: -77.0360, notes: "DC is ~1h drive to BWI; no flight needed" },
  // Tampa: Hyde Park/SoHo
  25: { airportCode: "TPA", airportName: "Tampa International", nonstop: true, flightTime: "2h 30m", flightTimeHours: 2.5, avgCostUsd: 80, distanceMiles: 844, lat: 27.9755, lon: -82.5332, notes: "Nonstop on Southwest, Frontier (~8/day)" },
  // Tampa: Channelside
  26: { airportCode: "TPA", airportName: "Tampa International", nonstop: true, flightTime: "2h 30m", flightTimeHours: 2.5, avgCostUsd: 80, distanceMiles: 844, lat: 27.9755, lon: -82.5332, notes: "Nonstop on Southwest, Frontier (~8/day)" },
  // Tampa: Downtown
  27: { airportCode: "TPA", airportName: "Tampa International", nonstop: true, flightTime: "2h 30m", flightTimeHours: 2.5, avgCostUsd: 80, distanceMiles: 844, lat: 27.9755, lon: -82.5332, notes: "Nonstop on Southwest, Frontier (~8/day)" },
  // Tampa: Seminole Heights
  28: { airportCode: "TPA", airportName: "Tampa International", nonstop: true, flightTime: "2h 30m", flightTimeHours: 2.5, avgCostUsd: 80, distanceMiles: 844, lat: 27.9755, lon: -82.5332, notes: "Nonstop on Southwest, Frontier (~8/day)" },
  // Austin: Zilker/Barton Hills
  29: { airportCode: "AUS", airportName: "Austin-Bergstrom International", nonstop: true, flightTime: "3h 0m", flightTimeHours: 3.0, avgCostUsd: 160, distanceMiles: 1339, lat: 30.1945, lon: -97.6699, notes: "Nonstop Southwest to BWI" },
  // Austin: East Austin
  30: { airportCode: "AUS", airportName: "Austin-Bergstrom International", nonstop: true, flightTime: "3h 0m", flightTimeHours: 3.0, avgCostUsd: 160, distanceMiles: 1339, lat: 30.1945, lon: -97.6699, notes: "Nonstop Southwest to BWI" },
  // Austin: South Congress
  31: { airportCode: "AUS", airportName: "Austin-Bergstrom International", nonstop: true, flightTime: "3h 0m", flightTimeHours: 3.0, avgCostUsd: 160, distanceMiles: 1339, lat: 30.1945, lon: -97.6699, notes: "Nonstop Southwest to BWI" },
  // Austin: Mueller
  32: { airportCode: "AUS", airportName: "Austin-Bergstrom International", nonstop: true, flightTime: "3h 0m", flightTimeHours: 3.0, avgCostUsd: 160, distanceMiles: 1339, lat: 30.1945, lon: -97.6699, notes: "Nonstop Southwest to BWI" },
  // Alexandria, VA
  33: { airportCode: "BWI", airportName: "BWI (drive)", nonstop: null, flightTime: "Drive 50m", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 40, lat: 39.1754, lon: -76.6685, notes: "Drive to BWI ~50 min; no flight needed" },
  // Arlington, VA
  34: { airportCode: "BWI", airportName: "BWI (drive)", nonstop: null, flightTime: "Drive 1h", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 38, lat: 39.1754, lon: -76.6685, notes: "Drive to BWI ~1h; no flight needed" },
  // Frederick, MD
  35: { airportCode: "BWI", airportName: "BWI (drive)", nonstop: null, flightTime: "Drive 55m", flightTimeHours: 0, avgCostUsd: 0, distanceMiles: 50, lat: 39.1754, lon: -76.6685, notes: "Drive to BWI ~55 min; no flight needed" },
  // Nashville: The Gulch
  36: { airportCode: "BNA", airportName: "Nashville International", nonstop: true, flightTime: "2h 0m", flightTimeHours: 2.0, avgCostUsd: 90, distanceMiles: 586, lat: 36.1245, lon: -86.6782, notes: "Nonstop Southwest ~30 flights/week" },
  // Nashville: East Nashville
  37: { airportCode: "BNA", airportName: "Nashville International", nonstop: true, flightTime: "2h 0m", flightTimeHours: 2.0, avgCostUsd: 90, distanceMiles: 586, lat: 36.1245, lon: -86.6782, notes: "Nonstop Southwest ~30 flights/week" },
  // Charleston: Downtown
  38: { airportCode: "CHS", airportName: "Charleston International", nonstop: true, flightTime: "1h 50m", flightTimeHours: 1.83, avgCostUsd: 80, distanceMiles: 470, lat: 32.8986, lon: -80.0405, notes: "Nonstop Southwest ~21 flights/week" },
  // Charleston: Park Circle
  39: { airportCode: "CHS", airportName: "Charleston International", nonstop: true, flightTime: "1h 50m", flightTimeHours: 1.83, avgCostUsd: 80, distanceMiles: 470, lat: 32.8986, lon: -80.0405, notes: "Nonstop Southwest ~21 flights/week" },
  // Raleigh: Downtown
  40: { airportCode: "RDU", airportName: "Raleigh-Durham International", nonstop: true, flightTime: "1h 20m", flightTimeHours: 1.33, avgCostUsd: 75, distanceMiles: 256, lat: 35.8776, lon: -78.7875, notes: "Nonstop Southwest ~35 flights/week, ~5/day" },
  // Durham: Bull City
  41: { airportCode: "RDU", airportName: "Raleigh-Durham International", nonstop: true, flightTime: "1h 20m", flightTimeHours: 1.33, avgCostUsd: 75, distanceMiles: 256, lat: 35.8776, lon: -78.7875, notes: "Nonstop Southwest ~35 flights/week, ~5/day" },
  // SLC: Downtown/Sugar House
  42: { airportCode: "SLC", airportName: "Salt Lake City International", nonstop: true, flightTime: "4h 0m", flightTimeHours: 4.0, avgCostUsd: 155, distanceMiles: 1859, lat: 40.7899, lon: -111.9791, notes: "Nonstop Delta and Southwest" },
  // SLC: 9th & 9th
  43: { airportCode: "SLC", airportName: "Salt Lake City International", nonstop: true, flightTime: "4h 0m", flightTimeHours: 4.0, avgCostUsd: 155, distanceMiles: 1859, lat: 40.7899, lon: -111.9791, notes: "Nonstop Delta and Southwest" },
  // Scottsdale: Old Town
  44: { airportCode: "PHX", airportName: "Phoenix Sky Harbor", nonstop: true, flightTime: "4h 10m", flightTimeHours: 4.17, avgCostUsd: 115, distanceMiles: 2000, lat: 33.4373, lon: -112.0078, notes: "Nonstop Southwest and American" },
  // Phoenix: Arcadia
  45: { airportCode: "PHX", airportName: "Phoenix Sky Harbor", nonstop: true, flightTime: "4h 10m", flightTimeHours: 4.17, avgCostUsd: 115, distanceMiles: 2000, lat: 33.4373, lon: -112.0078, notes: "Nonstop Southwest and American" },
  // Minneapolis: Uptown/Lakes
  46: { airportCode: "MSP", airportName: "Minneapolis-St Paul International", nonstop: true, flightTime: "2h 45m", flightTimeHours: 2.75, avgCostUsd: 100, distanceMiles: 934, lat: 44.8848, lon: -93.2223, notes: "Nonstop Delta, Southwest, Sun Country" },
  // Minneapolis: North Loop
  47: { airportCode: "MSP", airportName: "Minneapolis-St Paul International", nonstop: true, flightTime: "2h 45m", flightTimeHours: 2.75, avgCostUsd: 100, distanceMiles: 934, lat: 44.8848, lon: -93.2223, notes: "Nonstop Delta, Southwest, Sun Country" },
};

export const VIEW_W = 975;
export const VIEW_H = 610;
export const VIEW_BOX = `0 0 ${VIEW_W} ${VIEW_H}`;
