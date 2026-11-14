// NASA Mars Missions & Scientific Datasets
// Curated from NASA JPL Mars Trek, USGS Astrogeology, MGS MOLA, MRO HiRISE/CRISM, Curiosity (MSL) & Perseverance (Mars 2020)

export const MARS_EXPLORATION_ZONES = {
  gale: {
    id: 'gale',
    name: 'Gale Crater / Mount Sharp',
    subtitle: 'Curiosity Rover Exploration Zone & Boxwork Formations',
    center: [-4.65, 137.4],
    zoom: 11,
    landingSite: 'Bradbury Landing (-4.5895°, 137.4417°)',
    rover: 'Curiosity (MSL)',
    solActive: 5073,
    description: 'An ancient 154 km impact basin hosting Mount Sharp (Aeolis Mons), rising 5.5 km above the crater floor. Famous for layered sedimentary rocks, smectite clays, sulfate salts, and newly discovered boxwork honeycomb mineral networks formed by ancient groundwater.',
    elevationSpan: '-4,500m to -1,200m',
    primaryScience: 'Habitability transition from ancient wet freshwater lake to hyper-arid sulfate environment; Boxwork mineral vein genesis.',
    baseTiles: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    defaultMissionId: 'mission_boxwork',
    waypoints: [
      {
        id: 'gw-1',
        name: 'Camp Alpha (Bradbury Base)',
        lat: -4.5895,
        lng: 137.4417,
        elevation: -4450,
        type: 'base',
        hazard: 'Low',
        slopeDeg: 2.1,
        mineralogy: 'Basaltic Regolith',
        scienceGoal: 'Deploy pressurized crew habitat & initialize telemetry link with MRO orbiter relay.',
        notes: 'Landing ellipse nominal flat alluvial plain. Minimal obstacle density.',
        sampleTarget: null,
        img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/00002/soas/fdr/fcam/FLB_397681429EDR_F0010008AUT_04095M_.JPG'
      },
      {
        id: 'gw-2',
        name: 'Yellowknife Bay Mudstone Outcrop',
        lat: -4.6210,
        lng: 137.4280,
        elevation: -4495,
        type: 'science',
        hazard: 'Low',
        slopeDeg: 4.5,
        mineralogy: 'Phyllosilicates (Smectite Clays), Magnetite, Gypsum Veins',
        scienceGoal: 'Percussive drill sample to test for ancient neutral pH lakebed habitability biomarkers.',
        notes: 'Fine-grained mudstone sediments deposited in ancient tranquil lake.',
        sampleTarget: 'Sample Tube G-01: John Klein Core',
        img: 'https://mars.nasa.gov/msl-raw-images/mosaics/sol130/mastcam/PIA16834_YellowknifeBay_fig1_browse.jpg'
      },
      {
        id: 'gw-3',
        name: 'Bagnold Dune Field Bypass',
        lat: -4.6850,
        lng: 137.3950,
        elevation: -4310,
        type: 'hazard',
        hazard: 'Extreme (Sand Trap)',
        slopeDeg: 14.8,
        thermalInertia: 'Low (Loose Fine Sand)',
        scienceGoal: 'Atmospheric boundary layer aeolian transport measurements; avoid driving rover onto dune crests.',
        notes: 'Active barchanoid basaltic dunes. Wheel slip exceeds 60%. Walking requires snowshoe-style regolith cleats.',
        sampleTarget: null,
        img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01174/soas/fdr/fcam/FLB_502096738EDR_F0511116FHAZ00304M_.JPG'
      },
      {
        id: 'gw-4',
        name: 'Vera Rubin Ridge (Hematite Crest)',
        lat: -4.7290,
        lng: 137.3820,
        elevation: -4180,
        type: 'science',
        hazard: 'Medium (Steep Slope)',
        slopeDeg: 19.2,
        mineralogy: 'Crystalline Gray Hematite, Iron Oxides, Jarosite',
        scienceGoal: 'Raman and APXS spectral interrogation of groundwater oxidation-reduction interface.',
        notes: 'Erosion-resistant bedrock bench. Requires hand-hold ascent and tether lines.',
        sampleTarget: 'Sample Tube G-02: Stoer Gray Hematite Core',
        img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01926/soas/fdr/fcam/FLB_568600108EDR_F0672044FHAZ00337M_.JPG'
      },
      {
        id: 'gw-5',
        name: 'Gediz Vallis Debris Flow Channel',
        lat: -4.7820,
        lng: 137.3550,
        elevation: -3980,
        type: 'waypoint',
        hazard: 'High (Boulder Field)',
        slopeDeg: 16.5,
        mineralogy: 'Polymict Boulders, Magnesium Sulfate, Silica',
        scienceGoal: 'Investigate evidence of late-stage catastrophic liquid water debris flow torrents.',
        notes: 'Car-sized megablocks of upper Mount Sharp strata washed down canyon.',
        sampleTarget: 'Sample Tube G-03: Gediz Vallis Ridge Conglomerate',
        img: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03880/soas/fdr/fcam/FLB_742137599EDR_F1020000FHAZ00304M_.JPG'
      },
      {
        id: 'gw-6',
        name: 'Mount Sharp Boxwork Ridge Formations',
        lat: -4.8350,
        lng: 137.3200,
        elevation: -3750,
        type: 'primary-objective',
        hazard: 'Medium (Knife-edge Ridges)',
        slopeDeg: 12.0,
        mineralogy: 'Polygonal Sulfate Vein Networks, Silicified Quartz, Calcite',
        scienceGoal: 'PRIMARY MISSION OBJECTIVE: Map and collect pristine fracture-fill boxwork ridges created by pressurized mineralizing hydrothermal fluids during late Mars climate drying.',
        notes: 'Distinct honeycomb ridge networks spanning kilometers across sulfate-bearing strata. Never before sampled by humans.',
        sampleTarget: 'Sample Tube G-04: Boxwork Vein Matrix Core (Priority 1)',
        img: 'https://science.nasa.gov/wp-content/uploads/2024/09/boxwork-pia26388.jpg'
      }
    ],
    geologicalUnits: [
      { name: 'Yellowknife Mudstone', color: '#38bdf8', type: 'Smectite Clay' },
      { name: 'Murray Laminated Mudstone', color: '#818cf8', type: 'Lacustrine' },
      { name: 'Vera Rubin Ridge', color: '#f87171', type: 'Hematite Oxide' },
      { name: 'Glen Torridon Trough', color: '#34d399', type: 'Hydrated Phyllosilicates' },
      { name: 'Mirador Sandstone', color: '#fbbf24', type: 'Eolian Crossbedding' },
      { name: 'Sulfate Unit / Gediz Vallis', color: '#fb923c', type: 'Magnesium Sulfates' },
      { name: 'Boxwork Polygonal Ridges', color: '#e879f9', type: 'Hydrothermal Fracture Fills' }
    ]
  },
  
  jezero: {
    id: 'jezero',
    name: 'Jezero Crater & River Delta',
    subtitle: 'Perseverance Rover & Sample Return Exploration Zone',
    center: [18.42, 77.48],
    zoom: 11,
    landingSite: 'Octavia E. Butler Landing (18.4447° N, 77.4508° E)',
    rover: 'Perseverance (Mars 2020)',
    solActive: 2031,
    description: 'A 45 km diameter paleolake basin in Isidis Planitia. Ancient rivers breached the crater rim, depositing an exquisite preserved delta fan rich in clays, carbonates, and silica with exceptional biosignature preservation capability.',
    elevationSpan: '-2,550m to -2,100m',
    primaryScience: 'Search for biosignatures in deltaic river mudstones and carbonate margin units; collect sealed sample tubes for return to Earth.',
    baseTiles: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    defaultMissionId: 'mission_jezero_delta',
    waypoints: [
      {
        id: 'jw-1',
        name: 'Camp Butler (Octavia E. Butler Base)',
        lat: 18.4447,
        lng: 77.4508,
        elevation: -2540,
        type: 'base',
        hazard: 'Low',
        slopeDeg: 1.8,
        mineralogy: 'Pyroxene & Olivine-bearing Crater Floor Bedrock',
        scienceGoal: 'Commission base life support systems, check pressurized rover battery bank.',
        notes: 'Smooth, level igneous crater floor units. Excellent landing touchdown telemetry.',
        sampleTarget: null,
        img: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00003/ids/edr/browse/fcam/FLF_0003_0667087570_000ECM_N0010052AUT_04095_00_1J01.png'
      },
      {
        id: 'jw-2',
        name: 'Séítah South Sand Traverse',
        lat: 18.4230,
        lng: 77.4350,
        elevation: -2560,
        type: 'hazard',
        hazard: 'Extreme (Deep Sand / Dune Crests)',
        slopeDeg: 16.2,
        mineralogy: 'Olivine Cumulate Sand',
        scienceGoal: 'Skirt hazardous dunes along rocky outcrop ridge; inspect ancient layered igneous intrusion.',
        notes: 'Perseverance auto-navigation previously rerouted around this zone due to slip hazards.',
        sampleTarget: null,
        img: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00222/ids/edr/browse/zcam/ZL0_0222_0686940809_023ECM_N0010052AUT_04095_00_2J01.png'
      },
      {
        id: 'jw-3',
        name: 'Kodiak Butte (Delta Remnant)',
        lat: 18.4090,
        lng: 77.4080,
        elevation: -2480,
        type: 'waypoint',
        hazard: 'Medium (Rockfall Risk)',
        slopeDeg: 18.5,
        mineralogy: 'Deltaic Bottomset and Foreset Sediments',
        scienceGoal: 'Long-range telephoto imaging of delta layering geometry to determine ancient river lake level drops.',
        notes: 'Isolated mesa proving the ancient river delta once extended far across the crater floor.',
        sampleTarget: 'Sample Tube J-01: Kodiak Foreset Sandstone',
        img: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00078/ids/edr/browse/mcam/ML0_0078_0673753303_193ECM_N0010052AUT_04095_00_2J01.png'
      },
      {
        id: 'jw-4',
        name: 'Hawksbill Gap Delta Front Scarp',
        lat: 18.4550,
        lng: 77.3910,
        elevation: -2430,
        type: 'science',
        hazard: 'Medium (Climbing Incline)',
        slopeDeg: 13.5,
        mineralogy: 'Organic-rich Mudstone, Clay, Fe-Oxides',
        scienceGoal: 'Abrade surface rock with diamond bit; inspect with SHERLOC UV Raman fluorescence for aromatic organic carbon rings.',
        notes: 'Prime location for concentrated organics deposited where muddy river slowed entering lake.',
        sampleTarget: 'Sample Tube J-02: Wildcat Ridge Mudstone (High Organic Detection)',
        img: 'https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00525/ids/edr/browse/zcam/ZR0_0525_0713783457_012ECM_N0010052AUT_04095_00_2J01.png'
      },
      {
        id: 'jw-5',
        name: 'Bright Angel & Margin Unit Carbonates',
        lat: 18.5120,
        lng: 77.3480,
        elevation: -2290,
        type: 'primary-objective',
        hazard: 'Low-Medium',
        slopeDeg: 7.2,
        mineralogy: 'Magnesium Carbonates, Vivianite (Iron Phosphate), Silica',
        scienceGoal: 'PRIMARY MISSION OBJECTIVE: Sample "Cheyava Falls" rock featuring leopard-skin reduction reaction halos containing iron phosphate and potential biosignature organics.',
        notes: 'Carbonate rocks form a "bathtub ring" around Jezero. Minerals precipitate in alkaline lake water, sealing microbial microfossils.',
        sampleTarget: 'Sample Tube J-03: Cheyava Falls Biosignature Candidate Core',
        img: 'https://mars.nasa.gov/system/resources/detail_files/28080_PIA26372-web.jpg'
      }
    ],
    geologicalUnits: [
      { name: 'Crater Floor Igneous (Séítah)', color: '#a78bfa', type: 'Olivine Cumulate' },
      { name: 'Delta Lower Mudstones', color: '#38bdf8', type: 'Smectite/Clays' },
      { name: 'Delta Foreset Conglomerates', color: '#fbbf24', type: 'Fluvial Sands' },
      { name: 'Delta Top Boulder Bed', color: '#fb923c', type: 'Flooding Cobbles' },
      { name: 'Margin Unit Carbonates', color: '#34d399', type: 'Mg-Carbonates (Bathtub Ring)' }
    ]
  }
};

