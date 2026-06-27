'use client';

import * as THREE from 'three';
import { useRef, useEffect, useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GlobeCanvasProps {
  onDotClick?: (projectName: string, coordinates: { lat: number; lng: number }) => void;
  targetCoords?: { lat: number; lng: number } | null;
}

interface ProjectDot {
  name: string;
  lat: number;
  lng: number;
  mesh: THREE.Mesh;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GLOBE_RADIUS = 200;
const ATMOSPHERE_RADIUS = 205;
const DOT_RADIUS = 3.5;
const DOT_COLOR = 0x00e5a0;
const AUTO_ROTATE_SPEED = 0.001;
const PULSE_DURATION = 400;
const FLY_TO_DURATION = 1200;

const PROJECT_NAMES = [
  'Amazon Basin REDD+',
  'Congo Forest Reserve',
  'Borneo Peatland',
  'Guatemala Highlands',
  'Peru Cloud Forest',
  'Kenya Savanna',
  'Madagascar Rainforest',
  'Cambodia Mangrove',
  'Myanmar Teak Reserve',
  'Costa Rica Reforestation',
  'Colombia Páramo',
  'Tanzania Woodland',
  'Ethiopia Highland',
  'India Western Ghats',
  'Vietnam Forest',
  'Panama Canal Zone',
  'Ecuador Chocó',
  'Gabon Rainforest',
  'Central African Forest',
  'Sumatra Lowland',
];

/* Regional clusters — lat/lng with small random jitter per dot */
const REGION_SEEDS: { center: [number, number]; count: number; jitter: number }[] = [
  { center: [-3.0, -60.0], count: 8, jitter: 6 },   // Brazil / Amazon
  { center: [0.5, 22.0], count: 8, jitter: 5 },      // Central Africa / Congo Basin
  { center: [-2.0, 112.0], count: 8, jitter: 6 },    // Southeast Asia / Indonesia
  { center: [14.0, -87.0], count: 5, jitter: 4 },    // Central America
  { center: [-10.0, -75.0], count: 5, jitter: 4 },   // Peru / Andes
  { center: [-1.0, 37.0], count: 4, jitter: 4 },     // East Africa
  { center: [14.0, 76.0], count: 2, jitter: 3 },     // India
];

/* ------------------------------------------------------------------ */
/*  Continent polygon data (lat, lng)                                  */
/* ------------------------------------------------------------------ */

type LatLng = [number, number];

const ALASKA: LatLng[] = [
  [49, -125], [60, -140], [72, -160], [71, -157],
  [65, -168], [61, -165], [55, -132], [49, -125],
];

const NORTH_AMERICA_MAIN: LatLng[] = [
  [48, -125], [50, -90], [45, -65], [30, -82],
  [25, -80], [20, -87], [20, -105], [32, -117],
  [34, -120], [40, -124], [48, -125],
];

const SOUTH_AMERICA: LatLng[] = [
  [12, -75], [5, -50], [-5, -35], [-15, -40],
  [-23, -43], [-34, -55], [-55, -68], [-55, -64],
  [-40, -62], [-20, -40], [-5, -50], [0, -50],
  [5, -60], [10, -72], [12, -75],
];

const EUROPE: LatLng[] = [
  [36, -10], [43, -10], [48, -5], [51, 2],
  [55, 10], [60, 25], [70, 30], [71, 28],
  [65, 15], [55, 5], [51, 5], [48, 0],
  [45, -2], [40, -5], [36, -10],
];

const AFRICA: LatLng[] = [
  [35, -5], [37, 10], [30, 32], [12, 44],
  [5, 42], [-5, 40], [-15, 35], [-25, 30],
  [-35, 20], [-35, 18], [-30, 28], [-15, 40],
  [-5, 10], [5, 0], [5, -10], [15, -17],
  [30, -10], [35, -5],
];

const SAHARA: LatLng[] = [
  [30, -10], [30, 32], [20, 35], [15, 35],
  [15, -17], [20, -15], [30, -10],
];

const MIDDLE_EAST: LatLng[] = [
  [30, 32], [35, 45], [25, 55], [15, 45],
  [12, 44], [30, 32],
];

const INDIA: LatLng[] = [
  [30, 70], [25, 68], [8, 77], [20, 88],
  [28, 88], [30, 70],
];

const ASIA_MAIN: LatLng[] = [
  [35, 45], [45, 60], [55, 75], [60, 100],
  [55, 135], [45, 140], [35, 130], [30, 120],
  [22, 105], [10, 100], [1, 104], [-8, 115],
  [-5, 120], [5, 110], [20, 110], [30, 120],
  [40, 120], [50, 100], [55, 80], [50, 60],
  [40, 50], [35, 45],
];

const RUSSIA: LatLng[] = [
  [55, 30], [65, 40], [72, 60], [72, 100],
  [70, 140], [65, 170], [72, 180], [55, 180],
  [55, 135], [50, 100], [55, 80], [55, 30],
];

const AUSTRALIA: LatLng[] = [
  [-12, 130], [-15, 125], [-25, 115], [-32, 115],
  [-38, 145], [-35, 150], [-28, 153], [-20, 148],
  [-15, 145], [-12, 136], [-12, 130],
];

const GREENLAND: LatLng[] = [
  [60, -50], [65, -55], [72, -55], [78, -50],
  [83, -40], [82, -20], [75, -18], [68, -25],
  [63, -42], [60, -50],
];

/* ------------------------------------------------------------------ */
/*  Procedural Earth texture generator                                 */
/* ------------------------------------------------------------------ */

function createEarthTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  /* --- Ocean base --- */
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(0, 0, W, H);

  /* Add subtle ocean depth gradient for realism */
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
  oceanGrad.addColorStop(0, 'rgba(10, 60, 120, 0.3)');
  oceanGrad.addColorStop(0.5, 'rgba(21, 101, 192, 0)');
  oceanGrad.addColorStop(1, 'rgba(10, 60, 120, 0.3)');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, H);

  /* --- Helpers --- */
  function toXY(lat: number, lng: number): [number, number] {
    return [(lng + 180) / 360 * W, (90 - lat) / 180 * H];
  }

  function drawContinent(points: LatLng[], color: string) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const [x0, y0] = toXY(points[0][0], points[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < points.length; i++) {
      const [x, y] = toXY(points[i][0], points[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /* --- Draw continents --- */
  // North America
  drawContinent(ALASKA, '#4CAF50');
  drawContinent(NORTH_AMERICA_MAIN, '#4CAF50');

  // South America
  drawContinent(SOUTH_AMERICA, '#2E7D32');

  // Europe
  drawContinent(EUROPE, '#66BB6A');

  // Africa (green base, then Sahara overlay)
  drawContinent(AFRICA, '#43A047');
  drawContinent(SAHARA, '#D4A574');

  // Asia
  drawContinent(MIDDLE_EAST, '#C2956B');
  drawContinent(ASIA_MAIN, '#388E3C');
  drawContinent(RUSSIA, '#388E3C');
  drawContinent(INDIA, '#388E3C');

  // Australia
  drawContinent(AUSTRALIA, '#8D6E63');

  // Greenland
  drawContinent(GREENLAND, '#E0E0E0');

  // Antarctica strip
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(0, 950, W, H - 950);

  /* --- Add terrain-like noise patches for realism --- */
  ctx.globalAlpha = 0.06;
  let noiseSeed = 100;
  for (let i = 0; i < 200; i++) {
    const cx = seededRandom(noiseSeed++) * W;
    const cy = seededRandom(noiseSeed++) * H;
    const r = 5 + seededRandom(noiseSeed++) * 25;
    const shade = seededRandom(noiseSeed++) > 0.5 ? '#000000' : '#FFFFFF';
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  /* --- Cloud wisps --- */
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFFFFF';
  let cloudSeed = 500;
  for (let i = 0; i < 30; i++) {
    const cx = seededRandom(cloudSeed++) * W;
    const cy = seededRandom(cloudSeed++) * H;
    const rx = 80 + seededRandom(cloudSeed++) * 120;
    const ry = 15 + seededRandom(cloudSeed++) * 20;
    const rot = seededRandom(cloudSeed++) * Math.PI;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  /* --- Coastline outlines for definition --- */
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#0D47A1';
  ctx.lineWidth = 3;

  function strokeContinent(points: LatLng[]) {
    ctx.beginPath();
    const [x0, y0] = toXY(points[0][0], points[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < points.length; i++) {
      const [x, y] = toXY(points[i][0], points[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  strokeContinent(ALASKA);
  strokeContinent(NORTH_AMERICA_MAIN);
  strokeContinent(SOUTH_AMERICA);
  strokeContinent(EUROPE);
  strokeContinent(AFRICA);
  strokeContinent(ASIA_MAIN);
  strokeContinent(RUSSIA);
  strokeContinent(INDIA);
  strokeContinent(AUSTRALIA);
  strokeContinent(GREENLAND);
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Seeded deterministic random — same positions every render */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generateDotPositions(): { lat: number; lng: number }[] {
  const positions: { lat: number; lng: number }[] = [];
  let seed = 42;
  for (const region of REGION_SEEDS) {
    for (let i = 0; i < region.count; i++) {
      const latOffset = (seededRandom(seed++) - 0.5) * 2 * region.jitter;
      const lngOffset = (seededRandom(seed++) - 0.5) * 2 * region.jitter;
      positions.push({
        lat: region.center[0] + latOffset,
        lng: region.center[1] + lngOffset,
      });
    }
  }
  return positions;
}

function assignNames(count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(PROJECT_NAMES[i % PROJECT_NAMES.length]);
  }
  return names;
}

/** Ease-in-out cubic */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GlobeCanvas({ onDotClick, targetCoords }: GlobeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const dotsRef = useRef<ProjectDot[]>([]);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(true);

  /* Drag state */
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  /* Pulse animation queue */
  const pulsingRef = useRef<Map<THREE.Mesh, { start: number; baseScale: number }>>(new Map());

  /* Fly-to animation */
  const flyToRef = useRef<{
    startQuat: THREE.Quaternion;
    endQuat: THREE.Quaternion;
    startTime: number;
    duration: number;
  } | null>(null);

  /* Raycaster */
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNDC = useRef(new THREE.Vector2());

  /* Tooltip */
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Fly-to handler                                                   */
  /* ---------------------------------------------------------------- */

  const flyTo = useCallback((lat: number, lng: number) => {
    const group = globeGroupRef.current;
    if (!group) return;

    const target = latLngToVector3(lat, lng, GLOBE_RADIUS);

    // We want the target point to face the camera (which is on +Z).
    // Build a quaternion that rotates the target vector to (0, 0, GLOBE_RADIUS).
    const from = target.clone().normalize();
    const to = new THREE.Vector3(0, 0, 1);
    const endQuat = new THREE.Quaternion().setFromUnitVectors(from, to);

    flyToRef.current = {
      startQuat: group.quaternion.clone(),
      endQuat,
      startTime: performance.now(),
      duration: FLY_TO_DURATION,
    };
    autoRotateRef.current = false;
  }, []);

  /* React to targetCoords prop */
  useEffect(() => {
    if (targetCoords) {
      flyTo(targetCoords.lat, targetCoords.lng);
    }
  }, [targetCoords, flyTo]);

  /* ---------------------------------------------------------------- */
  /*  Scene bootstrap                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    mountedRef.current = true;

    /* Disposables collector for cleanup */
    const disposables: { dispose: () => void }[] = [];

    /* --- Renderer --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* --- Scene --- */
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    /* --- Camera --- */
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      2000,
    );
    camera.position.set(0, 0, 600);
    cameraRef.current = camera;

    /* --- Lighting --- */
    const directional = new THREE.DirectionalLight(0xfffaf0, 2.0);
    directional.position.set(5, 3, 5).normalize().multiplyScalar(500);
    scene.add(directional);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    /* --- Globe group (allows unified rotation) --- */
    const group = new THREE.Group();
    globeGroupRef.current = group;
    scene.add(group);

    /* ============================================================== */
    /*  1. Textured Earth sphere                                       */
    /* ============================================================== */
    const earthTexture = createEarthTexture();
    disposables.push(earthTexture);

    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 15,
      specular: new THREE.Color(0x1a1a2e),
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    group.add(earthMesh);
    disposables.push(earthGeo, earthMat);

    /* ============================================================== */
    /*  2. Atmosphere glow                                             */
    /* ============================================================== */
    const atmosGeo = new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    group.add(atmosMesh);
    disposables.push(atmosGeo, atmosMat);

    /* ============================================================== */
    /*  3. Project dots — glowing green spheres                        */
    /* ============================================================== */
    const dotPositions = generateDotPositions();
    const names = assignNames(dotPositions.length);
    const dotGeo = new THREE.SphereGeometry(DOT_RADIUS, 16, 16);
    const dotMat = new THREE.MeshPhongMaterial({
      color: DOT_COLOR,
      emissive: new THREE.Color(DOT_COLOR),
      emissiveIntensity: 0.4,
      shininess: 40,
    });
    const dots: ProjectDot[] = [];
    disposables.push(dotGeo, dotMat);

    dotPositions.forEach((pos, i) => {
      const vec = latLngToVector3(pos.lat, pos.lng, GLOBE_RADIUS + 2.5);
      const mesh = new THREE.Mesh(dotGeo, dotMat);
      mesh.position.copy(vec);
      mesh.userData = { projectName: names[i], lat: pos.lat, lng: pos.lng };
      group.add(mesh);
      dots.push({ name: names[i], lat: pos.lat, lng: pos.lng, mesh });
    });
    dotsRef.current = dots;

    /* -------------------------------------------------------------- */
    /*  Animation loop                                                 */
    /* -------------------------------------------------------------- */

    const animate = () => {
      if (!mountedRef.current) return;
      rafRef.current = requestAnimationFrame(animate);

      const now = performance.now();

      /* Fly-to interpolation */
      const ft = flyToRef.current;
      if (ft) {
        const elapsed = now - ft.startTime;
        const t = Math.min(elapsed / ft.duration, 1);
        const eased = easeInOutCubic(t);
        group.quaternion.slerpQuaternions(ft.startQuat, ft.endQuat, eased);
        if (t >= 1) {
          flyToRef.current = null;
          // Re-enable auto-rotate after a short pause
          setTimeout(() => { autoRotateRef.current = true; }, 800);
        }
      } else if (autoRotateRef.current && !isDraggingRef.current) {
        group.rotation.y += AUTO_ROTATE_SPEED;
      }

      /* Pulse animations */
      pulsingRef.current.forEach((anim, mesh) => {
        const elapsed = now - anim.start;
        if (elapsed >= PULSE_DURATION) {
          mesh.scale.setScalar(anim.baseScale);
          pulsingRef.current.delete(mesh);
        } else {
          const t = elapsed / PULSE_DURATION;
          const s = t < 0.5
            ? anim.baseScale + 0.5 * anim.baseScale * (t / 0.5)
            : anim.baseScale + 0.5 * anim.baseScale * (1 - (t - 0.5) / 0.5);
          mesh.scale.setScalar(s);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    /* -------------------------------------------------------------- */
    /*  Mouse / pointer events                                         */
    /* -------------------------------------------------------------- */

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();

      /* --- Drag rotation --- */
      if (isDraggingRef.current && !flyToRef.current) {
        const dx = e.clientX - prevMouseRef.current.x;
        const dy = e.clientY - prevMouseRef.current.y;
        group.rotation.y += dx * 0.005;
        group.rotation.x += dy * 0.005;
        // Clamp vertical rotation to avoid flipping
        group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, group.rotation.x));
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      /* --- Raycasting for hover --- */
      mouseNDC.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseNDC.current, camera);

      const dotMeshes = dots.map((d) => d.mesh);
      const intersects = raycasterRef.current.intersectObjects(dotMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData as { projectName: string };
        container.style.cursor = 'pointer';
        setTooltip({
          x: e.clientX - rect.left + 14,
          y: e.clientY - rect.top - 10,
          name: data.projectName,
        });

        // Start pulse if not already pulsing
        if (!pulsingRef.current.has(hit)) {
          pulsingRef.current.set(hit, { start: performance.now(), baseScale: 1 });
        }
      } else {
        container.style.cursor = 'grab';
        setTooltip(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!onDotClick) return;
      const rect = container.getBoundingClientRect();
      mouseNDC.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseNDC.current, camera);

      const dotMeshes = dots.map((d) => d.mesh);
      const intersects = raycasterRef.current.intersectObjects(dotMeshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData as { projectName: string; lat: number; lng: number };
        onDotClick(data.projectName, { lat: data.lat, lng: data.lng });
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('click', onClick);

    /* -------------------------------------------------------------- */
    /*  Resize                                                         */
    /* -------------------------------------------------------------- */

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* -------------------------------------------------------------- */
    /*  Cleanup                                                        */
    /* -------------------------------------------------------------- */

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);

      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);

      /* Dispose all tracked geometries & materials */
      for (const d of disposables) {
        d.dispose();
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab',
        overflow: 'hidden',
      }}
    >
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            background: '#FFFFFF',
            color: '#1A1D23',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(0,0,0,0.1)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transform: 'translateY(-100%)',
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
