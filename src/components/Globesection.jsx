import { useEffect, useRef, useState } from "react";
import { client } from "../sanity";
import * as THREE from "three";

const COORDS = {
  "berlin": { lat: 52.52, lng: 13.405 },
  "munich": { lat: 48.137, lng: 11.576 },
  "münchen": { lat: 48.137, lng: 11.576 },
  "vienna": { lat: 48.208, lng: 16.373 },
  "wien": { lat: 48.208, lng: 16.373 },
  "prague": { lat: 50.075, lng: 14.437 },
  "prag": { lat: 50.075, lng: 14.437 },
  "london": { lat: 51.507, lng: -0.127 },
  "paris": { lat: 48.856, lng: 2.352 },
  "hamburg": { lat: 53.551, lng: 9.993 },
  "cologne": { lat: 50.938, lng: 6.96 },
  "köln": { lat: 50.938, lng: 6.96 },
  "frankfurt": { lat: 50.11, lng: 8.682 },
  "stuttgart": { lat: 48.775, lng: 9.182 },
  "zurich": { lat: 47.376, lng: 8.541 },
  "zürich": { lat: 47.376, lng: 8.541 },
  "amsterdam": { lat: 52.37, lng: 4.895 },
  "rome": { lat: 41.902, lng: 12.496 },
  "barcelona": { lat: 41.385, lng: 2.173 },
  "jagsthausen": { lat: 49.316, lng: 9.498 },
  "new york": { lat: 40.712, lng: -74.006 },
  "los angeles": { lat: 34.052, lng: -118.243 },
  "tokyo": { lat: 35.689, lng: 139.692 },
  "sydney": { lat: -33.868, lng: 151.209 },
  "budapest": { lat: 47.497, lng: 19.040 },
  "sofia": { lat: 42.697, lng: 23.321 },
  "warsaw": { lat: 52.229, lng: 21.012 },
  "stockholm": { lat: 59.332, lng: 18.064 },
  "oslo": { lat: 59.913, lng: 10.752 },
  "copenhagen": { lat: 55.676, lng: 12.568 },
  "brussels": { lat: 50.850, lng: 4.351 },
  "madrid": { lat: 40.416, lng: -3.703 },
  "lisbon": { lat: 38.716, lng: -9.139 },
  "athens": { lat: 37.983, lng: 23.727 },
  "istanbul": { lat: 41.015, lng: 28.979 },
  "dubai": { lat: 25.204, lng: 55.270 },
  "mumbai": { lat: 19.075, lng: 72.877 },
  "delhi": { lat: 28.613, lng: 77.209 },
  "beijing": { lat: 39.904, lng: 116.407 },
  "shanghai": { lat: 31.224, lng: 121.469 },
  "singapore": { lat: 1.352, lng: 103.819 },
  "toronto": { lat: 43.651, lng: -79.347 },
  "chicago": { lat: 41.878, lng: -87.629 },
  "miami": { lat: 25.774, lng: -80.190 },
  "mexico city": { lat: 19.432, lng: -99.133 },
  "são paulo": { lat: -23.550, lng: -46.633 },
  "buenos aires": { lat: -34.603, lng: -58.381 },
  "cape town": { lat: -33.924, lng: 18.424 },
  "nairobi": { lat: -1.286, lng: 36.817 },
  "seoul": { lat: 37.566, lng: 126.977 },
  "osaka": { lat: 34.693, lng: 135.502 },
  "bregenz": { lat: 47.503, lng: 9.747 },
  "salzburg": { lat: 47.797, lng: 13.047 },
  "graz": { lat: 47.070, lng: 15.438 },
  "innsbruck": { lat: 47.269, lng: 11.404 },
  "nuremberg": { lat: 49.452, lng: 11.077 },
  "nürnberg": { lat: 49.452, lng: 11.077 },
  "düsseldorf": { lat: 51.227, lng: 6.773 },
  "dusseldorf": { lat: 51.227, lng: 6.773 },
  "leipzig": { lat: 51.339, lng: 12.373 },
  "dresden": { lat: 51.050, lng: 13.737 },
};

function resolveCoords(name) {
  const key = name.toLowerCase().trim();
  if (COORDS[key]) return { name, ...COORDS[key] };
  for (const [k, v] of Object.entries(COORDS)) {
    if (key.includes(k) || k.includes(key)) return { name, ...v };
  }
  return null;
}

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