// Historical NASA Mars Landing Sites Catalog
export const NASA_HISTORICAL_SITES = [
  { name: 'Viking 1', year: 1976, lat: 22.27, lng: -47.95, mission: 'First successful Mars lander', status: 'Decommissioned' },
  { name: 'Viking 2', year: 1976, lat: 47.64, lng: 134.29, mission: 'Utopia Planitia lander', status: 'Decommissioned' },
  { name: 'Mars Pathfinder / Sojourner', year: 1997, lat: 19.33, lng: -33.55, mission: 'First robotic micro-rover', status: 'Decommissioned' },
  { name: 'Spirit (MER-A)', year: 2004, lat: -14.5684, lng: 175.4726, mission: 'Gusev Crater explorer', status: 'Decommissioned' },
  { name: 'Opportunity (MER-B)', year: 2004, lat: -1.9462, lng: -5.5266, mission: 'Meridiani Planum hematite explorer', status: 'Decommissioned' },
  { name: 'Phoenix Lander', year: 2008, lat: 68.2188, lng: -125.7492, mission: 'Subsurface water ice discovery', status: 'Decommissioned' },
  { name: 'Curiosity (MSL)', year: 2012, lat: -4.5895, lng: 137.4417, mission: 'Gale Crater & Mount Sharp exploration', status: 'Active (Sol 5070+)' },
  { name: 'InSight Lander', year: 2018, lat: 4.5024, lng: 135.6234, mission: 'Mars interior seismic & heat flow probe', status: 'Decommissioned' },
  { name: 'Perseverance & Ingenuity', year: 2021, lat: 18.4447, lng: 77.4508, mission: 'Jezero Delta biosignature sample collection', status: 'Active (Sol 2030+)' }
];

