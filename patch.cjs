const fs = require('fs');
let code = fs.readFileSync('src/components/Scene3D.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { Canvas, useFrame, useThree } from '@react-three/fiber';",
  "import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';"
);
code = code.replace(
  "import { PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';",
  "import { PerspectiveCamera, Stars, useGLTF } from '@react-three/drei';\nimport { EXRLoader } from 'three-stdlib';"
);
code = code.replace(
  "useGLTF.preload('/models/coffe_bean/scene.gltf');",
  "useGLTF.preload('/models/coffe_bean/scene.gltf');\nuseGLTF.preload('/models/latte_art/scene.gltf');"
);

// 2. Add animState variables
code = code.replace(
  "  cupIntensity: 0.0,",
  "  cupIntensity: 0.0,\n  tableOpacity: 0.0,\n  latteScale: 0.0,\n  beanSpiralPhase: 0.0,\n  steamOpacity: 0.0,"
);

// 3. Update spiral logic in CoffeeBeanSpace
const oldSpiralLogic = `      // Compute current position — lerp toward convergence target
      const convergeFactor = Math.pow(converge, 1.5); // smooth easing curve
      const x = THREE.MathUtils.lerp(baseX + driftX, convX, convergeFactor);
      const y = THREE.MathUtils.lerp(baseY + driftY, convY, convergeFactor);
      const z = THREE.MathUtils.lerp(baseZ + driftZ, convZ, convergeFactor);

      // Slow continuous rotation
      const rotSpeed = 0.3 + (1.0 - converge) * 0.2; // slow down as they converge
      currentRotations.current[i * 3] += seeds.rotations[i * 3] * 0.016 * rotSpeed;
      currentRotations.current[i * 3 + 1] += seeds.rotations[i * 3 + 1] * 0.016 * rotSpeed;
      currentRotations.current[i * 3 + 2] += seeds.rotations[i * 3 + 2] * 0.016 * rotSpeed;

      // Scale: slight pulse + shrink during full convergence
      const scaleModifier = 1.0 - convergeFactor * 0.3;
      const pulse = 1.0 + Math.sin(time * 0.5 + phase) * 0.02;
      const finalScale = s * scaleModifier * pulse;`;

const newSpiralLogic = `      // 1. Converge toward a general center
      const convergeFactor = Math.pow(converge, 1.5);
      let x = THREE.MathUtils.lerp(baseX + driftX, convX, convergeFactor);
      let y = THREE.MathUtils.lerp(baseY + driftY, convY, convergeFactor);
      let z = THREE.MathUtils.lerp(baseZ + driftZ, convZ, convergeFactor);

      // 2. Spiral into the cup
      const spiralProgress = animState.beanSpiralPhase;
      if (spiralProgress > 0) {
        const radius = Math.sqrt(x * x + z * z);
        const currentAngle = Math.atan2(z, x);
        const spiralAngle = currentAngle + spiralProgress * 10.0 + phase;
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
      const finalScale = s * scaleModifier * pulse;`;

code = code.replace(oldSpiralLogic, newSpiralLogic);

// 4. LatteAndTable Component definition
const newComponent = `
// ─────────────────────────────────────────────────────────────────────────────
// Latte and Wooden Table Component
// ─────────────────────────────────────────────────────────────────────────────
function LatteAndTable() {
  const { scene } = useGLTF('/models/latte_art/scene.gltf');
  
  const diffMap = useLoader(THREE.TextureLoader, '/wood_table_2k.blend/textures/wood_table_diff_2k.jpg');
  const dispMap = useLoader(THREE.TextureLoader, '/wood_table_2k.blend/textures/wood_table_disp_2k.png');
  const normMap = useLoader(EXRLoader, '/wood_table_2k.blend/textures/wood_table_nor_gl_2k.exr');
  const roughMap = useLoader(EXRLoader, '/wood_table_2k.blend/textures/wood_table_rough_2k.exr');

  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cupGroupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    [diffMap, dispMap, normMap, roughMap].forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
    });
    diffMap.colorSpace = THREE.SRGBColorSpace;
  }, [diffMap, dispMap, normMap, roughMap]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (matRef.current) {
      const tOpac = animState.tableOpacity * (1.0 - animState.cupMorphToBelan);
      matRef.current.opacity = tOpac;
      matRef.current.transparent = tOpac < 0.99;
      matRef.current.depthWrite = tOpac > 0.5;
    }
    if (groupRef.current) {
      const shrinkFactor = 1.0 - animState.cupMorphToBelan;
      groupRef.current.scale.setScalar(animState.latteScale * shrinkFactor);
      
      // Belan morph effect
      if (animState.cupMorphToBelan > 0.01) {
        const squeezeX = 1.0 + animState.cupMorphToBelan * 2.5;
        const squeezeY = 1.0 - animState.cupMorphToBelan * 0.8;
        const squeezeZ = 1.0 - animState.cupMorphToBelan * 0.8;
        groupRef.current.scale.set(
          animState.latteScale * squeezeX * shrinkFactor,
          animState.latteScale * squeezeY * shrinkFactor,
          animState.latteScale * squeezeZ * shrinkFactor
        );
      }
    }
    if (cupGroupRef.current) {
      cupGroupRef.current.position.y = animState.cupY;
    }
  });

  return (
    <group ref={cupGroupRef} position={[0, -4.0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40, 256, 256]} />
        <meshStandardMaterial 
          ref={matRef}
          map={diffMap} 
          displacementMap={dispMap}
          displacementScale={0.03}
          normalMap={normMap} 
          roughnessMap={roughMap}
          color="#3a2518"
        />
      </mesh>
      
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
`;

