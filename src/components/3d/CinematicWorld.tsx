import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CustomizerState {
  boxColor: string;
  ribbonColor: string;
  monogramText: string;
}

interface CinematicWorldProps {
  customizerState?: CustomizerState;
}

export function CinematicWorld({ customizerState }: CinematicWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<{
    boxMat?: THREE.MeshStandardMaterial;
    ribbonMat?: THREE.MeshStandardMaterial;
    monogramCanvas?: HTMLCanvasElement;
    monogramTexture?: THREE.CanvasTexture;
  }>({});

  // Update 3D materials dynamically when customizer state changes
  useEffect(() => {
    if (!customizerState) return;

    if (materialsRef.current.boxMat) {
      materialsRef.current.boxMat.color.set(customizerState.boxColor);
    }
    if (materialsRef.current.ribbonMat) {
      materialsRef.current.ribbonMat.color.set(customizerState.ribbonColor);
    }
    if (materialsRef.current.monogramCanvas && materialsRef.current.monogramTexture) {
      const cv = materialsRef.current.monogramCanvas;
      const ctx = cv.getContext("2d");
      if (ctx) {
        ctx.fillStyle = customizerState.boxColor;
        ctx.fillRect(0, 0, 256, 128);
        ctx.lineWidth = 6;
        ctx.strokeStyle = customizerState.ribbonColor;
        ctx.strokeRect(6, 6, 244, 116);

        ctx.fillStyle = customizerState.ribbonColor;
        ctx.font = "bold 52px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(customizerState.monogramText || "Ni²", 128, 64);
        materialsRef.current.monogramTexture.needsUpdate = true;
      }
    }
  }, [customizerState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x230c1c, 0.042);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 6.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";

    // ==========================================
    // LIGHTING SYSTEM
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x5a1e3d, 1.5);
    scene.add(ambientLight);

    // Main studio key light
    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.6);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Dynamic pointer spotlight
    const pointerLight = new THREE.SpotLight(0xd6b77a, 3.2, 16, Math.PI / 4, 0.6);
    pointerLight.position.set(0, 4, 5);
    scene.add(pointerLight);

    // Atmospheric rim lights
    const rimLightLeft = new THREE.DirectionalLight(0xd6b77a, 1.6);
    rimLightLeft.position.set(-6, 3, -3);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0x702c49, 2.0);
    rimLightRight.position.set(6, 2, -4);
    scene.add(rimLightRight);

    // Warm glow from inside the signature box
    const boxInteriorLight = new THREE.PointLight(0xffdf88, 0.3, 5);
    boxInteriorLight.position.set(0.8, 0.4, 0);
    scene.add(boxInteriorLight);

    // ==========================================
    // MATERIALS
    // ==========================================
    const burgundyMat = new THREE.MeshStandardMaterial({
      color: 0x3b172d,
      roughness: 0.42,
      metalness: 0.08,
    });
    materialsRef.current.boxMat = burgundyMat;

    const goldRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xd6b77a,
      roughness: 0.22,
      metalness: 0.88,
    });
    materialsRef.current.ribbonMat = goldRibbonMat;

    const ivoryMat = new THREE.MeshStandardMaterial({
      color: 0xf8f3eb,
      roughness: 0.55,
      metalness: 0.05,
    });

    const wineMat = new THREE.MeshStandardMaterial({
      color: 0x702c49,
      roughness: 0.45,
      metalness: 0.1,
    });

    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1f0b18,
      roughness: 0.35,
      metalness: 0.25,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xebd8ad,
      roughness: 0.18,
      metalness: 0.95,
    });

    // Canvas Monogram Texture for Plaque
    const monogramCanvas = document.createElement("canvas");
    monogramCanvas.width = 256;
    monogramCanvas.height = 128;
    const mctx = monogramCanvas.getContext("2d")!;
    mctx.fillStyle = "#3B172D";
    mctx.fillRect(0, 0, 256, 128);
    mctx.lineWidth = 6;
    mctx.strokeStyle = "#D6B77A";
    mctx.strokeRect(6, 6, 244, 116);
    mctx.fillStyle = "#D6B77A";
    mctx.font = "bold 52px serif";
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.fillText("Ni²", 128, 64);

    const monogramTexture = new THREE.CanvasTexture(monogramCanvas);
    materialsRef.current.monogramCanvas = monogramCanvas;
    materialsRef.current.monogramTexture = monogramTexture;

    const plaqueMat = new THREE.MeshStandardMaterial({
      map: monogramTexture,
      roughness: 0.25,
      metalness: 0.75,
    });

    // ==========================================
    // 3D WORLD MESHES
    // ==========================================

    // 1. SIGNATURE LUXURY GIFT BOX (HERO / ATELIER OBJECT)
    const signatureBoxGroup = new THREE.Group();
    signatureBoxGroup.position.set(1.1, -0.25, 0.2);
    scene.add(signatureBoxGroup);

    // Base Box
    const sigBaseGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);
    const sigBaseMesh = new THREE.Mesh(sigBaseGeo, burgundyMat);
    sigBaseMesh.castShadow = true;
    sigBaseMesh.receiveShadow = true;
    signatureBoxGroup.add(sigBaseMesh);

    // Base Ribbons
    const sigRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.62, 2.24), goldRibbonMat);
    signatureBoxGroup.add(sigRibbonV);

    const sigRibbonH = new THREE.Mesh(new THREE.BoxGeometry(2.24, 1.62, 0.32), goldRibbonMat);
    signatureBoxGroup.add(sigRibbonH);

    // Front Monogram Plaque
    const plaqueMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.05), plaqueMat);
    plaqueMesh.position.set(0, 0, 1.13);
    signatureBoxGroup.add(plaqueMesh);

    // Elevating Lid Group
    const sigLidGroup = new THREE.Group();
    sigLidGroup.position.set(0, 0.95, 0);
    signatureBoxGroup.add(sigLidGroup);

    const sigLidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.38, 2.32), burgundyMat);
    sigLidMesh.castShadow = true;
    sigLidMesh.receiveShadow = true;
    sigLidGroup.add(sigLidMesh);

    const sigLidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 2.34), goldRibbonMat);
    sigLidGroup.add(sigLidRibbonV);

    const sigLidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.4, 0.32), goldRibbonMat);
    sigLidGroup.add(sigLidRibbonH);

    // Central Knot
    const knotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 18), goldRibbonMat);
    knotMesh.scale.set(1.15, 0.7, 1.15);
    knotMesh.position.set(0, 0.22, 0);
    sigLidGroup.add(knotMesh);

    // Bow Loops
    const createBow = (angle: number) => {
      const g = new THREE.Group();
      g.position.set(0, 0.22, 0);
      g.rotation.y = angle;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.09, 16, 32, Math.PI * 1.5), goldRibbonMat);
      torus.rotation.x = Math.PI / 2.3;
      torus.rotation.y = Math.PI / 4;
      torus.position.set(0.24, 0.16, 0);
      torus.scale.set(1, 0.65, 1);
      g.add(torus);
      return g;
    };
    sigLidGroup.add(createBow(0));
    sigLidGroup.add(createBow(Math.PI));
    sigLidGroup.add(createBow(Math.PI / 2));
    sigLidGroup.add(createBow(-Math.PI / 2));

    // Pedestal for Signature Box
    const sigPedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.6, 40), pedestalMat);
    sigPedestal.position.set(1.1, -1.35, 0.2);
    sigPedestal.receiveShadow = true;
    scene.add(sigPedestal);

    const sigPedestalRing = new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.05, 16, 48), goldTrimMat);
    sigPedestalRing.rotation.x = Math.PI / 2;
    sigPedestalRing.position.set(1.1, -1.05, 0.2);
    scene.add(sigPedestalRing);

    // 2. ROUND HAT BOX (WEDDING / CELEBRATION COLLECTIONS)
    const hatBoxGroup = new THREE.Group();
    hatBoxGroup.position.set(-4.2, -0.45, -2.4);
    scene.add(hatBoxGroup);

    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 1.4, 36), ivoryMat);
    hatBase.castShadow = true;
    hatBase.receiveShadow = true;
    hatBoxGroup.add(hatBase);

    const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(1.07, 1.07, 0.22, 36), goldRibbonMat);
    hatBand.position.set(0, 0.3, 0);
    hatBoxGroup.add(hatBand);

    const hatLid = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.28, 36), ivoryMat);
    hatLid.position.set(0, 0.8, 0);
    hatLid.castShadow = true;
    hatBoxGroup.add(hatLid);

    const hatLidRing = new THREE.Mesh(new THREE.CylinderGeometry(1.13, 1.13, 0.08, 36), goldRibbonMat);
    hatLidRing.position.set(0, 0.85, 0);
    hatBoxGroup.add(hatLidRing);

    const hatPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.5, 32), pedestalMat);
    hatPedestal.position.set(-4.2, -1.35, -2.4);
    hatPedestal.receiveShadow = true;
    scene.add(hatPedestal);

    // 3. EXECUTIVE SLIDING DRAWER BOX (CORPORATE COLLECTION)
    const drawerGroup = new THREE.Group();
    drawerGroup.position.set(3.8, -0.5, -1.8);
    scene.add(drawerGroup);

    const drawerSleeve = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 2.2), wineMat);
    drawerSleeve.castShadow = true;
    drawerSleeve.receiveShadow = true;
    drawerGroup.add(drawerSleeve);

    const drawerInner = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.76, 2.0), ivoryMat);
    drawerInner.position.set(0, 0, 0.45);
    drawerGroup.add(drawerInner);

    const drawerPull = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16), goldTrimMat);
    drawerPull.rotation.x = Math.PI / 2;
    drawerPull.position.set(0, 0, 1.5);
    drawerGroup.add(drawerPull);

    const drawerPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 32), pedestalMat);
    drawerPedestal.position.set(3.8, -1.35, -1.8);
    drawerPedestal.receiveShadow = true;
    scene.add(drawerPedestal);

    // 4. PETITE FAVOR TREASURE CUBE (RETURN FAVOURS)
    const favorGroup = new THREE.Group();
    favorGroup.position.set(-2.8, -0.75, 1.0);
    favorGroup.rotation.y = 0.4;
    scene.add(favorGroup);

    const favorBox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), ivoryMat);
    favorBox.castShadow = true;
    favorGroup.add(favorBox);

    const favorRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.92, 0.92), goldRibbonMat);
    favorGroup.add(favorRibbonV);
    const favorRibbonH = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.92, 0.14), goldRibbonMat);
    favorGroup.add(favorRibbonH);

    // Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // ==========================================
    // FLOATING GOLD FOIL PARTICLES (Atelier Atmosphere)
    // ==========================================
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
      particleScales[i / 3] = Math.random() * 0.04 + 0.02;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xebd8ad,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // CINEMATIC WAYPOINTS ACROSS 6 SCENES
    // ==========================================
    // Camera waypoints corresponding to scroll progression:
    // 0.0 -> Scene 1 (Hero Reveal)
    // 0.2 -> Scene 2 (The Art of Gifting)
    // 0.45 -> Scene 3 (Collections)
    // 0.68 -> Scene 4 (Bespoke Atelier)
    // 0.85 -> Scene 5 (Occasions)
    // 1.0 -> Scene 6 (Brand Statement)
    const waypoints = [
      { progress: 0.0, camPos: new THREE.Vector3(0.0, 1.3, 6.2), lookAt: new THREE.Vector3(0.6, 0.1, 0.0), lidOpen: 0.0 },
      { progress: 0.2, camPos: new THREE.Vector3(1.4, 1.8, 4.2), lookAt: new THREE.Vector3(0.8, 0.4, 0.0), lidOpen: 0.8 },
      { progress: 0.45, camPos: new THREE.Vector3(-1.8, 1.6, 5.2), lookAt: new THREE.Vector3(-0.4, 0.1, -0.6), lidOpen: 0.4 },
      { progress: 0.68, camPos: new THREE.Vector3(1.8, 2.2, 4.4), lookAt: new THREE.Vector3(0.7, 0.3, 0.0), lidOpen: 0.2 },
      { progress: 0.85, camPos: new THREE.Vector3(0.0, 2.4, 6.6), lookAt: new THREE.Vector3(0.2, -0.2, -0.4), lidOpen: 0.6 },
      { progress: 1.0, camPos: new THREE.Vector3(0.0, 1.4, 6.8), lookAt: new THREE.Vector3(0.5, 0.2, 0.0), lidOpen: 0.0 },
    ];

    const getInterpolatedWaypoint = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      let idx = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (clamped >= waypoints[i].progress && clamped <= waypoints[i + 1].progress) {
          idx = i;
          break;
        }
      }
      const w1 = waypoints[idx];
      const w2 = waypoints[idx + 1];
      const factor = (clamped - w1.progress) / (w2.progress - w1.progress);
      // Smooth cubic easing
      const t = factor * factor * (3 - 2 * factor);

      const pos = new THREE.Vector3().lerpVectors(w1.camPos, w2.camPos, t);
      const look = new THREE.Vector3().lerpVectors(w1.lookAt, w2.lookAt, t);
      const lid = w1.lidOpen + (w2.lidOpen - w1.lidOpen) * t;

      return { pos, look, lid };
    };

    // ==========================================
    // INTERACTION & RENDER LOOP
    // ==========================================
    let mouseNormX = 0;
    let mouseNormY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let targetScroll = 0;
    let currentScroll = 0;

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animId: number;

    const currentCamPos = camera.position.clone();
    const currentLookAt = new THREE.Vector3(0.6, 0.1, 0.0);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth pointer & scroll damping
      const mouseLerp = prefersReducedMotion ? 0.02 : 0.05;
      mouseNormX += (targetMouseX - mouseNormX) * mouseLerp;
      mouseNormY += (targetMouseY - mouseNormY) * mouseLerp;

      currentScroll += (targetScroll - currentScroll) * 0.06;

      // Waypoint camera calculation
      const wp = getInterpolatedWaypoint(currentScroll);

      // Layer pointer parallax on top of camera trajectory
      const parallaxX = mouseNormX * 0.45;
      const parallaxY = mouseNormY * 0.35;

      const targetCamPos = wp.pos.clone().add(new THREE.Vector3(parallaxX, parallaxY, 0));
      currentCamPos.lerp(targetCamPos, 0.08);
      currentLookAt.lerp(wp.look, 0.08);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // SpotLight follows pointer softly
      pointerLight.position.x = mouseNormX * 3;
      pointerLight.position.y = 3.5 + mouseNormY * 1.5;

      // Box rotations & animations
      const idle = prefersReducedMotion ? 0 : Math.sin(time * 0.7) * 0.025;

      signatureBoxGroup.rotation.y = -0.45 + mouseNormX * 0.15 + idle;
      hatBoxGroup.rotation.y = time * 0.15;
      drawerGroup.rotation.y = -0.3 + Math.sin(time * 0.5) * 0.04;
      favorGroup.rotation.y = 0.4 + time * 0.1;

      // Lid unboxing elevation and rotation
      const lidLift = wp.lid * 1.35;
      sigLidGroup.position.y = 0.95 + lidLift;
      sigLidGroup.rotation.y = wp.lid * 0.4;
      sigLidGroup.rotation.z = -wp.lid * 0.15;

      boxInteriorLight.intensity = 0.3 + wp.lid * 2.5;

      // Floating dust particles
      if (!prefersReducedMotion) {
        particles.rotation.y = time * 0.02;
        particles.rotation.x = time * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // Clean Three resources
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