export default function GlobeSection() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const [resolvedLocs, setResolvedLocs] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  // Fetch locations from Sanity
  useEffect(() => {
    client
      .fetch(`*[_type=="project" && defined(locations)]{locations}`)
      .then((results) => {
        const all = results.flatMap((r) => r.locations || []);
        const unique = [...new Set(all.map((l) => l.trim()))];
        const resolved = unique.map(resolveCoords).filter(Boolean);
        const seen = new Set();
        setResolvedLocs(resolved.filter((l) => {
          const k = `${l.lat},${l.lng}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        }));
      });
  }, []);

  // Init Three.js
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth || 480;
    const H = container.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = 3.0;
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(4, 2, 4);
    scene.add(dir);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Dark sphere base
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x0d0d0d, emissive: 0x050505, shininess: 8 })
    ));

    // Lat lines
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 3) pts.push(latLngToVec3(lat, lng - 180, 1.003));
      globeGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x252525, transparent: true, opacity: 0.8 })
      ));
    }

    // Lng lines
    for (let lng = 0; lng < 360; lng += 15) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(latLngToVec3(lat, lng, 1.003));
      globeGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x252525, transparent: true, opacity: 0.8 })
      ));
    }

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      if (!isDragging.current) globeGroup.rotation.y += 0.004;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // Add dots
  useEffect(() => {
    const group = globeGroupRef.current;
    if (!group) return;
    group.children.filter((c) => c.userData.isDot).forEach((c) => group.remove(c));

    resolvedLocs.forEach((loc) => {
      const pos = latLngToVec3(loc.lat, loc.lng, 1.018);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xe8dcc8 })
      );
      dot.position.copy(pos);
      dot.userData = { isDot: true, name: loc.name };
      group.add(dot);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.028, 0.038, 32),
        new THREE.MeshBasicMaterial({ color: 0xe8dcc8, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
      );
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      ring.userData = { isDot: true };
      group.add(ring);
    });
  }, [resolvedLocs]);

  // Drag
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const down = (e) => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; el.style.cursor = "grabbing"; };
    const up = () => { isDragging.current = false; el.style.cursor = "grab"; };
    const move = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      globeGroupRef.current.rotation.y += dx * 0.006;
      globeGroupRef.current.rotation.x += dy * 0.006;
      globeGroupRef.current.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroupRef.current.rotation.x));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const tStart = (e) => { isDragging.current = true; lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const tEnd = () => { isDragging.current = false; };
    const tMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      globeGroupRef.current.rotation.y += dx * 0.006;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    el.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    el.addEventListener("touchstart", tStart, { passive: true });
    window.addEventListener("touchend", tEnd);
    window.addEventListener("touchmove", tMove, { passive: true });
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
      el.removeEventListener("touchstart", tStart);
      window.removeEventListener("touchend", tEnd);
      window.removeEventListener("touchmove", tMove);
    };
  }, []);

  // Hover
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, cameraRef.current);
      const dots = globeGroupRef.current?.children.filter((c) => c.userData.name) || [];
      const hits = raycaster.intersectObjects(dots);
      setActiveLocation(hits.length > 0 ? hits[0].object.userData.name : null);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section style={{ background: "#080808", padding: "5rem 5rem 4rem", overflow: "hidden" }}>

      {/* Header */}
      <p style={{ fontFamily: "Georgia,serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#444", margin: "0 0 0.6rem" }}>
        Locations
      </p>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "#f0ece4", margin: "0 0 3rem", lineHeight: 1.15 }}>
        {resolvedLocs.length > 0 ? resolvedLocs.length : "—"} cities.{" "}
        <span style={{ color: "#2a2a2a" }}>1 designer.</span>
      </h2>

      {/* Main layout */}
      <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>

        {/* Globe */}
        <div
          ref={mountRef}
          style={{
            width: "clamp(280px, 45vw, 480px)",
            height: "clamp(280px, 45vw, 480px)",
            cursor: "grab",
            flexShrink: 0,
          }}
        />

        {/* Location list */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          {resolvedLocs.map((loc, i) => (
            <div
              key={i}
              onMouseEnter={() => setActiveLocation(loc.name)}
              onMouseLeave={() => setActiveLocation(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.6rem 0",
                borderBottom: "0.5px solid #181818",
                cursor: "default",
                transition: "all 0.15s",
              }}
            >
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: activeLocation === loc.name ? "#e8dcc8" : "#282828",
                transition: "background 0.15s", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "Georgia,serif",
                fontSize: "0.78rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: activeLocation === loc.name ? "#f0ece4" : "#3a3a3a",
                transition: "color 0.15s",
              }}>
                {loc.name}
              </span>
            </div>
          ))}
          {resolvedLocs.length === 0 && (
            <p style={{ color: "#2a2a2a", fontSize: "0.75rem", fontFamily: "Georgia,serif" }}>
              Add locations to projects in Sanity
            </p>
          )}
        </div>
      </div>

      {/* Hover label */}
      {activeLocation && (
        <div style={{
          textAlign: "center", marginTop: "1.5rem",
          color: "#e8dcc8", fontFamily: "Georgia,serif",
          fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          {activeLocation}
        </div>
      )}
    </section>
  );
}