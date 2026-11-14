import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NASA_HISTORICAL_SITES, MARS_EXPLORATION_ZONES } from '../data/marsMissionData';
import { marsAudio } from '../utils/audioSystem';
import { Globe, MapPin, Navigation, Eye, Compass, Info } from 'lucide-react';

export default function MarsGlobe3D({ onSelectZone, currentZoneId }) {
  const mountRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xff5722, 0.6);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 3. Mars Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Texture Loader with procedurally generated high-res canvas Mars texture if network fails
    const createMarsProceduralCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      // Base Mars rust gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#c85a32');
      grad.addColorStop(0.5, '#b33c1b');
      grad.addColorStop(1, '#9e2e11');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Add darker albedo features (Syrtis Major, Sinus Sabaeus, Mare Erythraeum)
      ctx.fillStyle = 'rgba(70, 24, 12, 0.45)';
      // Syrtis Major
      ctx.beginPath();
      ctx.ellipse(750, 230, 90, 140, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      // Acidalia Planitia
      ctx.beginPath();
      ctx.ellipse(320, 140, 120, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      // Valles Marineris canyon scratch
      ctx.strokeStyle = 'rgba(40, 12, 6, 0.6)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(300, 270);
      ctx.lineTo(460, 290);
      ctx.stroke();
      // Hellas Basin (bright impact basin)
      ctx.fillStyle = 'rgba(230, 140, 95, 0.5)';
      ctx.beginPath();
      ctx.arc(770, 360, 70, 0, Math.PI * 2);
      ctx.fill();
      // Polar Ice Caps
      ctx.fillStyle = 'rgba(245, 245, 255, 0.85)';
      ctx.fillRect(0, 0, 1024, 25);
      ctx.fillRect(0, 490, 1024, 22);

      return new THREE.CanvasTexture(canvas);
    };

    const textureLoader = new THREE.TextureLoader();
    const marsTexture = createMarsProceduralCanvas();

    // Try loading real Viking texture from Mars Trek or CDN
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg',
      (tex) => {
        sphereMaterial.map = tex;
        sphereMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback already assigned
      }
    );

    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
      roughness: 0.85,
      metalness: 0.1
    });
    const marsMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(marsMesh);

    // Atmosphere Glow Shell
    const atmoGeometry = new THREE.SphereGeometry(1.025, 64, 64);
    const atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    globeGroup.add(atmoMesh);

    // 4. Convert Lat/Lng to 3D Sphere coordinates
    const latLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 5. Add Landing Site Markers
    markersRef.current = [];
    NASA_HISTORICAL_SITES.forEach((site) => {
      const isCuriosity = site.name.includes('Curiosity');
      const isPerseverance = site.name.includes('Perseverance');
      const isPrimary = isCuriosity || isPerseverance;

      const pos = latLngToVector3(site.lat, site.lng, 1.015);

      // Marker pin mesh
      const markerGeo = new THREE.SphereGeometry(isPrimary ? 0.024 : 0.015, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isCuriosity ? 0x06b6d4 : (isPerseverance ? 0x10b981 : 0xffaa00)
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = site;

      // Pulsing outer ring for active EVA exploration sites
      if (isPrimary) {
        const ringGeo = new THREE.RingGeometry(0.03, 0.045, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: isCuriosity ? 0x06b6d4 : 0x10b981,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos);
        ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(ringMesh);
      }

      globeGroup.add(markerMesh);
      markersRef.current.push(markerMesh);
    });

    // 6. Raycasting for marker clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersRef.current);

      if (intersects.length > 0) {
        const hit = intersects[0].object.userData;
        setSelectedSite(hit);
        marsAudio.playBlip();
      }
    };

    // 7. Mouse drag rotation controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('click', handlePointerDown);
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        globeGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('click', handlePointerDown);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Overlay */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-mars-orange animate-spin" style={{ animationDuration: '20s' }} />
          <h2 className="text-sm font-orbitron tracking-widest text-slate-100 uppercase">
            Planetary Geospatial Overview // Mars 3D
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Rotational 3D reference showing all 9 historical NASA landing sites and primary EVA exploration zones.
        </p>
      </div>

      {/* Rotation Control Toggle */}
      <div className="absolute top-4 right-6 z-10 flex gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1.5 rounded text-xs font-mono border transition flex items-center gap-1.5 ${
            isRotating 
              ? 'bg-mars-orange/20 border-mars-orange text-mars-orange' 
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          {isRotating ? 'Auto-Rotate ON' : 'Paused'}
        </button>
      </div>

      {/* Selected Site Modal Card */}
      {selectedSite && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm glass-panel p-4 rounded-xl border border-mars-orange/40 text-left shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mars-orange/20 text-mars-orange border border-mars-orange/30">
                NASA LANDING SITE • {selectedSite.year}
              </span>
              <h3 className="text-base font-orbitron font-bold text-white mt-1.5">
                {selectedSite.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedSite(null)}
              className="text-slate-400 hover:text-white p-1 text-sm font-mono"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2">
            {selectedSite.mission}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">COORDINATES</span>
              <span className="text-slate-200">{selectedSite.lat.toFixed(2)}°, {selectedSite.lng.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MISSION STATUS</span>
              <span className={selectedSite.status.includes('Active') ? 'text-emerald-400' : 'text-slate-400'}>
                {selectedSite.status}
              </span>
            </div>
          </div>

          {/* Quick jump to EVA Map if it matches Gale or Jezero */}
          {(selectedSite.name.includes('Curiosity') || selectedSite.name.includes('Perseverance')) && (
            <button
              onClick={() => {
                const zoneId = selectedSite.name.includes('Curiosity') ? 'gale' : 'jezero';
                onSelectZone(zoneId);
                marsAudio.playQuindarIntro();
              }}
              className="w-full mt-3 py-2 px-3 rounded bg-gradient-to-r from-mars-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-orbitron text-xs flex items-center justify-center gap-2 font-bold shadow-lg shadow-orange-900/40 transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              Open Hyperlocalized EVA Map
            </button>
          )}
        </div>
      )}

      {/* Quick Explore Selector at Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <button
          onClick={() => onSelectZone('gale')}
          className={`px-4 py-2 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-2 border ${
            currentZoneId === 'gale'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950'
              : 'glass-panel border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          Gale Crater (Mount Sharp)
        </button>
        <button
          onClick={() => onSelectZone('jezero')}
          className={`px-4 py-2 rounded-lg text-xs font-orbitron font-bold transition flex items-center gap-2 border ${
            currentZoneId === 'jezero'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950'
              : 'glass-panel border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          Jezero Crater (Delta Fan)
        </button>
      </div>
    </div>
  );
}
