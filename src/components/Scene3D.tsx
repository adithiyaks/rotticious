/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Preload the lightweight single-bean model
useGLTF.preload('/models/coffe_bean/scene.gltf');
useGLTF.preload('/models/latte_art/scene.gltf');
useGLTF.preload('/models/pizzadoughflat/scene.gltf');
useGLTF.preload('/models/wooden_rolling_pin/scene.gltf');
useGLTF.preload('/croissant_4k.gltf/croissant_4k.gltf');
useGLTF.preload('/models/krabby_patty_burger/scene.gltf');
useGLTF.preload('/models/cupcake/scene.gltf');
useGLTF.preload('/models/cookie_school_project/scene.gltf');

// ─────────────────────────────────────────────────────────────────────────────
// Shared animation state driven by GSAP ScrollTrigger
// ─────────────────────────────────────────────────────────────────────────────
export const animState = {
  // Camera
  camX: 0,
  camY: 0,
  camZ: 15,
  lookX: 0,
  lookY: 0,
  lookZ: -5,

  // Section 1: Bean Space
  beanSpaceProgress: 0.0,   // 0→1 overall scroll phase
  beanSpaceConverge: 0.0,   // 0→1 convergence intensity
  beanSpaceOpacity: 1.0,    // fade beans out during cup transition

  // Section 2: Cup controls
  cupScale: 0.0,
  cupY: -4.0,
  cupIntensity: 0.0,
  tableOpacity: 0.0,
  latteScale: 0.0,
  beanSpiralPhase: 0.0,
  cameraOrbitAngle: 0.0,
  steamOpacity: 0.0,
  cupFade: 1.0,          // 1→0: cup fades as dough becomes hero
  cupSpinY: 0.0,         // Rapid spin before fading out

  // Section 3: Steam → Flour → Dough transition
  steamPhase: 0.0,       // 0→1: steam rises from cup
  flourPhase: 0.0,       // 0→1: steam becomes warm flour particles
  flourVortex: 0.0,      // 0→1: particles spiral into vortex above table
  doughReveal: 0.0,      // 0→1: dough model fades in
  doughHeroScale: 0.0,   // 0→1: dough scales to hero presentation size
  flourSettle: 0.0,      // 0→1: particles settle on dough and fade out

  // Section 4: Dough hero + rolling pin entrance
  rollingPinX: -8.0,     // rolling pin enters from left
  rollingPinVisible: 0.0,

  // Section 5: Final Logo Snap
  logoSnapProgress: 0.0,
  logoGlowIntensity: 0.0,

  // Section 6: Food Burst
  foodBurstProgress: 0.0,
  doughY: -4.04
};

// ─────────────────────────────────────────────────────────────────────────────
// Bean seed data generation
// ─────────────────────────────────────────────────────────────────────────────
interface BeanSeedData {
  positions: Float32Array;     // x, y, z per bean
  rotations: Float32Array;     // rx, ry, rz per bean (rotation velocities)
  scales: Float32Array;        // uniform scale per bean
  phases: Float32Array;        // phase offset for organic drift
  convergenceTargets: Float32Array; // cx, cy, cz per bean
}

