import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import rose from "../assets/rose.mp3";
import { HomeInfo, Loader, Popup } from "../components";
// Import only the models this page uses (the barrel file would also preload Earth/Bird)
import { BlackIsland } from "../models/BlackIsland";
import { Dragon } from "../models/Dragon";
import { Winter } from "../models/Winter";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { homeStagesInfo, world } from "../constants";
import useSound from "../hooks/useSound";
import { unlock } from "../lib/achievements";

// Rendered inside the Canvas' Suspense after the models, so it mounts only once they've loaded.
const SceneReady = ({ onReady }) => {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
};

const Home = () => {
  // Created lazily on first play — the 5.5MB track is no longer fetched on page load
  const audioRef = useRef(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const markSceneReady = useCallback(() => setSceneReady(true), []);
  // Auto-tour runs once the visitor has entered the world (or on return visits, straight away)
  const [touring, setTouring] = useState(false);
  const [visited, setVisited] = useState(() => new Set());
  const [hasDragged, setHasDragged] = useState(false);
  const { muted } = useSound();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const shouldShowPopup = !localStorage.getItem("popupAlreadyShown");
    if (shouldShowPopup) {
      setShowPopup(true);
    } else {
      setTouring(true);
    }
  }, []);

  // Track chapters seen; all five → achievement
  useEffect(() => {
    if (!currentStage) return;
    setVisited((v) => (v.has(currentStage) ? v : new Set(v).add(currentStage)));
  }, [currentStage]);

  useEffect(() => {
    if (visited.size === homeStagesInfo.length) unlock("loremaster");
  }, [visited]);

  useEffect(() => {
    if (isRotating) setHasDragged(true);
  }, [isRotating]);

  // The controls hint is only a nudge: fade it out a few seconds after the tour starts
  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    if (!touring) return undefined;
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, [touring]);
  
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = ''; 
    }
    return () => {
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = '';
    };
  }, [location.pathname]);
  // Music plays while touring the world, unless sound is switched off in the nav
  const musicOn = touring && !muted;
  useEffect(() => {
    if (!musicOn) {
      audioRef.current?.pause();
      return undefined;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(rose);
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    const start = () => audio.play().catch(() => {});
    // Browsers block autoplay without a user gesture (e.g. return visits) → start on first tap/click
    audio.play().catch(() => window.addEventListener("pointerdown", start, { once: true }));
    return () => {
      window.removeEventListener("pointerdown", start);
      audio.pause();
    };
  }, [musicOn]);

  const handleSeeHome = () => {
    localStorage.setItem("popupAlreadyShown", "true");
    setShowPopup(false);
    // The click is a user gesture, so the music effect is allowed to start playing now
    setTouring(true);
    unlock("first-flight");
  };



  const handleJumpToAbout = () => {
    localStorage.setItem("popupAlreadyShown", "true");
    setShowPopup(false);
    navigate("/about");
  };

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.02, 0.03, 0.02];
      screenPosition = [0, 0.33, 2.25];
    } else {
      screenScale = [0.02, 0.03, 0.02];
      screenPosition = [0, 0.45, 2.65];
        //keep dragon directly on top of rocks
      // screenPosition = [0, -0.05, 4.85];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, 0.31, -0.6];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0.12, 0.32, -0.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  return (
    <section style={{overflow:"hidden"}} className="w-full h-screen relative">
        {/* Popup waits for the world to finish loading (the loader shows until then) */}
        {sceneReady && showPopup && (
          <Popup
            onClose={() => setShowPopup(false)}
            onSeeHome={handleSeeHome}
            onJumpToAbout={handleJumpToAbout}
          />
        )}

        {/* Soft vignette: frames the scene and keeps the chapter card readable over bright snow */}
        <div className="world-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

        {sceneReady && !showPopup && (
          <HomeInfo currentStage={currentStage || null} visited={visited} />
        )}

        {/* Controls hint — fades once the visitor has tried dragging */}
        {sceneReady && !showPopup && (
          <div className={`world-hint pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-700 ${hasDragged || !hintVisible ? "opacity-0" : "opacity-100"}`}>
            <span className="world-hint-icon" aria-hidden="true" />
            <span className="hidden sm:inline">{world.hint}</span>
            <span className="sm:hidden">{world.hintMobile}</span>
          </div>
        )}

        <Canvas
         style={{overflow:"hidden"}}
          className={`w-full h-screen bg-transparent ${
            isRotating ? "cursor-grabbing" : "cursor-grab"
          }`}
          camera={{ near: 0.1, far: 1000 }}
        >
          <directionalLight position={[1.8, 1.2, 1.7]} intensity={4} />
          <ambientLight intensity={1.7} />
          <pointLight position={[0.8, 0.7, 0.5]} intensity={3} />
          <spotLight
            position={[4, 2, 2]}
            angle={0.25}
            penumbra={2}
            intensity={4}
          />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={2}
          />

          {/* The Canvas handles model loading itself, so the loader lives inside it */}
          <Suspense fallback={<Loader />}>
          <Winter isRotating={isRotating || touring} />
          <BlackIsland
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            autoRotate={touring}
            position={islandPosition}
            rotation={[0.4, 4.2, 0]}
            scale={islandScale}
          />
          <Dragon
            isRotating={isRotating}
            position={biplanePosition}
            rotation={[0.6, 1.7, 0]}
            scale={biplaneScale}
          />
          <SceneReady onReady={markSceneReady} />
          </Suspense>
        </Canvas>

    </section>
  );
};

export default Home;
