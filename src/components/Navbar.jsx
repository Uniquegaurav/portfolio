import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { gauravLogo } from "../assets/images";
import "./navbar.css";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import useSound from "../hooks/useSound";
import { sfx } from "../lib/sfx";
import { ui } from "../constants";


const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [showMenu, setShowMenu] = useState(false);
  const { muted, toggle } = useSound();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  return (
    <header className={`site-header ${isHome ? "on-home" : ""}`}>
      <div className="navbar-container">
        <button
          className={`menu-icon ${showMenu ? "active" : ""}`}
          onClick={() => {
            sfx.click();
            setShowMenu((s) => !s);
          }}
          aria-label="Toggle navigation"
          aria-expanded={showMenu}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <nav className={`nav-links ${showMenu ? "show" : ""}`} aria-label="Main">
          {ui.nav.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onMouseEnter={sfx.hover}
              onClick={sfx.click}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* One sound switch for music + effects, on every page */}
        <button
          type="button"
          className={`sound-toggle ${muted ? "" : "is-on"}`}
          onClick={() => {
            toggle();
            if (muted) setTimeout(sfx.click, 0);
          }}
          aria-label={muted ? ui.soundOff : ui.soundOn}
          aria-pressed={!muted}
          title={muted ? ui.soundOff : ui.soundOn}
        >
          {muted ? <FiVolumeX /> : <FiVolume2 />}
          {!muted && isHome && <span className="sound-wave" aria-hidden="true" />}
        </button>

        <NavLink to={isHome ? "/about" : "/"} className="logo-container" aria-label={isHome ? ui.nav[1]?.label : ui.nav[0]?.label}>
          <img src={gauravLogo} alt="Gaurav logo" className="logo object-contain" />
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