function generateBeanSeeds(count: number): BeanSeedData {
  const positions = new Float32Array(count * 3);
  const rotations = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const convergenceTargets = new Float32Array(count * 3);

  // Depth layer allocation — sparse and elegant, not cluttered
  const foregroundCount = Math.floor(count * 0.08);  // 8% — rare close encounters
  const midgroundCount = Math.floor(count * 0.42);   // 42% medium
  const backgroundCount = count - foregroundCount - midgroundCount; // 50% distant atmosphere

  let idx = 0;

  // Helper: spherical-ish random distribution within a shell
  const seedBean = (
    minRadius: number, maxRadius: number,
    zMin: number, zMax: number,
    scaleMin: number, scaleMax: number,
  ) => {
    // Random point in a cylindrical volume along Z axis (camera travel path)
    const angle = Math.random() * Math.PI * 2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = zMin + Math.random() * (zMax - zMin);

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    // Slow random rotation velocities
    rotations[idx * 3] = (Math.random() - 0.5) * 0.4;
    rotations[idx * 3 + 1] = (Math.random() - 0.5) * 0.3;
    rotations[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;

    scales[idx] = scaleMin + Math.random() * (scaleMax - scaleMin);
    phases[idx] = Math.random() * Math.PI * 2;

    // Convergence target: beans converge toward a point at (0, -3.5, 0) 
    // with generous scatter so they don't collide into a clump
    const convAngle = Math.random() * Math.PI * 2;
    const convRadius = 0.5 + Math.random() * 1.8;
    const convY = -3.5 + (Math.random() - 0.5) * 2.0;
    convergenceTargets[idx * 3] = Math.cos(convAngle) * convRadius;
    convergenceTargets[idx * 3 + 1] = convY;
    convergenceTargets[idx * 3 + 2] = Math.sin(convAngle) * convRadius;

    idx++;
  };

  // Foreground beans: kept away from dead center, moderate size for parallax
  for (let i = 0; i < foregroundCount; i++) {
    seedBean(2.0, 5.0, -5, 20, 0.35, 0.8);
  }

  // Midground beans: well-spaced, smaller
  for (let i = 0; i < midgroundCount; i++) {
    seedBean(4.0, 12.0, -15, 30, 0.2, 0.55);
  }

  // Background beans: distant, tiny, atmospheric depth
  for (let i = 0; i < backgroundCount; i++) {
    seedBean(8.0, 22.0, -25, 40, 0.1, 0.35);
  }

  return { positions, rotations, scales, phases, convergenceTargets };
}

// ─────────────────────────────────────────────────────────────────────────────
// CoffeeBeanSpace — InstancedMesh component
// ─────────────────────────────────────────────────────────────────────────────
function CoffeeBeanSpace() {
  const { scene } = useGLTF('/models/coffe_bean/scene.gltf');
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  // Detect mobile for adaptive count
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent)
  );
  const beanCount = isMobile ? 50 : 120;

  // Extract geometry and material from the loaded GLTF
  const { geometry, material } = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    let mat: THREE.Material | null = null;

    scene.traverse((node: any) => {
      if (node.isMesh && !geo) {
        geo = node.geometry.clone();
        mat = node.material.clone();
        // Ensure textures use sRGB
        if (mat && 'map' in mat && (mat as any).map) {
          (mat as any).map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });

    return {
      geometry: geo || new THREE.SphereGeometry(0.5, 16, 16),
      material: mat || new THREE.MeshStandardMaterial({ color: '#5C3A1E' }),
    };
  }, [scene]);

  // Generate seed data once
  const seeds = useMemo(() => generateBeanSeeds(beanCount), [beanCount]);

  // Current rotation accumulator (mutable, not reactive)
  const currentRotations = useRef(new Float32Array(beanCount * 3));

  // Track scroll velocity/delta for the swirl
  const prevSpiralProgressRef = useRef(animState.beanSpiralPhase);
  const spiralRotationRef = useRef(0);

  // Initialize instance matrices
  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < beanCount; i++) {
      const x = seeds.positions[i * 3];
      const y = seeds.positions[i * 3 + 1];
      const z = seeds.positions[i * 3 + 2];
      const s = seeds.scales[i];

      tempPosition.set(x, y, z);
      tempEuler.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      tempQuaternion.setFromEuler(tempEuler);
      tempScale.set(s, s, s);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      meshRef.current.setMatrixAt(i, tempMatrix);

      // Initialize rotation accumulator
      currentRotations.current[i * 3] = tempEuler.x;
      currentRotations.current[i * 3 + 1] = tempEuler.y;
      currentRotations.current[i * 3 + 2] = tempEuler.z;
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [beanCount, seeds, tempMatrix, tempPosition, tempQuaternion, tempEuler, tempScale]);

  // Per-frame animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const progress = animState.beanSpaceProgress;
    const converge = animState.beanSpaceConverge;
    const opacity = animState.beanSpaceOpacity;
    const spiralProgress = animState.beanSpiralPhase;

    // Accumulate swirl rotation is removed in favor of exact 1-circle progression

    // Update material opacity for fade-out during cup transition
    if (meshRef.current.material && 'opacity' in meshRef.current.material) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.transparent = opacity < 0.99;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.5;
    }

    for (let i = 0; i < beanCount; i++) {
      // Base positions from seed
      const baseX = seeds.positions[i * 3];
      const baseY = seeds.positions[i * 3 + 1];
      const baseZ = seeds.positions[i * 3 + 2];

      // Convergence targets
      const convX = seeds.convergenceTargets[i * 3];
      const convY = seeds.convergenceTargets[i * 3 + 1];
      const convZ = seeds.convergenceTargets[i * 3 + 2];

      const phase = seeds.phases[i];
      const s = seeds.scales[i];

      // Organic floating drift
      const driftX = Math.sin(time * 0.15 + phase) * 0.06;
      const driftY = Math.sin(time * 0.2 + phase * 1.3) * 0.08;
      const driftZ = Math.cos(time * 0.12 + phase * 0.7) * 0.04;

      // 1. Converge toward a general center
      const convergeFactor = Math.pow(converge, 1.5);
      let x = THREE.MathUtils.lerp(baseX + driftX, convX, convergeFactor);
      let y = THREE.MathUtils.lerp(baseY + driftY, convY, convergeFactor);
      let z = THREE.MathUtils.lerp(baseZ + driftZ, convZ, convergeFactor);

      // 2. Spiral into the cup
      if (spiralProgress > 0) {
        const radius = Math.sqrt(x * x + z * z);
        const currentAngle = Math.atan2(z, x);
        // Add exactly 1 full rotation (Math.PI * 2.0) over the spiral duration
        const spiralAngle = currentAngle + spiralProgress * Math.PI * 2.0 + phase;
        const targetRadius = THREE.MathUtils.lerp(radius, 0.2 + Math.random() * 0.4, spiralProgress);
        const spiralX = Math.cos(spiralAngle) * targetRadius;
        const spiralZ = Math.sin(spiralAngle) * targetRadius;
        const targetY = -3.8 + (Math.random() - 0.5) * 0.4;
        x = THREE.MathUtils.lerp(x, spiralX, spiralProgress);
        y = THREE.MathUtils.lerp(y, targetY, spiralProgress);
        z = THREE.MathUtils.lerp(z, spiralZ, spiralProgress);
      }

      // Slow continuous rotation
      const rotSpeed = 0.3 + (1.0 - converge) * 0.2 + (spiralProgress * 3.0);
      currentRotations.current[i * 3] += seeds.rotations[i * 3] * 0.016 * rotSpeed;
      currentRotations.current[i * 3 + 1] += seeds.rotations[i * 3 + 1] * 0.016 * rotSpeed;
      currentRotations.current[i * 3 + 2] += seeds.rotations[i * 3 + 2] * 0.016 * rotSpeed;

      // Scale: slight pulse + shrink
      const scaleModifier = 1.0 - convergeFactor * 0.3 - spiralProgress * 0.5;
      const pulse = 1.0 + Math.sin(time * 0.5 + phase) * 0.02;
      const finalScale = s * scaleModifier * pulse;

      tempPosition.set(x, y, z);
      tempEuler.set(
        currentRotations.current[i * 3],
        currentRotations.current[i * 3 + 1],
        currentRotations.current[i * 3 + 2]
      );
      tempQuaternion.setFromEuler(tempEuler);
      tempScale.set(finalScale, finalScale, finalScale);
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      meshRef.current.setMatrixAt(i, tempMatrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, beanCount]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Latte and Wooden Table Component
// ─────────────────────────────────────────────────────────────────────────────
function LatteAndTable() {
  const { scene } = useGLTF('/models/latte_art/scene.gltf');
  
  const diffMap = useLoader(THREE.TextureLoader, '/wood_table_2k.blend/textures/wood_table_diff_2k.jpg');
  const normMap = useLoader(THREE.TextureLoader, '/wood_table_2k.blend/textures/vertopal.com_wood_table_nor_gl_2k.jpeg');
  const roughMap = useLoader(THREE.TextureLoader, '/wood_table_2k.blend/textures/vertopal.com_wood_table_rough_2k.jpeg');

  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cupGroupRef = useRef<THREE.Group>(null);
  const tableMeshRef = useRef<THREE.Mesh>(null);
  
  const boxYOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return box.min.y;
  }, [scene]);

  useEffect(() => {
    [diffMap, normMap, roughMap].forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      tex.needsUpdate = true;
    });
    diffMap.colorSpace = THREE.SRGBColorSpace;
    normMap.colorSpace = THREE.NoColorSpace;
    roughMap.colorSpace = THREE.NoColorSpace;
  }, [diffMap, normMap, roughMap]);

  useFrame((state) => {
    const currentScale = animState.latteScale * animState.cupFade;

    // Table stays at fixed position
    if (tableMeshRef.current) {
      tableMeshRef.current.position.y = -0.05;
    }

    // Table opacity driven by scroll
    if (matRef.current) {
      const tOpac = animState.tableOpacity;
      matRef.current.transparent = tOpac < 0.99;
      matRef.current.opacity = tOpac;
      matRef.current.depthWrite = tOpac > 0.01;
    }

    // Cup scales and fades as dough becomes hero
    if (groupRef.current) {
      groupRef.current.scale.setScalar(currentScale);
      groupRef.current.rotation.y = Math.PI * 0.5 + animState.cupSpinY;
      const mat = groupRef.current.children[0] as any;
      if (mat?.material) {
        mat.material.transparent = animState.cupFade < 0.99;
        mat.material.opacity = animState.cupFade;
      }
    }
    if (cupGroupRef.current) {
      cupGroupRef.current.position.y = animState.cupY;
    }
  });

  return (
    <group ref={cupGroupRef} position={[0, -4.0, 0]}>
      <mesh 
        ref={tableMeshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40, 1, 1]} />
        <meshStandardMaterial 
          ref={matRef}
          map={diffMap} 
          normalMap={normMap} 
          roughnessMap={roughMap}
          roughness={0.9}
          metalness={0.05}
          color="#ffffff"
          emissive="#1c100a"
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <group ref={groupRef} rotation={[0, Math.PI * 0.5, 0]} position={[0, -0.05, 0]}>
        <primitive object={scene} position={[0, -boxYOffset, -0.065]} />
      </group>
    </group>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// // RollingPinHero