code = code.replace(
  "// ─────────────────────────────────────────────────────────────────────────────\n// SceneAnimationController",
  newComponent + "\n// ─────────────────────────────────────────────────────────────────────────────\n// SceneAnimationController"
);

// 5. Replace GSAP Timeline for section 1 and 2
const oldTimeline = `    // Phase 1 (0–30%): Fly forward through bean field
    mainTimeline.to(animState, {
      camZ: 8,
      lookZ: -2,
      beanSpaceProgress: 0.3,
      duration: 2.0,
      ease: 'power1.inOut'
    }, 0);

    // Phase 2 (30–60%): Beans begin converging, camera continues
    mainTimeline.to(animState, {
      camZ: 5,
      camY: -1.0,
      lookY: -1.5,
      lookZ: 0,
      beanSpaceProgress: 0.6,
      beanSpaceConverge: 0.35,
      duration: 2.0,
      ease: 'power1.inOut'
    }, 2.0);

    // Phase 3 (60–80%): Hero beans dominate frame, stronger convergence
    mainTimeline.to(animState, {
      camZ: 4.5,
      camY: -2.5,
      lookY: -3.0,
      beanSpaceProgress: 0.8,
      beanSpaceConverge: 0.7,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 4.0);

    // Phase 4 (80–100%): Full convergence staging for cup formation
    mainTimeline.to(animState, {
      camY: -3.5,
      camZ: 5.5,
      lookY: -3.8,
      beanSpaceProgress: 1.0,
      beanSpaceConverge: 1.0,
      beanSpaceOpacity: 0.0,
      cupScale: 1.1,
      cupY: -3.8,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 5.5);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: THE POUR — Cup fills
    // ═══════════════════════════════════════════════════════════════
    mainTimeline.to(animState, {
      camY: -4.0,
      camZ: 6,
      lookY: -4.0,
      lookZ: 0,
      cupIntensity: 1.0,
      duration: 1.0,
      ease: 'power2.out'
    }, 7.0);`;

const newTimeline = `    // Phase 1: 0 - 30% -> Bean Universe
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
      camY: 5.0,     // directly above
      camZ: 0.1,     // almost directly above
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

    // Phase 4: 55 - 70% -> Beans into Cup
    mainTimeline.to(animState, {
      beanSpaceProgress: 0.7,
      beanSpaceConverge: 1.0,
      beanSpiralPhase: 1.0,
      duration: 1.2,
      ease: 'power2.in'
    }, 4.4);

    // Phase 5: 70 - 80% -> Ripple & Steam, beans fade
    mainTimeline.to(animState, {
      beanSpaceProgress: 0.8,
      beanSpaceOpacity: 0.0,
      steamOpacity: 1.0,
      duration: 0.8,
      ease: 'power1.inOut'
    }, 5.6);

    // Phase 6: 80 - 100% -> Hero Angle
    mainTimeline.to(animState, {
      camX: 0,
      camY: -2.0,    // 45 degree angle
      camZ: 4.0,
      lookX: 0,
      lookY: -4.0,
      lookZ: 0,
      beanSpaceProgress: 1.0,
      duration: 1.6,
      ease: 'power2.inOut'
    }, 6.4);`;

code = code.replace(oldTimeline, newTimeline);

// 6. Delete old procedural cup HTML and replace with LatteAndTable
const oldCupRegex = /\{\/\* 2\. SECTION 2 COFFEE CUP \*\/\}.*?(?=\{\/\* 3\. THE BELAN \(ROLLING PIN\) \*\/\})/s;
const newCup = `{/* 2. SECTION 2 COFFEE CUP & TABLE */}
      <LatteAndTable />

      `;
code = code.replace(oldCupRegex, newCup);

// 7. Remove old cup animation logic from useFrame
const oldCupLogic = `    // 3. Section 2: Coffee Cup
    if (cupGroupRef.current) {
      cupGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(cupGroupRef.current.scale.x, animState.cupScale, 0.1));
      cupGroupRef.current.position.y = THREE.MathUtils.lerp(cupGroupRef.current.position.y, animState.cupY, 0.1);

      if (animState.cupMorphToBelan > 0.01) {
        const squeezeX = 1.0 + animState.cupMorphToBelan * 2.5;
        const squeezeY = 1.0 - animState.cupMorphToBelan * 0.8;
        const squeezeZ = 1.0 - animState.cupMorphToBelan * 0.8;
        cupGroupRef.current.scale.set(
          THREE.MathUtils.lerp(cupGroupRef.current.scale.x, squeezeX * animState.cupScale, 0.1),
          THREE.MathUtils.lerp(cupGroupRef.current.scale.y, squeezeY * animState.cupScale, 0.1),
          THREE.MathUtils.lerp(cupGroupRef.current.scale.z, squeezeZ * animState.cupScale, 0.1)
        );
      }
    }`;

code = code.replace(oldCupLogic, "");

// 8. Write file back
fs.writeFileSync('src/components/Scene3D.tsx', code);
console.log('Update Complete.');
