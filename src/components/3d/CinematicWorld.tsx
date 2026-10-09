import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function CinematicWorld() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // ==========================================
    // SCENE & RENDERER SETUP
    // ==========================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10030c);
    scene.fog = new THREE.FogExp2(0x10030c, 0.022);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";

    // ==========================================
    // PROCEDURAL STUDIO ENVIRONMENT MAP (PBR REFLECTIONS)
    // ==========================================
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x180514);

    // Warm softbox panels in reflection space
    const softboxGeo = new THREE.PlaneGeometry(6, 6);
    const keySoftboxMat = new THREE.MeshBasicMaterial({ color: 0xfff6ea, side: THREE.DoubleSide });
    const keyBox = new THREE.Mesh(softboxGeo, keySoftboxMat);
    keyBox.position.set(4, 5, 4);
    keyBox.lookAt(0, 0, 0);
    envScene.add(keyBox);

    const rimSoftboxMat = new THREE.MeshBasicMaterial({ color: 0xe0c28e, side: THREE.DoubleSide });
    const rimBox = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), rimSoftboxMat);
    rimBox.position.set(0, 6, -3);
    rimBox.lookAt(0, 0, 0);
    envScene.add(rimBox);

    const fillSoftboxMat = new THREE.MeshBasicMaterial({ color: 0x8a3059, side: THREE.DoubleSide });
    const fillBox = new THREE.Mesh(softboxGeo, fillSoftboxMat);
    fillBox.position.set(-5, 4, 3);
    fillBox.lookAt(0, 0, 0);
    envScene.add(fillBox);

    const envMap = pmremGenerator.fromScene(envScene);
    scene.environment = envMap.texture;

    // ==========================================
    // PROCEDURAL TEXTURES FOR REALISTIC MATERIALS
    // ==========================================
    // 1. Fine Paper Grain Texture (Texture of 300gsm luxury box paper)
    const paperCanvas = document.createElement("canvas");
    paperCanvas.width = 256;
    paperCanvas.height = 256;
    const pctx = paperCanvas.getContext("2d")!;
    const pData = pctx.createImageData(256, 256);
    for (let i = 0; i < pData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28 + 128;
      pData.data[i] = noise;
      pData.data[i + 1] = noise;
      pData.data[i + 2] = noise;
      pData.data[i + 3] = 255;
    }
    pctx.putImageData(pData, 0, 0);
    const paperTexture = new THREE.CanvasTexture(paperCanvas);
    paperTexture.wrapS = THREE.RepeatWrapping;
    paperTexture.wrapT = THREE.RepeatWrapping;
    paperTexture.repeat.set(8, 8);

    // 2. Satin Ribbon Thread Texture
    const ribbonCanvas = document.createElement("canvas");
    ribbonCanvas.width = 128;
    ribbonCanvas.height = 128;
    const rctx = ribbonCanvas.getContext("2d")!;
    rctx.fillStyle = "#808080";
    rctx.fillRect(0, 0, 128, 128);
    rctx.strokeStyle = "#999999";
    rctx.lineWidth = 1;
    for (let y = 0; y < 128; y += 3) {
      rctx.beginPath();
      rctx.moveTo(0, y);
      rctx.lineTo(128, y);
      rctx.stroke();
    }
    const ribbonBumpTexture = new THREE.CanvasTexture(ribbonCanvas);
    ribbonBumpTexture.wrapS = THREE.RepeatWrapping;
    ribbonBumpTexture.wrapT = THREE.RepeatWrapping;
    ribbonBumpTexture.repeat.set(4, 16);

    // 3. Monogram Canvas for Plaque
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

    // 4. Soft Contact Shadow Radial Texture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const sGrad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    sGrad.addColorStop(0, "rgba(0, 0, 0, 0.88)");
    sGrad.addColorStop(0.35, "rgba(0, 0, 0, 0.55)");
    sGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.2)");
    sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sctx.fillStyle = sGrad;
    sctx.fillRect(0, 0, 256, 256);
    const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);

    // ==========================================
    // SEAMLESS CURVED STUDIO CYCLORAMA (INFINITY BACKDROP)
    // ==========================================
    // Curved studio cyclorama with deep velvet burgundy studio lighting gradient
    const cycWidth = 50;
    const cycDepth = 30;
    const cycGeo = new THREE.PlaneGeometry(cycWidth, cycDepth, 48, 48);
    const posAttr = cycGeo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const zVal = posAttr.getY(i);
      if (zVal < 0) {
        // Flat floor
        posAttr.setZ(i, -zVal);
        posAttr.setY(i, -1.6);
      } else {
        // Smoothly curve upward into vertical studio wall
        const curveT = zVal / (cycDepth / 2);
        const yOffset = -1.6 + Math.pow(curveT, 2.2) * 16;
        const zOffset = -Math.pow(curveT, 1.2) * 8;
        posAttr.setY(i, yOffset);
        posAttr.setZ(i, zOffset);
      }
    }
    cycGeo.computeVertexNormals();

    // Studio backdrop gradient texture: deep velvety wine pool fading to midnight burgundy
    const cycCanvas = document.createElement("canvas");
    cycCanvas.width = 1024;
    cycCanvas.height = 1024;
    const cctx = cycCanvas.getContext("2d")!;
    const cycGrad = cctx.createRadialGradient(512, 620, 50, 512, 620, 520);
    cycGrad.addColorStop(0, "#3B172D");    // Signature deep burgundy center
    cycGrad.addColorStop(0.35, "#270D1E"); // Velvet wine
    cycGrad.addColorStop(0.70, "#180512"); // Dark plum
    cycGrad.addColorStop(1.0, "#10030C");  // Deep midnight perimeter
    cctx.fillStyle = cycGrad;
    cctx.fillRect(0, 0, 1024, 1024);

    const cycTexture = new THREE.CanvasTexture(cycCanvas);
    const cycMat = new THREE.MeshBasicMaterial({
      map: cycTexture,
      depthWrite: true,
    });
    const cyclorama = new THREE.Mesh(cycGeo, cycMat);
    scene.add(cyclorama);

    // ==========================================
    // STUDIO LIGHTING SETUP (3-POINT PRO SYSTEM)
    // ==========================================
    // Hemisphere fill: warm wine sky, dark velvet ground
    const hemiLight = new THREE.HemisphereLight(0x481734, 0x140410, 1.2);
    scene.add(hemiLight);

    // Key Light: Studio softbox illuminating front-right face of the box
    const keyLight = new THREE.DirectionalLight(0xfff2dc, 2.8);
    keyLight.position.set(2.4, 3.8, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light: Soft rose-wine bounce on the left
    const fillLight = new THREE.DirectionalLight(0x8e305e, 1.5);
    fillLight.position.set(-4.2, 2.8, 3.5);
    scene.add(fillLight);

    // Rim/Kicker Light: High backlight skimming the top edges and bow
    const rimLight = new THREE.DirectionalLight(0xe0be84, 1.8);
    rimLight.position.set(0, 5.8, -1.8);
    scene.add(rimLight);

    // Dynamic pointer spotlight (soft interactive studio follower)
    const pointerLight = new THREE.SpotLight(0xebd8ad, 2.6, 16, Math.PI / 3.5, 0.75);
    pointerLight.position.set(0, 3.8, 5.2);
    scene.add(pointerLight);

    // Warm inner unboxing light
    const boxInteriorLight = new THREE.PointLight(0xffdf88, 0.3, 6);
    boxInteriorLight.position.set(0.8, 0.4, 0);
    scene.add(boxInteriorLight);

    // ==========================================
    // REALISTIC LUXURY MATERIALS
    // ==========================================
    const burgundyMat = new THREE.MeshStandardMaterial({
      color: 0x481634,
      roughness: 0.34,
      metalness: 0.08,
      bumpMap: paperTexture,
      bumpScale: 0.0028,
    });

    const goldRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xdfbf82,
      roughness: 0.22,
      metalness: 0.88,
      bumpMap: ribbonBumpTexture,
      bumpScale: 0.0035,
    });

    const ivoryMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.44,
      metalness: 0.04,
      bumpMap: paperTexture,
      bumpScale: 0.0028,
    });

    const wineMat = new THREE.MeshStandardMaterial({
      color: 0x72274b,
      roughness: 0.38,
      metalness: 0.08,
      bumpMap: paperTexture,
      bumpScale: 0.0028,
    });

    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x160512,
      roughness: 0.18,
      metalness: 0.38,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xebd8ad,
      roughness: 0.14,
      metalness: 0.95,
    });

    const plaqueMat = new THREE.MeshStandardMaterial({
      map: monogramTexture,
      roughness: 0.20,
      metalness: 0.85,
    });

    // Helper: Contact shadow disc
    const createContactShadow = (radius: number, x: number, z: number) => {
      const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
      const mat = new THREE.MeshBasicMaterial({
        map: contactShadowTexture,
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, -1.59, z);
      scene.add(mesh);
    };

    // ==========================================
    // 3D SHOWCASE OBJECTS
    // ==========================================

    // 1. SIGNATURE LUXURY GIFT BOX & PEDESTAL
    const signatureBoxGroup = new THREE.Group();
    signatureBoxGroup.position.set(1.15, -0.22, 0.2);
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

    // Monogram Plaque
    const plaqueMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.44, 0.05), plaqueMat);
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

    // Ribbon Knot & Bow Loops
    const knotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 18), goldRibbonMat);
    knotMesh.scale.set(1.15, 0.7, 1.15);
    knotMesh.position.set(0, 0.22, 0);
    sigLidGroup.add(knotMesh);

    const createBow = (angle: number) => {
      const g = new THREE.Group();
      g.position.set(0, 0.22, 0);
      g.rotation.y = angle;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.09, 16, 32, Math.PI * 1.5), goldRibbonMat);
      torus.rotation.x = Math.PI / 2.3;
      torus.rotation.y = Math.PI / 4;
      torus.position.set(0.24, 0.16, 0);
      torus.scale.set(1, 0.65, 1);
      torus.castShadow = true;
      g.add(torus);
      return g;
    };
    sigLidGroup.add(createBow(0));
    sigLidGroup.add(createBow(Math.PI));
    sigLidGroup.add(createBow(Math.PI / 2));
    sigLidGroup.add(createBow(-Math.PI / 2));

    // Pedestal
    const sigPedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.6, 48), pedestalMat);
    sigPedestal.position.set(1.15, -1.35, 0.2);
    sigPedestal.receiveShadow = true;
    scene.add(sigPedestal);

    const sigPedestalRing = new THREE.Mesh(new THREE.TorusGeometry(2.22, 0.05, 16, 48), goldTrimMat);
    sigPedestalRing.rotation.x = Math.PI / 2;
    sigPedestalRing.position.set(1.15, -1.05, 0.2);
    scene.add(sigPedestalRing);

    createContactShadow(2.6, 1.15, 0.2);

    // 2. ROUND IVORY HAT BOX
    const hatBoxGroup = new THREE.Group();
    hatBoxGroup.position.set(-4.2, -0.45, -2.4);
    scene.add(hatBoxGroup);

    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 1.4, 40), ivoryMat);
    hatBase.castShadow = true;
    hatBase.receiveShadow = true;
    hatBoxGroup.add(hatBase);

    const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(1.07, 1.07, 0.22, 40), goldRibbonMat);
    hatBand.position.set(0, 0.3, 0);
    hatBoxGroup.add(hatBand);

    const hatLid = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.28, 40), ivoryMat);
    hatLid.position.set(0, 0.8, 0);
    hatLid.castShadow = true;
    hatBoxGroup.add(hatLid);

    const hatLidRing = new THREE.Mesh(new THREE.CylinderGeometry(1.13, 1.13, 0.08, 40), goldRibbonMat);
    hatLidRing.position.set(0, 0.85, 0);
    hatBoxGroup.add(hatLidRing);

    const hatPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.5, 36), pedestalMat);
    hatPedestal.position.set(-4.2, -1.35, -2.4);
    hatPedestal.receiveShadow = true;
    scene.add(hatPedestal);

    createContactShadow(1.8, -4.2, -2.4);

    // 3. EXECUTIVE SLIDING DRAWER BOX
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

    const drawerPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.5, 36), pedestalMat);
    drawerPedestal.position.set(3.8, -1.35, -1.8);
    drawerPedestal.receiveShadow = true;
    scene.add(drawerPedestal);

    createContactShadow(1.9, 3.8, -1.8);

    // 4. PETITE FAVOR TREASURE CUBE
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

    createContactShadow(0.9, -2.8, 1.0);

    // ==========================================
    // FLOATING GOLD FOIL PARTICLES (Atelier Atmosphere)
    // ==========================================
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xebd8ad,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // CINEMATIC WAYPOINTS ACROSS SCENES
    // ==========================================
    const waypoints = [
      { progress: 0.0, camPos: new THREE.Vector3(0.0, 1.3, 6.2), lookAt: new THREE.Vector3(0.6, 0.1, 0.0), lidOpen: 0.0 },
      { progress: 0.28, camPos: new THREE.Vector3(1.3, 1.85, 4.4), lookAt: new THREE.Vector3(0.75, 0.35, 0.0), lidOpen: 0.85 },
      { progress: 0.58, camPos: new THREE.Vector3(-2.2, 1.7, 5.0), lookAt: new THREE.Vector3(-0.6, 0.2, -0.6), lidOpen: 0.35 },
      { progress: 0.82, camPos: new THREE.Vector3(0.4, 2.4, 6.4), lookAt: new THREE.Vector3(0.2, -0.1, -0.3), lidOpen: 0.6 },
      { progress: 1.0, camPos: new THREE.Vector3(0.0, 1.35, 6.6), lookAt: new THREE.Vector3(0.5, 0.2, 0.0), lidOpen: 0.0 },
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

      const time = clock.getElapsedTime();

      // Smooth pointer & scroll damping
      const mouseLerp = prefersReducedMotion ? 0.02 : 0.05;
      mouseNormX += (targetMouseX - mouseNormX) * mouseLerp;
      mouseNormY += (targetMouseY - mouseNormY) * mouseLerp;

      currentScroll += (targetScroll - currentScroll) * 0.06;

      // Waypoint calculation
      const wp = getInterpolatedWaypoint(currentScroll);

      const parallaxX = mouseNormX * 0.45;
      const parallaxY = mouseNormY * 0.35;

      const targetCamPos = wp.pos.clone().add(new THREE.Vector3(parallaxX, parallaxY, 0));
      currentCamPos.lerp(targetCamPos, 0.08);
      currentLookAt.lerp(wp.look, 0.08);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // Pointer spotlight follow
      pointerLight.position.x = mouseNormX * 3.2;
      pointerLight.position.y = 3.8 + mouseNormY * 1.6;

      // Object idle rotations
      const idle = prefersReducedMotion ? 0 : Math.sin(time * 0.7) * 0.025;

      signatureBoxGroup.rotation.y = -0.45 + mouseNormX * 0.15 + idle;
      hatBoxGroup.rotation.y = time * 0.15;
      drawerGroup.rotation.y = -0.3 + Math.sin(time * 0.5) * 0.04;
      favorGroup.rotation.y = 0.4 + time * 0.1;

      // Lid unboxing
      const lidLift = wp.lid * 1.35;
      sigLidGroup.position.y = 0.95 + lidLift;
      sigLidGroup.rotation.y = wp.lid * 0.4;
      sigLidGroup.rotation.z = -wp.lid * 0.15;

      boxInteriorLight.intensity = 0.3 + wp.lid * 2.8;

      // Particles drift
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

      pmremGenerator.dispose();
      envMap.dispose();
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
