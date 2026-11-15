/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model’s meshes, we need to iterate through
 * each part of our model’s meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/black_island_map.glb";

// Auto-tour tuning: negative speed visits the chapters in order (I → II → III → IV → V)
const AUTO_SPEED = -0.24; // radians / second
const DWELL_SECONDS = 5.5; // pause at each chapter so the card can be read
const RESUME_AFTER_SECONDS = 3; // hand control back to the auto-tour after the user lets go

// Island orientation (radians, normalised 0..2π) → chapter number
const stageFor = (r) => {
  if (r >= 1.6 && r <= 2.1) return 3;
  if (r >= 2.8 && r <= 3.2) return 2;
  if (r >= 3.9 && r <= 4.4) return 1;
  if (r >= 4.9 && r <= 5.4) return 5;
  if (r >= 5.8 || r <= 0.4) return 4;
  return null;
};

export function BlackIsland({
  isRotating,
  setIsRotating,
  setCurrentStage,
  autoRotate = false,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;
  // Auto-tour state (refs: updated every frame without re-rendering)
  const autoVelocity = useRef(0);
  const dwell = useRef(0);
  const idleFor = useRef(Infinity);
  const lastStage = useRef(undefined);
  const wasAuto = useRef(autoRotate);

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    // Keep receiving move/up events even if the finger leaves the canvas
    event.target.setPointerCapture?.(event.pointerId);
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    // Tell mobile browsers the canvas handles its own touch gestures. Without this, Android
    // takes over the swipe (fires "pointercancel" instead of "pointerup"), the island thinks the
    // finger is still down, the auto-tour never resumes and dragging stutters.
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("lostpointercapture", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("lostpointercapture", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // Per-frame: user drag momentum + gentle auto-tour that pauses at each chapter
  useFrame((_, delta) => {
    const island = islandRef.current;
    if (!island) return;
    const dt = Math.min(delta, 0.05);

    // Auto-tour just switched on (e.g. "Explore the World") → linger on the current chapter first
    if (autoRotate && !wasAuto.current && lastStage.current) dwell.current = DWELL_SECONDS;
    wasAuto.current = autoRotate;

    if (isRotating) {
      // The user has the reins
      idleFor.current = 0;
      autoVelocity.current = 0;
    } else {
      // Momentum left over from a drag (original behaviour)
      rotationSpeed.current *= dampingFactor;
      if (Math.abs(rotationSpeed.current) < 0.001) rotationSpeed.current = 0;
      island.rotation.y += rotationSpeed.current;

      idleFor.current += dt;
      if (autoRotate && rotationSpeed.current === 0 && idleFor.current > RESUME_AFTER_SECONDS) {
        if (dwell.current > 0) dwell.current -= dt;
        const target = dwell.current > 0 ? 0 : AUTO_SPEED;
        // ease in/out so the island glides rather than snaps
        autoVelocity.current += (target - autoVelocity.current) * Math.min(1, dt * 2.2);
        island.rotation.y += autoVelocity.current * dt;
      }
    }

    const r = ((island.rotation.y % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const stage = stageFor(r);
    if (stage !== lastStage.current) {
      lastStage.current = stage;
      setCurrentStage(stage);
      // Arriving at a new chapter during the auto-tour → pause there for a while
      if (stage && autoRotate && !isRotating) dwell.current = DWELL_SECONDS;
    }
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface63_lambert1_0.geometry}
        material={materials.lambert1}
        scale={0.09}
      />
    </a.group>
  );
}
