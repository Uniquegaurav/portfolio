import { useEffect, useState } from "react";
import { isMuted, onMuteChange, setMuted } from "../lib/sfx";

/** Global sound on/off state shared by music + effects across the app. */
const useSound = () => {
  const [muted, setLocal] = useState(isMuted());
  useEffect(() => onMuteChange(setLocal), []);
  return { muted, setMuted, toggle: () => setMuted(!isMuted()) };
};

export default useSound;
