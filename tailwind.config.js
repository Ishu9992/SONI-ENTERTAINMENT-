/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        castle: {
          bg: "#0B0B10",
          surface: "#15151C",
          surface2: "#1D1D26",
          gold: "#E8B23D",
          goldSoft: "#F4D488",
          amethyst: "#6C4AB6",
          live: "#E94560",
          ink: "#F5F3EE",
          muted: "#9A97A6"
        }
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      backgroundImage: {
        "castle-radial": "radial-gradient(120% 120% at 50% 0%, rgba(108,74,182,0.25) 0%, rgba(11,11,16,0) 55%)",
        "castle-fade": "linear-gradient(180deg, rgba(11,11,16,0) 0%, #0B0B10 85%)"
      }
    }
  },
  plugins: []
};