// ─────────────────────────────────────────────────────────────────────────────
function RollingPinHero() {
  const { scene: pinScene } = useGLTF('/models/wooden_rolling_pin/scene.gltf');
  const { scene: doughScene } = useGLTF('/models/pizzadoughflat/scene.gltf');
  const pinRef = useRef<THREE.Group>(null);
  const currentDoughScaleRef = useRef(0.01);

  // Set up shadows and material properties
  useEffect(() => {
    pinScene.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.roughness = 0.55;
          node.material.metalness = 0.05;
          if (node.material.map) {
            node.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      }
    });
  }, [pinScene]);

  // Calculate rolling pin normalization scale and dimensions
  const { normalizedScale, worldRadius, offset, primRotation, localDoughTop } = useMemo(() => {
    // 1. Rolling pin bounding box
    const pinBox = new THREE.Box3().setFromObject(pinScene);
    const pinSize = new THREE.Vector3();
    pinBox.getSize(pinSize);
    
    // Find longest axis (length of the rolling pin)
    const dimensions = [
      { axis: 'x', value: pinSize.x },
      { axis: 'y', value: pinSize.y },
      { axis: 'z', value: pinSize.z }
    ];
    dimensions.sort((a, b) => b.value - a.value);
    
    const longestAxis = dimensions[0].axis;
    const length = dimensions[0].value;
    const thickness = dimensions[1].value;
    
    // We want the rolling pin to be 3.8 units wide in world space (reduced size)
    const targetLength = 3.8;
    const normalizedScale = targetLength / length;
    const worldRadius = (thickness / 2) * normalizedScale;
    
    // Centering offset to make sure rotation/pivot is at the geometric center
    const pinCenter = new THREE.Vector3();
    pinBox.getCenter(pinCenter);
    const offset = pinCenter.clone().multiplyScalar(-1);
    
    // Alignment rotation (make longest axis point along Z-axis)
    const primRotation = new THREE.Euler(0, 0, 0);
    if (longestAxis === 'x') {
      primRotation.y = Math.PI / 2;
    } else if (longestAxis === 'y') {
      primRotation.x = Math.PI / 2;
    }
    
    // 2. Dough bounding box to determine its thickness
    const doughBox = new THREE.Box3().setFromObject(doughScene);
    // Dough top in its group space
    const localDoughTop = doughBox.max.y - 0.012;
    
    return { normalizedScale, worldRadius, offset, primRotation, localDoughTop };
  }, [pinScene, doughScene]);

  useFrame((state) => {
    if (!pinRef.current) return;
    const vis = animState.rollingPinVisible;
    const rx = animState.rollingPinX;
    const logoProg = animState.logoSnapProgress;
    
    // Check if we are in the logo snap phase
    if (logoProg > 0.01) {
      // Reappear rolling pin vertically at the center [0, 0, 0] for the logo snap
      const targetScale = normalizedScale * 0.7 * logoProg;
      pinRef.current.scale.setScalar(targetScale);
      pinRef.current.position.set(0, 0, 0);
      
      // Face camera and point straight "up" in viewport space
      pinRef.current.quaternion.copy(state.camera.quaternion);
      pinRef.current.rotateX(Math.PI / 2);
    } else {
      // Interpolate dough scale to sync with DoughHero component
      const reveal = animState.doughReveal;
      const heroScale = 4.0 + animState.doughHeroScale * 0.5;
      const targetDoughScale = reveal > 0.01 ? heroScale : 0.01;
      currentDoughScaleRef.current = THREE.MathUtils.lerp(currentDoughScaleRef.current, targetDoughScale, 0.04);
      
      // Pin scale is driven by visibility
      const currentScale = THREE.MathUtils.lerp(0.001, normalizedScale, vis);
      pinRef.current.scale.setScalar(currentScale);
      
      // Position rolling pin dynamically above the growing dough
      const worldDoughTop = -4.04 + (localDoughTop * currentDoughScaleRef.current);
      const currentWorldRadius = worldRadius * (currentScale / normalizedScale);
      const pinY = worldDoughTop + currentWorldRadius;
      
      pinRef.current.position.set(rx, pinY, 0);
      
      // Roll rotation around Z axis based on distance traveled
      pinRef.current.rotation.set(0, 0, -rx / worldRadius);
    }
  });

  return (
    <group ref={pinRef}>
      <primitive 
        object={pinScene} 
        position={[offset.x, offset.y, offset.z]} 
        rotation={primRotation}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SteamFlourParticles — single Points system for the full steam→flour→vortex→settle journey
// ─────────────────────────────────────────────────────────────────────────────
function SteamImage() {
  const tex = useLoader(THREE.TextureLoader, '/steam.png');
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const { scene: latteScene } = useGLTF('/models/latte_art/scene.gltf');
  const cupHeight = useMemo(() => {
    const box = new THREE.Box3().setFromObject(latteScene);
    return box.max.y - box.min.y;
  }, [latteScene]);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const time = state.clock.getElapsedTime();
    const sp = animState.steamPhase;
    const fs = animState.flourSettle;

    // Fade in during steam Phase, hold, fade out during settle
    const opacity = Math.min(sp * 2.0, 1.0) * (1.0 - fs);
    matRef.current.opacity = Math.max(0, opacity * 0.5); // moderate opacity for steam image

    meshRef.current.visible = opacity > 0.01;

    const coffeeSurfaceY = -4.05 + cupHeight - 0.08;
    
    // Continuous upward motion based on time, scaled by steam phase
    const upwardMovement = sp * 0.5 + (time * 0.2 % 2.0);
    
    meshRef.current.position.y = coffeeSurfaceY + upwardMovement + 1.0; // lifted slightly so it's visible
    meshRef.current.position.x = Math.sin(time * 0.5) * 0.15;
    meshRef.current.position.z = Math.cos(time * 0.4) * 0.15;
    
    // Scale up slightly as it rises
    const scale = 1.0 + upwardMovement * 0.3;
    meshRef.current.scale.setScalar(scale);

    // Billboarding - face camera
    meshRef.current.lookAt(state.camera.position);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.5, 2.5]} />
      <meshBasicMaterial 
        ref={matRef} 
        map={tex} 
        transparent 
        depthWrite={false} 
        opacity={0} 
      />
    </mesh>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// DoughHero — the real pizzadoughflat model that fades in within the particle cloud
