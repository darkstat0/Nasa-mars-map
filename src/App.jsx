import React, { useState } from 'react';
import { 
  Map, 
  Globe, 
  Eye, 
  Camera, 
  BookOpen, 
  Navigation, 
  AlertTriangle, 
  Radio, 
  Layers, 
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  MARS_EXPLORATION_ZONES, 
  PREPACKAGED_MISSIONS, 
  DEFAULT_MARS_WEATHER 
} from './data/marsMissionData';
import MarsMap from './components/MarsMap';
import MarsGlobe3D from './components/MarsGlobe3D';
import AstronautHUD from './components/AstronautHUD';
import MissionPlanner from './components/MissionPlanner';
import MarsRawGallery from './components/MarsRawGallery';
import BoxworkScienceGuide from './components/BoxworkScienceGuide';
import MarsWeatherBar from './components/MarsWeatherBar';
import { marsAudio } from './utils/audioSystem';

export default function App() {
  // Navigation & View Mode: 'map', 'globe', 'hud', 'gallery'
  const [viewMode, setViewMode] = useState('map');

  // Active Exploration Zone: 'gale' or 'jezero'
  const [currentZoneId, setCurrentZoneId] = useState('gale');
  const zone = MARS_EXPLORATION_ZONES[currentZoneId];

  // Active Waypoints state (allows adding / removing custom waypoints)
  const [waypoints, setWaypoints] = useState(zone.waypoints);
  const [selectedWaypoint, setSelectedWaypoint] = useState(zone.waypoints[0]);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // Active Pre-packaged Mission
  const [selectedMission, setSelectedMission] = useState(
    PREPACKAGED_MISSIONS[zone.defaultMissionId]
  );

  // Custom Waypoint Add Mode
  const [isAddMode, setIsAddMode] = useState(false);

  // Science Dossier Modal
  const [showScienceGuide, setShowScienceGuide] = useState(false);

  // Live Mars Weather State
  const [weather, setWeather] = useState(DEFAULT_MARS_WEATHER);

  // Change Exploration Zone
  const handleSelectZone = (zoneId) => {
    marsAudio.playQuindarIntro();
    setCurrentZoneId(zoneId);
    const newZone = MARS_EXPLORATION_ZONES[zoneId];
    setWaypoints(newZone.waypoints);
    setSelectedWaypoint(newZone.waypoints[0]);
    setCurrentWaypointIndex(0);
    setSelectedMission(PREPACKAGED_MISSIONS[newZone.defaultMissionId]);
    setViewMode('map');
  };

  // Add custom waypoint on map click
  const handleAddWaypoint = (newWp) => {
    setWaypoints(prev => [...prev, newWp]);
    setSelectedWaypoint(newWp);
    setIsAddMode(false);
  };

  // Remove waypoint
  const handleRemoveWaypoint = (wpId) => {
    marsAudio.playBlip();
    setWaypoints(prev => {
      const filtered = prev.filter(w => w.id !== wpId);
      if (selectedWaypoint?.id === wpId) {
        setSelectedWaypoint(filtered[0] || null);
      }
      return filtered;
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-mars-dark text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. TOP MAIN NAVIGATION BAR */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-40 shrink-0">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          {/* NASA Meatball Badge Icon */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-red-600 flex items-center justify-center shadow-lg shadow-blue-950 border border-blue-400/40">
            <span className="font-orbitron font-extrabold text-[10px] text-white tracking-tighter">NASA</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-sm text-white tracking-wider">
                ARES-NAV
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mars-orange/20 text-mars-orange border border-mars-orange/30">
                2026 SPACE APPS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Layered Marswalk Navigation & Science Exploration System
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setViewMode('map');
              marsAudio.playBlip();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-mars-orange text-white shadow-md shadow-mars-orange/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden md:inline">EVA Map</span>
          </button>

          <button
            onClick={() => {
              setViewMode('hud');
              marsAudio.playQuindarIntro();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
              viewMode === 'hud'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visor HUD</span>
          </button>

          <button
            onClick={() => {
              setViewMode('globe');
              marsAudio.playBlip();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
              viewMode === 'globe'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mars 3D</span>
          </button>

          <button
            onClick={() => {
              setViewMode('gallery');
              marsAudio.playBlip();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-1.5 ${
              viewMode === 'gallery'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Raw Photos</span>
          </button>
        </div>

        {/* Right: Site Selector & Boxwork Dossier Button */}
        <div className="flex items-center gap-2">
          {/* Site Selector Dropdown */}
          <div className="relative">
            <select
              value={currentZoneId}
              onChange={(e) => handleSelectZone(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-500 text-white text-xs font-orbitron font-bold py-1.5 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none"
            >
              <option value="gale">Gale Crater (Mount Sharp)</option>
              <option value="jezero">Jezero Crater (Delta Fan)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Boxwork Science Dossier Button */}
          <button
            onClick={() => {
              setShowScienceGuide(true);
              marsAudio.playBlip();
            }}
            className="px-3 py-1.5 rounded-xl bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500 text-fuchsia-300 font-orbitron text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-fuchsia-950"
            title="Read Curiosity Boxwork Formations Science Guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="hidden lg:inline">Boxwork Dossier</span>
          </button>
        </div>

      </header>

      {/* 2. LIVE MARS WEATHER & SENSOR TELEMETRY SUB-BAR */}
      <MarsWeatherBar weather={weather} setWeather={setWeather} />

      {/* 3. MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 relative overflow-hidden flex">
        
        {/* VIEW 1: INTERACTIVE 2D TACTICAL EVA MAP & SIDEBAR */}
        {viewMode === 'map' && (
          <div className="w-full h-full flex flex-col md:flex-row relative">
            
            {/* Map Canvas (Left / Center) */}
            <div className="flex-1 h-full relative">
              <MarsMap
                zone={zone}
                waypoints={waypoints}
                onSelectWaypoint={(wp) => {
                  setSelectedWaypoint(wp);
                  const idx = waypoints.findIndex(w => w.id === wp.id);
                  if (idx !== -1) setCurrentWaypointIndex(idx);
                }}
                selectedWaypoint={selectedWaypoint}
                onAddWaypoint={handleAddWaypoint}
                onRemoveWaypoint={handleRemoveWaypoint}
                isAddMode={isAddMode}
                setIsAddMode={setIsAddMode}
              />
            </div>

            {/* Tactical Sidebar (Right: Mission Planner & Target Inspector) */}
            <div className="w-full md:w-96 lg:w-[420px] h-1/2 md:h-full shrink-0 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/95 flex flex-col z-20">
              
              {/* Selected Waypoint Detail Card (if one is selected) */}
              {selectedWaypoint && (
                <div className="p-3.5 bg-slate-900 border-b border-slate-800 shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        WAYPOINT TELEMETRY
                      </span>
                      <h3 className="text-sm font-orbitron font-bold text-white mt-1">
                        {selectedWaypoint.name}
                      </h3>
                    </div>
                    {selectedWaypoint.type === 'custom' && (
                      <button
                        onClick={() => handleRemoveWaypoint(selectedWaypoint.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-800 text-xs font-mono flex items-center gap-1"
                        title="Delete custom waypoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5">
                    {selectedWaypoint.scienceGoal}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">ELEVATION</span>
                      <span className="text-white font-bold">{selectedWaypoint.elevation}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">SLOPE INCLINE</span>
                      <span className={selectedWaypoint.slopeDeg > 15 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {selectedWaypoint.slopeDeg}°
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">MINERALOGY</span>
                      <span className="text-cyan-300 truncate block">{selectedWaypoint.mineralogy || 'Regolith'}</span>
                    </div>
                  </div>

                  {selectedWaypoint.sampleTarget && (
                    <div className="mt-2 p-2 rounded-lg bg-fuchsia-950/50 border border-fuchsia-500/40 text-[11px] font-mono text-fuchsia-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span>{selectedWaypoint.sampleTarget}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mission Planner Dossier */}
              <div className="flex-1 overflow-hidden">
                <MissionPlanner
                  zone={zone}
                  waypoints={waypoints}
                  selectedMission={selectedMission}
                  onSelectMission={setSelectedMission}
                  onOpenHUD={() => {
                    setViewMode('hud');
                    marsAudio.playQuindarIntro();
                  }}
                  onSelectWaypoint={(wp) => {
                    setSelectedWaypoint(wp);
                    const idx = waypoints.findIndex(w => w.id === wp.id);
                    if (idx !== -1) setCurrentWaypointIndex(idx);
                  }}
                  selectedWaypoint={selectedWaypoint}
                />
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: 3D MARS GLOBE EXPLORER */}
        {viewMode === 'globe' && (
          <MarsGlobe3D
            onSelectZone={handleSelectZone}
            currentZoneId={currentZoneId}
          />
        )}

        {/* VIEW 3: ASTRONAUT VISOR HUD SIMULATION */}
        {viewMode === 'hud' && (
          <AstronautHUD
            waypoints={waypoints}
            currentWaypointIndex={currentWaypointIndex}
            setCurrentWaypointIndex={setCurrentWaypointIndex}
            zone={zone}
            weather={weather}
            onExitHUD={() => setViewMode('map')}
          />
        )}

        {/* VIEW 4: RAW SURFACE IMAGES GALLERY */}
        {viewMode === 'gallery' && (
          <MarsRawGallery zone={zone} />
        )}

      </main>

      {/* 4. MODAL: BOXWORK SCIENCE DOSSIER */}
      {showScienceGuide && (
        <BoxworkScienceGuide onClose={() => setShowScienceGuide(false)} />
      )}

    </div>
  );
}

