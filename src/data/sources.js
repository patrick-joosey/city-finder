// Source URLs for every raw metric, organized by city ID and category.
// Each entry maps to verifiable data sources.
// Format: { [cityId]: { [categoryKey]: [{ label, url }] } }

// Shared source sets for cities that use the same data sources
const neighborhoodScout = (place, state) => ({
  label: `NeighborhoodScout - ${place}`,
  url: `https://www.neighborhoodscout.com/${state}/${place.toLowerCase().replace(/\s+/g, '-')}/crime`,
});

const allTrails = (place, state) => ({
  label: `AllTrails - ${place}`,
  url: `https://www.alltrails.com/us/${state}/${place.toLowerCase().replace(/\s+/g, '-')}`,
});

const walkScore = (place, state) => ({
  label: `Walk Score - ${place}`,
  url: `https://www.walkscore.com/${state}/${place.replace(/\s+/g, '_')}`,
});

const bestPlaces = (place, state) => ({
  label: `BestPlaces - ${place}`,
  url: `https://www.bestplaces.net/cost_of_living/city/${state}/${place.toLowerCase().replace(/\s+/g, '_')}`,
});

const epaAirData = { label: "EPA AirData (2023 Annual)", url: "https://aqs.epa.gov/aqsweb/airdata/download_files.html" };
const usClimateData = (place, state) => ({
  label: `US Climate Data - ${place}`,
  url: `https://www.usclimatedata.com/climate/${place.toLowerCase().replace(/\s+/g, '-')}/${state}/united-states`,
});

// Baltimore shared sources
const baltimoreRecovery = [
  { label: "Baltimore Intergroup AA", url: "https://baltimoreaa.org" },
  { label: "Baltimore Area NA", url: "https://baltoareana.org" },
];
const baltimoreSafety = [
  { label: "Baltimore Crime Map", url: "https://data.baltimorecity.gov" },
  { label: "CrimeGrade - Baltimore", url: "https://crimegrade.org/safest-places-in-baltimore-md/" },
];

// DC shared sources
const dcRecovery = [
  { label: "AA-DC.org (Washington Area Intergroup)", url: "https://aa-dc.org/meetings" },
  { label: "Chesapeake & Potomac Region NA", url: "https://www.cprna.org" },
];
const dcSafety = [
  { label: "DC MPD Crime Data", url: "https://mpdc.dc.gov/page/statistics-and-data" },
  { label: "CrimeGrade - DC", url: "https://crimegrade.org/safest-places-in-washington-dc/" },
];

// Denver shared sources
const denverRecovery = [
  { label: "DACCAA (Denver AA Central Committee)", url: "https://daccaa.org" },
  { label: "Mile High Area NA", url: "https://denverna.com/meeting-list" },
];
const denverSafety = (neighborhood) => [
  { label: `DenverCrimes - ${neighborhood}`, url: `https://denvercrimes.com/neighborhood/${neighborhood.toLowerCase().replace(/\s+/g, '-')}/` },
  neighborhoodScout("Denver", "co"),
];

