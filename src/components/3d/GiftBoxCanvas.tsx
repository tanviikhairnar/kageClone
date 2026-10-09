import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function GiftBoxCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x250b1b, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6b3052, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 2.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd6b77a, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf4eaf0, 1.2, 10);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Interior glow light (brightens when lid opens)
    const interiorLight = new THREE.PointLight(0xffd885, 0.2, 5);
    interiorLight.position.set(0, 0.4, 0);
    scene.add(interiorLight);

    // ==========================================
    // MATERIALS
    // ==========================================
    // Deep burgundy box material
    const burgundyMat = new THREE.MeshStandardMaterial({
      color: 0x3b172d,
      roughness: 0.45,
      metalness: 0.08,
    });

    // Box interior material (warm ivory/blush)
    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0xf4eaf0,
      roughness: 0.6,
      metalness: 0.02,
      side: THREE.BackSide,
    });

    // Champagne gold ribbon material (foil satin sheen)
    const goldRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xd6b77a,
      roughness: 0.24,
      metalness: 0.88,
    });

    // Monogram plaque material
    const goldPlaqueMat = new THREE.MeshStandardMaterial({
      color: 0xebd8ad,
      roughness: 0.18,
      metalness: 0.95,
    });

    // ==========================================
    // 3D GIFT BOX GROUP
    // ==========================================
    const giftBoxRoot = new THREE.Group();
    scene.add(giftBoxRoot);
    giftBoxRoot.position.set(0.6, -0.3, 0); // Positioned slightly to the right for editorial balance

    // Base Box
    const baseGroup = new THREE.Group();
    giftBoxRoot.add(baseGroup);

    const baseGeo = new THREE.BoxGeometry(2.2, 1.6, 2.2);
    const baseMesh = new THREE.Mesh(baseGeo, burgundyMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Base Ribbons
    const ribbonVGeo = new THREE.BoxGeometry(0.3, 1.62, 2.24);
    const ribbonVMesh = new THREE.Mesh(ribbonVGeo, goldRibbonMat);
    baseGroup.add(ribbonVMesh);

    const ribbonHGeo = new THREE.BoxGeometry(2.24, 1.62, 0.3);
    const ribbonHMesh = new THREE.Mesh(ribbonHGeo, goldRibbonMat);
    baseGroup.add(ribbonHMesh);

    // Monogram Plaque on Front
    const plaqueGeo = new THREE.BoxGeometry(0.65, 0.45, 0.04);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, goldPlaqueMat);
    plaqueMesh.position.set(0, 0, 1.13);
    baseGroup.add(plaqueMesh);

    // ==========================================
    // LID GROUP (Elevates & rotates on scroll)
    // ==========================================
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.95, 0);
    giftBoxRoot.add(lidGroup);

    const lidGeo = new THREE.BoxGeometry(2.32, 0.38, 2.32);
    const lidMesh = new THREE.Mesh(lidGeo, burgundyMat);
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    lidGroup.add(lidMesh);

    // Lid Ribbons
    const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 2.34), goldRibbonMat);
    lidGroup.add(lidRibbonV);

    const lidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.4, 0.3), goldRibbonMat);
    lidGroup.add(lidRibbonH);

    // Central Ribbon Knot
    const knotGeo = new THREE.SphereGeometry(0.2, 20, 20);
    const knotMesh = new THREE.Mesh(knotGeo, goldRibbonMat);
    knotMesh.scale.set(1.1, 0.7, 1.1);
    knotMesh.position.set(0, 0.22, 0);
    lidGroup.add(knotMesh);

    // Bow Loops (Champagne satin loops)
    const createBowLoop = (angle: number) => {
      const loopGroup = new THREE.Group();
      loopGroup.position.set(0, 0.22, 0);
      loopGroup.rotation.y = angle;

      const torusGeo = new THREE.TorusGeometry(0.32, 0.09, 16, 32, Math.PI * 1.45);
      const loopMesh = new THREE.Mesh(torusGeo, goldRibbonMat);
      loopMesh.rotation.x = Math.PI / 2.3;
      loopMesh.rotation.y = Math.PI / 4;
      loopMesh.position.set(0.24, 0.16, 0);
      loopMesh.scale.set(1, 0.65, 1);
      loopGroup.add(loopMesh);

      return loopGroup;
    };

    lidGroup.add(createBowLoop(0));
    lidGroup.add(createBowLoop(Math.PI));
    lidGroup.add(createBowLoop(Math.PI / 2));
    lidGroup.add(createBowLoop(-Math.PI / 2));

    // Shadow Catcher Plane underneath
    const shadowPlaneGeo = new THREE.PlaneGeometry(10, 10);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ==========================================
    // FLOATING GOLDEN PARTICLES (Atelier dust)
    // ==========================================
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xebd8ad,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // INTERACTION & ANIMATION STATE
    // ==========================================
    let targetRotX = 0.22;
    let targetRotY = -0.55;
    let currentRotX = 0.22;
    let currentRotY = -0.55;

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    let isVisible = true;
    let animationFrameId: number;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = -0.55 + normX * 0.35;
      targetRotX = 0.22 - normY * 0.25;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      targetScrollProgress = Math.min(Math.max(scrollY / (viewportH * 0.8), 0), 1.2);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;

      // Adjust camera distance for mobile vs desktop
      if (width < 768) {
        camera.position.set(0, 0.8, 8.2);
        giftBoxRoot.position.set(0, -0.4, 0);
      } else {
        camera.position.set(0, 1.2, 6.5);
        giftBoxRoot.position.set(0.6, -0.3, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup

    // Intersection Observer to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer damping (lerp)
      const lerpFactor = prefersReducedMotion ? 0.02 : 0.06;
      currentRotX += (targetRotX - currentRotX) * lerpFactor;
      currentRotY += (targetRotY - currentRotY) * lerpFactor;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

      // Box rotation (subtle idle sway + pointer reaction)
      const idleSwayX = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 0.8) * 0.02;
      const idleSwayY = prefersReducedMotion ? 0 : Math.cos(elapsedTime * 0.6) * 0.03;

      giftBoxRoot.rotation.x = currentRotX + idleSwayX;
      giftBoxRoot.rotation.y = currentRotY + idleSwayY;

      // Scroll-linked unwrapping animation:
      // Lid rises gracefully and twists open as user initiates scroll
      const lidElevation = currentScrollProgress * 1.45;
      const lidAngle = currentScrollProgress * 0.45;
      const lidTilt = currentScrollProgress * 0.15;

      lidGroup.position.y = 0.95 + lidElevation;
      lidGroup.rotation.y = lidAngle;
      lidGroup.rotation.z = -lidTilt;

      // Interior golden light intensifies as lid opens
      interiorLight.intensity = 0.2 + currentScrollProgress * 2.5;

      // Floating dust particles animation
      if (!prefersReducedMotion) {
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // Dispose geometries & materials
      baseGeo.dispose();
      ribbonVGeo.dispose();
      ribbonHGeo.dispose();
      plaqueGeo.dispose();
      lidGeo.dispose();
      knotGeo.dispose();
      shadowPlaneGeo.dispose();
      particleGeo.dispose();

      burgundyMat.dispose();
      interiorMat.dispose();
      goldRibbonMat.dispose();
      goldPlaqueMat.dispose();
      shadowPlaneMat.dispose();
      particleMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle, #4A1938 0%, #200B19 100%)",
        }}
      >
        <img
          src="/assets/packaging/gold-cube-box.jpg"
          alt="Ni Square Packaging Signature Gift Box"
          style={{
            maxWidth: "380px",
            maxHeight: "380px",
            objectFit: "contain",
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
          }}
        />
      </div>
    );
  }

  return <div ref={containerRef} className="canvas-container" aria-label="3D Luxury Gift Box Experience" />;
}

