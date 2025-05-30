module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        mono: {
          background: "#0b0b0b",
          secondary: "#151515",
          accent: "#202020",
          lightaccent: "#282828",
        },
        type: {
          emphasized: "#e0e0e0",
          subheader: "#d0d0d0",
          dimmed: "#bfbfbf",
          darker: "#b0b0b0",
          footer: "#6b7280",
          secondary: "#989898",
        },
      },
    },
  },
};
