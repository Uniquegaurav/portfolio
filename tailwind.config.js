/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // xs must come first so it never overrides sm/md/lg in the generated CSS
    screens: { xs: "450px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        gray: {
          200: "#D5DAE1"
        },
        black: {
          DEFAULT: "#000",
          500: "#1D2235"
        },
        blue: {
          500: "#2b77e7"
        },
        // ── House of the Dragon theme (taken from the 3D world) ──
        night: {
          DEFAULT: "#0a1416", // stormy sky, darkest
          800: "#0f1d20",
          700: "#16292d",
        },
        frost: "#e7f2f4",   // snow — primary text on dark
        mist: "#9db5ba",    // fog — secondary text
        ember: {
          DEFAULT: "#c2263f", // dragon red
          light: "#ff6b57",
        },
      },
      fontFamily: {
        worksans: ["Work Sans", "sans-serif"],
        poppins: ['Poppins', "sans-serif"],
        cinzel: ["Cinzel", "serif"],
      },
      boxShadow: {
        card: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        frost: '0 10px 40px -10px rgba(0, 0, 0, 0.6)',
        teal: '0 8px 24px -6px rgba(20, 184, 166, 0.5)',
      }
    },
  },
  plugins: [],
}