// ─────────────────────────────────────────────────────────────────────────────
function DoughHero() {
  const { scene } = useGLTF('/models/pizzadoughflat/scene.gltf');
  const doughRef  = useRef<THREE.Group>(null);
  const matRef    = useRef<THREE.MeshStandardMaterial | null>(null);
  const flourTex = useLoader(THREE.TextureLoader, '/flour.jpg');

  useEffect(() => {
    flourTex.colorSpace = THREE.SRGBColorSpace;
  }, [flourTex]);

  // Extract and enhance the dough material
  useEffect(() => {
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        node.castShadow = true;
        node.receiveShadow = true;
        const mat = node.material as THREE.MeshStandardMaterial;
        mat.map       = flourTex; // Apply flour texture directly to the dough mesh
        mat.color     = new THREE.Color('#FAF0D9'); // Warm floury dough color tint
        mat.roughness = 0.92;
        mat.metalness = 0.0;
        mat.transparent = true;
        mat.opacity = 0;
        mat.needsUpdate = true;
        matRef.current = mat;
      }
    });
  }, [scene, flourTex]);

  useFrame(() => {
    if (!doughRef.current || !matRef.current) return;

    const reveal = animState.doughReveal;
    const heroScale = 4.0 + animState.doughHeroScale * 0.5; // dough fills the frame

    // Fade in opacity
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, reveal, 0.05);
    matRef.current.transparent = matRef.current.opacity < 0.99;

    // Scale up from zero
    const s = THREE.MathUtils.lerp(doughRef.current.scale.x, reveal > 0.01 ? heroScale : 0.01, 0.04);
    doughRef.current.scale.setScalar(s);
    doughRef.current.position.y = animState.doughY;
  });

  // The GLTF model has nested transforms. We counteract by centering it.
  // Table surface is at world Y = -4.05. Dough sits flat on top.
  return (
    <group ref={doughRef} position={[0, -4.04, 0]} scale={0.01} rotation={[0, 0, 0]}>
      <primitive object={scene} position={[-0.149, -0.012, -0.843]} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FoodBurstHero — the menu items that pop out from the dough
// ─────────────────────────────────────────────────────────────────────────────
function FoodBurstHero() {
  const { scene: croissantScene } = useGLTF('/croissant_4k.gltf/croissant_4k.gltf');
  const { scene: burgerScene } = useGLTF('/models/krabby_patty_burger/scene.gltf');
  const { scene: cakeScene } = useGLTF('/models/cupcake/scene.gltf');
  const { scene: cookieScene } = useGLTF('/models/cookie_school_project/scene.gltf');

  const groupRef = useRef<THREE.Group>(null);
  const croissantRef = useRef<THREE.Group>(null);
  const burgerRef = useRef<THREE.Group>(null);
  const cakeRef = useRef<THREE.Group>(null);
  const cookieRef = useRef<THREE.Group>(null);

  // Set up shadows and scale normalization
  useEffect(() => {
    const setupModel = (scene: THREE.Group, targetSize: number) => {
      scene.traverse((node: any) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      // reset scale and position before measuring to be safe
      scene.scale.setScalar(1);
      scene.position.set(0, 0, 0);
      
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = targetSize / maxDim;
        scene.scale.setScalar(scale);
        
        // Center the pivot
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      }
    };

    // Normalize models individually to match reference image composition proportions
    setupModel(croissantScene, 8.5); // massive croissant
    setupModel(burgerScene, 3.8);    // medium-large burger in the center
    setupModel(cakeScene, 2.8);      // smaller cupcake floating in the back
    setupModel(cookieScene, 5.2);    // large cookie on the right
  }, [croissantScene, burgerScene, cakeScene, cookieScene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = animState.foodBurstProgress;
    
    // Bind group Y to doughY so they pop out from the floating position
    groupRef.current.position.y = animState.doughY;
    
    // Scale up from 0 to 1 with a bouncy pop at the start
    const bouncyScale = progress < 0.01 ? 0 : Math.min(1.0, progress * 2.5);
    
    if (croissantRef.current) {
      croissantRef.current.scale.setScalar(bouncyScale);
      croissantRef.current.position.set(-1.5 - 6.5 * progress, progress * 1.8, -0.5 + 18.5 * progress);
      croissantRef.current.rotation.x = progress * Math.PI * 4;
      croissantRef.current.rotation.y = progress * Math.PI * 2;
    }
    if (burgerRef.current) {
      burgerRef.current.scale.setScalar(bouncyScale);
      burgerRef.current.position.set(-0.1 - 2.9 * progress, progress * 1.0, 0.5 + 17.5 * progress);
      burgerRef.current.rotation.x = progress * Math.PI * 3;
      burgerRef.current.rotation.y = progress * Math.PI * 3;
    }
    if (cakeRef.current) {
      cakeRef.current.scale.setScalar(bouncyScale);
      cakeRef.current.position.set(0.1 + 2.9 * progress, progress * 2.4, 0.5 + 17.5 * progress);
      cakeRef.current.rotation.x = progress * Math.PI * 2;
      cakeRef.current.rotation.y = progress * Math.PI * 4;
    }
    if (cookieRef.current) {
      cookieRef.current.scale.setScalar(bouncyScale);
      cookieRef.current.position.set(1.5 + 6.5 * progress, progress * 0.2, -0.5 + 17.5 * progress);
      cookieRef.current.rotation.x = progress * Math.PI * 5;
      cookieRef.current.rotation.y = progress * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -4.04, 0]}>
      <group ref={croissantRef}><primitive object={croissantScene} /></group>
      <group ref={burgerRef}><primitive object={burgerScene} /></group>
      <group ref={cakeRef}><primitive object={cakeScene} /></group>
      <group ref={cookieRef}><primitive object={cookieScene} /></group>
    </group>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SceneAnimationController — GSAP timeline + per-frame updates
function SceneAnimationController({ activeCategoryIndex }: { activeCategoryIndex: number }) {
  const { camera } = useThree();



  // Halo glow ring ref for the dough hero shot
  const haloRef = useRef<THREE.Mesh>(null);

  // Stable lookAt target and base camera position
  const lookAtTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -5));
  const baseCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 15));

  // ─── GSAP Scroll Timeline ───
  useLayoutEffect(() => {
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.story-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: BEAN SPACE — 4-phase immersive camera flight
    // ═══════════════════════════════════════════════════════════════

    // Phase 1: 0 - 30% -> Bean Universe
    mainTimeline.to(animState, {
      camZ: 10,
      lookZ: -2,
      beanSpaceProgress: 0.3,
      duration: 2.4,
      ease: 'power1.inOut'
    }, 0);

    // Phase 2: 30 - 45% -> Bean Convergence & Pitch Down
    mainTimeline.to(animState, {
      camY: 3.0,     // move camera up to look down
      camZ: 4.0,     // move closer
      lookY: -4.0,   // look down at cup
      lookZ: 0,
      beanSpaceProgress: 0.45,
      beanSpaceConverge: 0.5,
      duration: 1.2,
      ease: 'power1.inOut'
    }, 2.4);

    // Phase 3: 45 - 55% -> Table Reveal (Top-down view)
    mainTimeline.to(animState, {
      camX: 0,
      camY: 7.0,     // directly above, moved up slightly
      camZ: 1.2,     // stable radius to prevent lookAt gimbal lock / jitter
      lookX: 0,
      lookY: -4.0,
      lookZ: 0,
      beanSpaceProgress: 0.55,
      beanSpaceConverge: 0.8,
      tableOpacity: 1.0,
      latteScale: 3.5, // Enlarge latte
      duration: 0.8,
      ease: 'power2.inOut'
    }, 3.6);

    // Phase 4: 55 - 70% -> Beans into Cup + Camera Swirl
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,     // transition down to the 45 degree angle
      camZ: 10.5,    // moved a little back
      lookX: 0,
      lookY: -4.0,
      lookZ: 0,
      beanSpaceProgress: 0.7,
      beanSpaceConverge: 1.0,
      beanSpiralPhase: 1.0,
      cameraOrbitAngle: Math.PI * 2.0, // Complete the full cinematic sweep during the swirl
      duration: 1.2,
      ease: 'power1.inOut'
    }, 4.4);

    // Phase 5: 70 - 80% -> Ripple & Steam, beans fade
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,
      camZ: 10.5,
      lookX: 0,
      lookY: -4.0,
      lookZ: 0,
      beanSpaceProgress: 0.8,
      beanSpaceOpacity: 0.0,
      steamOpacity: 1.0,
      duration: 0.8,
      ease: 'power1.inOut'
    }, 5.6);

    // Phase 6: 80 - 100% -> Hero Angle
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,    
      camZ: 10.5,    
      lookX: 0,
      lookY: -4.0,
      lookZ: 0,
      beanSpaceProgress: 1.0,
      duration: 1.6,
      ease: 'power2.inOut'
    }, 6.4);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: STEAM RISING
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,    
      camZ: 10.5,    
      lookX: 0,
      lookY: -4.0,   
      lookZ: 0,
      steamPhase: 1.0,
      beanSpaceOpacity: 0.0,
      duration: 2.0,
      ease: 'power2.inOut'
    }, 8.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: STEAM → FLOUR
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,    
      camZ: 10.5,
      lookX: 0,
      lookY: -4.0,   
      lookZ: 0,
      flourPhase: 1.0,
      duration: 2.0,
      ease: 'power1.inOut'
    }, 10.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: FLOUR VORTEX & CAMERA PULLBACK
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,    
      camZ: 10.5,    
      lookX: 0,
      lookY: -4.0,   
      lookZ: 0,
      flourVortex: 1.0,
      duration: 2.0,
      ease: 'power2.inOut'
    }, 12.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: RAPID CUP SPIN → ROLLING PIN ENTRANCE
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      cupSpinY: Math.PI * 10,  // rapid multiple spins
      cupFade: 0.0,            // Cup vanishes during the spin
      rollingPinVisible: 1.0,  // Pin scales up
      rollingPinX: -4.0,       // Pin enters from left
      doughReveal: 0.5,        // Dough starts emerging when rolling enters the screen
      camX: 0,
      camY: 3.5,
      camZ: 10.5,
      lookX: 0,
      lookY: -4.0,
      duration: 3.0,
      ease: 'power2.inOut'
    }, 14.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: ROLLING PIN ROLLS DOUGH
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      rollingPinX: 4.0,        // Pin rolls across to the right
      doughReveal: 1.0,        // Dough finishes emerging
      flourSettle: 1.0,        // Dust settles
      camX: 0,
      camY: 3.5,    
      camZ: 10.5,
      lookX: 0,
      lookY: -4.0,  
      duration: 3.0,
      ease: 'power2.inOut'
    }, 17.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: DOUGH FLOATING & TABLE FADING
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      rollingPinVisible: 0.0,  // rolling pin completely disappears
      doughY: 0.0,             // dough floats up to center height
      tableOpacity: 0.0,       // table fades to reveal dark background
      camX: 0,
      camY: 3.5,               // camera stays still
      camZ: 10.5,              // camera stays still
      lookX: 0,
      lookY: 0.0,              // camera lookAt shifts up to look at floating dough
      lookZ: 0,
      cameraOrbitAngle: Math.PI * 2.0,
      duration: 3.0,
      ease: 'power2.inOut'
    }, 20.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 9: FOOD BURST (Dough breaks and food pops)
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      doughReveal: 0.0,        // dough breaks/disappears
      foodBurstProgress: 1.0,  // food models pop out!
      camX: 0,
      camY: 3.5,
      camZ: 10.5,
      lookX: 0,
      lookY: 0.0,
      lookZ: 0,
      cameraOrbitAngle: Math.PI * 2.0,
      logoSnapProgress: 1.0,
      logoGlowIntensity: 1.5,
      duration: 4.0,
      ease: 'power1.out'       // smooth ease to prevent jerking/overshoot clipping
    }, 23.0);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 10: EXTENDED HOLD FOR MENU UI
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      camX: 0,
      camY: 3.5,
      camZ: 10.5,
      lookX: 0,
      lookY: 0.0,
      lookZ: 0,
      cameraOrbitAngle: Math.PI * 2.0,
      duration: 4.0,
      ease: 'linear'
    }, 27.0);

    return () => {
      mainTimeline.kill();
    };
  }, []);



  // ─── Per-frame updates ───
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Smooth Camera Translation with organic sway added to the target position to prevent idle drift
    let targetX = animState.camX;
    let targetY = animState.camY;
    let targetZ = animState.camZ;

    if (animState.beanSpaceProgress < 0.95) {
      const swayIntensity = (1.0 - animState.beanSpaceConverge) * 0.15;
      targetX += Math.sin(time * 0.3) * swayIntensity;
      targetY += Math.cos(time * 0.25) * swayIntensity * 0.5;
    }

    baseCameraPosRef.current.x = THREE.MathUtils.lerp(baseCameraPosRef.current.x, targetX, 0.1);
    baseCameraPosRef.current.y = THREE.MathUtils.lerp(baseCameraPosRef.current.y, targetY, 0.1);
    baseCameraPosRef.current.z = THREE.MathUtils.lerp(baseCameraPosRef.current.z, targetZ, 0.1);

    // Apply the swirl orbit around the Y axis mathematically AFTER lerp to prevent orbit collapse
    // We must consider floating point precision, so we check if the angle modulo 2PI is > 0.01.
    // In section 3, the timeline animates cameraOrbitAngle to 0, which also bypasses this cleanly.
    if (Math.abs(animState.cameraOrbitAngle % (Math.PI * 2)) > 0.001 || (animState.cameraOrbitAngle > 0 && animState.cameraOrbitAngle < Math.PI * 2 - 0.001)) {
      const currentX = baseCameraPosRef.current.x;
      const currentZ = baseCameraPosRef.current.z;
      const cosA = Math.cos(animState.cameraOrbitAngle);
      const sinA = Math.sin(animState.cameraOrbitAngle);
      camera.position.x = currentX * cosA + currentZ * sinA;
      camera.position.z = -currentX * sinA + currentZ * cosA;
      camera.position.y = baseCameraPosRef.current.y;
    } else {
      camera.position.copy(baseCameraPosRef.current);
    }

    // 2. Camera Orientation LookAt
    lookAtTargetRef.current.x = THREE.MathUtils.lerp(lookAtTargetRef.current.x, animState.lookX, 0.1);
    lookAtTargetRef.current.y = THREE.MathUtils.lerp(lookAtTargetRef.current.y, animState.lookY, 0.1);
    lookAtTargetRef.current.z = THREE.MathUtils.lerp(lookAtTargetRef.current.z, animState.lookZ, 0.1);
    camera.lookAt(lookAtTargetRef.current);



    // 3. Logo Halo — dough hero glow ring
    if (haloRef.current) {
      // Scale based on logoSnapProgress
      haloRef.current.scale.setScalar(THREE.MathUtils.lerp(haloRef.current.scale.x, animState.logoSnapProgress * 3.5, 0.08));
      
      if (haloRef.current.material instanceof THREE.MeshBasicMaterial) {
        haloRef.current.material.opacity = animState.logoSnapProgress * 0.18;
      }
      
      // Slowly rotate the ring over time
      haloRef.current.rotation.z = time * 0.08;
      
      // Center and face camera directly when in logo snap phase
      if (animState.logoSnapProgress > 0.01) {
        haloRef.current.position.set(0, 0.0, 0);
        haloRef.current.quaternion.copy(camera.quaternion);
      } else {
        // Otherwise sits flat on table
        haloRef.current.position.set(0, -3.96, 0);
        const tempEuler = new THREE.Euler(-Math.PI / 2, 0, time * 0.08);
        haloRef.current.quaternion.setFromEuler(tempEuler);
      }
    }
  });

  return (
    <>
      {/* 1. BEAN SPACE — Instanced coffee beans */}
      <CoffeeBeanSpace />

      {/* 2. COFFEE CUP & WOODEN TABLE */}
      <LatteAndTable />

      {/* 3. STEAM IMAGE */}
      <SteamImage />

      {/* 4. ROLLING PIN HERO */}
      <RollingPinHero />

      {/* 5. DOUGH HERO — real GLTF model fades in from particle cloud */}
      <DoughHero />

      {/* 5.5 FOOD BURST HERO */}
      <FoodBurstHero />

      {/* 6. DOUGH HERO GOLDEN HALO GLOW — flat ring on table surface */}
      <mesh ref={haloRef} position={[0, -3.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.8, 64]} />
        <meshBasicMaterial
          color="#D4AF37"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0}
        />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas wrapper with premium lighting