export const citySources = {
  // === Boulder ===
  1: {
    safety: [neighborhoodScout("Boulder", "co"), { label: "CrimeGrade - Boulder", url: "https://crimegrade.org/violent-crime-boulder-co/" }],
    recovery: [{ label: "Boulder County AA", url: "https://bouldercountyaa.com" }, { label: "NA Boulder", url: "https://naboulder.org/meetings" }],
    meditation: [{ label: "Yelp - Boulder Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Boulder,+CO" }],
    healthWellness: [{ label: "UCHealth Boulder", url: "https://www.uchealth.org" }],
    gyms: [{ label: "Yelp - Boulder Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Boulder,+CO" }],
    nutrition: [{ label: "Boulder County Farmers Markets", url: "https://bcfm.org/" }],
    socialCommunity: [walkScore("Boulder", "CO")],
    outdoorRec: [allTrails("Boulder", "colorado"), { label: "Boulder OSMP", url: "https://bouldercolorado.gov/government/departments/open-space-mountain-parks" }],
    climate: [usClimateData("Boulder", "colorado"), { label: "BestPlaces - Boulder Climate", url: "https://www.bestplaces.net/climate/city/colorado/boulder" }],
    affordability: [bestPlaces("Boulder", "colorado"), { label: "RentCafe - Boulder", url: "https://www.rentcafe.com/average-rent-market-trends/us/co/boulder/" }],
    airQuality: [epaAirData, { label: "AirNow - Boulder County", url: "https://www.airnow.gov/?city=Boulder&state=CO" }],
    jobMarket: [{ label: "Data USA - Boulder", url: "https://datausa.io/profile/geo/boulder-co" }, { label: "BLS - Boulder MSA", url: "https://www.bls.gov/eag/eag.co_boulder_msa.htm" }],
  },
  // === Colorado Springs ===
  2: {
    safety: [neighborhoodScout("Colorado Springs", "co")],
    recovery: [{ label: "Colorado Springs AA", url: "https://coloradospringsaa.org" }, { label: "Pikes Peak Area NA", url: "https://nacolorado.org/cospgs" }],
    meditation: [{ label: "Yelp - COS Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Colorado+Springs,+CO" }],
    healthWellness: [{ label: "UCHealth - COS", url: "https://www.uchealth.org" }],
    gyms: [{ label: "Yelp - COS Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Colorado+Springs,+CO" }],
    nutrition: [{ label: "Visit COS Markets", url: "https://www.visitcos.com/blog/farmers-markets-in-colorado-springs/" }],
    socialCommunity: [walkScore("Colorado_Springs", "CO")],
    outdoorRec: [allTrails("Colorado Springs", "colorado"), { label: "COS Parks", url: "https://coloradosprings.gov/parks-trails-open-space" }],
    climate: [usClimateData("Colorado Springs", "colorado")],
    affordability: [bestPlaces("Colorado Springs", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - COS", url: "https://datausa.io/profile/geo/colorado-springs-co" }],
  },
  // === Fort Collins ===
  3: {
    safety: [neighborhoodScout("Fort Collins", "co")],
    recovery: [{ label: "Northern CO Intergroup AA", url: "https://nocoaa.org" }, { label: "Off The Wall Area NA", url: "https://otwna.org" }],
    meditation: [{ label: "Yelp - FC Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Fort+Collins,+CO" }],
    healthWellness: [{ label: "UCHealth Poudre Valley", url: "https://www.uchealth.org" }],
    gyms: [{ label: "Yelp - FC Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Fort+Collins,+CO" }],
    nutrition: [{ label: "FC Farmers Market", url: "https://www.fortcollinsfarmersmarket.org/" }, { label: "Winter Farmers Market", url: "https://www.winterfarmersmarket.com" }],
    socialCommunity: [walkScore("Fort_Collins", "CO")],
    outdoorRec: [allTrails("Fort Collins", "colorado"), { label: "FC Natural Areas", url: "https://www.fcgov.com/naturalareas/" }],
    climate: [usClimateData("Fort Collins", "colorado")],
    affordability: [bestPlaces("Fort Collins", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - FC", url: "https://datausa.io/profile/geo/fort-collins-co" }],
  },
  // === Denver neighborhoods (4, 9-13) ===
  ...Object.fromEntries([4, 9, 10, 11, 12, 13].map(id => [id, {
    safety: denverSafety(["Capitol Hill", "Highland", "Washington Park", "RiNo", "Baker", "CBD"][[4,9,10,11,12,13].indexOf(id)]),
    recovery: denverRecovery,
    meditation: [{ label: "Yelp - Denver Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Denver,+CO" }],
    healthWellness: [{ label: "Denver Health", url: "https://www.denverhealth.org" }, { label: "UCHealth Denver", url: "https://www.uchealth.org" }],
    gyms: [{ label: "Yelp - Denver Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Denver,+CO" }],
    nutrition: [{ label: "Visit Denver Markets", url: "https://www.denver.org/food-drink/farmers-markets/" }],
    socialCommunity: [walkScore("Denver", "CO")],
    outdoorRec: [allTrails("Denver", "colorado"), { label: "Denver Parks & Rec", url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation" }],
    climate: [usClimateData("Denver", "colorado")],
    affordability: [bestPlaces("Denver", "colorado"), { label: "RentCafe - Denver", url: "https://www.rentcafe.com/average-rent-market-trends/us/co/denver/" }],
    airQuality: [epaAirData, { label: "ALA - Denver", url: "https://www.lung.org/research/sota/city-rankings/states/colorado" }],
    jobMarket: [{ label: "Data USA - Denver", url: "https://datausa.io/profile/geo/denver-co" }, { label: "BLS - Denver", url: "https://www.bls.gov/eag/eag.co_denver_msa.htm" }],
  }])),
  // === Durango ===
  5: {
    safety: [neighborhoodScout("Durango", "co"), { label: "CrimeGrade - Durango", url: "https://crimegrade.org/violent-crime-durango-co/" }],
    recovery: [{ label: "Animas Alano Club", url: "https://animasalanoclub.org" }, { label: "AA District 18", url: "https://aadistrict18.org" }],
    meditation: [{ label: "Yelp - Durango Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Durango,+CO" }],
    healthWellness: [{ label: "Mercy Regional Medical Center", url: "https://www.mercydurango.org" }],
    gyms: [{ label: "Yelp - Durango Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Durango,+CO" }],
    nutrition: [{ label: "Durango Farmers Market", url: "https://www.durangofarmersmarket.com/" }],
    socialCommunity: [walkScore("Durango", "CO")],
    outdoorRec: [allTrails("Durango", "colorado"), { label: "Durango Trails", url: "https://www.durangotrails.org/" }],
    climate: [usClimateData("Durango", "colorado")],
    affordability: [bestPlaces("Durango", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Durango", url: "https://datausa.io/profile/geo/durango-co" }],
  },
  // === Steamboat Springs ===
  6: {
    safety: [neighborhoodScout("Steamboat Springs", "co")],
    recovery: [{ label: "Steamboat AA", url: "https://steamboataa.org" }],
    meditation: [{ label: "Yelp - Steamboat Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Steamboat+Springs,+CO" }],
    healthWellness: [{ label: "UCHealth Yampa Valley", url: "https://www.uchealth.org" }],
    gyms: [{ label: "Yelp - Steamboat Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Steamboat+Springs,+CO" }],
    nutrition: [{ label: "Steamboat Farmers Market", url: "https://www.mainstreetsteamboat.com/farmers-market/" }],
    socialCommunity: [walkScore("Steamboat_Springs", "CO")],
    outdoorRec: [allTrails("Steamboat Springs", "colorado"), { label: "Steamboat Trails", url: "https://steamboatsprings.net/307/Trails" }],
    climate: [usClimateData("Steamboat Springs", "colorado")],
    affordability: [bestPlaces("Steamboat Springs", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Steamboat", url: "https://datausa.io/profile/geo/steamboat-springs-co" }],
  },
  // === Salida ===
  7: {
    safety: [neighborhoodScout("Salida", "co")],
    recovery: [{ label: "AA Salida/BV/Leadville", url: "https://aasalidabvleadville.com" }],
    meditation: [{ label: "Yelp - Salida Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Salida,+CO" }],
    healthWellness: [{ label: "Heart of the Rockies Hospital", url: "https://www.hrrmc.com" }],
    gyms: [{ label: "Yelp - Salida Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Salida,+CO" }],
    nutrition: [{ label: "Natural Grocers - Salida", url: "https://www.naturalgrocers.com/store/salida" }],
    socialCommunity: [walkScore("Salida", "CO")],
    outdoorRec: [allTrails("Salida", "colorado"), { label: "Salida Mountain Trails", url: "https://salidamountaintrails.org/" }],
    climate: [usClimateData("Salida", "colorado")],
    affordability: [bestPlaces("Salida", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Salida", url: "https://datausa.io/profile/geo/salida-co" }],
  },
  // === Carbondale ===
  8: {
    safety: [neighborhoodScout("Carbondale", "co")],
    recovery: [{ label: "The Meeting Place Carbondale", url: "https://meetingplacecarbondale.org" }, { label: "AA District 14", url: "https://coaadistrict14.org" }],
    meditation: [{ label: "Carbondale Yoga & Wellness", url: "https://www.carbondale.com/activity/yoga-wellness/" }],
    healthWellness: [{ label: "Valley View Hospital", url: "https://www.vvh.org" }],
    gyms: [{ label: "Carbondale Rec Center", url: "https://www.carbondalerec.com/" }],
    nutrition: [{ label: "Mana Foods", url: "https://www.carbondale.com/eat/mana-foods/" }],
    socialCommunity: [walkScore("Carbondale", "CO")],
    outdoorRec: [allTrails("Carbondale", "colorado"), { label: "Carbondale Skiing", url: "https://www.carbondale.com/activity/skiing-snowboarding/" }],
    climate: [usClimateData("Carbondale", "colorado")],
    affordability: [bestPlaces("Carbondale", "colorado")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Carbondale", url: "https://datausa.io/profile/geo/carbondale-co" }],
  },
  // === Westminster, MD ===
  14: {
    safety: [{ label: "CrimeGrade - Westminster", url: "https://crimegrade.org/safest-places-in-westminster-md/" }],
    recovery: [{ label: "District 9 AA (Carroll County)", url: "https://d9mdaa.org" }, { label: "Triangle Recovery Club", url: "https://trcofwestminster.com" }],
    meditation: [{ label: "Yelp - Westminster Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Westminster,+MD" }],
    healthWellness: [{ label: "Carroll Hospital (LifeBridge)", url: "https://www.lifebridgehealth.org/locations/carroll-hospital" }],
    gyms: [{ label: "Westminster Fitness Center", url: "https://www.westminstermd.gov/258/Westminster-Family-Fitness-Center" }],
    nutrition: [{ label: "Westminster Farmers Market", url: "https://downtownwestminsterfarmersmarket.com/" }],
    socialCommunity: [walkScore("Westminster", "MD")],
    outdoorRec: [allTrails("Westminster", "maryland"), { label: "Carroll County Rec & Parks", url: "https://www.carrollcountymd.gov/government/directory/recreation-parks/" }],
    climate: [usClimateData("Westminster", "maryland")],
    affordability: [bestPlaces("Westminster", "maryland")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Westminster MD", url: "https://datausa.io/profile/geo/westminster-md" }],
  },
  // === Boise ===
  15: {
    safety: [neighborhoodScout("Boise", "id")],
    recovery: [{ label: "Idaho Area 18 AA", url: "https://idahoarea18aa.org" }],
    meditation: [{ label: "Yelp - Boise Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Boise,+ID" }],
    healthWellness: [{ label: "Saint Alphonsus Health", url: "https://www.saintalphonsus.org" }],
    gyms: [{ label: "Yelp - Boise Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Boise,+ID" }],
    nutrition: [{ label: "Boise Co-op", url: "https://www.boise.coop" }],
    socialCommunity: [walkScore("Boise", "ID")],
    outdoorRec: [allTrails("Boise", "idaho"), { label: "Ridge to Rivers", url: "https://www.ridgetorivers.org" }],
    climate: [usClimateData("Boise", "idaho")],
    affordability: [bestPlaces("Boise", "idaho")],
    airQuality: [epaAirData, { label: "IQAir - Boise", url: "https://www.iqair.com/us/usa/idaho/boise" }],
    jobMarket: [{ label: "Data USA - Boise", url: "https://datausa.io/profile/geo/boise-city-id" }],
  },
  // === Asheville ===
  16: {
    safety: [neighborhoodScout("Asheville", "nc")],
    recovery: [{ label: "Asheville AA (District 70)", url: "https://ashevilleaa.org" }],
    meditation: [{ label: "Asheville Yoga Center", url: "https://www.ashevilleyogacenter.com" }],
    healthWellness: [{ label: "Mission Hospital", url: "https://www.missionhealth.org" }],
    gyms: [{ label: "Yelp - Asheville Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Asheville,+NC" }],
    nutrition: [{ label: "WNC Farmers Market", url: "https://www.asapconnections.org" }, { label: "French Broad Food Co-op", url: "https://www.frenchbroadfood.coop" }],
    socialCommunity: [walkScore("Asheville", "NC")],
    outdoorRec: [allTrails("Asheville", "north-carolina"), { label: "Pisgah National Forest", url: "https://www.fs.usda.gov/nfsnc/visiting/pisgah" }],
    climate: [usClimateData("Asheville", "north-carolina")],
    affordability: [bestPlaces("Asheville", "north-carolina")],
    airQuality: [epaAirData, { label: "ALA - Asheville", url: "https://www.lung.org/research/sota" }],
    jobMarket: [{ label: "Data USA - Asheville", url: "https://datausa.io/profile/geo/asheville-nc" }],
  },
  // === Bend ===
  17: {
    safety: [neighborhoodScout("Bend", "or")],
    recovery: [{ label: "Central Oregon Intergroup AA", url: "https://coigaa.org" }],
    meditation: [{ label: "Yelp - Bend Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Bend,+OR" }],
    healthWellness: [{ label: "St. Charles Health System", url: "https://www.stcharleshealthcare.org" }],
    gyms: [{ label: "Yelp - Bend Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Bend,+OR" }],
    nutrition: [{ label: "Central Oregon Locavore", url: "https://www.centraloregonlocavore.org" }],
    socialCommunity: [walkScore("Bend", "OR")],
    outdoorRec: [allTrails("Bend", "oregon"), { label: "Visit Bend - Trails", url: "https://www.visitbend.com/things-to-do/outdoor-activities/" }],
    climate: [usClimateData("Bend", "oregon")],
    affordability: [bestPlaces("Bend", "oregon")],
    airQuality: [epaAirData, { label: "OR DEQ - Air Quality", url: "https://www.oregon.gov/deq/aq" }],
    jobMarket: [{ label: "Data USA - Bend", url: "https://datausa.io/profile/geo/bend-or" }, { label: "City of Bend Economic Data", url: "https://www.bendoregon.gov/government/departments/economic-development" }],
  },
  // === Sedona ===
  18: {
    safety: [neighborhoodScout("Sedona", "az")],
    recovery: [{ label: "Better Addiction Care - Sedona", url: "https://betteraddictioncare.com/meetings/arizona/sedona/" }],
    meditation: [{ label: "Sedona.net Yoga", url: "https://www.sedona.net/yoga" }, { label: "Sedona Meditation Center", url: "https://www.sedonameditationcenter.com" }],
    healthWellness: [{ label: "Verde Valley Medical Center", url: "https://www.nahealth.com" }],
    gyms: [{ label: "Yelp - Sedona Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Sedona,+AZ" }],
    nutrition: [{ label: "Sedona Farmers Market", url: "https://sedona-farmers-market.com/" }],
    socialCommunity: [walkScore("Sedona", "AZ")],
    outdoorRec: [allTrails("Sedona", "arizona"), { label: "Coconino NF - Red Rock", url: "https://www.fs.usda.gov/recarea/coconino/recreation/recarea/?recid=54892" }],
    climate: [usClimateData("Sedona", "arizona")],
    affordability: [bestPlaces("Sedona", "arizona")],
    airQuality: [epaAirData, { label: "IQAir - Sedona", url: "https://www.iqair.com/us/usa/arizona/sedona" }],
    jobMarket: [{ label: "Data USA - Sedona", url: "https://datausa.io/profile/geo/sedona-az" }],
  },
  // === Santa Fe ===
  19: {
    safety: [neighborhoodScout("Santa Fe", "nm")],
    recovery: [{ label: "Santa Fe AA", url: "https://santafeaa.org/" }, { label: "Friendship Club Santa Fe", url: "https://friendshipclubsantafe.org/" }],
    meditation: [{ label: "Upaya Zen Center", url: "https://www.upaya.org" }],
    healthWellness: [{ label: "CHRISTUS St. Vincent", url: "https://www.christushealth.org/st-vincent" }],
    gyms: [{ label: "Yelp - Santa Fe Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Santa+Fe,+NM" }],
    nutrition: [{ label: "Santa Fe Farmers' Market", url: "https://santafefarmersmarket.com/" }, { label: "La Montanita Co-op", url: "https://www.lamontanita.coop" }],
    socialCommunity: [walkScore("Santa_Fe", "NM")],
    outdoorRec: [allTrails("Santa Fe", "new-mexico"), { label: "Ski Santa Fe", url: "https://www.skisantafe.com/" }],
    climate: [usClimateData("Santa Fe", "new-mexico")],
    affordability: [bestPlaces("Santa Fe", "new-mexico")],
    airQuality: [epaAirData, { label: "ALA - New Mexico", url: "https://www.lung.org/research/sota/city-rankings/states/new-mexico" }],
    jobMarket: [{ label: "Data USA - Santa Fe", url: "https://datausa.io/profile/geo/santa-fe-nm" }, { label: "BLS - Santa Fe", url: "https://www.bls.gov/eag/eag.nm_santafe_msa.htm" }],
  },
  // === Canton ===
  20: {
    safety: baltimoreSafety,
    recovery: baltimoreRecovery,
    meditation: [{ label: "The Hall of SELF", url: "https://www.thehallofselfbaltimore.com" }],
    healthWellness: [{ label: "Johns Hopkins Hospital", url: "https://www.hopkinsmedicine.org" }],
    gyms: [{ label: "Merritt Clubs Canton", url: "https://www.merrittclubs.com" }],
    nutrition: [{ label: "MOM's Organic Market", url: "https://momsorganicmarket.com" }],
    socialCommunity: [walkScore("Canton", "MD")],
    outdoorRec: [allTrails("Baltimore", "maryland"), { label: "Patapsco Valley State Park", url: "https://dnr.maryland.gov/publiclands/pages/central/patapsco.aspx" }],
    climate: [usClimateData("Baltimore", "maryland")],
    affordability: [bestPlaces("Baltimore", "maryland"), { label: "RentHop - Canton", url: "https://www.renthop.com/average-rent-in/canton-baltimore-md" }],
    airQuality: [epaAirData, { label: "IQAir - Baltimore", url: "https://www.iqair.com/us/usa/maryland/baltimore" }],
    jobMarket: [{ label: "Data USA - Baltimore", url: "https://datausa.io/profile/geo/baltimore-city-md" }],
  },
  // === Fells Point ===
  21: {
    safety: baltimoreSafety,
    recovery: baltimoreRecovery,
    meditation: [{ label: "YogaWorks Fells Point", url: "https://www.yogaworks.com" }],
    healthWellness: [{ label: "Johns Hopkins Hospital", url: "https://www.hopkinsmedicine.org" }],
    gyms: [{ label: "Yelp - Fells Point Fitness", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Fells+Point,+Baltimore,+MD" }],
    nutrition: [{ label: "Fells Point Farmers' Market", url: "https://fellspointmainstreet.org/farmers-market/" }],
    socialCommunity: [walkScore("Fells_Point-Baltimore", "MD")],
    outdoorRec: [allTrails("Baltimore", "maryland")],
    climate: [usClimateData("Baltimore", "maryland")],
    affordability: [bestPlaces("Baltimore", "maryland"), { label: "Zumper - Fells Point", url: "https://www.zumper.com/rent-research/baltimore-md/fells-point" }],
    airQuality: [epaAirData, { label: "IQAir - Baltimore", url: "https://www.iqair.com/us/usa/maryland/baltimore" }],
    jobMarket: [{ label: "Data USA - Baltimore", url: "https://datausa.io/profile/geo/baltimore-city-md" }],
  },
  // === DC: Dupont / Adams Morgan ===
  22: {
    safety: dcSafety,
    recovery: [...dcRecovery, { label: "Dupont Circle Club", url: "https://dupontcircleclub.org" }],
    meditation: [{ label: "Kadampa Meditation Center DC", url: "https://meditationindc.org" }, { label: "Insight Meditation Community", url: "https://www.imcw.org" }],
    healthWellness: [{ label: "GW University Hospital", url: "https://www.gwhospital.com" }],
    gyms: [{ label: "Yelp - Dupont Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Dupont+Circle,+Washington,+DC" }],
    nutrition: [{ label: "FRESHFARM Dupont Market", url: "https://freshfarm.org/markets" }],
    socialCommunity: [walkScore("Dupont_Circle-Washington", "DC")],
    outdoorRec: [allTrails("Washington", "district-of-columbia"), { label: "Rock Creek Park (NPS)", url: "https://www.nps.gov/rocr/" }],
    climate: [usClimateData("Washington", "district-of-columbia")],
    affordability: [bestPlaces("Washington", "district_of_columbia"), { label: "RentCafe - Dupont", url: "https://www.rentcafe.com/average-rent-market-trends/us/dc/washington/dupont-circle/" }],
    airQuality: [epaAirData, { label: "IQAir - DC", url: "https://www.iqair.com/us/usa/district-of-columbia/washington-d-c" }],
    jobMarket: [{ label: "Data USA - Washington DC", url: "https://datausa.io/profile/geo/washington-dc" }, { label: "DC Policy Center - Remote Work", url: "https://www.dcpolicycenter.org" }],
  },
  // === DC: Georgetown ===
  23: {
    safety: dcSafety,
    recovery: dcRecovery,
    meditation: [{ label: "Down Dog Yoga Georgetown", url: "https://www.downdogyoga.com" }],
    healthWellness: [{ label: "MedStar Georgetown Hospital", url: "https://www.medstargeorgetown.org" }],
    gyms: [{ label: "Yelp - Georgetown Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Georgetown,+Washington,+DC" }],
    nutrition: [{ label: "FRESHFARM - Georgetown", url: "https://freshfarm.org/markets" }],
    socialCommunity: [walkScore("Georgetown-Washington", "DC")],
    outdoorRec: [allTrails("Washington", "district-of-columbia"), { label: "C&O Canal (NPS)", url: "https://www.nps.gov/choh/" }, { label: "Capital Crescent Trail", url: "https://www.cctrail.org" }],
    climate: [usClimateData("Washington", "district-of-columbia")],
    affordability: [bestPlaces("Washington", "district_of_columbia"), { label: "RentCafe - Georgetown", url: "https://www.rentcafe.com/average-rent-market-trends/us/dc/washington/georgetown/" }],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Washington DC", url: "https://datausa.io/profile/geo/washington-dc" }],
  },
  // === Tampa: Hyde Park/SoHo ===
  25: {
    safety: [neighborhoodScout("Hyde Park", "fl"), { label: "CrimeGrade - Hyde Park", url: "https://crimegrade.org/violent-crime-hyde-park-tampa-fl/" }],
    recovery: [{ label: "Tampa AA", url: "https://aatampa-area.org/" }, { label: "Tampa NA", url: "https://www.tampa-na.org/meetings/" }],
    meditation: [{ label: "Bella Prana Collective", url: "https://bellaprana.com/" }],
    healthWellness: [{ label: "Tampa General Hospital", url: "https://www.tgh.org/" }],
    gyms: [{ label: "CrossFit Hyde Park", url: "https://www.crossfithydepark.com/" }, { label: "Yelp - Hyde Park Fitness", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Hyde+Park,+Tampa,+FL" }],
    nutrition: [{ label: "Hyde Park Village Fresh Market", url: "https://www.tampabaymarkets.com/fresh-market-at-hyde-park-village" }],
    socialCommunity: [walkScore("Hyde_Park-Tampa", "FL"), { label: "Tampa Bay Club Sport", url: "https://www.tampabayclubsport.com/" }],
    outdoorRec: [allTrails("Tampa", "florida"), { label: "Bayshore Linear Park Trail", url: "https://greatruns.com/tampa-bayshore-linear-park-trail/" }],
    climate: [usClimateData("Tampa", "florida")],
    affordability: [bestPlaces("Tampa", "florida")],
    airQuality: [epaAirData, { label: "AQI Tampa", url: "https://www.aqi.in/us/dashboard/united-states/florida/tampa" }],
    jobMarket: [{ label: "Data USA - Tampa", url: "https://datausa.io/profile/geo/tampa-fl" }, { label: "FRED - Tampa MSA", url: "https://fred.stlouisfed.org/series/TAMP312URN" }],
    events: [{ label: "Sports in Tampa Bay - Wikipedia", url: "https://en.wikipedia.org/wiki/Sports_in_the_Tampa_Bay_area" }, { label: "Visit Tampa Bay Events", url: "https://www.visittampabay.com/events/" }],
  },
  // === Tampa: Channelside ===
  26: {
    safety: [neighborhoodScout("Channel District", "fl")],
    recovery: [{ label: "Tampa AA", url: "https://aatampa-area.org/" }, { label: "Tampa NA", url: "https://www.tampa-na.org/meetings/" }],
    meditation: [{ label: "Bella Prana Collective", url: "https://bellaprana.com/" }],
    healthWellness: [{ label: "Tampa General Hospital", url: "https://www.tgh.org/" }],
    gyms: [{ label: "Life Time Water Street", url: "https://www.lifetime.life/life-time-locations/fl-tampa.html" }],
    nutrition: [{ label: "Water Street Market", url: "https://waterstreettampa.com/" }],
    socialCommunity: [walkScore("Channel_District-Tampa", "FL"), { label: "Tampa Bay Club Sport", url: "https://www.tampabayclubsport.com/" }],
    outdoorRec: [allTrails("Tampa", "florida"), { label: "Tampa Riverwalk", url: "https://www.tampa.gov/riverwalk" }],
    climate: [usClimateData("Tampa", "florida")],
    affordability: [bestPlaces("Tampa", "florida")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Tampa", url: "https://datausa.io/profile/geo/tampa-fl" }],
    events: [{ label: "Amalie Arena", url: "https://www.amaliearena.com/" }, { label: "Sports in Tampa Bay", url: "https://en.wikipedia.org/wiki/Sports_in_the_Tampa_Bay_area" }],
  },
  // === Tampa: Downtown ===
  27: {
    safety: [neighborhoodScout("Tampa", "fl")],
    recovery: [{ label: "Tampa AA", url: "https://aatampa-area.org/" }, { label: "Tampa NA", url: "https://www.tampa-na.org/meetings/" }],
    meditation: [{ label: "Bella Prana Collective", url: "https://bellaprana.com/" }],
    healthWellness: [{ label: "Tampa General Hospital", url: "https://www.tgh.org/" }],
    gyms: [{ label: "Life Time Water Street", url: "https://www.lifetime.life/life-time-locations/fl-tampa.html" }],
    nutrition: [{ label: "Water Street Market", url: "https://waterstreettampa.com/" }],
    socialCommunity: [walkScore("Downtown-Tampa", "FL"), { label: "Tampa Bay Club Sport", url: "https://www.tampabayclubsport.com/" }],
    outdoorRec: [allTrails("Tampa", "florida"), { label: "Curtis Hixon Park", url: "https://www.tampa.gov/parks-and-recreation/featured-parks/curtis-hixon" }],
    climate: [usClimateData("Tampa", "florida")],
    affordability: [bestPlaces("Tampa", "florida")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Tampa", url: "https://datausa.io/profile/geo/tampa-fl" }],
    events: [{ label: "Tampa Downtown Partnership Events", url: "https://www.tampasdowntown.com/community-events/" }, { label: "Sports in Tampa Bay", url: "https://en.wikipedia.org/wiki/Sports_in_the_Tampa_Bay_area" }],
  },
  // === Tampa: Seminole Heights ===
  28: {
    safety: [{ label: "CrimeGrade - Seminole Heights", url: "https://crimegrade.org/safest-places-in-seminole-heights-tampa-fl/" }],
    recovery: [{ label: "Tampa AA", url: "https://aatampa-area.org/" }, { label: "Tampa NA", url: "https://www.tampa-na.org/meetings/" }],
    meditation: [{ label: "Lucky Cat Yoga", url: "https://luckycatyoga.com/" }],
    healthWellness: [{ label: "Tampa General Hospital", url: "https://www.tgh.org/" }],
    gyms: [{ label: "Yelp - Seminole Heights Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Seminole+Heights,+Tampa,+FL" }],
    nutrition: [{ label: "Seminole Heights Sunday Market", url: "https://www.tampabaymarkets.com/seminole-heights-sunday-market" }, { label: "Sprouts Tampa Heights", url: "https://www.sprouts.com/store/fl/tampa/636-tampa-heights/" }],
    socialCommunity: [walkScore("Seminole_Heights-Tampa", "FL"), { label: "Run The Heights", url: "https://runclubtampa.com/runtheheights/" }],
    outdoorRec: [allTrails("Tampa", "florida"), { label: "Hillsborough River State Park", url: "https://www.alltrails.com/parks/us/florida/hillsborough-river-state-park" }],
    climate: [usClimateData("Tampa", "florida")],
    affordability: [bestPlaces("Tampa", "florida")],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Tampa", url: "https://datausa.io/profile/geo/tampa-fl" }],
    events: [{ label: "Sports in Tampa Bay", url: "https://en.wikipedia.org/wiki/Sports_in_the_Tampa_Bay_area" }],
  },
  // === Austin neighborhoods (shared metro sources) ===
  ...Object.fromEntries([29, 30, 31, 32].map(id => [id, {
    safety: [neighborhoodScout("Austin", "tx"), { label: "CrimeGrade - Austin", url: "https://crimegrade.org/violent-crime-austin-tx/" }],
    recovery: [{ label: "Hill Country Intergroup AA", url: "https://austinaa.org/meetings/" }, { label: "Austin Galano Club", url: "https://austingalanoclub.org" }],
    meditation: [{ label: "Yelp - Austin Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Austin,+TX" }, { label: "Black Swan Yoga", url: "https://blackswanyoga.com" }],
    healthWellness: [{ label: "St. David's HealthCare", url: "https://stdavids.com" }, { label: "Dell Medical School", url: "https://dellmed.utexas.edu" }],
    gyms: [{ label: "Yelp - Austin Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Austin,+TX" }, { label: "ClassPass - Austin", url: "https://classpass.com/search/austin/fitness" }],
    nutrition: [{ label: "Wheatsville Co-op", url: "https://wheatsville.coop" }, { label: "SFC Farmers Markets", url: "https://sustainablefoodcenter.org" }],
    socialCommunity: [walkScore("Austin", "TX"), { label: "Austin Sports & Social Club", url: "https://www.austinsportsandsocialclub.com" }, { label: "Austin Runners Club", url: "https://austinrunners.org/" }],
    outdoorRec: [allTrails("Austin", "texas"), { label: "Barton Creek Greenbelt", url: "https://www.austintexas.gov/department/barton-creek-greenbelt" }, { label: "Zilker Park", url: "https://www.austintexas.gov/department/zilker-metropolitan-park" }],
    climate: [usClimateData("Austin", "texas"), bestPlaces("Austin", "texas")],
    affordability: [bestPlaces("Austin", "texas"), { label: "RentCafe - Austin", url: "https://www.rentcafe.com/average-rent-market-trends/us/tx/austin/" }],
    airQuality: [epaAirData, { label: "City of Austin Air Quality", url: "https://data.austintexas.gov/stories/s/HE-D-1-Number-of-Days-Per-Year-of-Good-Air-Quality/nfyy-i9cj/" }],
    jobMarket: [{ label: "Dallas Fed - Austin", url: "https://www.dallasfed.org/research/indicators/aus" }, { label: "Data USA - Austin", url: "https://datausa.io/profile/geo/austin-tx" }],
    events: [{ label: "ACL Festival", url: "https://www.aclfestival.com" }, { label: "SXSW", url: "https://www.sxsw.com" }, { label: "Austin FC", url: "https://www.austinfc.com" }, { label: "Circuit of the Americas", url: "https://circuitoftheamericas.com/" }],
  }])),
  // === Alexandria VA ===
  33: {
    safety: [neighborhoodScout("Alexandria", "va"), { label: "PlainCrime - Alexandria", url: "https://plaincrime.com/city/alexandria-va" }],
    recovery: [{ label: "WAIA DC Metro AA", url: "https://aa-dc.org/meetings" }, { label: "Chesapeake & Potomac NA", url: "https://www.cprna.org" }],
    meditation: [{ label: "Sun & Moon Yoga", url: "https://www.sunandmoonstudio.com" }, { label: "Yelp - Alexandria Yoga", url: "https://www.yelp.com/search?cflt=yoga&find_loc=Alexandria,+VA" }],
    healthWellness: [{ label: "Inova Alexandria Hospital", url: "https://www.inova.org/our-services/inova-alexandria-hospital" }],
    gyms: [{ label: "Yelp - Alexandria Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Alexandria,+VA" }],
    nutrition: [{ label: "Old Town Farmers Market", url: "https://www.alexandriava.gov/FarmersMarket" }, { label: "Visit Alexandria Markets", url: "https://visitalexandria.com/things-to-do/farmers-markets/" }],
    socialCommunity: [walkScore("Alexandria", "VA"), { label: "Volo City DC", url: "https://www.volosports.com/Washington-DC" }, { label: "Pacers Running", url: "https://www.runpacers.com" }],
    outdoorRec: [allTrails("Alexandria", "virginia"), { label: "Mount Vernon Trail (NPS)", url: "https://www.nps.gov/gwmp/planyourvisit/mountvernontrail.htm" }],
    climate: [usClimateData("Alexandria", "virginia"), bestPlaces("Alexandria", "virginia")],
    affordability: [bestPlaces("Alexandria", "virginia"), { label: "RentCafe - Alexandria", url: "https://www.rentcafe.com/average-rent-market-trends/us/va/alexandria/" }],
    airQuality: [epaAirData, { label: "IQAir - DC Metro", url: "https://www.iqair.com/us/usa/district-of-columbia/washington-d-c" }],
    jobMarket: [{ label: "Data USA - Alexandria", url: "https://datausa.io/profile/geo/alexandria-va" }],
    events: [{ label: "Visit Alexandria Events", url: "https://visitalexandria.com/events/" }, { label: "Sports in DC - Wikipedia", url: "https://en.wikipedia.org/wiki/Sports_in_Washington,_D.C." }],
  },
  // === Arlington VA ===
  34: {
    safety: [neighborhoodScout("Arlington", "va"), { label: "ARLnow Crime Trends", url: "https://www.arlnow.com/tag/crime/" }],
    recovery: [{ label: "WAIA DC Metro AA", url: "https://aa-dc.org/meetings" }, { label: "Chesapeake & Potomac NA", url: "https://www.cprna.org" }],
    meditation: [{ label: "CorePower Yoga", url: "https://www.corepoweryoga.com" }, { label: "Mind the Mat", url: "https://www.mindthemat.com" }],
    healthWellness: [{ label: "Virginia Hospital Center", url: "https://www.virginiahospitalcenter.com" }],
    gyms: [{ label: "Yelp - Arlington Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Arlington,+VA" }],
    nutrition: [{ label: "Arlington Farmers Market", url: "https://www.arlingtonva.us/Government/Programs/Sustainability/Food" }],
    socialCommunity: [walkScore("Arlington", "VA"), { label: "Volo City DC", url: "https://www.volosports.com/Washington-DC" }, { label: "DC Fray", url: "https://dcfray.com/" }],
    outdoorRec: [allTrails("Arlington", "virginia"), { label: "W&OD Trail", url: "https://www.novaparks.com/parks/washington-and-old-dominion-railroad-regional-park" }, { label: "Mount Vernon Trail", url: "https://www.nps.gov/gwmp/planyourvisit/mountvernontrail.htm" }],
    climate: [usClimateData("Arlington", "virginia")],
    affordability: [bestPlaces("Arlington", "virginia"), { label: "Zillow - Arlington", url: "https://www.zillow.com/rental-manager/market-trends/arlington-va/" }],
    airQuality: [epaAirData],
    jobMarket: [{ label: "FRED - Arlington Unemployment", url: "https://fred.stlouisfed.org/series/VAARLI0URN" }, { label: "Data USA - Arlington", url: "https://datausa.io/profile/geo/arlington-county-va" }],
    events: [{ label: "Sports in DC - Wikipedia", url: "https://en.wikipedia.org/wiki/Sports_in_Washington,_D.C." }],
  },
  // === Frederick MD ===
  35: {
    safety: [neighborhoodScout("Frederick", "md"), { label: "CrimeGrade - Frederick", url: "https://crimegrade.org/safest-places-in-frederick-md/" }],
    recovery: [{ label: "Maryland General Service AA", url: "https://www.marylandaa.org" }],
    meditation: [{ label: "Yoga Center of Frederick", url: "https://www.yogacenteroffrederick.com" }],
    healthWellness: [{ label: "Frederick Health Hospital", url: "https://www.frederickhealth.org" }],
    gyms: [{ label: "Yelp - Frederick Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Frederick,+MD" }],
    nutrition: [{ label: "Common Market Co-op", url: "https://www.commonmarket.coop" }, { label: "West Frederick Farmers Market", url: "https://westfrederickfarmersmarket.org" }],
    socialCommunity: [walkScore("Frederick", "MD"), { label: "Frederick Steeplechasers", url: "https://www.steeplechasers.org" }],
    outdoorRec: [allTrails("Frederick", "maryland"), { label: "Catoctin Mountain Park (NPS)", url: "https://www.nps.gov/cato/planyourvisit/hiking.htm" }, { label: "Cunningham Falls State Park", url: "https://dnr.maryland.gov/publiclands/pages/western/cunninghamfalls.aspx" }],
    climate: [usClimateData("Frederick", "maryland"), bestPlaces("Frederick", "maryland")],
    affordability: [bestPlaces("Frederick", "maryland"), { label: "Redfin - Frederick", url: "https://www.redfin.com/city/7735/MD/Frederick/housing-market" }],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Frederick", url: "https://datausa.io/profile/geo/frederick-md" }],
    events: [{ label: "Visit Frederick Events", url: "https://www.visitfrederick.org/events/" }, { label: "Weinberg Center", url: "https://weinbergcenter.org" }],
  },
  // === DC: Columbia Heights / Petworth ===
  24: {
    safety: dcSafety,
    recovery: dcRecovery,
    meditation: [{ label: "Yoga District", url: "https://www.yogadistrict.com" }],
    healthWellness: [{ label: "Howard University Hospital", url: "https://www.huhealthcare.com" }],
    gyms: [{ label: "Yelp - Columbia Heights Gyms", url: "https://www.yelp.com/search?cflt=gyms&find_loc=Columbia+Heights,+Washington,+DC" }],
    nutrition: [{ label: "FRESHFARM Columbia Heights", url: "https://freshfarm.org/markets" }, { label: "Yes! Organic Market", url: "https://www.yesorganicmarket.com" }],
    socialCommunity: [walkScore("Columbia_Heights-Washington", "DC")],
    outdoorRec: [allTrails("Washington", "district-of-columbia"), { label: "Rock Creek Park (NPS)", url: "https://www.nps.gov/rocr/" }],
    climate: [usClimateData("Washington", "district-of-columbia")],
    affordability: [bestPlaces("Washington", "district_of_columbia"), { label: "RentCafe - Columbia Heights", url: "https://www.rentcafe.com/average-rent-market-trends/us/dc/washington/columbia-heights/" }],
    airQuality: [epaAirData],
    jobMarket: [{ label: "Data USA - Washington DC", url: "https://datausa.io/profile/geo/washington-dc" }],
  },
};
