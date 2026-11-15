import { Suspense, lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import { Navbar } from "./components";
import AchievementToast from "./components/AchievementToast";
import Home from "./pages/Home";

// Inner pages are split into their own chunks so the 3D world loads first and fast.
// (Contact also pulls in the Earth model + EmailJS — no reason to download that on the home page.)
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Personal = lazy(() => import("./pages/Personal"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageFallback = () => (
  <div className='flex min-h-screen items-center justify-center'>
    <span className='h-12 w-12 animate-spin rounded-full border-4 border-teal-400/20 border-t-teal-400' />
  </div>
);

// Stormy sky + falling snow, matching the 3D world, for every inner page.
// Snow is skipped where a WebGL scene already runs (Contact's Earth): together they
// starve the main thread on devices without a strong GPU and freeze the page animations.
const ThemedPage = ({ children, snow = true }) => (
  <div className='storm-bg'>
    {snow && <div className='snowfall' aria-hidden='true' />}
    <div className='page-enter relative z-[1]'>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </div>
  </div>
);

const App = () => {
  return (
    <main className='bg-night'>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<ThemedPage snow={false}><About /></ThemedPage>} />
          <Route path='/projects' element={<ThemedPage><Projects /></ThemedPage>} />
          <Route path='/contact' element={<ThemedPage snow={false}><Contact /></ThemedPage>} />
          <Route path='/personal' element={<ThemedPage><Personal /></ThemedPage>} />
          <Route path='*' element={<Home />} />
        </Routes>
        <AchievementToast />
      </Router>
    </main>
  );
};

export default App;
