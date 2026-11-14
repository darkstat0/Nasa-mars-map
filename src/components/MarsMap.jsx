import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Compass, 
  Maximize2, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Mountain,
  Flame,
  ShieldAlert,
  Info
} from 'lucide-react';
import { marsAudio } from '../utils/audioSystem';

export default function MarsMap({ 
  zone, 
  waypoints, 
  onSelectWaypoint, 
  selectedWaypoint, 
  onAddWaypoint, 
  onRemoveWaypoint,
  isAddMode,
  setIsAddMode
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layersGroupRef = useRef({});
  const routePolylineRef = useRef(null);
  const markersRef = useRef([]);

  // Active Map Layer States
  const [baseMap, setBaseMap] = useState('mola'); // 'mola', 'viking', 'themis'
  const [layerOpacity, setLayerOpacity] = useState({
    slopeHazard: 0.75,
    mineralogy: 0.7,
    thermalInertia: 0.6,
    radiation: 0.5,
    contours: 0.8
  });
  const [activeLayers, setActiveLayers] = useState({
    slopeHazard: true,
    mineralogy: true,
    thermalInertia: true,
    radiation: false,
    contours: true
  });
  const [mouseCoords, setMouseCoords] = useState({ lat: 0, lng: 0 });

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Plate Carrée projection for Mars: standard L.CRS.EPSG4326
    const map = L.map(mapContainerRef.current, {
      center: zone.center,
      zoom: zone.zoom,
      minZoom: 3,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    // Zoom controls in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Track mouse coordinates in Martian degrees
    map.on('mousemove', (e) => {
      setMouseCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4))
      });
    });

    // Map click handler for adding custom waypoints
    map.on('click', (e) => {
      if (isAddMode && onAddWaypoint) {
        onAddWaypoint({
          id: `custom-${Date.now()}`,
          name: `EVA Waypoint ${waypoints.length + 1}`,
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4)),
          elevation: Math.round(-4200 + Math.random() * 500),
          type: 'custom',
          hazard: 'Nominal',
          slopeDeg: Math.round(3 + Math.random() * 12),
          mineralogy: 'Regolith / Silt Breccia',
          scienceGoal: 'Astronaut field inspection & rock hammer strike test.',
          notes: 'Manually designated field target.',
          sampleTarget: null,
          img: null
        });
        marsAudio.playBlip();
      }
    });

    // Layer groups for science overlays
    layersGroupRef.current = {
      slopeHazard: L.layerGroup().addTo(map),
      mineralogy: L.layerGroup().addTo(map),
      thermalInertia: L.layerGroup().addTo(map),
      radiation: L.layerGroup().addTo(map),
      contours: L.layerGroup().addTo(map),
      markers: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map)
    };

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [zone.id]);

  // 2. Update Base Tile Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (layersGroupRef.current.baseTile) {
      map.removeLayer(layersGroupRef.current.baseTile);
    }

    let tileLayer;
    if (baseMap === 'mola') {
      // NASA MGS MOLA Elevation & Shaded Relief
      tileLayer = L.tileLayer('https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg', {
        maxZoom: 14,
        maxNativeZoom: 7,
        attribution: 'NASA/JPL/GSFC Mars MOLA'
      });
    } else if (baseMap === 'viking') {
      // NASA Viking Color Mosaic
      tileLayer = L.tileLayer('https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg', {
        maxZoom: 14,
        maxNativeZoom: 7,
        attribution: 'NASA/USGS Viking MDIM2.1'
      });
    } else if (baseMap === 'themis') {
      // Google Mars / THEMIS Infrared Thermal
      // Custom tile generator for Google Mars quadkeys
      const toQuadKey = (x, y, z) => {
        const chars = ['q', 'r', 't', 's'];
        let key = 't';
        for (let i = z; i > 0; i--) {
          let digit = 0;
          const mask = 1 << (i - 1);
          if ((x & mask) !== 0) digit += 1;
          if ((y & mask) !== 0) digit += 2;
          key += chars[digit];
        }
        return key;
      };

      const CustomQuadTileLayer = L.TileLayer.extend({
        getTileUrl: function(coords) {
          const qk = toQuadKey(coords.x, coords.y, coords.z);
          return `https://mw1.google.com/mw-planetary/mars/infrared/${qk}.jpg`;
        }
      });
      tileLayer = new CustomQuadTileLayer('', {
        maxZoom: 14,
        maxNativeZoom: 8,
        attribution: 'NASA/ASU THEMIS Infrared'
      });
    }

    tileLayer.addTo(map);
    layersGroupRef.current.baseTile = tileLayer;
  }, [baseMap]);

  // 3. Render Scientific Overlays (Slope Hazards, Minerals, Thermal Sand Traps)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layersGroupRef.current.slopeHazard) return;

    // Clear existing overlay features
    layersGroupRef.current.slopeHazard.clearLayers();
    layersGroupRef.current.mineralogy.clearLayers();
    layersGroupRef.current.thermalInertia.clearLayers();
    layersGroupRef.current.radiation.clearLayers();
    layersGroupRef.current.contours.clearLayers();

    const [cLat, cLng] = zone.center;

    // A. Slope Hazard Heatmap Overlay
    if (activeLayers.slopeHazard) {
      // Create danger zones (>20° steep slopes, cliff edges)
      const steepZones = [
        // Gale Vera Rubin Ridge steep escarpment or Jezero delta scarp
        {
          coords: [
            [cLat - 0.07, cLng - 0.03],
            [cLat - 0.08, cLng - 0.01],
            [cLat - 0.065, cLng + 0.015],
            [cLat - 0.055, cLng - 0.01]
          ],
          color: '#ef4444',
          label: 'STEEP ESCARPMENT (>22° Slope Hazard)',
          desc: 'High slip risk. Unpassable for pressurized rover. Hand-tethers required for astronauts.'
        },
        {
          coords: [
            [cLat + 0.04, cLng - 0.06],
            [cLat + 0.03, cLng - 0.04],
            [cLat + 0.05, cLng - 0.025]
          ],
          color: '#f59e0b',
          label: 'MODERATE INCLINE (12°-18° Slope Caution)',
          desc: 'Increased suit oxygen burn rate (+45%). Rocky scree traversability caution.'
        }
      ];

      steepZones.forEach((sz) => {
        const poly = L.polygon(sz.coords, {
          color: sz.color,
          fillColor: sz.color,
          fillOpacity: layerOpacity.slopeHazard * 0.45,
          weight: 2,
          dashArray: '4, 4'
        });
        poly.bindTooltip(`<b>${sz.label}</b><br/>${sz.desc}`, { sticky: true });
        layersGroupRef.current.slopeHazard.addLayer(poly);
      });
    }

    // B. CRISM Mineralogy Overlays (Phyllosilicates, Sulfates, Boxwork Formations, Carbonates)
    if (activeLayers.mineralogy) {
      // Boxwork Ridge & Sulfate deposits
      const mineralFeatures = [
        {
          center: [cLat - 0.12, cLng - 0.08],
          radius: 2200,
          color: '#e879f9', // Boxwork purple/magenta
          label: 'Curiosity 2024-2025 Boxwork Ridge System',
          desc: 'Polygonal honeycomb boxwork ridges formed by groundwater mineral veins filling bedrock fractures.'
        },
        {
          center: [cLat + 0.02, cLng + 0.02],
          radius: 1800,
          color: '#38bdf8', // Clays / phyllosilicates cyan
          label: 'Hydrated Phyllosilicates (Smectite Clays)',
          desc: 'Ancient freshwater lake sediments with high organic compound preservation potential.'
        },
        {
          center: [cLat - 0.04, cLng + 0.05],
          radius: 1500,
          color: '#34d399', // Carbonates emerald green
          label: 'Magnesium Carbonate Margin Beds',
          desc: 'Precipitated alkaline lake minerals sealing potential biosignature microbial fossils.'
        }
      ];

      mineralFeatures.forEach((mf) => {
        const circle = L.circle(mf.center, {
          radius: mf.radius,
          color: mf.color,
          fillColor: mf.color,
          fillOpacity: layerOpacity.mineralogy * 0.4,
          weight: 2
        });
        circle.bindTooltip(`<b>${mf.label}</b><br/>${mf.desc}`, { sticky: true });
        layersGroupRef.current.mineralogy.addLayer(circle);
      });
    }

    // C. THEMIS Thermal Inertia / Loose Sand Traps (Bagnold Dunes / Séítah)
    if (activeLayers.thermalInertia) {
      const sandTraps = [
        {
          center: [cLat - 0.035, cLng - 0.005],
          radius: 1400,
          color: '#f97316',
          label: 'Active Basaltic Sand Dunes (Low Thermal Inertia)',
          desc: 'Loose fine sand. 60%+ wheel slippage hazard. Avoid rover ingress.'
        }
      ];

      sandTraps.forEach((st) => {
        const circle = L.circle(st.center, {
          radius: st.radius,
          color: st.color,
          fillColor: st.color,
          fillOpacity: layerOpacity.thermalInertia * 0.45,
          weight: 2,
          dashArray: '6, 6'
        });
        circle.bindTooltip(`<b>${st.label}</b><br/>${st.desc}`, { sticky: true });
        layersGroupRef.current.thermalInertia.addLayer(circle);
      });
    }

    // D. Elevation Contours
    if (activeLayers.contours) {
      const contourRings = [
        { center: [cLat, cLng], radius: 3000, label: '-4,200m' },
        { center: [cLat, cLng], radius: 5500, label: '-4,000m' },
        { center: [cLat, cLng], radius: 8000, label: '-3,800m' },
        { center: [cLat, cLng], radius: 10500, label: '-3,600m' }
      ];

      contourRings.forEach((cr) => {
        const ring = L.circle(cr.center, {
          radius: cr.radius,
          color: 'rgba(255, 255, 255, 0.25)',
          fill: false,
          weight: 1,
          dashArray: '3, 6'
        });
        ring.bindTooltip(`Elevation Contour: ${cr.label}`, { sticky: true });
        layersGroupRef.current.contours.addLayer(ring);
      });
    }

    // E. Radiation Field
    if (activeLayers.radiation) {
      const radZone = L.circle([cLat + 0.01, cLng - 0.02], {
        radius: 4000,
        color: '#a855f7',
        fillColor: '#a855f7',
        fillOpacity: layerOpacity.radiation * 0.35,
        weight: 1,
        dashArray: '8, 8'
      });
      radZone.bindTooltip('Galactic Cosmic Ray Exposure Zone (0.26 mSv/day)', { sticky: true });
      layersGroupRef.current.radiation.addLayer(radZone);
    }

  }, [activeLayers, layerOpacity, zone.id]);

  // 4. Render Route Polyline & Waypoint Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layersGroupRef.current.markers) return;

    layersGroupRef.current.markers.clearLayers();
    layersGroupRef.current.routes.clearLayers();

    if (waypoints.length === 0) return;

    // Draw Route Polyline
    const latLngs = waypoints.map(w => [w.lat, w.lng]);
    const routeLine = L.polyline(latLngs, {
      color: '#ff5722',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '8, 6'
    });
    routeLine.bindTooltip(`Total Route: ${waypoints.length} waypoints planned`, { sticky: true });
    layersGroupRef.current.routes.addLayer(routeLine);

    // Draw Markers
    waypoints.forEach((wp, index) => {
      const isSelected = selectedWaypoint?.id === wp.id;
      const isBase = wp.type === 'base';
      const isPrimary = wp.type === 'primary-objective';
      const isHazard = wp.type === 'hazard';

      let markerBg = 'bg-slate-800 border-slate-400 text-white';
      if (isBase) markerBg = 'bg-blue-600 border-blue-300 text-white';
      else if (isPrimary) markerBg = 'bg-fuchsia-600 border-fuchsia-300 text-white animate-pulse';
      else if (isHazard) markerBg = 'bg-amber-600 border-amber-300 text-white';
      else if (isSelected) markerBg = 'bg-mars-orange border-white text-white scale-125';

      const customIcon = L.divIcon({
        className: 'custom-mars-marker',
        html: `
          <div class="flex items-center justify-center w-7 h-7 rounded-full border-2 ${markerBg} shadow-lg text-xs font-mono font-bold transition-all transform hover:scale-110">
            ${index + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectWaypoint(wp);
        marsAudio.playBlip();
      });

      marker.bindTooltip(`
        <div class="p-1">
          <div class="text-[10px] font-mono text-mars-orange font-bold uppercase">WAYPOINT ${index + 1}</div>
          <div class="text-xs font-bold text-white">${wp.name}</div>
          <div class="text-[11px] text-slate-300 mt-1">Elev: ${wp.elevation}m | Slope: ${wp.slopeDeg}°</div>
        </div>
      `, { direction: 'top', offset: [0, -12] });

      layersGroupRef.current.markers.addLayer(marker);
    });

  }, [waypoints, selectedWaypoint]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Top Left: Scientific Layer Controller Dropdown */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="glass-panel p-3 rounded-xl border border-mars-orange/30 w-72 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
            <span className="text-xs font-orbitron font-bold text-slate-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-mars-orange" />
              NASA Science Layers
            </span>
            <span className="text-[10px] font-mono text-mars-orange bg-mars-orange/20 px-1.5 py-0.5 rounded">
              {Object.values(activeLayers).filter(Boolean).length}/5 Active
            </span>
          </div>

          {/* Base Map Switcher */}
          <div className="mb-3">
            <label className="text-[10px] font-mono text-slate-400 block mb-1">BASE PLANETARY TILESET</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'mola', label: 'MOLA DEM' },
                { id: 'viking', label: 'Viking Color' },
                { id: 'themis', label: 'THEMIS IR' }
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBaseMap(b.id);
                    marsAudio.playBlip();
                  }}
                  className={`text-[10px] py-1 px-1.5 rounded font-mono font-bold transition text-center border ${
                    baseMap === b.id
                      ? 'bg-mars-orange/30 border-mars-orange text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Toggles & Opacity */}
          <div className="space-y-2 text-xs">
            {/* Slope Hazard */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLayers(p => ({ ...p, slopeHazard: !p.slopeHazard }))}
                  className={`p-1 rounded ${activeLayers.slopeHazard ? 'text-red-400' : 'text-slate-500'}`}
                >
                  {activeLayers.slopeHazard ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-200 text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Slope Hazard Map
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={layerOpacity.slopeHazard}
                onChange={(e) => setLayerOpacity(p => ({ ...p, slopeHazard: parseFloat(e.target.value) }))}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Mineralogy / CRISM */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLayers(p => ({ ...p, mineralogy: !p.mineralogy }))}
                  className={`p-1 rounded ${activeLayers.mineralogy ? 'text-fuchsia-400' : 'text-slate-500'}`}
                >
                  {activeLayers.mineralogy ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-200 text-[11px] flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-fuchsia-400" />
                  CRISM Minerals & Boxwork
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={layerOpacity.mineralogy}
                onChange={(e) => setLayerOpacity(p => ({ ...p, mineralogy: parseFloat(e.target.value) }))}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-fuchsia-500"
              />
            </div>

            {/* THEMIS Thermal / Sand Traps */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLayers(p => ({ ...p, thermalInertia: !p.thermalInertia }))}
                  className={`p-1 rounded ${activeLayers.thermalInertia ? 'text-amber-400' : 'text-slate-500'}`}
                >
                  {activeLayers.thermalInertia ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-200 text-[11px] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  Thermal Sand Traps
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={layerOpacity.thermalInertia}
                onChange={(e) => setLayerOpacity(p => ({ ...p, thermalInertia: parseFloat(e.target.value) }))}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Elevation Contours */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLayers(p => ({ ...p, contours: !p.contours }))}
                  className={`p-1 rounded ${activeLayers.contours ? 'text-cyan-400' : 'text-slate-500'}`}
                >
                  {activeLayers.contours ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-200 text-[11px]">Elevation Contours</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={layerOpacity.contours}
                onChange={(e) => setLayerOpacity(p => ({ ...p, contours: parseFloat(e.target.value) }))}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Space Weather & Radiation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLayers(p => ({ ...p, radiation: !p.radiation }))}
                  className={`p-1 rounded ${activeLayers.radiation ? 'text-purple-400' : 'text-slate-500'}`}
                >
                  {activeLayers.radiation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-200 text-[11px] flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-purple-400" />
                  GCR Radiation Zone
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={layerOpacity.radiation}
                onChange={(e) => setLayerOpacity(p => ({ ...p, radiation: parseFloat(e.target.value) }))}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Map Legend Card */}
        <div className="glass-panel p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono space-y-1 text-slate-300">
          <div className="font-bold text-slate-400 mb-1">SLOPE HAZARD CLASSIFICATION</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>&lt; 10° Slope: Nominal Walking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>10° - 18° Slope: Caution (+40% O2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>&gt; 18° Slope: Impassable Cliff/Escarpment</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-700/40">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
            <span>Boxwork Polygonal Ridges (Curiosity 2025)</span>
          </div>
        </div>
      </div>

      {/* Top Center: Add Custom Waypoint Mode Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            setIsAddMode(!isAddMode);
            marsAudio.playBlip();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 shadow-xl border ${
            isAddMode 
              ? 'bg-amber-500 border-amber-300 text-black animate-pulse'
              : 'glass-panel border-mars-orange/40 text-mars-orange hover:bg-mars-orange/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          {isAddMode ? 'CLICK MAP TO PLACE WAYPOINT' : '+ ADD CUSTOM WAYPOINT'}
        </button>

        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView(zone.center, zone.zoom);
              marsAudio.playBlip();
            }
          }}
          className="glass-panel border-slate-700 text-slate-300 hover:text-white p-2 rounded-xl transition"
          title="Recenter Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Bar: Live Martian Coordinates & Elevation Readout */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-mars-orange">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '30s' }} />
          <span>MARS-CRS:</span>
        </div>
        <span>LAT: {mouseCoords.lat >= 0 ? `${mouseCoords.lat}° N` : `${Math.abs(mouseCoords.lat)}° S`}</span>
        <span>LON: {mouseCoords.lng}° E</span>
        <span className="text-slate-500">|</span>
        <span className="text-emerald-400 font-bold">{zone.name}</span>
      </div>
    </div>
  );
}