// ─────────────────────────────────────────────────────────────────────────────
interface Scene3DProps {
  activeCategoryIndex: number;
}

export default function Scene3D({ activeCategoryIndex }: Scene3DProps) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#1E0F09]">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} near={0.1} far={120} />

        {/* Warm atmospheric fog — espresso depth */}
        <fog attach="fog" args={['#1A0D07', 10, 40]} />

        {/* Warm ambient fill */}
        <ambientLight intensity={0.35} color="#FFE8D0" />

        {/* Soft hemispheric light for natural fill */}
        <hemisphereLight
          args={['#FFD6A5', '#1E0F09', 0.4]}
        />

        {/* Main warm key light */}
        <spotLight
          position={[0, 10, 12]}
          angle={0.6}
          penumbra={1.0}
          intensity={3.0}
          color="#FFD6A5"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Rim light — saffron accent */}
        <directionalLight
          position={[-6, 4, -4]}
          intensity={1.5}
          color="#D4AF37"
        />

        {/* Subtle warm fill from below */}
        <pointLight
          position={[0, -2, 4]}
          intensity={0.8}
          color="#FFE0C0"
        />

        {/* Ambient starry backdrop */}
        <Stars radius={100} depth={50} count={250} factor={3} saturation={0.3} fade speed={0.8} />

        <SceneAnimationController activeCategoryIndex={activeCategoryIndex} />
      </Canvas>
    </div>
  );
}
