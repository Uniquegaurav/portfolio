import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import CanvasLoader from "./CanvasLoader";
import { Earth } from "../models/Earth";

/**
 * The rotating Earth, shared by About and Contact.
 * frameloop="demand": OrbitControls keeps requesting frames only while auto-rotating,
 * so when `autoRotate` is false the GPU goes completely idle.
 */
const EarthCanvas = ({ autoRotate = true, speed = 1.4, fov = 45 }) => (
  <Canvas
    frameloop='demand'
    dpr={[1, 1.75]}
    camera={{ fov, near: 0.1, far: 200, position: [-4, 3, 6] }}
    className='cursor-grab active:cursor-grabbing'
  >
    <Suspense fallback={<CanvasLoader />}>
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={speed}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.12} // settle quickly when rotation pauses (e.g. while typing)
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <Earth />
    </Suspense>
  </Canvas>
);

export default EarthCanvas;