// Pre-packaged Scientific Expeditions (EVA Missions)
export const PREPACKAGED_MISSIONS = {
  mission_boxwork: {
    id: 'mission_boxwork',
    zoneId: 'gale',
    title: 'EVA-01: Mount Sharp Boxwork Ridge & Hydrothermal Survey',
    sol: 5074,
    leadExplorer: 'CDR. Sarah Chen & GEOL. Alex Rodriguez',
    primaryObjective: 'Traverse lower Mount Sharp to sample polygonal sulfate boxwork networks discovered in 2024-2025.',
    estimatedDurationMin: 340, // 5.6 hours
    totalDistanceKm: 8.6,
    ascentMeters: 700,
    descentMeters: 0,
    o2BudgetLiters: 1200,
    targetSamples: 4,
    recommendedSpeedKmH: 1.8,
    hazardSummary: 'Steep gravel slopes on Vera Rubin Ridge, wheel/boot slip on Bagnold dune margins. UV index severe at midday.'
  },
  mission_jezero_delta: {
    id: 'mission_jezero_delta',
    zoneId: 'jezero',
    title: 'EVA-02: Jezero Western Fan Delta & Carbonate Biosignature Loop',
    sol: 2032,
    leadExplorer: 'CDR. Sarah Chen & ASTROBIO. Marcus Vance',
    primaryObjective: 'Climb Hawksbill Gap scarp into Bright Angel margin unit to extract core samples from "Cheyava Falls" reduction spots.',
    estimatedDurationMin: 290, // 4.8 hours
    totalDistanceKm: 7.2,
    ascentMeters: 250,
    descentMeters: 20,
    o2BudgetLiters: 1100,
    targetSamples: 3,
    recommendedSpeedKmH: 2.1,
    hazardSummary: 'Fine dust deposits on delta scarp, boulder obstacles along ancient riverbed.'
  }
};

// NASA Mars Weather Live Baseline (Curiosity REMS & Perseverance MEDA fallback)
export const DEFAULT_MARS_WEATHER = {
  sol: 4995,
  terrestrial_date: '2026-08-25',
  min_temp: -71,
  max_temp: -5,
  pressure: 777, // Pascals (Earth is 101,325 Pa, Mars is ~0.7% Earth)
  pressure_string: 'Nominal High',
  atmo_opacity: 'Sunny / Low Dust',
  wind_speed: '4.2 m/s',
  wind_direction: 'ENE (68°)',
  local_uv_irradiance_index: 'High (Category 8)',
  ground_min_temp: -84,
  ground_max_temp: 4,
  radiation_dose: '0.24 mSv/day (Galactic Cosmic Ray nominal)',
  dust_tau: 0.38,
  sunrise: '06:46 MTC',
  sunset: '18:51 MTC'
};

// Calculation Utilities for Human Marswalks
export const EVA_PHYSICS = {
  gravityMars: 3.72, // m/s² (0.38g)
  suitWeightKg: 85, // NASA xEMU spacesuit mass
  astronautMassKg: 75,
  baseMetabolicRateKcalHr: 180,
  slopeMetabolicMultiplier: 8.5, // extra kcal/hr per degree of incline
  o2ConsumptionRateLiterMin: 1.25, // nominal walking O2 consumption
  o2ConsumptionSlopeMultiplier: 0.04, // extra L/min per degree
  batteryDrawWatts: 140, // life support, suit heaters, CO2 scrubber
  totalBatteryWh: 1500, // suit battery capacity
  safeSlopeLimitDeg: 20.0 // slopes steeper than 20° trigger hazard alarms
};
